import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { propietariosService } from '../services/propietariosService';
import { useToast } from '@/hooks/use-toast';
import { EditPropietarioDialog } from './EditPropietarioDialog';
import { Search, RefreshCw, User, Pencil, Trash2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChange?: () => void;
}

export const ManagePropietariosDialog = ({ open, onOpenChange, onDataChange }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingOwner, setEditingOwner] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['propietarios-manager', page, searchTerm],
    queryFn: () => propietariosService.getPropietarios(page, searchTerm),
    enabled: open,
    staleTime: 30 * 1000,
  });

  const owners = useMemo(() => (Array.isArray(data?.propietarios) ? data.propietarios : []), [data]);
  const pagination = data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: (dni: string) => propietariosService.deletePropietario(dni),
    onSuccess: () => {
      toast({
        title: 'Propietario eliminado',
        description: 'El propietario fue eliminado correctamente.',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['propietarios'] });
      queryClient.invalidateQueries({ queryKey: ['propietarios-manager'] });
      onDataChange?.();
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar propietario',
        description: error?.response?.data?.message || error?.message || 'Error desconocido',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (owner: any) => {
    const ownerDni = String(owner?.dni ?? owner?.ownerDni ?? '').trim();
    const ownerName = String(owner?.fullName ?? owner?.nombreCompleto ?? '').trim() || ownerDni;
    const count = Number(owner?.vehicleCount ?? 0);

    if (!ownerDni) return;

    if (count > 0) {
      toast({
        title: 'No se puede eliminar',
        description: 'Este propietario tiene vehículos asociados. Primero debe desvincularlos o reasignarlos.',
        variant: 'destructive',
      });
      return;
    }

    const confirmed = window.confirm(`¿Seguro que deseas eliminar al propietario ${ownerName} (${ownerDni})?`);
    if (!confirmed) return;

    deleteMutation.mutate(ownerDni);
  };

  const handleEdit = (owner: any) => {
    setEditingOwner(owner);
    setShowEditDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Gestionar Propietarios</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Edita o elimina propietarios registrados. Los propietarios con vehículos asociados no pueden eliminarse.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por nombre o DNI..."
                className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead>Propietario</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-center">Vehículos</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-gray-500 dark:text-gray-400">
                        <div className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Cargando propietarios...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-red-600 dark:text-red-400">
                        No se pudieron cargar propietarios.
                      </TableCell>
                    </TableRow>
                  ) : owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-gray-500 dark:text-gray-400">
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
                      const count = Number(owner?.vehicleCount ?? 0);

                      return (
                        <TableRow key={ownerDni}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">{ownerName}</TableCell>
                          <TableCell className="font-mono">{ownerDni || '-'}</TableCell>
                          <TableCell>{ownerPhone}</TableCell>
                          <TableCell className="text-center">{count}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(owner)}>
                                <Pencil className="w-3.5 h-3.5 mr-1" />
                                Editar
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(owner)}
                                disabled={count > 0 || deleteMutation.isPending}
                                title={count > 0 ? 'No se puede eliminar: tiene vehículos asociados' : 'Eliminar propietario'}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
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

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Página {Number(pagination?.currentPage || page)} de {Number(pagination?.totalPages || 1)}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={Number(pagination?.currentPage || page) <= 1 || isLoading}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={Number(pagination?.currentPage || page) >= Number(pagination?.totalPages || 1) || isLoading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditPropietarioDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        owner={editingOwner}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['propietarios'] });
          queryClient.invalidateQueries({ queryKey: ['propietarios-manager'] });
          onDataChange?.();
          refetch();
        }}
      />
    </>
  );
};
