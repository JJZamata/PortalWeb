import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye, Filter, Download, Users, RefreshCw, XCircle, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, User, Clock, Monitor, Shield, Activity, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Fiscalizador {
  idUsuario: number;
  usuario: string;
  email: string;
  isActive: boolean;
  deviceConfigured: boolean;
  lastLogin: string | null;
  estado: string;
  dispositivo: string;
  ultimoAcceso: string;
  dni: string;
  nombreCompleto: string;
  telefono: string | null;
  direccion: string | null;
}

interface FiscalizadorDetallado {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: Array<{
    id: number;
    name: string;
  }>;
  lastLogin: string;
  lastLoginIp: string;
  lastLoginDevice: string;
  deviceConfigured: boolean;
  deviceInfo: {
    configurado: boolean;
    detalles: {
      deviceId: string;
      deviceName: string;
      platform: string;
      version: string;
      appVersion: string;
    };
  };
  createdAt: string;
  updatedAt: string;
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
  activos: number;
  inactivos: number;
  configurados: number;
  pendientes: number;
}

const FiscalizadoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fiscalizadores, setFiscalizadores] = useState<Fiscalizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  
  // Estados para vista detallada
  const [fiscalizadorDetallado, setFiscalizadorDetallado] = useState<FiscalizadorDetallado | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const [showDetalleDialog, setShowDetalleDialog] = useState(false);
  
  const { toast } = useToast();

  // Filtrar fiscalizadores basado en el término de búsqueda
  const filteredFiscalizadores = fiscalizadores.filter(fiscalizador => {
    const searchLower = searchTerm.toLowerCase();
    return (
      fiscalizador.usuario.toLowerCase().includes(searchLower) ||
      fiscalizador.email.toLowerCase().includes(searchLower) ||
      fiscalizador.idUsuario.toString().includes(searchTerm) ||
      (fiscalizador.nombreCompleto && fiscalizador.nombreCompleto.toLowerCase().includes(searchLower)) ||
      (fiscalizador.dni && fiscalizador.dni.includes(searchTerm))
    );
  });

  // Formulario para agregar fiscalizador
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  // Función para obtener detalles del fiscalizador
  const fetchFiscalizadorDetalle = async (id: number) => {
    try {
      setLoadingDetalle(true);
      setErrorDetalle(null);
      const response = await axiosInstance.get(`/users/${id}`);
      
      if (response.data.success) {
        setFiscalizadorDetallado(response.data.data);
        setShowDetalleDialog(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles del fiscalizador:', error);
      setErrorDetalle(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al obtener los detalles del fiscalizador'
        : 'Error al obtener los detalles del fiscalizador');
      
      toast({
        title: "Error al cargar detalles",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al obtener los detalles del fiscalizador'
          : 'Error al obtener los detalles del fiscalizador',
        variant: "destructive",
      });
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Validación de contraseña según requisitos del backend
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!minLength) return "La contraseña debe tener al menos 8 caracteres";
    if (!hasUpperCase) return "La contraseña debe contener al menos una mayúscula";
    if (!hasLowerCase) return "La contraseña debe contener al menos una minúscula";
    if (!hasNumber) return "La contraseña debe contener al menos un número";
    if (!hasSpecialChar) return "La contraseña debe contener al menos un carácter especial";
    return true;
  };

  // Validación de username según requisitos del backend
  const validateUsername = (username: string) => {
    if (username.length < 3 || username.length > 20) {
      return "El nombre de usuario debe tener entre 3 y 20 caracteres";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "El nombre de usuario solo puede contener letras, números y guiones bajos";
    }
    return true;
  };

  const fetchFiscalizadores = async (page: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/fisca/admin/fiscalizadores?page=${page}`
      );

      if (response.data.success) {
        setFiscalizadores(response.data.data.fiscalizadores);
        setPagination(response.data.data.pagination);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Error al cargar fiscalizadores:', error);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || 'Error al cargar los fiscalizadores'
        : 'Error al cargar los fiscalizadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiscalizadores(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleAddFiscalizador = async (values: any) => {
    // Validar que las contraseñas coincidan
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        roles: ["fiscalizador"]
      };
      
      const response = await axiosInstance.post('/auth/signup', payload);
      
      if (response.data.success) {
        setShowAddDialog(false);
        form.reset();
        toast({
          title: "Fiscalizador agregado",
          description: response.data.message || "El fiscalizador fue registrado correctamente.",
          variant: "default",
        });
        fetchFiscalizadores(currentPage);
      } else {
        throw new Error(response.data.message || 'Error al registrar fiscalizador');
      }
    } catch (error) {
      toast({
        title: "Error al agregar fiscalizador",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error desconocido'
          : 'Error desconocido',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchFiscalizadores(1)} variant="outline">
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
        <div className="bg-gradient-to-br from-white to-red-50/30 dark:from-[#1a1a1a] dark:to-[#3b1c1c]/40 p-8 rounded-2xl shadow-lg border border-red-200/40 dark:border-[#812020]/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#812020] to-[#a94442] bg-clip-text text-transparent mb-2 dark:from-[#fca5a5] dark:to-[#a94442]">
                Gestión de Fiscalizadores
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Administra y supervisa el equipo de fiscalizadores del sistema</p>
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
                    {loading ? '-' : summary?.activos || 0}
                  </p>
                  <p className="text-sm text-gray-600">Activos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-700">
                    {loading ? '-' : summary?.inactivos || 0}
                  </p>
                  <p className="text-sm text-gray-600">Inactivos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Fiscalizadores */}
        <Card className="shadow-lg border-0 bg-background rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  Fiscalizadores Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#812020]" />}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Listado completo de fiscalizadores en el sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Fiscalizador
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-2xl font-bold text-gray-800">Agregar Fiscalizador</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Completa la información del nuevo fiscalizador
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddFiscalizador)} className="space-y-4 pt-2">
                        <FormField name="username" control={form.control} rules={{ 
                          required: "El nombre de usuario es obligatorio",
                          validate: validateUsername
                        }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de usuario</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: fiscal30_test" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="email" control={form.control} rules={{ required: "El email es obligatorio" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ingrese el email" type="email" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="password" control={form.control} rules={{ 
                          required: "La contraseña es obligatoria",
                          validate: validatePassword
                        }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: Fiscal123@" type="password" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField name="confirmPassword" control={form.control} rules={{ required: "La confirmación de la contraseña es obligatoria" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Contraseña</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Repita la contraseña" type="password" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className="pt-2">
                          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full" disabled={submitting}>
                            {submitting ? 'Agregando...' : 'Agregar Fiscalizador'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
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
                placeholder="Buscar por nombre de usuario, email o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-border rounded-xl focus:border-[#812020] focus:ring-[#812020] bg-background text-foreground dark:placeholder:text-gray-400"
              />
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#812020]" />
                  <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando fiscalizadores...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-[#812020]/10 to-[#a94442]/10 dark:from-[#2d0909] dark:to-[#3a1010]">
                      <TableRow>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">ID Usuario</TableHead>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Usuario</TableHead>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Email</TableHead>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Estado</TableHead>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Último Acceso</TableHead>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Dispositivo</TableHead>
                        <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5] text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiscalizadores.length === 0 && !loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                              <Search className="w-8 h-8 mb-2" />
                              <p>No se encontraron fiscalizadores que coincidan con "{searchTerm}"</p>
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
                        filteredFiscalizadores.map((fiscalizador) => (
                          <TableRow key={fiscalizador.idUsuario} className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 transition-colors">
                            <TableCell className="font-mono font-semibold text-[#812020] text-foreground dark:text-muted-foreground">{fiscalizador.idUsuario}</TableCell>
                            <TableCell className="font-semibold text-foreground dark:text-muted-foreground">{fiscalizador.usuario}</TableCell>
                            <TableCell className="text-foreground dark:text-muted-foreground">{fiscalizador.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className={`px-3 py-1 rounded-full font-semibold border ${fiscalizador.isActive 
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800' 
                                  : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
                                }`}
                              >
                                {fiscalizador.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-foreground dark:text-muted-foreground text-sm">
                              {fiscalizador.ultimoAcceso}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={fiscalizador.deviceConfigured ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
                                {fiscalizador.dispositivo}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 rounded-lg"
                                  onClick={() => fetchFiscalizadorDetalle(fiscalizador.idUsuario)}
                                  disabled={loadingDetalle}
                                >
                                  {loadingDetalle ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 rounded-lg">
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
                    `Mostrando ${filteredFiscalizadores.length} de ${pagination.totalItems} fiscalizadores (búsqueda: "${searchTerm}")`
                  ) : (
                    `Mostrando página ${pagination.currentPage} de ${pagination.totalPages} (${pagination.totalItems} fiscalizadores en total)`
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

        {/* Diálogo de Detalles del Fiscalizador */}
        <Dialog open={showDetalleDialog} onOpenChange={setShowDetalleDialog}>
          <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Detalles del Fiscalizador
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Información completa y detallada del fiscalizador
              </DialogDescription>
            </DialogHeader>
            
            {errorDetalle ? (
              <div className="flex flex-col items-center justify-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
                <p className="text-gray-600 mb-4 text-center">{errorDetalle}</p>
                <Button 
                  onClick={() => fiscalizadorDetallado && fetchFiscalizadorDetalle(fiscalizadorDetallado.id)} 
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            ) : fiscalizadorDetallado ? (
              <div className="space-y-8">
                {/* Header con información principal */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-red-50 to-red-100/30 rounded-xl">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-red-600">
                    <AvatarFallback className="text-2xl font-bold text-white">
                      {fiscalizadorDetallado.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{fiscalizadorDetallado.username}</h2>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-mono font-semibold text-red-700">ID: {fiscalizadorDetallado.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        <Badge 
                          variant="secondary"
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                            fiscalizadorDetallado.isActive 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {fiscalizadorDetallado.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información de Usuario */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-red-600" />
                        Información de Usuario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">ID de Usuario</Label>
                        <p className="mt-1 text-lg font-mono font-semibold text-red-700">{fiscalizadorDetallado.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nombre de Usuario</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{fiscalizadorDetallado.username}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{fiscalizadorDetallado.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Roles</Label>
                        <div className="mt-1 flex gap-2">
                          {fiscalizadorDetallado.roles.map((role) => (
                            <Badge key={role.id} variant="outline" className="text-red-700 border-red-200">
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Sesión */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Información de Sesión
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Último Acceso</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {fiscalizadorDetallado.lastLogin ? (
                            new Date(fiscalizadorDetallado.lastLogin).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          ) : (
                            <span className="text-gray-500 italic">Nunca ha accedido</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">IP del Último Acceso</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {fiscalizadorDetallado.lastLoginIp || (
                            <span className="text-gray-500 italic">No disponible</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Dispositivo del Último Acceso</Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {fiscalizadorDetallado.lastLoginDevice || (
                            <span className="text-gray-500 italic">No disponible</span>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información del Dispositivo */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-red-600" />
                        Configuración del Dispositivo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Estado de Configuración</Label>
                        <div className="mt-1">
                          <Badge 
                            variant="secondary"
                            className={`px-3 py-1 rounded-full font-semibold border ${
                              fiscalizadorDetallado.deviceConfigured 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {fiscalizadorDetallado.deviceConfigured ? 'Configurado' : 'Pendiente de Configuración'}
                          </Badge>
                        </div>
                      </div>
                      {fiscalizadorDetallado.deviceInfo?.detalles && (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">ID del Dispositivo</Label>
                            <p className="mt-1 text-sm font-mono text-gray-900">{fiscalizadorDetallado.deviceInfo.detalles.deviceId}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Nombre del Dispositivo</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{fiscalizadorDetallado.deviceInfo.detalles.deviceName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Plataforma</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{fiscalizadorDetallado.deviceInfo.detalles.platform}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Versión del Sistema</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{fiscalizadorDetallado.deviceInfo.detalles.version}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Versión de la App</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{fiscalizadorDetallado.deviceInfo.detalles.appVersion}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Información de Registro */}
                  <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-600" />
                        Información de Registro
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Fecha de Creación
                        </Label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {new Date(fiscalizadorDetallado.createdAt).toLocaleDateString('es-ES', {
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
                          {new Date(fiscalizadorDetallado.updatedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Cargando detalles del fiscalizador...</span>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default FiscalizadoresPage;
