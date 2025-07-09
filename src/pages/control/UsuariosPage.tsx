import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Users, Search, Edit, Eye, Shield, RefreshCw, XCircle, ChevronLeft, ChevronRight, Plus, Filter, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/AdminLayout";

interface AddUserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    has_next: false,
    has_previous: false
  });
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  // Cambiar el estado de roles a string (solo uno a la vez)
  const [rolSeleccionado, setRolSeleccionado] = useState('fiscalizador');

  const form = useForm<AddUserFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      roles: []
    }
  });

  const fetchUsuarios = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/users/?page=${page}`);
      setUsuarios(response.data.data.usuarios || []);
      setEstadisticas(response.data.data.estadisticas || {});
      setPagination(response.data.data.pagination || {
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        has_next: false,
        has_previous: false
      });
      setError(null);
    } catch (err: any) {
      setError('Error al cargar los usuarios');
      if (axios.isAxiosError(err)) {
        console.error('Error al cargar usuarios:', err.response?.data);
      } else {
        console.error('Error al cargar usuarios:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(1);
  }, []);

  const handleNextPage = () => {
    if (pagination.has_next) {
      fetchUsuarios(pagination.current_page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.has_previous) {
      fetchUsuarios(pagination.current_page - 1);
    }
  };

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "El nombre de usuario solo puede contener letras, números y guiones bajos";
    }
    return true;
  };

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    // Acepta más caracteres especiales: #@!$%*?&-_.,:;+='/\\|<>~^[]{}()
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|~`])/.test(value)) {
      return "La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial";
    }
    return true;
  };

  const handleAddUser = async (data: AddUserFormData) => {
    try {
      setSubmitting(true);

      // Validar que las contraseñas coincidan
      if (data.password !== data.confirmPassword) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: 'Las contraseñas no coinciden'
        });
        return;
      }

      // Validar que se haya seleccionado un rol
      if (!data.roles || data.roles.length === 0) {
        form.setError('roles', {
          type: 'manual',
          message: 'Debe seleccionar un rol'
        });
        return;
      }

      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        roles: [rolSeleccionado],
      };

      const response = await axiosInstance.post('/auth/signup', payload);

      if (response.data.success) {
        toast({
          title: "Usuario creado exitosamente",
          description: `El usuario ${data.username} ha sido registrado correctamente.`,
          variant: "default"
        });

        // Resetear el formulario y cerrar el diálogo
        form.reset({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          roles: []
        });
        setShowAddDialog(false);
        
        // Recargar la lista de usuarios
        fetchUsuarios(pagination.current_page);
      }
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      
      let errorMessage = 'Error al crear el usuario';
      
      if (axios.isAxiosError(err) && err.response?.data) {
        errorMessage = err.response.data.message || errorMessage;
        
        // Si hay un campo específico con error, mostrarlo en el formulario
        if (err.response.data.field) {
          form.setError(err.response.data.field as keyof AddUserFormData, {
            type: 'manual',
            message: err.response.data.message
          });
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'web_admin':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'fiscalizador':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'web_operator':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'web_admin':
        return 'Admin Web';
      case 'fiscalizador':
        return 'Fiscalizador';
      case 'web_operator':
        return 'Operador Web';
      default:
        return 'Sin Rol';
    }
  };

  const getStatusBadge = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-red-50 text-red-700 border-red-200';
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.id?.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header y estadísticas */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-2xl shadow-lg border border-purple-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-2">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 text-lg">Administra y supervisa los usuarios del sistema</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700">{isLoading ? '-' : estadisticas.total_usuarios || 0}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">{isLoading ? '-' : estadisticas.usuarios_activos || 0}</p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700">{isLoading ? '-' : estadisticas.total_admins || 0}</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-700">{isLoading ? '-' : estadisticas.total_fiscalizadores || 0}</p>
                <p className="text-sm text-gray-600">Fiscalizadores</p>
              </div>
              <Button 
                onClick={() => fetchUsuarios()} 
                variant="outline" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Usuarios Registrados
                  {isLoading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
                </CardTitle>
                <CardDescription>Listado completo de usuarios en el sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-2xl font-bold text-gray-800">Agregar Usuario</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Completa la información del nuevo usuario
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4 pt-2">
                        <FormField 
                          name="username" 
                          control={form.control} 
                          rules={{ 
                            required: "El nombre de usuario es obligatorio",
                            validate: validateUsername
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de usuario *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: admin_user" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          name="email" 
                          control={form.control} 
                          rules={{ 
                            required: "El email es obligatorio",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Ingrese un email válido"
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="usuario@ejemplo.com" type="email" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          name="roles" 
                          control={form.control} 
                          rules={{ required: "Debe seleccionar un rol" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rol *</FormLabel>
                              <Select
                                value={rolSeleccionado}
                                onValueChange={(value) => {
                                  setRolSeleccionado(value);
                                  field.onChange([value]);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Selecciona un rol" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="fiscalizador">Fiscalizador</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          name="password" 
                          control={form.control} 
                          rules={{ 
                            required: "La contraseña es obligatoria",
                            validate: validatePassword
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input {...field} placeholder="Ej: Admin123@" type={showPassword ? "text" : "password"} className="bg-white pr-10" />
                                  <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword((v) => !v)}
                                  >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField 
                          name="confirmPassword" 
                          control={form.control} 
                          rules={{ required: "La confirmación de la contraseña es obligatoria" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Contraseña *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Repita la contraseña" type="password" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className="pt-2">
                          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl w-full" disabled={submitting}>
                            {submitting ? 'Agregando...' : 'Agregar Usuario'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Cargando usuarios...</span>
                </div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
                <Table>
                  <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                    <TableRow>
                      <TableHead className="font-bold text-purple-900">ID</TableHead>
                      <TableHead className="font-bold text-purple-900">Usuario</TableHead>
                      <TableHead className="font-bold text-purple-900">Email</TableHead>
                      <TableHead className="font-bold text-purple-900">Rol</TableHead>
                      <TableHead className="font-bold text-purple-900">Estado</TableHead>
                      <TableHead className="font-bold text-purple-900">Último Acceso</TableHead>
                      <TableHead className="font-bold text-purple-900">Dispositivo</TableHead>
                      <TableHead className="font-bold text-purple-900 text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsuarios.map((usuario: any) => (
                      <TableRow key={usuario.id} className="hover:bg-purple-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-purple-800">{usuario.id}</TableCell>
                        <TableCell className="font-semibold text-gray-900">{usuario.usuario}</TableCell>
                        <TableCell className="text-gray-700">{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getRoleBadge(usuario.rol)} font-semibold rounded-full border`}>
                            {getRoleDisplayName(usuario.rol)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getStatusBadge(usuario.estado)} font-semibold rounded-full border`}>
                            {usuario.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{usuario.ultimo_acceso}</TableCell>
                        <TableCell className="text-gray-700">{usuario.dispositivo}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Dialog onOpenChange={(open) => !open && setSelectedUsuario(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg" onClick={() => setSelectedUsuario(usuario)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              {selectedUsuario && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Detalles del Usuario: {selectedUsuario.usuario}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <p><strong>ID:</strong> {selectedUsuario.id}</p>
                                    <p><strong>Email:</strong> {selectedUsuario.email}</p>
                                    <p><strong>Rol:</strong> {getRoleDisplayName(selectedUsuario.rol)}</p>
                                    <p><strong>Estado:</strong> {selectedUsuario.estado}</p>
                                    <p><strong>Último Acceso:</strong> {selectedUsuario.ultimo_acceso}</p>
                                    <p><strong>Dispositivo:</strong> {selectedUsuario.dispositivo}</p>
                                  </div>
                                </DialogContent>
                              )}
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Controles de paginación */}
            {!isLoading && !error && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando página {pagination.current_page} de {pagination.total_pages} ({pagination.total_records} usuarios en total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!pagination.has_previous || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!pagination.has_next || isLoading}
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
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

export default UsuariosPage;