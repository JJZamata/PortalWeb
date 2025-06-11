
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Edit, Eye, Shield, RefreshCw, XCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { useUsuariosData, useRolesData } from "@/hooks/useRealTimeData";

const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const { data: usuariosData = [], isLoading: isLoadingUsuarios, error: errorUsuarios, refetch: refetchUsuarios, isRefetching: isRefetchingUsuarios } = useUsuariosData();
  const { data: rolesData = [], isLoading: isLoadingRoles } = useRolesData();

  const isLoading = isLoadingUsuarios || isLoadingRoles;
  const error = errorUsuarios;
  const refetch = refetchUsuarios;
  const isRefetching = isRefetchingUsuarios;

  // Combinar datos de usuarios con roles
  const usuariosConRoles = usuariosData.map(usuario => {
    const rol = rolesData.find(r => r.role_id === usuario.role_id);
    return {
      ...usuario,
      role: rol?.name || 'fiscalizador',
      roleDescription: rol?.description || 'Sin descripción'
    };
  });

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

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-red-50 text-red-700 border-red-200';
  };

  const filteredUsuarios = usuariosConRoles.filter(usuario => {
    const matchesSearch = 
      usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.id_usuario?.toString().includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || usuario.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los usuarios</p>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 p-6 md:p-8 rounded-2xl shadow-lg border border-purple-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-2">
                Gestión de Usuarios y Roles
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Administración de usuarios del sistema y asignación de roles</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="text-center bg-white/60 p-3 rounded-xl border border-purple-100">
                  <p className="text-xl font-bold text-purple-700">{isLoading ? '-' : filteredUsuarios.length}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xl font-bold text-emerald-700">
                    {isLoading ? '-' : filteredUsuarios.filter(u => u.isActive).length}
                  </p>
                  <p className="text-xs text-gray-600">Activos</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-blue-100">
                  <p className="text-xl font-bold text-blue-700">
                    {isLoading ? '-' : filteredUsuarios.filter(u => u.role === 'admin' || u.role === 'web_admin').length}
                  </p>
                  <p className="text-xs text-gray-600">Admins</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xl font-bold text-emerald-700">
                    {isLoading ? '-' : filteredUsuarios.filter(u => u.role === 'fiscalizador').length}
                  </p>
                  <p className="text-xs text-gray-600">Fiscalizadores</p>
                </div>
              </div>
              
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                disabled={isRefetching}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Gestión de Usuarios */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Usuarios del Sistema
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
                </CardTitle>
                <CardDescription>{filteredUsuarios.length} usuarios registrados</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Completa la información del nuevo usuario
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Nombre de Usuario *</Label>
                        <Input id="username" placeholder="usuario123" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="usuario@ejemplo.com" />
                      </div>
                      <div>
                        <Label htmlFor="role">Rol *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesData.map((rol) => (
                              <SelectItem key={rol.role_id} value={rol.name}>
                                {getRoleDisplayName(rol.name)} - {rol.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña Temporal *</Label>
                        <Input id="password" type="password" placeholder="contraseña123" />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1">Crear Usuario</Button>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por usuario, email o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {rolesData.map((rol) => (
                    <SelectItem key={rol.role_id} value={rol.name}>
                      {getRoleDisplayName(rol.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div></div>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Cargando usuarios...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                      {filteredUsuarios.map((usuario) => (
                        <TableRow key={usuario.id_usuario} className="hover:bg-purple-50/50 transition-colors">
                          <TableCell className="font-mono font-semibold text-purple-700">{usuario.id_usuario}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{usuario.username}</TableCell>
                          <TableCell className="text-gray-700">{usuario.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${getRoleBadge(usuario.role)} font-semibold rounded-full border`}
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              {getRoleDisplayName(usuario.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusBadge(usuario.isActive)} font-semibold rounded-full border`}
                            >
                              {usuario.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {usuario.lastLogin ? new Date(usuario.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{usuario.lastLoginDevice || 'N/A'}</span>
                              {usuario.deviceConfigured && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  Configurado
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UsuariosPage;
