import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useEmpresas } from './hooks/useEmpresas';
import { useEmpresaDetail } from './hooks/useEmpresaDetail';
import { EmpresasTable } from './components/EmpresasTable';
import { EmpresaDetailDialog } from './components/EmpresaDetailDialog';
import { AddEmpresaDialog } from './components/AddEmpresaDialog';
import { EditEmpresaDialog } from './components/EditEmpresaDialog';
import { DeleteEmpresaDialog } from './components/DeleteEmpresaDialog';
import { PaginationControls } from './components/PaginationControls';
import { empresasService } from './services/empresasService';
import { useToast } from '@/hooks/use-toast';
import { XCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmpresasView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { empresas, pagination, stats, loading, error, page, handlePageChange } = useEmpresas(searchTerm, statusFilter);
  const { empresaDetail, loadingDetail, errorDetail, fetchEmpresaDetail } = useEmpresaDetail();
  const { toast } = useToast();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editEmpresa, setEditEmpresa] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteRuc, setDeleteRuc] = useState<string | null>(null);

  const openEditDialog = (empresa: any) => {
    setEditEmpresa(empresa);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (ruc: string) => {
    setDeleteRuc(ruc);
    setShowDeleteDialog(true);
  };

  const handleDeleteEmpresa = async () => {
    if (deleteRuc) {
      try {
        await empresasService.deleteEmpresa(deleteRuc);
        toast({ title: "Empresa eliminada", description: "La empresa fue eliminada exitosamente.", variant: "success" });
        handlePageChange(page);
      } catch (error) {
        toast({ title: "Error al eliminar empresa", description: "Error desconocido", variant: "destructive" });
      } finally {
        setShowDeleteDialog(false);
      }
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => handlePageChange(1)} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
        <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 p-8 rounded-2xl shadow-lg border border-purple-200/40 dark:border-purple-800/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-900 to-fuchsia-700 dark:from-purple-300 dark:to-fuchsia-400 bg-clip-text text-transparent mb-2">
                Gestión de Empresas
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Administra y supervisa las empresas registradas en el sistema</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{loading ? '-' : stats?.activeCompanies || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Activas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{loading ? '-' : stats?.suspendedCompanies || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Suspendidas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{loading ? '-' : stats?.totalCompanies || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Empresas</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Empresas Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Gestión completa de empresas de transporte</CardDescription>
              </div>
              <div className="flex gap-3">
                <AddEmpresaDialog onSuccess={() => handlePageChange(page)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nombre o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 pr-10 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex gap-2 min-w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 dark:text-white">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los estados</SelectItem>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                    <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <EmpresasTable
              empresas={empresas}
              loading={loading}
              onView={fetchEmpresaDetail}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
            {pagination && <PaginationControls pagination={pagination} onPageChange={handlePageChange} searchTerm={searchTerm} statusFilter={statusFilter} />}
          </CardContent>
        </Card>

        <EmpresaDetailDialog
          open={!!empresaDetail}
          onOpenChange={() => fetchEmpresaDetail(null)}
          empresa={empresaDetail}
          loading={loadingDetail}
          error={errorDetail}
        />
        <EditEmpresaDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          empresa={editEmpresa}
          onSuccess={() => handlePageChange(page)}
        />
        <DeleteEmpresaDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          ruc={deleteRuc}
          onConfirm={handleDeleteEmpresa}
        />
      </div>
    </AdminLayout>
  );
};

export default EmpresasView;