import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useTUCs, useTUCDetail } from '@/features/documentacion/tucs/hooks/useTUCs';
import { TUCsTable } from '@/features/documentacion/tucs/components/TUCsTable';
import { CreateTUCDialog } from '@/features/documentacion/tucs/components/CreateTUCDialog';
import { EditTUCDialog } from '@/features/documentacion/tucs/components/EditTUCDialog';
import { TUCDetailDialog } from '@/features/documentacion/tucs/components/TUCDetailDialog';
import { PaginationControls } from '@/features/documentacion/tucs/components/PaginationControls';
import tucService from '@/features/documentacion/tucs/services/tucService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Plus, Search, FileText, XCircle } from 'lucide-react';
import { TUCFilters } from '@/features/documentacion/tucs/types';

const TUCsPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Estado de filtros
  const [filters, setFilters] = useState<TUCFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Diálogos
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Obtener datos
  const { tucs, pagination, loading, error } = useTUCs({
    ...filters,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
  });

  const { tuc: selectedTUC, loading: loadingDetail, fetchTUCDetail, clearTUCDetail } = useTUCDetail();

  const handleRefresh = () => {
    setFilters({ ...filters, page: 1 });
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 max-w-2xl mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar TUCs</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error?.message || 'Error desconocido'}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['tucs'] });
    queryClient.invalidateQueries({ queryKey: ['tucDetail'] });
  };

  const handleViewDetail = async (tucNumber: string) => {
    try {
      fetchTUCDetail(tucNumber);
      setShowDetailDialog(true);
    } catch (error: any) {
      toast({
        title: 'Error al cargar detalles',
        description: error?.message || 'No se pudieron cargar los detalles de la TUC',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (tucNumber: string) => {
    try {
      fetchTUCDetail(tucNumber);
      setShowEditDialog(true);
    } catch (error: any) {
      toast({
        title: 'Error al cargar datos',
        description: error?.message || 'No se pudieron cargar los datos de la TUC',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (tucNumber: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la TUC ${tucNumber}?`)) return;

    try {
      await tucService.deleteTUC(tucNumber);
      toast({
        title: '✅ TUC eliminada',
        description: `La TUC ${tucNumber} ha sido eliminada exitosamente`,
      });
      handleUpdateSuccess();
    } catch (error: any) {
      toast({
        title: '❌ Error al eliminar',
        description: error?.response?.data?.message || error?.message || 'No se pudo eliminar la TUC',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-[#1a1a1a] dark:to-[#1a2340]/40 p-8 rounded-2xl shadow-lg border border-blue-200/40 dark:border-blue-900/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-500 mb-2">
                Gestión de TUCs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Administra las Tarjetas Únicas de Circulación de tus vehículos
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">{pagination?.totalItems || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total TUCs</p>
            </div>
          </div>
        </div>

        {/* Tabla y Filtros */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  TUCs Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />}
                </CardTitle>
                <CardDescription>Listado completo de todas las TUCs registradas</CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva TUC
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Filtros */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por TUC, placa o propietario..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFilters({ ...filters, page: 1 });
                  }}
                  className="pl-12 h-12 border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>

              <div className="flex gap-2 items-center">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setFilters({ ...filters, page: 1 }); }}>
                  <SelectTrigger className="h-12 w-[200px] border-gray-200 dark:border-gray-700 rounded-xl">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="vigente">Vigente</SelectItem>
                    <SelectItem value="por_vencer">Por Vencer</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={handleRefresh} title="Actualizar">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tabla */}
            <TUCsTable
              tucs={tucs}
              loading={loading}
              onView={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Paginación */}
            {pagination && (
              <PaginationControls
                pagination={pagination}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            )}
          </CardContent>
        </Card>

        {/* Diálogos */}
        <CreateTUCDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={() => {
            handleUpdateSuccess();
            setShowCreateDialog(false);
          }}
        />

        <EditTUCDialog
          tuc={selectedTUC}
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) clearTUCDetail();
          }}
          onSuccess={() => {
            handleUpdateSuccess();
            setShowEditDialog(false);
            clearTUCDetail();
          }}
          loading={loadingDetail}
        />

        <TUCDetailDialog
          tuc={selectedTUC}
          open={showDetailDialog}
          onOpenChange={(open) => {
            setShowDetailDialog(open);
            if (!open) clearTUCDetail();
          }}
          loading={loadingDetail}
        />
      </div>
    </AdminLayout>
  );
};

export default TUCsPage;
