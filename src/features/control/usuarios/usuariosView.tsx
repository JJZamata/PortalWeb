import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { useUsuarios } from './hooks/useUsuarios';
import { useUsuarioDetail } from './hooks/useUsuarioDetail';
import { UsuariosTable } from './components/UsuariosTable';
import { AddUsuarioDialog } from './components/AddUsuarioDialog';
import { UsuarioDetailDialog } from './components/UsuarioDetailDialog';
import { EditUsuarioDialog } from './components/EditUsuarioDialog';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';
import { ResetDeviceDialog } from './components/ResetDeviceDialog';
import { DeleteUsuarioDialog } from './components/DeleteUsuarioDialog';
import { PaginationControls } from './components/PaginationControls';
import { UsuariosFilters } from './components/UsuariosFilters';
import { usuariosService } from './services/usuariosService';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, XCircle, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Usuario, AddUserFormData, UsuariosQueryParams, CreateUserResponse, CreateUserError, DeleteUserError, UpdateUserError, EditUserFormData, UpdatePasswordError, ResetDeviceError } from './types';

const UsuariosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showResetDeviceDialog, setShowResetDeviceDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [resettingDevice, setResettingDevice] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [activeFilters, setActiveFilters] = useState<Partial<UsuariosQueryParams>>({});

  const { usuarios, pagination, loading, error, page, handlePageChange, updateFilters, refetch } = useUsuarios(searchTerm, activeFilters);
  const { usuarioDetail, loadingDetail, errorDetail, fetchUsuarioDetail } = useUsuarioDetail();
  const { toast } = useToast();

  const { data: fiscalizadoresConTelefono = 0, isLoading: loadingFiscalizadoresConTelefono, refetch: refetchFiscalizadoresConTelefono } = useQuery({
    queryKey: ['usuarios-count-con-telefono', 'fiscalizador'],
    queryFn: async () => {
      const response = await usuariosService.getUsuarios({
        page: 1,
        limit: 1,
        role: 'fiscalizador',
        deviceConfigured: true,
      });
      return response.data.pagination.totalItems || 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: administradoresConTelefono = 0, isLoading: loadingAdministradoresConTelefono, refetch: refetchAdministradoresConTelefono } = useQuery({
    queryKey: ['usuarios-count-con-telefono', 'admin'],
    queryFn: async () => {
      const response = await usuariosService.getUsuarios({
        page: 1,
        limit: 1,
        role: 'admin',
        deviceConfigured: true,
      });
      return response.data.pagination.totalItems || 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleAddUsuario = async (values: AddUserFormData) => {
    // La validación de contraseñas ya se maneja en el diálogo con Zod
    setSubmitting(true);
    try {
      const response: CreateUserResponse = await usuariosService.addUsuario(values);

      if (response.success) {
        setShowAddDialog(false);

        // Mensaje principal de éxito
        let description = `El usuario ${response.data.username} ha sido creado exitosamente.`;

        // Agregar información sobre configuración de dispositivo si aplica
        if (response.data.requiresDeviceSetup && response.data.instructions) {
          description += ` ${response.data.instructions}`;
        }

        toast({
          title: "✅ Usuario creado exitosamente",
          description,
          variant: "default"
        });

        // Refrescar datos
        refetch();
        refetchFiscalizadoresConTelefono();
        refetchAdministradoresConTelefono();
      }
    } catch (error: any) {
      const errorData = error as CreateUserError;

      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Errores de validación específicos por campo
        const fieldErrors = errorData.errors.map((err) =>
          `• ${err.field}: ${err.message}`
        ).join('\n');

        toast({
          title: "❌ Error de validación",
          description: fieldErrors,
          variant: "destructive"
        });
      } else {
        // Error general
        toast({
          title: "❌ Error al crear usuario",
          description: errorData.message || 'Error desconocido al crear el usuario',
          variant: "destructive"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowEditDialog(true);
  };

  const handleUpdateUsuario = async (id: number, values: EditUserFormData) => {
    setUpdating(true);
    try {
      const response = await usuariosService.updateUsuario(id, values);

      if (response.success) {
        setShowEditDialog(false);
        setSelectedUsuario(null);

        toast({
          title: "✅ Usuario actualizado exitosamente",
          description: `El usuario ${response.data.username} ha sido actualizado correctamente.`,
          variant: "default"
        });

        // Refrescar datos
        refetch();
        refetchFiscalizadoresConTelefono();
        refetchAdministradoresConTelefono();
      }
    } catch (error: any) {
      const errorData = error as UpdateUserError;

      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Errores de validación específicos por campo
        const fieldErrors = errorData.errors.map((err) =>
          `• ${err.message}`
        ).join('\n');

        toast({
          title: "❌ Error de validación",
          description: fieldErrors,
          variant: "destructive"
        });
      } else {
        // Error general
        toast({
          title: "❌ Error al actualizar usuario",
          description: errorData.message || 'Error desconocido al actualizar el usuario',
          variant: "destructive"
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowChangePasswordDialog(true);
  };

  const handleChangePasswordConfirm = async (id: number, newPassword: string) => {
    setChangingPassword(true);
    try {
      const response = await usuariosService.updatePassword(id, newPassword);

      setShowChangePasswordDialog(false);
      setSelectedUsuario(null);

      toast({
        title: "✅ Contraseña actualizada exitosamente",
        description: response.data.message,
        variant: "default"
      });

      // Refrescar datos
      refetch();
    } catch (error: any) {
      const errorData = error as UpdatePasswordError;

      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Errores de validación específicos con retroalimentación completa
        const fieldErrors = errorData.errors.map((err) => {
          // Formatear el mensaje para mejor legibilidad
          const location = err.location ? `[${err.location}]` : '';
          return `• ${err.message}${location}`;
        }).join('\n');

        // Crear un mensaje descriptivo para el título
        const errorCount = errorData.errors.length;
        const title = errorCount === 1 ? "Error de validación" : `Se encontraron ${errorCount} errores de validación`;

        toast({
          title: `❌ ${title}`,
          description: fieldErrors,
          variant: "destructive"
        });
      } else {
        // Error general
        toast({
          title: "❌ Error al actualizar contraseña",
          description: errorData.message || 'Error desconocido al actualizar la contraseña',
          variant: "destructive"
        });
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResetDevice = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowResetDeviceDialog(true);
  };

  const handleResetDeviceConfirm = async (id: number) => {
    setResettingDevice(true);
    try {
      const response = await usuariosService.resetDevice(id);

      setShowResetDeviceDialog(false);
      setSelectedUsuario(null);

      toast({
        title: "✅ Dispositivo reseteado exitosamente",
        description: response.message,
        variant: "default"
      });

      // Refrescar datos
      refetch();
      refetchFiscalizadoresConTelefono();
      refetchAdministradoresConTelefono();
    } catch (error: any) {
      const errorData = error as ResetDeviceError;

      toast({
        title: "❌ Error al resetear dispositivo",
        description: errorData.message || 'Error desconocido al resetear el dispositivo',
        variant: "destructive"
      });
    } finally {
      setResettingDevice(false);
    }
  };

  const handleDeleteUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUsuario) return;

    setDeleting(true);
    try {
      await usuariosService.deleteUsuario(selectedUsuario.id);

      setShowDeleteDialog(false);
      setSelectedUsuario(null);

      toast({
        title: "✅ Usuario eliminado exitosamente",
        description: `El usuario ${selectedUsuario.usuario} ha sido eliminado permanentemente.`,
        variant: "default"
      });

      // Refrescar datos
      refetch();
      refetchFiscalizadoresConTelefono();
      refetchAdministradoresConTelefono();
    } catch (error: any) {
      const errorData = error as DeleteUserError;

      toast({
        title: "❌ Error al eliminar usuario",
        description: errorData.message || 'Error desconocido al eliminar el usuario',
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFiltersChange = (filters: Partial<UsuariosQueryParams>) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
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
        {/* Header */}
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
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{loading ? '-' : pagination?.totalItems || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Usuarios</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{loadingFiscalizadoresConTelefono ? '-' : fiscalizadoresConTelefono}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fiscalizadores con Teléfono</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{loadingAdministradoresConTelefono ? '-' : administradoresConTelefono}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Administradores con Teléfono</p>
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
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Input de búsqueda */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Buscar por usuario, email o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 pr-10 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Componente de filtros */}
            <UsuariosFilters
              filters={activeFilters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              loading={loading}
            />

            <div className="flex flex-col lg:flex-row gap-4 mb-6"></div>

            <UsuariosTable
              usuarios={usuarios}
              loading={loading}
              onView={fetchUsuarioDetail}
              onEdit={handleEditUsuario}
              onChangePassword={handleChangePassword}
              onResetDevice={handleResetDevice}
              onDelete={handleDeleteUsuario}
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

        <EditUsuarioDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          usuario={selectedUsuario}
          loading={updating}
          onUpdate={handleUpdateUsuario}
        />

        <ChangePasswordDialog
          open={showChangePasswordDialog}
          onOpenChange={setShowChangePasswordDialog}
          usuario={selectedUsuario}
          loading={changingPassword}
          onUpdate={handleChangePasswordConfirm}
        />

        <ResetDeviceDialog
          open={showResetDeviceDialog}
          onOpenChange={setShowResetDeviceDialog}
          usuario={selectedUsuario}
          loading={resettingDevice}
          onReset={handleResetDeviceConfirm}
        />

        <DeleteUsuarioDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          usuario={selectedUsuario}
          loading={deleting}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default UsuariosView;
