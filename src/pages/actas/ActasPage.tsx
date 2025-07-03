import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, FileText, Search, Edit, Eye, Filter, Download, Users, RefreshCw, XCircle, 
  ChevronLeft, ChevronRight, Calendar, MapPin, Phone, User, Clock, 
  Monitor, Shield, Activity, Smartphone, FileBarChart, CheckCircle, 
  AlertTriangle, Car, Building2, Camera, ClipboardCheck 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/lib/axios';
import axios from 'axios';

interface Record {
  id: number;
  recordType: 'conforme' | 'noconforme';
  vehiclePlate: string;
  location: string;
  observations: string;
  inspectionDateTime: string;
  createdAt: string;
  updatedAt: string;
  inspector: {
    id: number;
    username: string;
    email: string;
  };
  driver: {
    name: string;
    dni: string;
    phone: string;
    licenseNumber: string;
    category: string;
  } | null;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
  } | null;
  company: {
    ruc: string;
    name: string;
    address: string;
  } | null;
  checklist: {
    seatbelt: boolean;
    cleanliness: boolean;
    tires: boolean;
    firstAidKit: boolean;
    fireExtinguisher: boolean;
    lights: boolean;
  } | null;
  photosCount: number;
  violations: Array<{
    id: number;
    code: string;
    description: string;
    severity: string;
    uitPercentage: number;
  }>;
  violationsCount: number;
}

interface RecordDetailed extends Record {
  photos: Array<{
    id: number;
    url: string;
    coordinates: string;
    captureDate: string;
  }>;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface SummaryData {
  totalCompliant: number;
  totalNonCompliant: number;
  totalRecords: number;
}

const ActasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordType, setRecordType] = useState('all'); // 'all', 'conforme', 'noconforme'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  
  // Estados para vista detallada
  const [recordDetailed, setRecordDetailed] = useState<RecordDetailed | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  const { toast } = useToast();

  // Función para obtener todas las actas
  const fetchRecords = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchTerm,
        type: recordType,
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      const response = await axiosInstance.get(`/records?${params.toString()}`);

      if (response.data.success) {
        setRecords(response.data.data);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.pages,
          totalItems: response.data.total,
          itemsPerPage: limit,
          hasNextPage: response.data.currentPage < response.data.pages,
          hasPrevPage: response.data.currentPage > 1,
          nextPage: response.data.currentPage < response.data.pages ? response.data.currentPage + 1 : null,
          prevPage: response.data.currentPage > 1 ? response.data.currentPage - 1 : null
        });
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error al cargar actas:', error);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al cargar las actas'
        : 'Error al cargar las actas');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener detalles del acta
  const fetchRecordDetail = async (id: number, type: 'conforme' | 'noconforme') => {
    try {
      setLoadingDetail(true);
      setErrorDetail(null);
      
      const response = await axiosInstance.get(`/records/${id}/detail?type=${type}`);
      
      if (response.data.success) {
        setRecordDetailed(response.data.data);
        setShowDetailDialog(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles del acta:', error);
      setErrorDetail(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al obtener los detalles del acta'
        : 'Error al obtener los detalles del acta');
      
      toast({
        title: "Error al cargar detalles",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al obtener los detalles del acta'
          : 'Error al obtener los detalles del acta',
        variant: "destructive",
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchRecords(currentPage);
  }, [currentPage, searchTerm, recordType, sortBy, sortOrder]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRecords(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'conforme':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'noconforme':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'conforme':
        return <CheckCircle className="w-4 h-4" />;
      case 'noconforme':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileBarChart className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchRecords(1)} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-red-50/30 p-8 rounded-2xl shadow-lg border border-red-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent mb-2">
                Gestión de Actas
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Administra y supervisa todas las actas de inspección vehicular
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700">
                    {loading ? '-' : summary?.totalRecords || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {loading ? '-' : summary?.totalCompliant || 0}
                  </p>
                  <p className="text-sm text-gray-600">Conformes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-amber-700">
                    {loading ? '-' : summary?.totalNonCompliant || 0}
                  </p>
                  <p className="text-sm text-gray-600">No Conformes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-red-600" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <Label htmlFor="search">Búsqueda</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por placa, ubicación u observaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Tipo de Acta */}
              <div>
                <Label htmlFor="recordType">Tipo de Acta</Label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Actas</SelectItem>
                    <SelectItem value="conforme">Actas Conformes</SelectItem>
                    <SelectItem value="noconforme">Actas No Conformes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Ordenar por */}
              <div>
                <Label htmlFor="sortBy">Ordenar por</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Fecha de Creación</SelectItem>
                    <SelectItem value="inspection_date_time">Fecha de Inspección</SelectItem>
                    <SelectItem value="location">Ubicación</SelectItem>
                    <SelectItem value="vehicle_plate">Placa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Button 
                onClick={handleSearch} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setRecordType('all');
                  setSortBy('createdAt');
                  setSortOrder('DESC');
                  setCurrentPage(1);
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Actas */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Actas Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-red-600" />}
                </CardTitle>
                <CardDescription>Listado completo de actas de inspección</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                  <span className="ml-2 text-gray-600">Cargando actas...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-red-900">ID</TableHead>
                        <TableHead className="font-bold text-red-900">Tipo</TableHead>
                        <TableHead className="font-bold text-red-900">Placa</TableHead>
                        <TableHead className="font-bold text-red-900">Inspector</TableHead>
                        <TableHead className="font-bold text-red-900">Ubicación</TableHead>
                        <TableHead className="font-bold text-red-900">Fecha Inspección</TableHead>
                        <TableHead className="font-bold text-red-900">Fotos</TableHead>
                        <TableHead className="font-bold text-red-900">Infracciones</TableHead>
                        <TableHead className="font-bold text-red-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 && !loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <FileBarChart className="w-8 h-8 mb-2" />
                              <p>No se encontraron actas</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((record) => (
                          <TableRow key={record.id} className="hover:bg-red-50/50 transition-colors">
                            <TableCell className="font-mono font-semibold text-red-700">{record.id}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={`px-3 py-1 rounded-full font-semibold border flex items-center gap-1 w-fit ${getRecordTypeColor(record.recordType)}`}
                              >
                                {getRecordTypeIcon(record.recordType)}
                                {record.recordType === 'conforme' ? 'Conforme' : 'No Conforme'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-gray-900">{record.vehiclePlate}</TableCell>
                            <TableCell className="text-gray-700">{record.inspector.username}</TableCell>
                            <TableCell className="text-gray-700">{record.location}</TableCell>
                            <TableCell className="text-gray-700 text-sm">{formatDate(record.inspectionDateTime)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-blue-700">
                                <Camera className="w-3 h-3 mr-1" />
                                {record.photosCount}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.violationsCount > 0 ? (
                                <Badge variant="outline" className="text-red-700">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {record.violationsCount}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-emerald-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  0
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-red-100 rounded-lg"
                                  onClick={() => fetchRecordDetail(record.id, record.recordType)}
                                  disabled={loadingDetail}
                                >
                                  {loadingDetail ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {pagination && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems} actas en total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo de Detalles del Acta */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileBarChart className="w-6 h-6 text-red-600" />
                Detalles del Acta
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Información completa y detallada del acta de inspección
              </DialogDescription>
            </DialogHeader>
            
            {errorDetail ? (
              <div className="flex flex-col items-center justify-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
                <p className="text-gray-600 mb-4 text-center">{errorDetail}</p>
                <Button 
                  onClick={() => recordDetailed && fetchRecordDetail(recordDetailed.id, recordDetailed.recordType)} 
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            ) : recordDetailed ? (
              <div className="space-y-8">
                {/* Header con información principal */}
                <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-red-50 to-red-100/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Acta #{recordDetailed.id}
                      </h2>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant="secondary"
                          className={`px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${getRecordTypeColor(recordDetailed.recordType)}`}
                        >
                          {getRecordTypeIcon(recordDetailed.recordType)}
                          {recordDetailed.recordType === 'conforme' ? 'Acta Conforme' : 'Acta No Conforme'}
                        </Badge>
                        <span className="text-gray-600">Placa: <strong>{recordDetailed.vehiclePlate}</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Fecha de Inspección</p>
                      <p className="text-lg font-semibold">{formatDate(recordDetailed.inspectionDateTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información del Inspector */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        Inspector
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.inspector.username}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="mt-1 text-gray-900">{recordDetailed.inspector.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">ID Inspector</Label>
                        <p className="mt-1 font-mono font-semibold text-red-700">{recordDetailed.inspector.id}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información del Conductor */}
                  {recordDetailed.driver && (
                    <Card className="shadow-sm border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <User className="w-5 h-5 text-red-600" />
                          Conductor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.driver.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">DNI</Label>
                          <p className="mt-1 font-mono text-gray-900">{recordDetailed.driver.dni}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                          <p className="mt-1 text-gray-900">{recordDetailed.driver.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Licencia</Label>
                          <p className="mt-1 text-gray-900">{recordDetailed.driver.licenseNumber} - {recordDetailed.driver.category}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Información del Vehículo */}
                  {recordDetailed.vehicle && (
                    <Card className="shadow-sm border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Car className="w-5 h-5 text-red-600" />
                          Vehículo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Placa</Label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.vehicle.plateNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Marca y Modelo</Label>
                          <p className="mt-1 text-gray-900">{recordDetailed.vehicle.brand} {recordDetailed.vehicle.model}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Año</Label>
                          <p className="mt-1 text-gray-900">{recordDetailed.vehicle.year}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Información de la Empresa (solo para actas no conformes) */}
                  {recordDetailed.company && (
                    <Card className="shadow-sm border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-red-600" />
                          Empresa
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.company.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">RUC</Label>
                          <p className="mt-1 font-mono text-gray-900">{recordDetailed.company.ruc}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                          <p className="mt-1 text-gray-900">{recordDetailed.company.address}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Lista de Verificación */}
                {recordDetailed.checklist && (
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-red-600" />
                        Lista de Verificación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries({
                          'Cinturón de Seguridad': recordDetailed.checklist.seatbelt,
                          'Limpieza': recordDetailed.checklist.cleanliness,
                          'Neumáticos': recordDetailed.checklist.tires,
                          'Botiquín': recordDetailed.checklist.firstAidKit,
                          'Extintor': recordDetailed.checklist.fireExtinguisher,
                          'Luces': recordDetailed.checklist.lights
                        }).map(([item, status]) => (
                          <div key={item} className="flex items-center gap-2">
                            {status ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`font-medium ${status ? 'text-emerald-700' : 'text-red-700'}`}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Infracciones (solo para actas no conformes) */}
                {recordDetailed.violations && recordDetailed.violations.length > 0 && (
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Infracciones Detectadas ({recordDetailed.violations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recordDetailed.violations.map((violation, index) => (
                          <div key={violation.id} className="p-4 border border-red-200 rounded-lg bg-red-50/50">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-red-900">
                                {violation.code} - {violation.description}
                              </h4>
                              <Badge variant="outline" className="text-red-700">
                                {violation.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              UIT: {violation.uitPercentage}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ubicación y Observaciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        Ubicación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-900">{recordDetailed.location}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-600" />
                        Observaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-900">{recordDetailed.observations || 'Sin observaciones'}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Fotos */}
                {recordDetailed.photos && recordDetailed.photos.length > 0 && (
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-red-600" />
                        Fotos de la Inspección ({recordDetailed.photos.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recordDetailed.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img 
                              src={photo.url} 
                              alt={`Foto ${photo.id}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => window.open(photo.url, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                            {photo.captureDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(photo.captureDate)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Cargando detalles del acta...</span>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ActasPage;