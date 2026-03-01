import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useVehiculos } from './hooks/useVehiculos';
import { useVehiculoDetail } from './hooks/useVehiculoDetail';
import { useVehicleStats } from './hooks/useVehicleStats';
import { VehiculosTable } from './components/VehiculosTable';
import { VehiculoDetailDialog } from './components/VehiculoDetailDialog';
import { OwnerDetailDialog } from './components/OwnerDetailDialog';
import { AddVehiculoDialog } from './components/AddVehiculoDialog';
import { EditVehiculoDialog } from './components/EditVehiculoDialog';
import { DeleteVehiculoDialog } from './components/DeleteVehiculoDialog';
import { PaginationControls } from './components/PaginationControls';
import { vehiculosService } from './services/vehiculosService';
import { propietariosService } from '../propietarios/services/propietariosService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { XCircle, RefreshCw, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const VehiculosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { vehiculos, pagination, summary, loading, error, page, handlePageChange } = useVehiculos(searchTerm);
  const { vehiculoDetail, loadingDetail, errorDetail, fetchVehiculoDetail } = useVehiculoDetail();
  const { stats, loading: statsLoading } = useVehicleStats();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editVehiculo, setEditVehiculo] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePlate, setDeletePlate] = useState<string | null>(null);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [ownerDetail, setOwnerDetail] = useState<any>(null);
  const [ownerPlates, setOwnerPlates] = useState<string[]>([]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);

  const openEditDialog = (vehiculo: any) => {
    setEditVehiculo(vehiculo);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (plate: string) => {
    setDeletePlate(plate);
    setShowDeleteDialog(true);
  };

  const extractOwnerPlatesFromDetail = (detail: any): string[] => {
    const possibleArrays = [
      detail?.vehicles,
      detail?.vehiculos,
      detail?.associatedVehicles,
      detail?.vehiculosAsociados,
      detail?.mototaxis,
    ].filter(Array.isArray);

    const plates = possibleArrays.flatMap((list: any[]) =>
      list
        .map((item: any) => String(item?.plateNumber ?? item?.placa ?? item?.placa_v ?? item?.placaVehiculo ?? '').trim().toUpperCase())
        .filter((plate: string) => plate.length > 0)
    );

    return Array.from(new Set(plates));
  };

  const openOwnerDialog = async (dni: string) => {
    if (!dni) {
      toast({
        title: 'Propietario no disponible',
        description: 'Este vehículo no tiene DNI de propietario asociado.',
        variant: 'destructive',
      });
      return;
    }

    setShowOwnerDialog(true);
    setOwnerLoading(true);
    setOwnerError(null);
    setOwnerDetail(null);
    setOwnerPlates([]);

    try {
      const detail = await propietariosService.getPropietarioDetail(dni);
      setOwnerDetail(detail);

      let plates = extractOwnerPlatesFromDetail(detail);

      if (plates.length === 0) {
        const firstPage = await vehiculosService.getVehiculos(1, dni);
        const totalPages = Number(firstPage?.pagination?.totalPages || 1);
        let allVehicles = Array.isArray(firstPage?.vehicles) ? firstPage.vehicles : [];

        if (totalPages > 1) {
          const restPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              vehiculosService.getVehiculos(index + 2, dni)
            )
          );

          restPages.forEach((pageResult) => {
            if (Array.isArray(pageResult?.vehicles)) {
              allVehicles = [...allVehicles, ...pageResult.vehicles];
            }
          });
        }

        plates = Array.from(new Set(
          allVehicles
            .filter((vehicle: any) => String(vehicle?.propietario?.dni || vehicle?.ownerDni || '').trim() === String(dni).trim())
            .map((vehicle: any) => String(vehicle?.placa?.plateNumber || vehicle?.placa_v || '').trim().toUpperCase())
            .filter((plate: string) => plate.length > 0)
        ));
      }

      setOwnerPlates(plates);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo cargar el detalle del propietario';
      setOwnerError(message);
    } finally {
      setOwnerLoading(false);
    }
  };

  const handleDeleteVehiculo = async () => {
    if (deletePlate) {
      await vehiculosService.deleteVehiculo(deletePlate);
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
                <p className="text-sm text-gray-600 dark:text-gray-300">Total mototaxis</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   Mototaxis Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Listado completo de mototaxis en el sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Mototaxi
                </Button>
              </div>
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
              onViewOwner={openOwnerDialog}
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
        <OwnerDetailDialog
          open={showOwnerDialog}
          onOpenChange={(open) => {
            setShowOwnerDialog(open);
            if (!open) {
              setOwnerDetail(null);
              setOwnerPlates([]);
              setOwnerError(null);
            }
          }}
          owner={ownerDetail}
          vehiclePlates={ownerPlates}
          loading={ownerLoading}
          error={ownerError}
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
        <AddVehiculoDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={refreshVehiculos}
        />
      </div>
    </AdminLayout>
  );
};

export default VehiculosView;