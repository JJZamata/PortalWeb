
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Search, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, Plus, Download, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useVehiculosData } from "@/hooks/useRealTimeData";

const VehiculosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehiculo, setSelectedVehiculo] = useState<any>(null);
  const [searchParams] = useSearchParams();
  
  // Usar datos en tiempo real
  const { data: vehiculos = [], isLoading, error, refetch, isRefetching } = useVehiculosData();

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
                  {isLoading ? '-' : vehiculos.length}
                </p>
                <p className="text-sm text-gray-600">Total Vehículos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">
                  {isLoading ? '-' : vehiculos.filter(v => v.tipo_vehiculo.estado_vehiculo === 'Activo').length}
                </p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">
                  {isLoading ? '-' : vehiculos.filter(v => v.tipo_vehiculo.estado_vehiculo === 'Inactivo').length}
                </p>
                <p className="text-sm text-gray-600">Inactivos</p>
              </div>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                disabled={isRefetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Actualizando...' : 'Actualizar'}
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
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Cargando vehículos...</span>
                </div>
              ) : (
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
                    {filteredVehiculos.map((vehiculo) => (
                      <TableRow key={vehiculo.placa_v} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-blue-800">{vehiculo.placa_v}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {vehiculo.propietario.nombres} {vehiculo.propietario.apellidos}
                            </p>
                            <p className="text-sm text-gray-500">DNI: {vehiculo.dni_propietario}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{vehiculo.empresa.nombre}</p>
                            <p className="text-sm text-gray-500">RUC: {vehiculo.ruc_empresa}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {vehiculo.tipo_vehiculo.marca} {vehiculo.tipo_vehiculo.modelo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEstadoIcon(vehiculo.tipo_vehiculo.estado_vehiculo)}
                            <Badge variant={getBadgeVariant(vehiculo.tipo_vehiculo.estado_vehiculo)} className="font-semibold rounded-full">
                              {vehiculo.tipo_vehiculo.estado_vehiculo}
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
                                    Información Completa - {selectedVehiculo?.placa_v}
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
                                            <p className="font-mono font-bold text-lg">{selectedVehiculo.placa_v}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Estado</label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Badge variant={getBadgeVariant(selectedVehiculo.tipo_vehiculo.estado_vehiculo)} className="font-semibold rounded-full">
                                                {selectedVehiculo.tipo_vehiculo.estado_vehiculo}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Marca</label>
                                            <p className="font-medium">{selectedVehiculo.tipo_vehiculo.marca}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Modelo</label>
                                            <p className="font-medium">{selectedVehiculo.tipo_vehiculo.modelo}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Año</label>
                                            <p className="font-medium">{selectedVehiculo.tipo_vehiculo.anio_fabricacion}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Tipo</label>
                                            <p className="font-medium">{selectedVehiculo.tipo_vehiculo.nombre}</p>
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
                                              {selectedVehiculo.propietario.nombres} {selectedVehiculo.propietario.apellidos}
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VehiculosPage;
