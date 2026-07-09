import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User, Plus, Search, RefreshCw, Pencil, Trash2, XCircle, Phone, Mail } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { usePropietarios } from '@/features/vehiculos/propietarios/hooks/usePropietarios';
import { AddPropietarioDialog } from '@/features/vehiculos/propietarios/components/AddPropietarioDialog';
import { EditPropietarioDialog } from '@/features/vehiculos/propietarios/components/EditPropietarioDialog';
import { propietariosService } from '@/features/vehiculos/propietarios/services/propietariosService';

const PropietariosPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any | null>(null);

  const { data, isLoading, error } = usePropietarios(page, searchTerm);

  const owners = Array.isArray(data?.propietarios) ? data.propietarios : [];
  const pagination = data?.pagination;
  const totalItems = Number(pagination?.totalItems || owners.length || 0);
  const totalPages = Number(pagination?.totalPages || 1);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['propietarios'] });
    queryClient.invalidateQueries({ queryKey: ['propietarios-manager'] });
  };

  const handleOwnersChanged = () => {
    handleRefresh();
  };

  const openEditDialog = (owner: any) => {
    setEditingOwner(owner);
    setShowEditDialog(true);
  };

  const handleDeleteOwner = async (owner: any) => {
    const ownerDni = String(owner?.dni ?? owner?.ownerDni ?? '').trim();
    const ownerName = String(owner?.fullName ?? owner?.nombreCompleto ?? '').trim() || ownerDni;
    const vehicleCount = Number(owner?.vehicleCount ?? 0);

    if (!ownerDni) return;

    if (vehicleCount > 0) {
      toast({
        title: 'No se puede eliminar',
        description: 'Este propietario tiene vehículos asociados. Primero debe desvincularlos o reasignarlos.',
        variant: 'destructive',
      });
      return;
    }

    const confirmed = window.confirm(`¿Seguro que deseas eliminar al propietario ${ownerName} (${ownerDni})?`);
    if (!confirmed) return;

    try {
      await propietariosService.deletePropietario(ownerDni);
      toast({
        title: 'Propietario eliminado',
        description: 'El propietario fue eliminado correctamente.',
        variant: 'success',
      });
      handleRefresh();
      setPage(1);
    } catch (error: any) {
      toast({
        title: 'Error al eliminar propietario',
        description: error?.response?.data?.message || error?.message || 'Error desconocido',
        variant: 'destructive',
      });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{String(error)}</p>
          <Button onClick={() => setPage(1)} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
        <div className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-gray-900 dark:to-emerald-950/20 p-8 rounded-2xl shadow-lg border border-emerald-200/50 dark:border-emerald-800/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent mb-2">
                Gestión de Propietarios
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Administra y supervisa los propietarios registrados en el sistema.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">{isLoading ? '-' : totalItems}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Propietarios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400">{isLoading ? '-' : totalPages}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Páginas</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Propietarios Registrados
                  {isLoading && <RefreshCw className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Listado completo de propietarios en el sistema</CardDescription>
              </div>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Propietario
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 pr-10 bg-white dark:bg-gray-800 dark:text-white"
              />
              {searchTerm.length > 0 && searchTerm.length < 2 && (
                <div className="absolute -bottom-6 left-0 text-xs text-amber-600 dark:text-amber-400">
                  Ingresa al menos 2 caracteres para buscar
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead>Propietario</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead className="text-center">Vehículos</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                        <div className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Cargando propietarios...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                        <div className="inline-flex items-center gap-2">
                          <User className="w-4 h-4" />
                          No hay propietarios para mostrar.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner: any) => {
                      const ownerDni = String(owner?.dni ?? owner?.ownerDni ?? '').trim();
                      const ownerName = String(owner?.fullName ?? owner?.nombreCompleto ?? '').trim() || 'Sin nombre';
                      const ownerPhone = String(owner?.phone ?? owner?.phoneNumber ?? '').trim() || '-';
                      const ownerEmail = String(owner?.email ?? '').trim() || '-';
                      const vehicleCount = Number(owner?.vehicleCount ?? 0);

                      return (
                        <TableRow key={ownerDni || ownerName}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">{ownerName}</TableCell>
                          <TableCell className="font-mono">{ownerDni || '-'}</TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {ownerPhone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {ownerEmail}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{vehicleCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                onClick={() => openEditDialog(owner)}
                                title="Editar propietario"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                onClick={() => handleDeleteOwner(owner)}
                                disabled={vehicleCount > 0}
                                title={vehicleCount > 0 ? 'No se puede eliminar: tiene vehículos asociados' : 'Eliminar propietario'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {searchTerm ? (
                    `Encontrados ${pagination.totalItems} para "${searchTerm}" (página ${pagination.currentPage} de ${pagination.totalPages})`
                  ) : (
                    `Mostrando página ${pagination.currentPage} de ${pagination.totalPages}`
                  )}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPreviousPage || isLoading}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!pagination.hasNextPage || isLoading}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AddPropietarioDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleOwnersChanged}
        />
        <EditPropietarioDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          owner={editingOwner}
          onSuccess={handleOwnersChanged}
        />
      </div>
    </AdminLayout>
  );
};

export default PropietariosPage;