import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Loader } from 'lucide-react';
import { TUCData, Propietario, Empresa } from '../types';

interface Props {
  tuc: TUCData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

const getStatusColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colorMap[color] || colorMap.gray;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Detalles de TUC
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : tuc ? (
          (() => {
            // Compatibilidad: usar anidado o plano
            const tucNumber = tuc.tuc?.tucNumber ?? tuc.tucNumber ?? 'N/A';
            const vehiclePlate = tuc.tuc?.vehiclePlate ?? tuc.vehiclePlate ?? 'N/A';
            const vehicleInfo = tuc.vehiculo?.vehicleInfo ?? tuc.vehicleInfo ?? 'N/A';
            const vehicleType = tuc.vehiculo?.tipo?.descripcion ?? 'N/A';
            const registralCode = tuc.tuc?.registralCode ?? tuc.registralCode ?? 'N/A';
            const supportDocument = tuc.tuc?.supportDocument ?? tuc.supportDocument ?? 'N/A';
            const validityDate = tuc.fechas?.vigencia ?? tuc.validityDate;
            const diasRestantes = tuc.fechas?.diasRestantes ?? tuc.diasRestantes ?? 0;
            const createdAt = tuc.auditoria?.fechaCreacion ?? tuc.createdAt;
            const updatedAt = tuc.auditoria?.fechaActualizacion ?? tuc.updatedAt;

            return (
          <div className="space-y-4">
            {/* Header con Estado */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Número de TUC</p>
                <p className="text-xl font-bold">{tucNumber}</p>
              </div>
              <Badge className={getStatusColor(tuc.estado?.color || 'gray')}>
                {tuc.estado?.descripcion || 'Sin estado'}
              </Badge>
            </div>

            {/* Grid rectangular con todos los detalles */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-200 dark:divide-gray-800">
                  
                  {/* TUC */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Número de TUC</p>
                    <p className="font-medium text-lg">{tucNumber}</p>
                  </div>
                  
                  {/* Placa */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Placa del Vehículo</p>
                    <p className="font-mono font-bold text-lg">{vehiclePlate}</p>
                  </div>

                  {/* Marca y Modelo */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Marca y Modelo</p>
                    <p className="font-medium">{vehicleInfo}</p>
                  </div>

                  {/* Tipo de Vehículo */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Tipo de Vehículo</p>
                    <p className="font-medium">{vehicleType}</p>
                  </div>

                  {/* Propietario */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Propietario</p>
                    <p className="font-medium">{getPropietarioName(tuc.propietario)}</p>
                  </div>

                  {/* DNI Propietario */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">DNI Propietario</p>
                    <p className="font-medium">
                      {typeof tuc.propietario === 'object' && tuc.propietario?.dni ? tuc.propietario.dni : 'N/A'}
                    </p>
                  </div>

                  {/* Empresa */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Empresa</p>
                    <p className="font-medium">{getEmpresaName(tuc.empresa)}</p>
                  </div>

                  {/* RUC Empresa */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">RUC Empresa</p>
                    <p className="font-medium">
                      {typeof tuc.empresa === 'object' && tuc.empresa?.ruc ? tuc.empresa.ruc : 'N/A'}
                    </p>
                  </div>

                  {/* Código Registral */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Código Registral</p>
                    <p className="font-medium">{registralCode}</p>
                  </div>

                  {/* Documento Soporte */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Documento Soporte</p>
                    <p className="font-medium">{supportDocument}</p>
                  </div>

                  {/* Fecha de Vigencia */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Fecha de Vigencia</p>
                    <p className="font-medium">{validityDate ? new Date(validityDate).toLocaleDateString('es-PE') : 'N/A'}</p>
                  </div>

                  {/* Días Restantes */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Días Restantes</p>
                    <p className={`font-bold text-lg ${diasRestantes <= 0 ? 'text-red-600 dark:text-red-400' : diasRestantes <= 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                      {diasRestantes} días
                    </p>
                  </div>

                  {/* Creado */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Fecha de Creación</p>
                    <p className="font-medium text-sm">{createdAt ? new Date(createdAt).toLocaleDateString('es-PE') : 'N/A'}</p>
                  </div>

                  {/* Actualizado */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Última Actualización</p>
                    <p className="font-medium text-sm">{updatedAt ? new Date(updatedAt).toLocaleDateString('es-PE') : 'N/A'}</p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
            );
          })()
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
