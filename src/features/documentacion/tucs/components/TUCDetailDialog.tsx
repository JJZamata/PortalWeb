import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RefreshCw, XCircle, Car, User, Building2, Calendar, UserCheck } from 'lucide-react';
import { TUCData, Propietario, Empresa } from '../types';

interface Props {
  tuc: TUCData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

const getStatusColor = (statusText: string): string => {
  const value = String(statusText || '').toLowerCase();

  if (value.includes('vigente') || value.includes('active') || value.includes('activo')) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
  }

  if (value.includes('por vencer') || value.includes('por_vencer') || value.includes('expiring')) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
  }

  if (value.includes('vencido') || value.includes('expired')) {
    return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
  }

  return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700';
};

// Función auxiliar para obtener el nombre del propietario
const getPropietarioName = (propietario: Propietario | string | undefined): string => {
  if (!propietario) return 'N/A';
  if (typeof propietario === 'string') return propietario;
  return propietario.nombreCompleto || propietario.nombre || 'N/A';
};

// Función auxiliar para obtener el nombre de la empresa
const getEmpresaName = (empresa: Empresa | string | undefined): string => {
  if (!empresa) return 'N/A';
  if (typeof empresa === 'string') return empresa;
  return empresa.nombre || 'N/A';
};

export const TUCDetailDialog = ({ tuc, open, onOpenChange, loading = false, error }: Props) => {
  if (!tuc && !loading && !error) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
              Error al cargar detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              No se pudo obtener la información detallada de la TUC
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if ((loading && !tuc) || (!tuc && !error)) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Cargando Detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Obteniendo información detallada de la TUC
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-2 border-blue-300 dark:border-blue-700 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center space-x-1 mb-4">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando información...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Detalle de TUC
            <Badge variant="secondary" className="ml-2">
              {tuc?.tuc?.tucNumber ?? tuc?.tucNumber ?? 'N/A'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {tuc ? (
          (() => {
            // Compatibilidad: usar anidado o plano
            const tucNumber = tuc.tuc?.tucNumber ?? tuc.tucNumber ?? 'N/A';
            const vehiclePlate = tuc.tuc?.vehiclePlate ?? tuc.vehiclePlate ?? 'N/A';
            const vehicleInfo = tuc.vehiculo?.vehicleInfo ?? tuc.vehicleInfo ?? 'N/A';
            const vehicleType = tuc.vehiculo?.tipo?.descripcion ?? 'N/A';
            const registralCode = tuc.tuc?.registralCode ?? tuc.registralCode ?? 'N/A';
            const supportDocument = tuc.tuc?.supportDocument ?? tuc.supportDocument ?? 'N/A';
            const validityDate = tuc.fechas?.vigencia ?? tuc.validityDate;
            const diasRestantes = Math.max(0, Number(tuc.fechas?.diasRestantes ?? tuc.diasRestantes ?? 0));
            const createdAt = tuc.auditoria?.fechaCreacion ?? tuc.createdAt;
            const updatedAt = tuc.auditoria?.fechaActualizacion ?? tuc.updatedAt;
            const estadoDescripcion = tuc.estado?.descripcion ?? tuc.estado?.codigo ?? 'Sin estado';

            return (
          <div className="space-y-6">
            {/* Header con Estado */}
            <div className="flex items-center justify-between p-4 bg-blue-50/70 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Estado de la TUC</p>
                <Badge variant="secondary" className={`mt-1 border ${getStatusColor(estadoDescripcion)}`}>
                  {estadoDescripcion}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Días Restantes</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{diasRestantes} días</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Información de la TUC
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Número de TUC</p>
                    <p className="font-semibold">{tucNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Código Registral</p>
                    <p className="font-semibold">{registralCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Documento Soporte</p>
                    <p className="font-semibold text-sm">{supportDocument}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Información del Vehículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Placa</p>
                    <p className="font-semibold">{vehiclePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Marca y Modelo</p>
                    <p className="font-semibold">{vehicleInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Vehículo</p>
                    <p className="font-semibold">{vehicleType}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Propietario y Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Propietario</p>
                    <p className="font-semibold">{getPropietarioName(tuc.propietario)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">DNI Propietario</p>
                    <p className="font-semibold">
                      {typeof tuc.propietario === 'object' && tuc.propietario?.dni ? tuc.propietario.dni : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Empresa</p>
                    <p className="font-semibold">{getEmpresaName(tuc.empresa)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">RUC Empresa</p>
                    <p className="font-semibold">
                      {typeof tuc.empresa === 'object' && tuc.empresa?.ruc ? tuc.empresa.ruc : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Vigencia de la TUC
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Vencimiento</p>
                    <p className="font-semibold">{formatDate(validityDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Días Restantes</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{diasRestantes}</p>
                      <p className="text-sm text-gray-500">días</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Última Actualización</p>
                    <p className="font-semibold">{formatDate(updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Auditoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Creación</p>
                    <p className="font-semibold">{formatDate(createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Actualización</p>
                    <p className="font-semibold">{formatDate(updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
            );
          })()
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
