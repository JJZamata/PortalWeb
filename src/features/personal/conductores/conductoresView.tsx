import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useConductores } from './hooks/useConductores';
import { useConductorDetail } from './hooks/useConductorDetail';
import { ConductoresTable } from './components/ConductoresTable';
import { ConductorDetailDialog } from './components/ConductorDetailDialog';
import { AddConductorDialog } from './components/AddConductorDialog';
import { EditConductorDialog } from './components/EditConductorDialog';
import { DeleteConductorDialog } from './components/DeleteConductorDialog';
import { AddLicenseDialog } from './components/AddLicenseDialog';
import { PaginationControls } from './components/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { XCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ConductorDetalladoNuevo } from './types';
import { conductoresService } from './services/conductoresService';
import { useQueryClient } from '@tanstack/react-query';

const ConductoresView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { conductores, pagination, summary, stats, loading, error, page, handlePageChange } = useConductores(searchTerm);
  const { conductorDetail, licencias, licenciasSummary, loadingDetail, errorDetail, fetchConductorDetail } = useConductorDetail();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estado para controlar los diálogos
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editConductor, setEditConductor] = useState<ConductorDetalladoNuevo | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDni, setDeleteDni] = useState<string | null>(null);
  const [showAddLicenseDialog, setShowAddLicenseDialog] = useState(false);

  // Funciones para abrir diálogos
  const openDetailDialog = (dni: string) => {
    setShowAddLicenseDialog(false); // Cerrar cualquier dialogo abierto
    setShowEditDialog(false);
    fetchConductorDetail(dni);
    setShowDetailDialog(true);
  };

  const openEditDialog = (conductor: ConductorDetalladoNuevo) => {
    setShowDetailDialog(false); // Cerrar detail primero
    setShowAddLicenseDialog(false); // Cerrar add license si está abierto
    setEditConductor(conductor);
    fetchConductorDetail(conductor.dni); // Obtener detalle con licencias
    setShowEditDialog(true);
  };

  const openDeleteDialog = (dni: string) => {
    setDeleteDni(dni);
    setShowDeleteDialog(true);
  };

  const handleDeleteConductor = async () => {
    if (deleteDni) {
      try {
        // Aquí iría la lógica para eliminar el conductor (usando conductoresService.deleteConductor)
        await conductoresService.deleteConductor(deleteDni); // Asegúrate de importar conductoresService
        toast({ title: "Conductor eliminado", description: "El conductor fue eliminado exitosamente.", variant: "success" });
        refreshConductores();
      } catch (error) {
        toast({ title: "Error al eliminar conductor", description: "Error desconocido", variant: "destructive" });
      } finally {
        setShowDeleteDialog(false);
      }
    }
  };

  const refreshConductores = () => {
    // Forzar refetch de lista y stats; mantener la página actual
    queryClient.invalidateQueries({ queryKey: ['conductores'] });
    queryClient.invalidateQueries({ queryKey: ['conductores-stats'] });
    handlePageChange(page);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
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
        <div className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/30 p-8 rounded-2xl shadow-lg border border-green-200/40 dark:border-green-800/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent mb-2">
                Gestión de Conductores
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Administra y supervisa los conductores registrados en el sistema</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
                  {loading ? '-' : stats?.totales?.total || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Conductores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {loading ? '-' : stats?.totales?.completados || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Completados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-400">
                  {loading ? '-' : stats?.totales?.pendientes || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pendientes</p>
              </div>
              
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Conductores Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-green-600 dark:text-green-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Listado completo de conductores en el sistema</CardDescription>
              </div>
              <AddConductorDialog onSuccess={refreshConductores} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Buscar por DNI, nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 focus:ring-green-500 pr-10 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <ConductoresTable
              conductores={conductores}
              loading={loading}
              onView={openDetailDialog}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
            {pagination && <PaginationControls pagination={pagination} onPageChange={handlePageChange} searchTerm={searchTerm} />}
          </CardContent>
        </Card>

        <ConductorDetailDialog
          open={showDetailDialog}
          onOpenChange={(open) => {
            setShowDetailDialog(open);
            if (!open) fetchConductorDetail(null);
          }}
          conductor={conductorDetail}
          licencias={licencias}
          licenciasSummary={licenciasSummary}
          loading={loadingDetail}
          error={errorDetail}
          onAddLicense={() => setShowAddLicenseDialog(true)}
        />
        <EditConductorDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setEditConductor(null);
          }}
          conductor={editConductor}
          onSuccess={() => {
            setShowEditDialog(false);
            setEditConductor(null);
            refreshConductores();
          }}
          licensesData={licencias || []}
        />
        <DeleteConductorDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          dni={deleteDni}
          onConfirm={handleDeleteConductor}
        />
        <AddLicenseDialog
          open={showAddLicenseDialog}
          onOpenChange={setShowAddLicenseDialog}
          conductorDni={conductorDetail?.dni || ''}
          onSuccess={() => conductorDetail && fetchConductorDetail(conductorDetail.dni)}
        />
      </div>
    </AdminLayout>
  );
};

export default ConductoresView;