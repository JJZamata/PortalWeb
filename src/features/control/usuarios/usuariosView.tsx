import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useUsuarios } from './hooks/useUsuarios';
import { useUsuarioDetail } from './hooks/useUsuarioDetail';
import { UsuariosTable } from './components/UsuariosTable';
import { AddUsuarioDialog } from './components/AddUsuarioDialog';
import { UsuarioDetailDialog } from './components/UsuarioDetailDialog';
import { PaginationControls } from './components/PaginationControls';
import { usuariosService } from './services/usuariosService';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, XCircle, Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Usuario, AddUserFormData } from './types';

const UsuariosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { usuarios, pagination, estadisticas, loading, error, page, handlePageChange, refetch } = useUsuarios(searchTerm);
  const { usuarioDetail, loadingDetail, errorDetail, fetchUsuarioDetail } = useUsuarioDetail();
  const { toast } = useToast();

  const handleAddUsuario = async (values: AddUserFormData) => {
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
        roles: values.roles,
      };

      const response = await usuariosService.addUsuario(payload);

      if (response?.success) {
        setShowAddDialog(false);
        toast({
          title: "Usuario creado exitosamente",
          description: `El usuario ${values.username} ha sido registrado correctamente.`,
          variant: "default"
        });
        refetch();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUsuario = (usuario: Usuario) => {
    // TODO: Implementar edición
    console.log('Editar usuario:', usuario);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => refetch()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
        {/* Header y estadísticas */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 p-8 rounded-2xl shadow-lg border border-purple-200/40 dark:border-purple-800/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent mb-2">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Administra y supervisa los usuarios del sistema</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{loading ? '-' : estadisticas?.usuarios_activos || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Activos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{loading ? '-' : estadisticas?.total_admins || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Admins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-700 dark:text-pink-400">{loading ? '-' : estadisticas?.total_fiscalizadores || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fiscalizadores</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{loading ? '-' : estadisticas?.total_usuarios || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Usuarios</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Usuarios Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Listado completo de usuarios en el sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Buscar por usuario, email o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 pr-10 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <UsuariosTable
              usuarios={usuarios}
              loading={loading}
              onView={fetchUsuarioDetail}
              onEdit={handleEditUsuario}
              searchTerm={searchTerm}
            />

            {pagination && (
              <PaginationControls 
                pagination={pagination} 
                onPageChange={handlePageChange}
                searchTerm={searchTerm}
              />
            )}
          </CardContent>
        </Card>

        <AddUsuarioDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddUsuario}
          submitting={submitting}
        />

        <UsuarioDetailDialog
          open={!!usuarioDetail}
          onOpenChange={() => fetchUsuarioDetail(null)}
          usuario={usuarioDetail}
          loading={loadingDetail}
          error={errorDetail}
        />
      </div>
    </AdminLayout>
  );
};

export default UsuariosView;
