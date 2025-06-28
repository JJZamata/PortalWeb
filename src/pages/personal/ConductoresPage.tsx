import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye, Filter, Download, Users, RefreshCw, XCircle, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface Licencia {
  licenseId: string;
  licenseNumber: string;
  category: string;
  issueDate: string;
  expirationDate: string;
  issuingEntity: string;
  restrictions: string;
  estado: string;
  diasParaVencimiento: number;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

interface LicenciasSummary {
  total: number;
  vigentes: number;
  porVencer: number;
  vencidas: number;
}

interface ConductorDetalladoNuevo {
  dni: string;
  nombreCompleto: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  photoUrl: string;
  fechaRegistro: string;
  ultimaActualizacion: string;
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para vista detallada
  const [conductorDetallado, setConductorDetallado] = useState<ConductorDetalladoNuevo | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const [showDetalleDialog, setShowDetalleDialog] = useState(false);
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [licenciasSummary, setLicenciasSummary] = useState<LicenciasSummary | null>(null);
  
  const { toast } = useToast();

  // Formulario para agregar conductor
  const form = useForm({
    defaultValues: {
      dni: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  // Función para obtener detalles del conductor
  const fetchConductorDetalle = async (dni: string) => {
    try {
      setLoadingDetalle(true);
      setErrorDetalle(null);
      const response = await axiosInstance.get(`/drivers/${dni}`);
      
      if (response.data.success) {
        setConductorDetallado(response.data.data.conductor);
        setLicencias(response.data.data.licencias || []);
        setLicenciasSummary(response.data.data.summary || null);
        setShowDetalleDialog(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles del conductor:', error);
      setErrorDetalle(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al obtener los detalles del conductor'
        : 'Error al obtener los detalles del conductor');
      
      toast({
        title: "Error al cargar detalles",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al obtener los detalles del conductor'
          : 'Error al obtener los detalles del conductor',
        variant: "destructive",
      });
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Validación de DNI (8 dígitos)
  const validateDNI = (dni: string) => {
    if (dni.length !== 8) {
      return "El DNI debe tener exactamente 8 dígitos";
    }
    if (!/^\d+$/.test(dni)) {
      return "El DNI solo puede contener números";
    }
    return true;
  };

  // Validación de teléfono (9 dígitos)
  const validatePhone = (phone: string) => {
    if (phone.length !== 9) {
      return "El teléfono debe tener exactamente 9 dígitos";
    }
    if (!/^\d+$/.test(phone)) {
      return "El teléfono solo puede contener números";
    }
    return true;
  };

  const handleAddConductor = async (values: any) => {
    setSubmitting(true);
    try {
      // Aquí solo falta poner el link del API
      // await axiosInstance.post('/ruta/del/api', values);
      setShowAddDialog(false);
      form.reset();
      toast({
        title: "Conductor agregado",
        description: "El conductor fue registrado correctamente.",
        variant: "default",
      });
      fetchConductores(currentPage);
    } catch (error) {
      toast({
        title: "Error al agregar conductor",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error desconocido'
          : 'Error desconocido',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Función para buscar conductores en el backend
  const searchConductores = async (query: string, page: number = 1) => {
    if (query.length < 2) {
      // Si la búsqueda es muy corta, volver a cargar todos los conductores
      fetchConductores(page);
      return;
    }

    try {
      setSearchLoading(true);
      setIsSearching(true);
      const response = await axiosInstance.get(`/drivers/search?q=${encodeURIComponent(query)}&page=${page}`);

      if (response.data.success) {
        setConductores(response.data.data.conductores);
        setPagination(response.data.data.pagination);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Error al buscar conductores:', error);
      toast({
        title: "Error en la búsqueda",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al buscar conductores'
          : 'Error al buscar conductores',
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchConductores(searchTerm, 1);
      } else if (searchTerm.length === 0 && isSearching) {
        // Si se limpia la búsqueda, volver a cargar todos los conductores
        setIsSearching(false);
        fetchConductores(1);
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchConductores = async (page: number) => {
    try {
      setLoading(true);
      setIsSearching(false);
      const response = await axiosInstance.get(
        `/drivers/list?page=${page}`
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
    if (isSearching && searchTerm.length >= 2) {
      searchConductores(searchTerm, newPage);
    } else {
      fetchConductores(newPage);
    }
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
        <div className="bg-gradient-to-br from-white to-green-50/30 p-8 rounded-2xl shadow-lg border border-green-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-2">
                Gestión de Conductores
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Administra y supervisa los conductores registrados en el sistema</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-700">
                  {loading ? '-' : summary?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Total Conductores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Conductores */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Conductores Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-green-600" />}
                </CardTitle>
                <CardDescription>Listado completo de conductores en el sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
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
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddConductor)} className="space-y-4 pt-2">
                        <FormField name="dni" control={form.control} rules={{ 
                          required: "El DNI es obligatorio",
                          validate: validateDNI
                        }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>DNI</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: 12345678" maxLength={8} className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="firstName" control={form.control} rules={{ required: "El nombre es obligatorio" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: Juan Carlos" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="lastName" control={form.control} rules={{ required: "Los apellidos son obligatorios" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Apellidos</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: Pérez López" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="phoneNumber" control={form.control} rules={{ 
                          required: "El teléfono es obligatorio",
                          validate: validatePhone
                        }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: 987654321" maxLength={9} className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="address" control={form.control} rules={{ required: "La dirección es obligatoria" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: Av. Principal 123, La Joya" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className="pt-2">
                          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-full" disabled={submitting}>
                            {submitting ? 'Agregando...' : 'Agregar Conductor'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Buscador */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por DNI, nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500 pr-10"
                disabled={searchLoading}
              />
              {searchLoading && (
                <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5 animate-spin" />
              )}
              {searchTerm.length > 0 && searchTerm.length < 2 && (
                <div className="absolute -bottom-6 left-0 text-xs text-amber-600">
                  Ingresa al menos 2 caracteres para buscar
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">Cargando conductores...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-green-900">DNI</TableHead>
                        <TableHead className="font-bold text-green-900">Nombre Completo</TableHead>
                        <TableHead className="font-bold text-green-900">Teléfono</TableHead>
                        <TableHead className="font-bold text-green-900">Dirección</TableHead>
                        <TableHead className="font-bold text-green-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conductores.length === 0 && !loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <Search className="w-8 h-8 mb-2" />
                              <p>
                                {isSearching 
                                  ? `No se encontraron conductores que coincidan con "${searchTerm}"`
                                  : "No hay conductores registrados en el sistema"
                                }
                              </p>
                              {searchTerm && (
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSearchTerm('')}
                                  className="mt-2"
                                >
                                  Limpiar búsqueda
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        conductores.map((conductor) => (
                          <TableRow key={conductor.dni} className="hover:bg-green-50/50 transition-colors">
                            <TableCell className="font-mono font-semibold text-green-700">{conductor.dni}</TableCell>
                            <TableCell className="font-semibold text-gray-900">{conductor.nombreCompleto}</TableCell>
                            <TableCell className="text-gray-700">{conductor.telefono}</TableCell>
                            <TableCell className="text-gray-700">{conductor.direccion}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-green-100 rounded-lg"
                                  onClick={() => fetchConductorDetalle(conductor.dni)}
                                  disabled={loadingDetalle}
                                >
                                  {loadingDetalle ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-green-100 rounded-lg">
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
                  {searchTerm ? (
                    `Encontrados ${pagination.totalItems} conductores para "${searchTerm}" (página ${pagination.currentPage} de ${pagination.totalPages})`
                  ) : (
                    `Mostrando página ${pagination.currentPage} de ${pagination.totalPages} (${pagination.totalItems} conductores en total)`
                  )}
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

        {/* Diálogo de Detalles del Conductor */}
        <Dialog open={showDetalleDialog} onOpenChange={setShowDetalleDialog}>
          <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-green-600" />
                Detalles del Conductor
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Información completa y detallada del conductor
              </DialogDescription>
            </DialogHeader>
            
            {errorDetalle ? (
              <div className="flex flex-col items-center justify-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
                <p className="text-gray-600 mb-4 text-center">{errorDetalle}</p>
                <Button 
                  onClick={() => conductorDetallado && fetchConductorDetalle(conductorDetallado.dni)} 
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            ) : conductorDetallado ? (
              <div className="space-y-8">
                {/* Header con foto y datos principales */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={conductorDetallado.photoUrl} alt={conductorDetallado.nombreCompleto} />
                    <AvatarFallback className="text-2xl font-bold bg-green-600 text-white">
                      {conductorDetallado.firstName.charAt(0)}{conductorDetallado.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{conductorDetallado.nombreCompleto}</h2>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-mono font-semibold text-green-700">{conductorDetallado.dni}</span>
                      </div>
                      {conductorDetallado.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{conductorDetallado.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información Personal */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Información Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">DNI</Label>
                        <p className="mt-1 text-lg font-mono font-semibold text-green-700">{conductorDetallado.dni}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductorDetallado.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Apellidos</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductorDetallado.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{conductorDetallado.nombreCompleto}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Contacto */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-600" />
                        Información de Contacto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {conductorDetallado.phoneNumber || (
                            <span className="text-gray-500 italic">No registrado</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {conductorDetallado.address || (
                            <span className="text-gray-500 italic">No registrada</span>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Licencias */}
                  <Card className="shadow-sm border border-gray-200 md:col-span-2">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Licencias de Conducir
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {licenciasSummary && (
                        <div className="flex flex-wrap gap-4 mb-4">
                          <Badge className="bg-green-100 text-green-800">Total: {licenciasSummary.total}</Badge>
                          <Badge className="bg-green-100 text-green-800">Vigentes: {licenciasSummary.vigentes}</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800">Por vencer: {licenciasSummary.porVencer}</Badge>
                          <Badge className="bg-red-100 text-red-800">Vencidas: {licenciasSummary.vencidas}</Badge>
                        </div>
                      )}
                      {licencias.length === 0 ? (
                        <div className="text-gray-500 italic">No se encontraron licencias para este conductor.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-bold text-green-900">ID</TableHead>
                                <TableHead className="font-bold text-green-900">Número</TableHead>
                                <TableHead className="font-bold text-green-900">Categoría</TableHead>
                                <TableHead className="font-bold text-green-900">Entidad</TableHead>
                                <TableHead className="font-bold text-green-900">Estado</TableHead>
                                <TableHead className="font-bold text-green-900">Vencimiento</TableHead>
                                <TableHead className="font-bold text-green-900">Restricciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {licencias.map((lic) => (
                                <TableRow key={lic.licenseId}>
                                  <TableCell className="font-mono text-green-700">{lic.licenseId}</TableCell>
                                  <TableCell>{lic.licenseNumber}</TableCell>
                                  <TableCell>{lic.category}</TableCell>
                                  <TableCell>{lic.issuingEntity}</TableCell>
                                  <TableCell>
                                    <Badge className={
                                      lic.estado === 'vigente' ? 'bg-green-200 text-green-800' :
                                      lic.estado === 'por vencer' ? 'bg-yellow-200 text-yellow-800' :
                                      'bg-red-200 text-red-800'
                                    }>
                                      {lic.estado}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{new Date(lic.expirationDate).toLocaleDateString('es-ES')}</TableCell>
                                  <TableCell>{lic.restrictions}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* Información de Registro */}
                  <Card className="shadow-sm border border-gray-200 md:col-span-2">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        Información de Registro
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Fecha de Registro
                          </Label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {new Date(conductorDetallado.fechaRegistro).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Última Actualización
                          </Label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {new Date(conductorDetallado.ultimaActualizacion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Cargando detalles del conductor...</span>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ConductoresPage;
