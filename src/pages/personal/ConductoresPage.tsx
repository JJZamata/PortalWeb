import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye, Filter, Download, Users, RefreshCw, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';

interface Conductor {
  dni: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
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
  total: number;
  conTelefono: number;
  sinTelefono: number;
  conDireccion: number;
  sinDireccion: number;
}

const ConductoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const { toast } = useToast();

  const fetchConductores = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backendfiscamoto.onrender.com/api/drivers/list?page=${page}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setConductores(response.data.data.conductores);
        setPagination(response.data.data.pagination);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Error al cargar conductores:', error);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al cargar los conductores'
        : 'Error al cargar los conductores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConductores(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchConductores(1)} variant="outline">
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
                Gestión de Conductores
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Administra y supervisa los conductores registrados en el sistema</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-6">
              <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700">
                    {loading ? '-' : summary?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {loading ? '-' : summary?.conTelefono || 0}
                </p>
                  <p className="text-sm text-gray-600">Con Teléfono</p>
              </div>
              <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-700">
                    {loading ? '-' : summary?.conDireccion || 0}
                </p>
                  <p className="text-sm text-gray-600">Con Dirección</p>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo Conductor
              </Button>
                  </DialogTrigger>
                  <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-2xl font-bold text-gray-800">Agregar Conductor</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Completa la información del nuevo conductor
                      </DialogDescription>
                    </DialogHeader>
                    {/* Formulario de agregar conductor */}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                  placeholder="Buscar por DNI, nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-red-500 rounded-xl bg-white text-base"
              />
              </div>
              <Button variant="outline" className="h-12 px-6 border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Conductores */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Conductores Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-red-600" />}
                </CardTitle>
                <CardDescription>Listado completo de conductores en el sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                  <span className="ml-2 text-gray-600">Cargando conductores...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-red-900">DNI</TableHead>
                        <TableHead className="font-bold text-red-900">Nombre Completo</TableHead>
                        <TableHead className="font-bold text-red-900">Teléfono</TableHead>
                        <TableHead className="font-bold text-red-900">Dirección</TableHead>
                        <TableHead className="font-bold text-red-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conductores.map((conductor) => (
                        <TableRow key={conductor.dni} className="hover:bg-red-50/50 transition-colors">
                          <TableCell className="font-mono font-semibold text-red-700">{conductor.dni}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{conductor.nombreCompleto}</TableCell>
                          <TableCell className="text-gray-700">{conductor.telefono}</TableCell>
                          <TableCell className="text-gray-700">{conductor.direccion}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-2xl">
                                  <DialogHeader className="pb-6">
                                    <DialogTitle className="text-2xl font-bold text-gray-800">Detalles del Conductor</DialogTitle>
                                    <DialogDescription className="text-gray-600">
                                      Información completa del conductor
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">DNI</Label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductor.dni}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductor.nombreCompleto}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductor.telefono || 'No registrado'}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductor.direccion || 'No registrada'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {pagination && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {conductores.length} de {pagination.totalItems} resultados
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ConductoresPage;
