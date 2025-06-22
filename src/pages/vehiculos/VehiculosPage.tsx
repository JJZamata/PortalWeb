import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Search, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, Plus, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useVehiculosData } from "@/hooks/useRealTimeData";
import axios from 'axios';

const VehiculosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehiculo, setSelectedVehiculo] = useState<any>(null);
  const [searchParams] = useSearchParams();
  
  // Usar datos en tiempo real
  const { data: vehiculos = [], isLoading, error, refetch, isRefetching } = useVehiculosData();

  const [vehiculosState, setVehiculosState] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchVehiculos = async (page = 1) => {
    try {
      setIsLoadingState(true);
      const response = await axios.get(`https://backendfiscamoto.onrender.com/api/vehicles?page=${page}`, {
        withCredentials: true
      });
      setVehiculosState(response.data.data.vehicles || []);
      setPagination(response.data.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      setErrorState(null);
    } catch (err: any) {
      setErrorState('Error al cargar los vehículos');
      console.error('Error al cargar vehículos:', err);
    } finally {
      setIsLoadingState(false);
    }
  };

  useEffect(() => {
    fetchVehiculos(1);
  }, []);

  useEffect(() => {
    const placa = searchParams.get('placa');
    if (placa) {
      setSearchTerm(placa);
    }
  }, [searchParams]);

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Activo': return 'default';
      case 'Por Vencer': return 'secondary';
      case 'Inactivo': case 'Vencido': return 'destructive';
      default: return 'outline';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Activo': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Por Vencer': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Inactivo': case 'Vencido': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const filteredVehiculos = vehiculos.filter(vehiculo =>
    vehiculo.placa_v.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.propietario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.propietario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      fetchVehiculos(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      fetchVehiculos(pagination.currentPage - 1);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de vehículos</p>
          <Button onClick={() => refetch()} variant="outline">
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
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-lg border border-blue-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Gestión de Vehículos
              </h1>
              <p className="text-gray-600 text-lg">Consulta información completa de vehículos y propietarios</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {isLoadingState ? '-' : pagination.totalItems}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <Button 
                onClick={() => fetchVehiculos(1)} 
                variant="outline" 
                disabled={isLoadingState}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingState ? 'animate-spin' : ''}`} />
                {isLoadingState ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Vehículos Registrados
                  {isLoadingState && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>Registro completo de vehículos del sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Vehículo
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Buscador */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por placa, propietario o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="pl-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoadingState ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Cargando vehículos...</span>
                </div>
              ) : errorState ? (
                <div>Error: {errorState}</div>
              ) : (
                <>
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-blue-900">Placa</TableHead>
                        <TableHead className="font-bold text-blue-900">Propietario</TableHead>
                        <TableHead className="font-bold text-blue-900">Empresa</TableHead>
                        <TableHead className="font-bold text-blue-900">Tipo</TableHead>
                        <TableHead className="font-bold text-blue-900">Estado</TableHead>
                        <TableHead className="font-bold text-blue-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehiculosState.map((vehiculo: any) => (
                        <TableRow key={vehiculo.placa.plateNumber} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-mono font-bold text-blue-800">{vehiculo.placa.plateNumber}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {vehiculo.propietario.nombreCompleto}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{vehiculo.empresa.nombre}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {vehiculo.tipo.marca} {vehiculo.tipo.modelo}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEstadoIcon(vehiculo.estado)}
                              <Badge variant={getBadgeVariant(vehiculo.estado)} className="font-semibold rounded-full">
                                {vehiculo.estado}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedVehiculo(vehiculo)} className="hover:bg-blue-100 rounded-lg">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Car className="w-5 h-5" />
                                      Información Completa - {selectedVehiculo?.placa.plateNumber}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Datos del vehículo, propietario y empresa
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedVehiculo && (
                                    <div className="space-y-6">
                                      {/* Información del Vehículo */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg flex items-center gap-2">
                                            <Car className="w-5 h-5" />
                                            Información del Vehículo
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Placa</label>
                                              <p className="font-mono font-bold text-lg">{selectedVehiculo.placa.plateNumber}</p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Estado</label>
                                              <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={getBadgeVariant(selectedVehiculo.estado)} className="font-semibold rounded-full">
                                                  {selectedVehiculo.estado}
                                                </Badge>
                                              </div>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Marca</label>
                                              <p className="font-medium">{selectedVehiculo.tipo.marca}</p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Modelo</label>
                                              <p className="font-medium">{selectedVehiculo.tipo.modelo}</p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Año</label>
                                              <p className="font-medium">{selectedVehiculo.tipo.año}</p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Tipo</label>
                                              <p className="font-medium">{selectedVehiculo.tipo.nombre}</p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Información del Propietario */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Información del Propietario</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                                              <p className="font-medium">
                                                {selectedVehiculo.propietario.nombreCompleto}
                                              </p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">DNI</label>
                                              <p className="font-mono font-medium">{selectedVehiculo.dni_propietario}</p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Información de la Empresa */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Empresa Operadora</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">Nombre</label>
                                              <p className="font-medium">{selectedVehiculo.empresa.nombre}</p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-700">RUC</label>
                                              <p className="font-mono font-medium">{selectedVehiculo.ruc_empresa}</p>
                                            </div>
                                            <div className="col-span-2">
                                              <label className="text-sm font-medium text-gray-700">Dirección</label>
                                              <p className="font-medium">{selectedVehiculo.empresa.direccion}</p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Mostrando página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems} vehículos en total)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={!pagination.hasPrevPage || isLoadingState}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage || isLoadingState}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VehiculosPage;
