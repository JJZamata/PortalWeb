import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechnicalReviewDetail } from "../types";
import {
  Calendar,
  FileCheck,
  Car,
  Building2,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Props {
  technicalReview: TechnicalReviewDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TechnicalReviewDetailDialog = ({ technicalReview, open, onOpenChange }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getResultColor = (result: string) => {
    switch (result?.toUpperCase()) {
      case 'APROBADO':
        return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-700';
      case 'REPROBADO':
        return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-700';
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-700';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-700';
    }
  };

  const getIconForResult = (result: string) => {
    switch (result?.toUpperCase()) {
      case 'APROBADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'REPROBADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!technicalReview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600" />
            Detalle de Revisión Técnica
            <Badge variant="secondary" className="ml-2">
              {technicalReview.revision.reviewId}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado de la Revisión */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Resultado de la Revisión</p>
              <Badge
                variant="secondary"
                className={`mt-1 flex items-center gap-1 ${getResultColor(technicalReview.revision.inspectionResult)}`}
              >
                {getIconForResult(technicalReview.revision.inspectionResult)}
                {technicalReview.estado.descripcion}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Días Restantes</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {technicalReview.fechas.diasRestantes} días
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información de la Revisión */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  Información de la Revisión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Código de Revisión</p>
                  <p className="font-semibold">{technicalReview.revision.reviewId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resultado</p>
                  <Badge className={`${getResultColor(technicalReview.revision.inspectionResult)} flex items-center gap-1`}>
                    {getIconForResult(technicalReview.revision.inspectionResult)}
                    {technicalReview.revision.inspectionResult}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Empresa Certificadora</p>
                  <p className="font-semibold text-sm">{technicalReview.revision.certifyingCompany}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Placa</p>
                  <p className="font-semibold">{technicalReview.revision.vehiclePlate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Vehículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-green-600" />
                  Información del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Placa</p>
                  <p className="font-semibold">{technicalReview.vehiculo.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marca</p>
                  <p className="font-semibold">{technicalReview.vehiculo.marca}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modelo</p>
                  <p className="font-semibold">{technicalReview.vehiculo.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Año</p>
                  <p className="font-semibold">{technicalReview.vehiculo.año}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categoría</p>
                  <p className="font-semibold">{technicalReview.vehiculo.tipo?.categoria || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Descripción</p>
                  <p className="font-semibold text-sm">{technicalReview.vehiculo.tipo?.descripcion || 'No especificada'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Vigencia de la Revisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Emisión</p>
                  <p className="font-semibold">{formatDate(technicalReview.fechas.emision)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Vencimiento</p>
                  <p className="font-semibold">{formatDate(technicalReview.fechas.vencimiento)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Días Restantes</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{technicalReview.fechas.diasRestantes}</p>
                    <p className="text-sm text-gray-500">días</p>
                  </div>
                  {technicalReview.fechas.diasRestantes <= 30 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Próximo a vencer
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                Estado de la Revisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Código</p>
                  <p className="font-semibold">{technicalReview.estado.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                  <Badge
                    variant="secondary"
                    className={`${
                      technicalReview.estado.color === 'green'
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
                        : technicalReview.estado.color === 'red'
                        ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700'
                    }`}
                  >
                    {technicalReview.estado.descripcion}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};