import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TechnicalReviewDetail } from "../types";
import {
  Calendar,
  FileCheck,
  Car,
  Building2,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from "lucide-react";

interface Props {
  technicalReview: TechnicalReviewDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

export const TechnicalReviewDetailDialog = ({ technicalReview, open, onOpenChange, loading = false, error }: Props) => {
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

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
              Error al cargar detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              No se pudo obtener la información de la revisión técnica
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

  if ((loading && !technicalReview) || (!technicalReview && !error)) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-600 dark:text-green-400">
              Cargando Detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Obteniendo información detallada de la revisión técnica
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute inset-0 border-4 border-green-200 dark:border-green-800 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-2 border-green-300 dark:border-green-700 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center space-x-1 mb-4">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando información...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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