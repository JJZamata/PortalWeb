import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Search, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, Plus, Download, Filter, ChevronLeft, ChevronRight, Trash2, Edit, User, Building2, BadgeInfo, Info } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useVehiculosData } from "@/hooks/useRealTimeData";
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Esquema de validación para el formulario de registro de vehículo
const vehiculoSchema = z.object({
  plateNumber: z.string().min(5, "La placa debe tener al menos 5 caracteres").max(10, "Máximo 10 caracteres"),
  companyRuc: z.string().length(11, "El RUC debe tener 11 dígitos"),
  ownerDni: z.string().length(8, "El DNI debe tener 8 dígitos"),
  typeId: z.coerce.number().int().positive("Debe ser un número positivo"),
  vehicleStatus: z.enum(["OPERATIVO", "INACTIVO", "VENCIDO", "POR VENCER"]),
  brand: z.string().min(2, "Marca requerida"),
  model: z.string().min(1, "Modelo requerido"),
  manufacturingYear: z.coerce.number().int().gte(1900, "Año inválido").lte(new Date().getFullYear(), "Año inválido"),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

// Componente reutilizable para tarjetas de estadísticas
function StatCard({ value, label }: { value: any, label: string }) {
  return (
    <Card className="w-28 text-center py-2 px-0 border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <p className="text-3xl font-bold text-blue-700">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </CardContent>
    </Card>
  );
}

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

  const [openNuevoVehiculo, setOpenNuevoVehiculo] = useState(false);
  const [loadingNuevoVehiculo, setLoadingNuevoVehiculo] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    mode: "onTouched",
  });

  // Estado para editar vehículo
  const [openEditarVehiculo, setOpenEditarVehiculo] = useState(false);
  const [loadingEditarVehiculo, setLoadingEditarVehiculo] = useState(false);
  const [formErrorEditar, setFormErrorEditar] = useState<string | null>(null);
  const [vehiculoEditando, setVehiculoEditando] = useState<any>(null);

  const {
    register: registerEditar,
    handleSubmit: handleSubmitEditar,
    reset: resetEditar,
    setValue: setValueEditar,
    formState: { errors: errorsEditar },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    mode: "onTouched",
  });

  const [openEliminarVehiculo, setOpenEliminarVehiculo] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<any>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [successEliminar, setSuccessEliminar] = useState<string | null>(null);

  const [detalleVehiculo, setDetalleVehiculo] = useState<any>(null);
  const [loadingDetalleVehiculo, setLoadingDetalleVehiculo] = useState(false);
  const [errorDetalleVehiculo, setErrorDetalleVehiculo] = useState<string | null>(null);

  // Estados para filtros avanzados
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('plateNumber');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Estado para estadísticas
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  const fetchVehiculos = async (page = 1) => {
    try {
      setIsLoadingState(true);
      // Construir query params
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      const response = await axios.get(`https://backendfiscamoto.onrender.com/api/vehicles/?${params.toString()}`);
      setVehiculosState(response.data.data.vehicles || []);
      setPagination(response.data.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      setErrorState(null);
    } catch (err) {
      setErrorState('Error al cargar los vehículos');
    } finally {
      setIsLoadingState(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    setErrorStats(null);
    try {
      const response = await axiosInstance.get('https://backendfiscamoto.onrender.com/api/vehicles/stats?groupBy=status');
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setErrorStats(response.data.message || 'Error al cargar estadísticas');
      }
    } catch (err: any) {
      setErrorStats(err?.response?.data?.message || 'Error al cargar estadísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  // useEffect inicial: solo al cargar la página
  useEffect(() => {
    fetchVehiculos(1);
    fetchStats();
    // eslint-disable-next-line
  }, []);

  // useEffect para filtros: actualiza solo la tabla
  useEffect(() => {
    fetchVehiculos(1);
    // NO llamar fetchStats aquí
    // eslint-disable-next-line
  }, [searchTerm, statusFilter]);

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

  const onSubmitNuevoVehiculo = async (data: VehiculoFormData) => {
    setLoadingNuevoVehiculo(true);
    setFormError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post("/vehicles", data, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      if (response.data.success) {
        setOpenNuevoVehiculo(false);
        reset();
        fetchVehiculos(1); // Recargar la tabla
        fetchStats(); // Actualizar stats
      } else {
        setFormError(response.data.message || "Error desconocido");
      }
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Error al registrar el vehículo");
    } finally {
      setLoadingNuevoVehiculo(false);
    }
  };

  const abrirEditarVehiculo = (vehiculo: any) => {
    setVehiculoEditando(vehiculo);
    setOpenEditarVehiculo(true);
    // Precargar valores
    setValueEditar("plateNumber", vehiculo.placa.plateNumber);
    setValueEditar("companyRuc", vehiculo.empresa.ruc || "");
    setValueEditar("ownerDni", vehiculo.propietario.dni || "");
    setValueEditar("typeId", vehiculo.tipo.id || 1);
    setValueEditar("vehicleStatus", vehiculo.estado || "OPERATIVO");
    setValueEditar("brand", vehiculo.tipo.marca || "");
    setValueEditar("model", vehiculo.tipo.modelo || "");
    setValueEditar("manufacturingYear", vehiculo.tipo.año || "");
    setFormErrorEditar(null);
  };

  const onSubmitEditarVehiculo = async (data: VehiculoFormData) => {
    setLoadingEditarVehiculo(true);
    setFormErrorEditar(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(`/vehicles/${data.plateNumber}`,
        {
          companyRuc: data.companyRuc,
          ownerDni: data.ownerDni,
          typeId: data.typeId,
          vehicleStatus: data.vehicleStatus,
          brand: data.brand,
          model: data.model,
          manufacturingYear: data.manufacturingYear,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );
      if (response.data.success) {
        setOpenEditarVehiculo(false);
        resetEditar();
        fetchVehiculos(1);
        fetchStats(); // Actualizar stats
      } else {
        setFormErrorEditar(response.data.message || "Error desconocido");
      }
    } catch (err: any) {
      setFormErrorEditar(err?.response?.data?.message || "Error al actualizar el vehículo");
    } finally {
      setLoadingEditarVehiculo(false);
    }
  };

  const handleEliminarVehiculo = (vehiculo: any) => {
    setVehiculoAEliminar(vehiculo);
    setOpenEliminarVehiculo(true);
    setErrorEliminar(null);
    setSuccessEliminar(null);
  };

  const confirmarEliminarVehiculo = async () => {
    if (!vehiculoAEliminar) return;
    setLoadingEliminar(true);
    setErrorEliminar(null);
    setSuccessEliminar(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.delete(`/vehicles/${vehiculoAEliminar.placa.plateNumber}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (response.data.success) {
        setSuccessEliminar(response.data.message || "Vehículo eliminado exitosamente");
        fetchVehiculos(1);
        fetchStats(); // Actualizar stats
        setTimeout(() => {
          setOpenEliminarVehiculo(false);
          setVehiculoAEliminar(null);
        }, 1200);
      } else {
        setErrorEliminar(response.data.message || "Error al eliminar");
      }
    } catch (err: any) {
      setErrorEliminar(err?.response?.data?.message || "Error al eliminar el vehículo");
    } finally {
      setLoadingEliminar(false);
    }
  };

  const fetchDetalleVehiculo = async (plateNumber: string) => {
    // Validar y limpiar plateNumber
    if (!plateNumber || typeof plateNumber !== 'string' || plateNumber.trim().length < 5) {
      setErrorDetalleVehiculo('Placa inválida. No se puede obtener detalles.');
      setDetalleVehiculo(null);
      setLoadingDetalleVehiculo(false);
      return;
    }
    // Eliminar guiones y espacios, y pasar a mayúsculas
    const cleanPlate = plateNumber.replace(/[-\s]/g, '').toUpperCase();
    setLoadingDetalleVehiculo(true);
    setErrorDetalleVehiculo(null);
    try {
      const response = await axios.get(`/api/vehicles/${cleanPlate}`);
      if (response.data.success) {
        setDetalleVehiculo(response.data.data);
      } else {
        setErrorDetalleVehiculo(response.data.message || "Error al obtener detalles");
      }
    } catch (err: any) {
      setErrorDetalleVehiculo(err?.response?.data?.message || "Error al obtener detalles del vehículo");
    } finally {
      setLoadingDetalleVehiculo(false);
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
            <div className="flex items-center gap-4 mt-2">
              <StatCard value={
                loadingStats
                  ? <RefreshCw className="w-6 h-6 mx-auto animate-spin text-blue-600" />
                  : stats && stats.byStatus
                    ? (Object.values(stats.byStatus) as number[]).reduce((acc, val) => acc + val, 0)
                    : 0
              } label="Total" />
              {loadingStats
                ? ["Operativo", "Reparación", "Fuera de servicio"].map((estado) => (
                    <StatCard key={estado} value={<RefreshCw className="w-6 h-6 mx-auto animate-spin text-blue-600" />} label={estado} />
                  ))
                : stats && stats.byStatus
                  ? Object.entries(stats.byStatus)
                      .filter(([estado]) => estado !== 'INSPECCIÓN')
                      .map(([estado, cantidad]: any) => (
                        <StatCard key={estado} value={cantidad} label={estado.charAt(0) + estado.slice(1).toLowerCase()} />
                      ))
                  : errorStats
                    ? <div className="text-red-600 text-xs">{errorStats}</div>
                    : null}
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
                <Dialog open={openNuevoVehiculo} onOpenChange={setOpenNuevoVehiculo}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Vehículo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
                      <DialogDescription>Completa todos los campos para registrar un vehículo.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitNuevoVehiculo)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Placa</label>
                        <Input {...register("plateNumber")} placeholder="Ej: ABC123" className="mt-1" />
                        {errors.plateNumber && <p className="text-red-500 text-xs mt-1">{errors.plateNumber.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">RUC Empresa</label>
                        <Input {...register("companyRuc")} placeholder="Ej: 20123456789" className="mt-1" />
                        {errors.companyRuc && <p className="text-red-500 text-xs mt-1">{errors.companyRuc.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">DNI Propietario</label>
                        <Input {...register("ownerDni")} placeholder="Ej: 12345678" className="mt-1" />
                        {errors.ownerDni && <p className="text-red-500 text-xs mt-1">{errors.ownerDni.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID Tipo Vehículo</label>
                        <Input type="number" {...register("typeId")} placeholder="Ej: 1" className="mt-1" />
                        {errors.typeId && <p className="text-red-500 text-xs mt-1">{errors.typeId.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select {...register("vehicleStatus")} className="mt-1 w-full border rounded-md h-10 px-2">
                          <option value="">Selecciona estado</option>
                          <option value="OPERATIVO">Operativo</option>
                          <option value="INACTIVO">Inactivo</option>
                          <option value="VENCIDO">Vencido</option>
                          <option value="POR VENCER">Por vencer</option>
                        </select>
                        {errors.vehicleStatus && <p className="text-red-500 text-xs mt-1">{errors.vehicleStatus.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Marca</label>
                        <Input {...register("brand")} placeholder="Ej: Toyota" className="mt-1" />
                        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Modelo</label>
                        <Input {...register("model")} placeholder="Ej: Corolla" className="mt-1" />
                        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Año de fabricación</label>
                        <Input type="number" {...register("manufacturingYear")} placeholder="Ej: 2020" className="mt-1" />
                        {errors.manufacturingYear && <p className="text-red-500 text-xs mt-1">{errors.manufacturingYear.message}</p>}
                      </div>
                      {formError && <div className="text-red-600 text-sm font-semibold">{formError}</div>}
                      <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => { setOpenNuevoVehiculo(false); reset(); }} disabled={loadingNuevoVehiculo}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-blue-600 text-white" disabled={loadingNuevoVehiculo}>
                          {loadingNuevoVehiculo ? "Registrando..." : "Registrar"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Controles de búsqueda y filtro (estilo Empresas) */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Buscador */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, propietario o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
              </div>
              {/* Filtro por Estado */}
              <div className="flex gap-2 min-w-[200px]">
                <Select
                  value={statusFilter || "ALL"}
                  onValueChange={value => setStatusFilter(value === "ALL" ? "" : value)}
                >
                  <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los estados</SelectItem>
                    <SelectItem value="OPERATIVO">Operativo</SelectItem>
                    <SelectItem value="REPARACIÓN">Reparación</SelectItem>
                    <SelectItem value="FUERA DE SERVICIO">Fuera de servicio</SelectItem>
                    <SelectItem value="INSPECCIÓN">Inspección</SelectItem>
                  </SelectContent>
                </Select>
                {(searchTerm || statusFilter) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSearchTerm(''); setStatusFilter(''); fetchVehiculos(1); }}
                    className="h-12 px-3 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
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
                    {vehiculosState.length === 0 && !isLoadingState ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                          No hay vehículos registrados que coincidan con los filtros.
                        </TableCell>
                      </TableRow>
                    ) : (
                      vehiculosState.map((vehiculo: any) => (
                        <TableRow key={vehiculo.placa?.plateNumber || vehiculo.placa_v || vehiculo.placa || Math.random()} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-mono font-bold text-blue-800">{vehiculo.placa?.plateNumber || vehiculo.placa_v || vehiculo.placa || '-'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {vehiculo.propietario?.nombreCompleto || '-'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{vehiculo.empresa?.nombre || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {(vehiculo.tipo?.marca || '-') + ' ' + (vehiculo.tipo?.modelo || '-')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEstadoIcon(vehiculo.estado)}
                              <Badge variant={getBadgeVariant(vehiculo.estado)} className="font-semibold rounded-full">
                                {vehiculo.estado || '-'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Dialog open={!!selectedVehiculo && selectedVehiculo.placa.plateNumber === vehiculo.placa.plateNumber} onOpenChange={(open) => { if (!open) setSelectedVehiculo(null); }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVehiculo(vehiculo);
                                      const placaLimpia = (vehiculo.placa?.plateNumber || vehiculo.placa_v || vehiculo.placa || '').replace(/[-\s]/g, '');
                                      fetchDetalleVehiculo(placaLimpia);
                                    }}
                                    className="hover:bg-blue-100 rounded-lg"
                                    title="Ver Detalles"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader className="pb-6">
                                    <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                      <Car className="w-6 h-6 text-blue-600" />
                                      Detalles del Vehículo
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600">
                                      Información completa y detallada del vehículo
                                    </DialogDescription>
                                  </DialogHeader>
                                  {errorDetalleVehiculo ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                      <XCircle className="w-12 h-12 text-red-500 mb-4" />
                                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
                                      <p className="text-gray-600 mb-4 text-center">{errorDetalleVehiculo}</p>
                                      <Button onClick={() => fetchDetalleVehiculo(selectedVehiculo?.placa.plateNumber)} variant="outline">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reintentar
                                      </Button>
                                    </div>
                                  ) : loadingDetalleVehiculo ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                      <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                                      <span className="text-gray-600">Cargando detalles...</span>
                                    </div>
                                  ) : detalleVehiculo ? (
                                    <div className="space-y-8">
                                      {/* Header con placa, estado y datos principales */}
                                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl">
                                        <div className="flex-1">
                                          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <span className="font-mono text-3xl text-blue-700">{detalleVehiculo.placa.plateNumber}</span>
                                            <Badge variant={getBadgeVariant(detalleVehiculo.estado)} className="font-semibold rounded-full text-base px-4 py-1">
                                              {detalleVehiculo.estado}
                                            </Badge>
                                          </h2>
                                          <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                              <Building2 className="w-4 h-4" />
                                              <span className="font-medium">{detalleVehiculo.empresa?.nombre}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <User className="w-4 h-4" />
                                              <span>{detalleVehiculo.propietario?.nombreCompleto}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <BadgeInfo className="w-4 h-4" />
                                              <span className="font-mono">{detalleVehiculo.placa.companyRuc}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Información detallada en tarjetas */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Información del Vehículo */}
                                        <Card className="shadow-sm border border-gray-200">
                                          <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                              <Car className="w-5 h-5 text-blue-600" />
                                              Información del Vehículo
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Placa</Label>
                                              <p className="mt-1 text-lg font-mono font-bold text-blue-800">{detalleVehiculo.placa.plateNumber}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Estado</Label>
                                              <Badge variant={getBadgeVariant(detalleVehiculo.estado)} className="font-semibold rounded-full">
                                                {detalleVehiculo.estado}
                                              </Badge>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">RUC Empresa</Label>
                                              <p className="font-mono">{detalleVehiculo.placa.companyRuc}</p>
                                            </div>
                                          </CardContent>
                                        </Card>
                                        {/* Información del Propietario */}
                                        <Card className="shadow-sm border border-gray-200">
                                          <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                              <User className="w-5 h-5 text-blue-600" />
                                              Propietario
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                                              <p className="font-medium">{detalleVehiculo.propietario?.nombreCompleto}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">DNI</Label>
                                              <p className="font-mono">{detalleVehiculo.propietario?.dni}</p>
                                            </div>
                                          </CardContent>
                                        </Card>
                                        {/* Información de la Empresa */}
                                        <Card className="shadow-sm border border-gray-200">
                                          <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                              <Building2 className="w-5 h-5 text-blue-600" />
                                              Empresa Operadora
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                                              <p className="font-medium">{detalleVehiculo.empresa?.nombre}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">RUC</Label>
                                              <p className="font-mono">{detalleVehiculo.empresa?.ruc}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Estado</Label>
                                              <Badge variant={getBadgeVariant(detalleVehiculo.empresa?.estado)} className="font-semibold rounded-full">
                                                {detalleVehiculo.empresa?.estado}
                                              </Badge>
                                            </div>
                                          </CardContent>
                                        </Card>
                                        {/* Información del Tipo de Vehículo */}
                                        <Card className="shadow-sm border border-gray-200">
                                          <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                              <Info className="w-5 h-5 text-blue-600" />
                                              Tipo de Vehículo
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Categoría</Label>
                                              <p className="font-medium">{detalleVehiculo.tipo?.categoria}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Marca</Label>
                                              <p className="font-medium">{detalleVehiculo.tipo?.marca}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Modelo</Label>
                                              <p className="font-medium">{detalleVehiculo.tipo?.modelo}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Año</Label>
                                              <p className="font-medium">{detalleVehiculo.tipo?.año}</p>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium text-gray-700">Info</Label>
                                              <p className="font-medium">{detalleVehiculo.tipo?.vehicleInfo}</p>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </div>
                                  ) : null}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" onClick={() => abrirEditarVehiculo(vehiculo)} className="hover:bg-yellow-100 rounded-lg" title="Editar">
                                <Edit className="w-4 h-4 text-yellow-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEliminarVehiculo(vehiculo)} className="hover:bg-red-100 rounded-lg" title="Eliminar">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Controles de paginación */}
            {!isLoadingState && !errorState && (
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
            )}
          </CardContent>
        </Card>

        <Dialog open={openEditarVehiculo} onOpenChange={setOpenEditarVehiculo}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Vehículo</DialogTitle>
              <DialogDescription>Modifica los datos y guarda los cambios.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEditar(onSubmitEditarVehiculo)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Placa</label>
                <Input {...registerEditar("plateNumber")} readOnly className="mt-1 bg-gray-100" />
                {errorsEditar.plateNumber && <p className="text-red-500 text-xs mt-1">{errorsEditar.plateNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">RUC Empresa</label>
                <Input {...registerEditar("companyRuc")} className="mt-1" />
                {errorsEditar.companyRuc && <p className="text-red-500 text-xs mt-1">{errorsEditar.companyRuc.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DNI Propietario</label>
                <Input {...registerEditar("ownerDni")} className="mt-1" />
                {errorsEditar.ownerDni && <p className="text-red-500 text-xs mt-1">{errorsEditar.ownerDni.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Tipo Vehículo</label>
                <Input type="number" {...registerEditar("typeId")} className="mt-1" />
                {errorsEditar.typeId && <p className="text-red-500 text-xs mt-1">{errorsEditar.typeId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select {...registerEditar("vehicleStatus")} className="mt-1 w-full border rounded-md h-10 px-2">
                  <option value="OPERATIVO">Operativo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="VENCIDO">Vencido</option>
                  <option value="POR VENCER">Por vencer</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                </select>
                {errorsEditar.vehicleStatus && <p className="text-red-500 text-xs mt-1">{errorsEditar.vehicleStatus.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <Input {...registerEditar("brand")} className="mt-1" />
                {errorsEditar.brand && <p className="text-red-500 text-xs mt-1">{errorsEditar.brand.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                <Input {...registerEditar("model")} className="mt-1" />
                {errorsEditar.model && <p className="text-red-500 text-xs mt-1">{errorsEditar.model.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Año de fabricación</label>
                <Input type="number" {...registerEditar("manufacturingYear")} className="mt-1" />
                {errorsEditar.manufacturingYear && <p className="text-red-500 text-xs mt-1">{errorsEditar.manufacturingYear.message}</p>}
              </div>
              {formErrorEditar && <div className="text-red-600 text-sm font-semibold">{formErrorEditar}</div>}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setOpenEditarVehiculo(false); resetEditar(); }} disabled={loadingEditarVehiculo}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 text-white" disabled={loadingEditarVehiculo}>
                  {loadingEditarVehiculo ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={openEliminarVehiculo} onOpenChange={setOpenEliminarVehiculo}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>¿Eliminar Vehículo?</DialogTitle>
              <DialogDescription>
                ¿Estás seguro que deseas eliminar el vehículo con placa <span className="font-bold">{vehiculoAEliminar?.placa.plateNumber}</span>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            {errorEliminar && <div className="text-red-600 text-sm font-semibold">{errorEliminar}</div>}
            {successEliminar && <div className="text-green-600 text-sm font-semibold">{successEliminar}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenEliminarVehiculo(false)} disabled={loadingEliminar}>
                Cancelar
              </Button>
              <Button type="button" className="bg-red-600 text-white" onClick={confirmarEliminarVehiculo} disabled={loadingEliminar}>
                {loadingEliminar ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default VehiculosPage;
