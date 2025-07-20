import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useVehiculos } from './hooks/useVehiculos';
import { useVehiculoDetail } from './hooks/useVehiculoDetail';
import { useVehicleStats } from './hooks/useVehicleStats';
import { VehiculosTable } from './components/VehiculosTable';
import { VehiculoDetailDialog } from './components/VehiculoDetailDialog';
import { AddVehiculoDialog } from './components/AddVehiculoDialog';
import { EditVehiculoDialog } from './components/EditVehiculoDialog';
import { DeleteVehiculoDialog } from './components/DeleteVehiculoDialog';
import { PaginationControls } from './components/PaginationControls';
import { vehiculosService } from './services/vehiculosService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { XCircle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const VehiculosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { vehiculos, pagination, summary, loading, error, page, handlePageChange } = useVehiculos(searchTerm);
  const { vehiculoDetail, loadingDetail, errorDetail, fetchVehiculoDetail } = useVehiculoDetail();
  const { stats, loading: statsLoading } = useVehicleStats();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editVehiculo, setEditVehiculo] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePlate, setDeletePlate] = useState<string | null>(null);

  const openEditDialog = (vehiculo: any) => {
    setEditVehiculo(vehiculo);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (plate: string) => {
    setDeletePlate(plate);
    setShowDeleteDialog(true);
  };

  const handleDeleteVehiculo = async () => {
    if (deletePlate) {
      console.log('Eliminando vehículo con placa:', deletePlate);
      await vehiculosService.deleteVehiculo(deletePlate);
      console.log('Vehículo eliminado exitosamente');
    }
  };

  const refreshVehiculos = () => {
    // Invalidar todas las queries de vehículos para forzar refetch
    queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    queryClient.invalidateQueries({ queryKey: ['vehicleStats'] });
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => handlePageChange(1)} variant="outline" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
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
        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 p-8 rounded-2xl shadow-lg border border-blue-200/40 dark:border-blue-800/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                Gestión de Mototaxis
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Administra y supervisa las mototaxis registrados en el sistema</p>
            </div>

            {/* Estadísticas juntas tipo fiscalizadores */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
                  {statsLoading ? '-' : stats?.byStatus?.OPERATIVO || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Operativo</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-400">
                  {statsLoading ? '-' : stats?.byStatus?.REPARACIÓN || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Reparación</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
                  {statsLoading ? '-' : stats?.byStatus?.['FUERA DE SERVICIO'] || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fuera Servicio</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {statsLoading ? '-' : stats?.byStatus?.INSPECCIÓN || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Inspección</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
                  {statsLoading ? '-' : stats?.totalVehicles || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Vehículos Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Listado completo de vehículos en el sistema</CardDescription>
              </div>
              <AddVehiculoDialog onSuccess={refreshVehiculos} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Buscar por placa, propietario o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-blue-500 pr-10 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <VehiculosTable
              vehiculos={vehiculos}
              loading={loading}
              onView={fetchVehiculoDetail}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
            {pagination && <PaginationControls pagination={pagination} onPageChange={handlePageChange} searchTerm={searchTerm} />}
          </CardContent>
        </Card>

        <VehiculoDetailDialog
          open={!!vehiculoDetail}
          onOpenChange={() => fetchVehiculoDetail(null)}
          vehiculo={vehiculoDetail}
          loading={loadingDetail}
          error={errorDetail}
        />
        <EditVehiculoDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          vehiculo={editVehiculo}
          onSuccess={refreshVehiculos}
        />
        <DeleteVehiculoDialog
          open={showDeleteDialog}
          onOpenChange={(open) => {
            setShowDeleteDialog(open);
            if (!open) setDeletePlate(null); // Limpiar placa al cerrar
          }}
          plate={deletePlate}
          onConfirm={handleDeleteVehiculo}
          onSuccess={refreshVehiculos}
        />
      </div>
    </AdminLayout>
  );
};

export default VehiculosView;