import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, Search, Plus, Edit, Eye, FileText, Calendar, MapPin, Filter, ChevronLeft, ChevronRight, RefreshCw, XCircle, Car, Clock, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Empresa {
  ruc: string;
  nombre: string;
  direccion: string;
  nro_resolucion: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  entidad_emisora: string;
  estado: string;
  vehiculos_asociados: number;
}

interface EmpresaDetallada {
  ruc: string;
  name: string;
  address: string;
  legalRepresentative: string;
  rucStatus: string;
  registrationDate: string;
  expirationDate: string;
  phone: string;
  email: string;
  vehicles: any[];
}

interface PaginacionData {
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// Esquema de validación para empresa
const empresaSchema = z.object({
  ruc: z.string().min(11, "El RUC debe tener 11 dígitos").max(11),
  name: z.string().min(3, "Nombre requerido"),
  address: z.string().min(3, "Dirección requerida"),
  registrationDate: z.string().min(8, "Fecha requerida"),
  expirationDate: z.string().min(8, "Fecha requerida"),
  rucStatus: z.enum(["ACTIVO", "SUSPENDIDO", "BAJA PROV."]),
});

type EmpresaForm = z.infer<typeof empresaSchema>;

// Esquema de validación para editar empresa (sin RUC ni fecha de registro)
const empresaEditSchema = z.object({
  name: z.string().min(3, "Nombre requerido"),
  address: z.string().min(3, "Dirección requerida"),
  expirationDate: z.string().min(8, "Fecha requerida"),
  rucStatus: z.enum(["ACTIVO", "SUSPENDIDO", "BAJA PROV."]),
});

type EmpresaEditForm = z.infer<typeof empresaEditSchema>;

const EmpresasPage = () => {
  console.log('EmpresasPage se está renderizando');
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState<PaginacionData>({
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Estados para filtrado
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // Estados para vista detallada
  const [empresaDetalle, setEmpresaDetalle] = useState<EmpresaDetallada | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);

  // Estado para estadísticas
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    suspendedCompanies: 0,
    lowProvCompanies: 0,
    totalVehicles: 0,
    companiesWithVehicles: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Estado para modal de nueva empresa
  const [showNewEmpresa, setShowNewEmpresa] = useState(false);
  const [loadingNewEmpresa, setLoadingNewEmpresa] = useState(false);

  // Estado para modal de edición
  const [showEditEmpresa, setShowEditEmpresa] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [loadingEditEmpresa, setLoadingEditEmpresa] = useState(false);

  // Estado para modal de eliminación
  const [showDeleteEmpresa, setShowDeleteEmpresa] = useState(false);
  const [deletingEmpresa, setDeletingEmpresa] = useState<Empresa | null>(null);
  const [loadingDeleteEmpresa, setLoadingDeleteEmpresa] = useState(false);

  const { toast } = useToast();

  const form = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      ruc: "",
      name: "",
      address: "",
      registrationDate: "",
      expirationDate: "",
      rucStatus: "ACTIVO",
    },
  });

  const editForm = useForm<EmpresaEditForm>({
    resolver: zodResolver(empresaEditSchema),
    defaultValues: {
      name: "",
      address: "",
      expirationDate: "",
      rucStatus: "ACTIVO",
    },
  });

  const fetchEmpresas = async (page = 1) => {
    try {
      setLoading(true);
      setIsSearching(false);
      setIsFiltering(false);
      const response = await axiosInstance.get(`/companies?page=${page}`);

      const companiesData = response.data?.data?.companies || [];
      const paginationData = response.data?.data?.pagination || {};

      const empresasTransformadas = companiesData.map(company => ({
        ruc: company.ruc || '',
        nombre: company.name || '',
        direccion: company.address || 'Dirección no disponible',
        nro_resolucion: "RES-2024-001",
        fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
        fecha_vencimiento: company.expirationDate || '',
        entidad_emisora: "Municipalidad Distrital La Joya",
        estado: company.rucStatus || 'Sin Estado',
        vehiculos_asociados: company.vehicleCount || 0
      }));

      setEmpresas(empresasTransformadas);
      setPaginacion(paginationData);
      setLoading(false);
    } catch (error) {
      console.error('Error completo:', error);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || "Error al cargar las empresas"
        : "Error al cargar las empresas");
      setLoading(false);
    }
  };

  // Función para filtrar empresas por estado RUC
  const filterEmpresas = async (status: string, page: number = 1) => {
    if (!status) {
      // Si no hay filtro, volver a cargar todas las empresas
      fetchEmpresas(page);
      return;
    }

    try {
      setFilterLoading(true);
      setIsFiltering(true);
      setIsSearching(false);
      
      const response = await axiosInstance.get(`/companies/filter?status=${status}&page=${page}`);
      
      if (response.data.success) {
        const companiesData = response.data.data.companies || [];
        const paginationData = response.data.data.pagination || {};

        const empresasTransformadas = companiesData.map(company => ({
          ruc: company.ruc || '',
          nombre: company.name || '',
          direccion: company.address || 'Dirección no disponible',
          nro_resolucion: "RES-2024-001",
          fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
          fecha_vencimiento: company.expirationDate || '',
          entidad_emisora: "Municipalidad Distrital La Joya",
          estado: company.rucStatus || 'Sin Estado',
          vehiculos_asociados: company.vehicleCount || 0
        }));

        setEmpresas(empresasTransformadas);
        setPaginacion(paginationData);
        
        toast({
          title: "Filtro aplicado",
          description: `Mostrando empresas con estado: ${status}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error al filtrar empresas:', error);
      toast({
        title: "Error en el filtro",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al filtrar empresas'
          : 'Error al filtrar empresas',
        variant: "destructive",
      });
    } finally {
      setFilterLoading(false);
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setStatusFilter('ALL');
    setSearchTerm('');
    setIsSearching(false);
    setIsFiltering(false);
    fetchEmpresas(1);
    toast({
      title: "Filtros limpiados",
      description: "Mostrando todas las empresas",
      variant: "default",
    });
  };

  // Función para obtener detalles de empresa
  const fetchEmpresaDetalle = async (ruc: string) => {
    setLoadingDetalle(true);
    setErrorDetalle(null);
    try {
      const response = await axiosInstance.get(`/companies/${ruc}`);
      setEmpresaDetalle(response.data.data);
    } catch (error) {
      setErrorDetalle(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al obtener detalles de la empresa'
        : 'Error al obtener detalles de la empresa');
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Función para buscar empresas
  const searchEmpresas = async (query: string, page: number = 1) => {
    if (query.length < 2) {
      // Si la búsqueda es muy corta, volver a cargar según el filtro actual
      if (statusFilter && statusFilter !== "ALL") {
        filterEmpresas(statusFilter, page);
      } else {
        fetchEmpresas(page);
      }
      return;
    }

    try {
      setSearchLoading(true);
      setIsSearching(true);
      const response = await axiosInstance.get(`/companies/search?query=${encodeURIComponent(query)}&page=${page}`);
      
      if (response.data.success) {
        const companiesData = response.data.data.companies || [];
        const paginationData = response.data.data.pagination || {};

        const empresasTransformadas = companiesData.map(company => ({
          ruc: company.ruc || '',
          nombre: company.name || '',
          direccion: company.address || 'Dirección no disponible',
          nro_resolucion: "RES-2024-001",
          fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
          fecha_vencimiento: company.expirationDate || '',
          entidad_emisora: "Municipalidad Distrital La Joya",
          estado: company.rucStatus || 'Sin Estado',
          vehiculos_asociados: company.vehicleCount || 0
        }));

        setEmpresas(empresasTransformadas);
        setPaginacion(paginationData);
      }
    } catch (error) {
      console.error('Error al buscar empresas:', error);
      toast({
        title: "Error en la búsqueda",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al buscar empresas'
          : 'Error al buscar empresas',
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Función para aplicar filtros combinados
  const applyCombinedFilters = async (page: number = 1) => {
    const hasSearch = searchTerm.length >= 2;
    const hasStatusFilter = statusFilter && statusFilter !== "ALL";

    try {
      setFilterLoading(true);
      setSearchLoading(true);
      setIsSearching(hasSearch);
      setIsFiltering(hasStatusFilter);

      let response;
      
      if (hasSearch && hasStatusFilter) {
        // Filtros combinados: búsqueda + estado
        // Primero buscamos, luego filtramos por estado en el frontend
        const searchResponse = await axiosInstance.get(`/companies/search?query=${encodeURIComponent(searchTerm)}&page=${page}`);
        
        if (searchResponse.data.success) {
          const companiesData = searchResponse.data.data.companies || [];
          const paginationData = searchResponse.data.data.pagination || {};

          // Filtrar por estado en el frontend
          const filteredCompanies = companiesData.filter(company => 
            company.rucStatus === statusFilter
          );

          const empresasTransformadas = filteredCompanies.map(company => ({
            ruc: company.ruc || '',
            nombre: company.name || '',
            direccion: company.address || 'Dirección no disponible',
            nro_resolucion: "RES-2024-001",
            fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
            fecha_vencimiento: company.expirationDate || '',
            entidad_emisora: "Municipalidad Distrital La Joya",
            estado: company.rucStatus || 'Sin Estado',
            vehiculos_asociados: company.vehicleCount || 0
          }));

          setEmpresas(empresasTransformadas);
          setPaginacion({
            ...paginationData,
            totalCompanies: filteredCompanies.length,
            totalPages: Math.ceil(filteredCompanies.length / paginationData.limit)
          });
        }
      } else if (hasSearch) {
        // Solo búsqueda
        response = await axiosInstance.get(`/companies/search?query=${encodeURIComponent(searchTerm)}&page=${page}`);
        
        if (response.data.success) {
          const companiesData = response.data.data.companies || [];
          const paginationData = response.data.data.pagination || {};

          const empresasTransformadas = companiesData.map(company => ({
            ruc: company.ruc || '',
            nombre: company.name || '',
            direccion: company.address || 'Dirección no disponible',
            nro_resolucion: "RES-2024-001",
            fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
            fecha_vencimiento: company.expirationDate || '',
            entidad_emisora: "Municipalidad Distrital La Joya",
            estado: company.rucStatus || 'Sin Estado',
            vehiculos_asociados: company.vehicleCount || 0
          }));

          setEmpresas(empresasTransformadas);
          setPaginacion(paginationData);
        }
      } else if (hasStatusFilter) {
        // Solo filtro por estado
        response = await axiosInstance.get(`/companies/filter?status=${statusFilter}&page=${page}`);
        
        if (response.data.success) {
          const companiesData = response.data.data.companies || [];
          const paginationData = response.data.data.pagination || {};

          const empresasTransformadas = companiesData.map(company => ({
            ruc: company.ruc || '',
            nombre: company.name || '',
            direccion: company.address || 'Dirección no disponible',
            nro_resolucion: "RES-2024-001",
            fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
            fecha_vencimiento: company.expirationDate || '',
            entidad_emisora: "Municipalidad Distrital La Joya",
            estado: company.rucStatus || 'Sin Estado',
            vehiculos_asociados: company.vehicleCount || 0
          }));

          setEmpresas(empresasTransformadas);
          setPaginacion(paginationData);
        }
      } else {
        // Sin filtros, cargar todas
        fetchEmpresas(page);
        return;
      }

      // Toast de confirmación para filtros combinados
      if (hasSearch && hasStatusFilter) {
        toast({
          title: "Filtros aplicados",
          description: `Mostrando empresas con "${searchTerm}" y estado "${statusFilter}"`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error al aplicar filtros combinados:', error);
      toast({
        title: "Error en los filtros",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al aplicar filtros'
          : 'Error al aplicar filtros',
        variant: "destructive",
      });
    } finally {
      setFilterLoading(false);
      setSearchLoading(false);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyCombinedFilters(1);
    }, 500); // 500ms de debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SUSPENDIDO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BAJA PROV.':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Vigente':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Por Vencer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Vencido':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Función para obtener estadísticas
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await axiosInstance.get('/companies/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      // Opcional: mostrar toast de error
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchEmpresas(1);
  }, []);

  const onSubmitEmpresa = async (data: EmpresaForm) => {
    try {
      setLoadingNewEmpresa(true);
      await axiosInstance.post("/companies/", data);
      toast({
        title: "Empresa registrada",
        description: "La empresa fue creada exitosamente.",
        variant: "success",
      });
      setShowNewEmpresa(false);
      form.reset();
      fetchEmpresas(1);
      fetchStats();
    } catch (error) {
      toast({
        title: "Error al registrar",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al registrar empresa'
          : 'Error al registrar empresa',
        variant: "destructive",
      });
    } finally {
      setLoadingNewEmpresa(false);
    }
  };

  const openEditEmpresa = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    editForm.reset({
      name: empresa.nombre,
      address: empresa.direccion,
      expirationDate: empresa.fecha_vencimiento?.slice(0, 10) || "",
      rucStatus: empresa.estado as any,
    });
    setShowEditEmpresa(true);
  };

  const onSubmitEditEmpresa = async (data: EmpresaEditForm) => {
    if (!editingEmpresa) return;
    try {
      setLoadingEditEmpresa(true);
      await axiosInstance.put(`/companies/${editingEmpresa.ruc}`, data);
      toast({
        title: "Empresa actualizada",
        description: "La empresa fue actualizada exitosamente.",
        variant: "success",
      });
      setShowEditEmpresa(false);
      setEditingEmpresa(null);
      fetchEmpresas(1);
      fetchStats();
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al actualizar empresa'
          : 'Error al actualizar empresa',
        variant: "destructive",
      });
    } finally {
      setLoadingEditEmpresa(false);
    }
  };

  const openDeleteEmpresa = (empresa: Empresa) => {
    setDeletingEmpresa(empresa);
    setShowDeleteEmpresa(true);
  };

  const confirmDeleteEmpresa = async () => {
    if (!deletingEmpresa) return;
    try {
      setLoadingDeleteEmpresa(true);
      await axiosInstance.delete(`/companies/${deletingEmpresa.ruc}`);
      toast({
        title: "Empresa eliminada",
        description: "La empresa fue eliminada exitosamente.",
        variant: "success",
      });
      setShowDeleteEmpresa(false);
      setDeletingEmpresa(null);
      fetchEmpresas(1);
      fetchStats();
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al eliminar empresa'
          : 'Error al eliminar empresa',
        variant: "destructive",
      });
    } finally {
      setLoadingDeleteEmpresa(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-2xl shadow-lg border border-purple-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-2">
                Gestión de Empresas
              </h1>
              <p className="text-gray-600 text-lg">Administración de empresas de transporte registradas</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700">{loadingStats ? '...' : stats.totalCompanies}</p>
                <p className="text-sm text-gray-600">Total Empresas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">{loadingStats ? '...' : stats.activeCompanies}</p>
                <p className="text-sm text-gray-600">Activas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700">{loadingStats ? '...' : stats.suspendedCompanies}</p>
                <p className="text-sm text-gray-600">Suspendidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Empresas Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
                </CardTitle>
                <CardDescription>Gestión completa de empresas de transporte</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg" onClick={() => setShowNewEmpresa(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Empresa
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Controles de búsqueda y filtro */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Buscador */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nombre o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 pr-10"
                  disabled={searchLoading}
                />
                {searchLoading && (
                  <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 w-5 h-5 animate-spin" />
                )}
                {searchTerm.length > 0 && searchTerm.length < 2 && (
                  <div className="absolute -bottom-6 left-0 text-xs text-amber-600">
                    Ingresa al menos 2 caracteres para buscar
                  </div>
                )}
              </div>

              {/* Filtro por Estado RUC */}
              <div className="flex gap-2 min-w-[200px]">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    // No limpiar búsqueda automáticamente, permitir filtros combinados
                  }}
                  disabled={filterLoading}
                >
                  <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los estados</SelectItem>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                    <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                  </SelectContent>
                </Select>
                
                {(isFiltering || isSearching || (statusFilter && statusFilter !== "ALL") || searchTerm) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="h-12 px-3 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                    disabled={filterLoading || searchLoading}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Indicadores de estado */}
            {/* Eliminado: Card de indicadores de filtros activos */}

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                  <TableRow>
                    <TableHead className="font-bold text-purple-900">RUC</TableHead>
                    <TableHead className="font-bold text-purple-900">Empresa</TableHead>
                    <TableHead className="font-bold text-purple-900">Resolución</TableHead>
                    <TableHead className="font-bold text-purple-900">Vencimiento</TableHead>
                    <TableHead className="font-bold text-purple-900">Estado</TableHead>
                    <TableHead className="font-bold text-purple-900">Vehículos</TableHead>
                    <TableHead className="font-bold text-purple-900 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                          <span className="ml-2 text-gray-600">Cargando empresas...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex flex-col items-center justify-center text-red-600">
                          <p>Error al cargar los datos</p>
                          <Button 
                            variant="outline" 
                            onClick={() => fetchEmpresas(paginacion.currentPage)}
                            className="mt-2"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : empresas.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="w-8 h-8 mb-2" />
                          <p>
                            {isSearching 
                              ? `No se encontraron empresas que coincidan con "${searchTerm}"`
                              : "No hay empresas registradas en el sistema"
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
                    empresas.map((empresa) => (
                      <TableRow key={empresa.ruc} className="hover:bg-purple-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-purple-800">{empresa.ruc}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">{empresa.nombre}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {empresa.direccion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{empresa.nro_resolucion}</p>
                            <p className="text-sm text-gray-500">{empresa.entidad_emisora}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{empresa.fecha_vencimiento}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getEstadoBadge(empresa.estado)} font-semibold rounded-full border`}>
                            {empresa.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="font-bold text-lg text-purple-700">{empresa.vehiculos_asociados}</span>
                            <p className="text-xs text-gray-500">vehículos</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Dialog onOpenChange={open => { if (open) fetchEmpresaDetalle(empresa.ruc); }}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader className="pb-6">
                                  <DialogTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-purple-600" />
                                    Detalles de la Empresa
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Información completa y detallada de la empresa
                                  </DialogDescription>
                                </DialogHeader>
                                {loadingDetalle ? (
                                  <div className="flex items-center justify-center py-8">
                                    <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                                    <span className="ml-2 text-gray-600">Cargando detalles...</span>
                                  </div>
                                ) : errorDetalle ? (
                                  <div className="flex flex-col items-center justify-center py-8">
                                    <XCircle className="w-12 h-12 text-red-500 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
                                    <p className="text-gray-600 mb-4 text-center">{errorDetalle}</p>
                                  </div>
                                ) : empresaDetalle ? (
                                  <div className="space-y-8">
                                    {/* Header con datos principales */}
                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl">
                                      <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-2xl shadow-lg">
                                        <Building2 className="w-12 h-12 text-purple-700" />
                                      </div>
                                      <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{empresaDetalle.name || 'No registrado'}</h2>
                                        <div className="flex items-center gap-4 text-gray-600 flex-wrap">
                                          <div className="flex items-center gap-1">
                                            <span className="font-mono font-semibold text-purple-700">{empresaDetalle.ruc || 'No registrado'}</span>
                                          </div>
                                          {empresaDetalle.phone && (
                                            <div className="flex items-center gap-1">
                                              <span className="font-mono">{empresaDetalle.phone || 'No registrado'}</span>
                                            </div>
                                          )}
                                          {empresaDetalle.email && (
                                            <div className="flex items-center gap-1">
                                              <span className="font-mono">{empresaDetalle.email || 'No registrado'}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {/* Información detallada */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Información Registral */}
                                      <Card className="shadow-sm border border-gray-200">
                                        <CardHeader className="pb-4">
                                          <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                            Información Registral
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">RUC</label>
                                            <p className="mt-1 text-lg font-mono font-semibold text-purple-700">{empresaDetalle.ruc || 'No registrado'}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Razón Social</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{empresaDetalle.name || 'No registrado'}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Dirección</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{empresaDetalle.address || 'No registrada'}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Representante Legal</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{empresaDetalle.legalRepresentative || 'No registrado'}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1">Estado RUC</label>
                                            <Badge variant="secondary" className={`font-semibold rounded-full border px-3 py-1 text-base ${getEstadoBadge(empresaDetalle.rucStatus)}`}>
                                              {empresaDetalle.rucStatus || 'No registrado'}
                                            </Badge>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      {/* Información de Contacto */}
                                      <Card className="shadow-sm border border-gray-200">
                                        <CardHeader className="pb-4">
                                          <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-purple-600" />
                                            Contacto
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{empresaDetalle.phone || 'No registrado'}</p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{empresaDetalle.email || 'No registrado'}</p>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                    {/* Vehículos asociados */}
                                    <Card className="shadow-sm border border-gray-200">
                                      <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                                          <Car className="w-5 h-5 text-purple-600" />
                                          Vehículos Asociados
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        {empresaDetalle.vehicles && empresaDetalle.vehicles.length > 0 ? (
                                          <div className="overflow-x-auto">
                                            <Table>
                                              <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                                                <TableRow>
                                                  <TableHead className="font-bold text-purple-900">Placa</TableHead>
                                                  <TableHead className="font-bold text-purple-900">Estado</TableHead>
                                                  <TableHead className="font-bold text-purple-900">Marca</TableHead>
                                                  <TableHead className="font-bold text-purple-900">Modelo</TableHead>
                                                  <TableHead className="font-bold text-purple-900">Año</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {empresaDetalle.vehicles.map((veh: any) => (
                                                  <TableRow key={veh.plateNumber}>
                                                    <TableCell>{veh.plateNumber}</TableCell>
                                                    <TableCell>{veh.vehicleStatus}</TableCell>
                                                    <TableCell>{veh.brand}</TableCell>
                                                    <TableCell>{veh.model}</TableCell>
                                                    <TableCell>{veh.manufacturingYear}</TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        ) : (
                                          <p className="text-gray-500 italic">No hay vehículos asociados.</p>
                                        )}
                                      </CardContent>
                                    </Card>
                                    {/* Información de Registro */}
                                    <Card className="shadow-sm border border-gray-200 md:col-span-2">
                                      <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                                          <Calendar className="w-5 h-5 text-purple-600" />
                                          Información de Registro
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                              <Clock className="w-4 h-4" />
                                              Fecha de Registro
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                              {empresaDetalle.registrationDate ? new Date(empresaDetalle.registrationDate).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                              }) : 'No registrada'}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                              <Clock className="w-4 h-4" />
                                              Fecha de Vencimiento
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                              {empresaDetalle.expirationDate ? new Date(empresaDetalle.expirationDate).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                              }) : 'No registrada'}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                ) : null}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg" onClick={() => openEditEmpresa(empresa)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg" onClick={() => openDeleteEmpresa(empresa)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {searchTerm && statusFilter && statusFilter !== "ALL" ? (
                  `Mostrando ${paginacion.totalCompanies} empresas con "${searchTerm}" y estado "${statusFilter}" (página ${paginacion.currentPage} de ${paginacion.totalPages})`
                ) : searchTerm ? (
                  `Encontradas ${paginacion.totalCompanies} empresas para "${searchTerm}" (página ${paginacion.currentPage} de ${paginacion.totalPages})`
                ) : statusFilter && statusFilter !== "ALL" ? (
                  `Mostrando ${paginacion.totalCompanies} empresas con estado "${statusFilter}" (página ${paginacion.currentPage} de ${paginacion.totalPages})`
                ) : (
                  `Mostrando página ${paginacion.currentPage} de ${paginacion.totalPages} (${paginacion.totalCompanies} empresas en total)`
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (paginacion.hasPrevPage) {
                      applyCombinedFilters(paginacion.currentPage - 1);
                    }
                  }}
                  disabled={!paginacion.hasPrevPage || loading || filterLoading || searchLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (paginacion.hasNextPage) {
                      applyCombinedFilters(paginacion.currentPage + 1);
                    }
                  }}
                  disabled={!paginacion.hasNextPage || loading || filterLoading || searchLoading}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal para nueva empresa */}
        <Dialog open={showNewEmpresa} onOpenChange={setShowNewEmpresa}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Empresa</DialogTitle>
              <DialogDescription>Completa los datos para registrar una empresa.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmitEmpresa)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">RUC</label>
                <Input {...form.register("ruc")}/>
                {form.formState.errors.ruc && <p className="text-red-600 text-xs mt-1">{form.formState.errors.ruc.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Razón Social</label>
                <Input {...form.register("name")}/>
                {form.formState.errors.name && <p className="text-red-600 text-xs mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <Input {...form.register("address")}/>
                {form.formState.errors.address && <p className="text-red-600 text-xs mt-1">{form.formState.errors.address.message}</p>}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Fecha Registro</label>
                  <Input type="date" {...form.register("registrationDate")}/>
                  {form.formState.errors.registrationDate && <p className="text-red-600 text-xs mt-1">{form.formState.errors.registrationDate.message}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Fecha Vencimiento</label>
                  <Input type="date" {...form.register("expirationDate")}/>
                  {form.formState.errors.expirationDate && <p className="text-red-600 text-xs mt-1">{form.formState.errors.expirationDate.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado RUC</label>
                <Select value={form.watch("rucStatus")} onValueChange={v => form.setValue("rucStatus", v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                    <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.rucStatus && <p className="text-red-600 text-xs mt-1">{form.formState.errors.rucStatus.message}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowNewEmpresa(false)} disabled={loadingNewEmpresa}>Cancelar</Button>
                <Button type="submit" className="bg-purple-600 text-white" disabled={loadingNewEmpresa}>
                  {loadingNewEmpresa ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Registrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal para editar empresa */}
        <Dialog open={showEditEmpresa} onOpenChange={setShowEditEmpresa}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Empresa</DialogTitle>
              <DialogDescription>Modifica los datos de la empresa.</DialogDescription>
            </DialogHeader>
            <form onSubmit={editForm.handleSubmit(onSubmitEditEmpresa)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de Empresa o Razón Social</label>
                <Input {...editForm.register("name")}/>
                {editForm.formState.errors.name && <p className="text-red-600 text-xs mt-1">{editForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <Input {...editForm.register("address")}/>
                {editForm.formState.errors.address && <p className="text-red-600 text-xs mt-1">{editForm.formState.errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Vencimiento</label>
                <Input type="date" {...editForm.register("expirationDate")}/>
                {editForm.formState.errors.expirationDate && <p className="text-red-600 text-xs mt-1">{editForm.formState.errors.expirationDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado RUC</label>
                <Select value={editForm.watch("rucStatus")} onValueChange={v => editForm.setValue("rucStatus", v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                    <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                  </SelectContent>
                </Select>
                {editForm.formState.errors.rucStatus && <p className="text-red-600 text-xs mt-1">{editForm.formState.errors.rucStatus.message}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowEditEmpresa(false)} disabled={loadingEditEmpresa}>Cancelar</Button>
                <Button type="submit" className="bg-purple-600 text-white" disabled={loadingEditEmpresa}>
                  {loadingEditEmpresa ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Actualizar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación para eliminar empresa */}
        <AlertDialog open={showDeleteEmpresa} onOpenChange={setShowDeleteEmpresa}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la empresa{" "}
                <span className="font-semibold">{deletingEmpresa?.nombre}</span> con RUC{" "}
                <span className="font-semibold">{deletingEmpresa?.ruc}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loadingDeleteEmpresa}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteEmpresa}
                disabled={loadingDeleteEmpresa}
                className="bg-red-600 hover:bg-red-700"
              >
                {loadingDeleteEmpresa ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default EmpresasPage;
