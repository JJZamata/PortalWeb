import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, Edit, Eye, Shield, RefreshCw, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    has_next: false,
    has_previous: false
  });
  const { toast } = useToast();

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
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Usuarios Registrados
              {isLoading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
            </CardTitle>
            <CardDescription>Listado completo de usuarios en el sistema</CardDescription>
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
