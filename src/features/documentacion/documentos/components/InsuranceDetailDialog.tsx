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
import { InsuranceDetail } from "../types";
import {
  Calendar,
  FileText,
  Car,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  CreditCard,
  UserCheck,
  RefreshCw,
  XCircle
} from "lucide-react";

interface Props {
  insurance: InsuranceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

export const InsuranceDetailDialog = ({ insurance, open, onOpenChange, loading = false, error }: Props) => {
  const formatDate = (dateString: string) => {
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
              No se pudo obtener la información del seguro AFOCAT
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

  if ((loading && !insurance) || (!insurance && !error)) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Cargando Detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Obteniendo información detallada del seguro AFOCAT
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
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
            <Shield className="w-6 h-6 text-blue-600" />
            Detalle del Seguro AFOCAT
            <Badge variant="secondary" className="ml-2">
              {insurance.seguro.policyNumber}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado del Seguro */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Estado del Seguro</p>
              <Badge
  variant="secondary"
  className={`mt-1 ${
    insurance.estado.color === 'green'
      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
      : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'
  }`}
>
  {insurance.estado.descripcion}
</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Días Restantes</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {insurance.fechas.diasRestantes} días
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del Seguro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Información del Seguro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Póliza</p>
                  <p className="font-semibold">{insurance.seguro.policyNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Compañía</p>
                  <p className="font-semibold">{insurance.seguro.insuranceCompanyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cobertura</p>
                  <p className="font-semibold text-sm">{insurance.seguro.coverage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Placa</p>
                  <p className="font-semibold">{insurance.seguro.vehiclePlate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Vehículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Información del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Placa</p>
                  <p className="font-semibold">{insurance.vehiculo.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marca</p>
                  <p className="font-semibold">{insurance.vehiculo.marca}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modelo</p>
                  <p className="font-semibold">{insurance.vehiculo.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Año</p>
                  <p className="font-semibold">{insurance.vehiculo.año}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categoría</p>
                  <p className="font-semibold">{insurance.vehiculo.tipo?.categoria || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Descripción</p>
                  <p className="font-semibold text-sm">{insurance.vehiculo.tipo?.descripcion || 'No especificada'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Propietario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Información del Propietario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nombre Completo</p>
                  <p className="font-semibold">{insurance.propietario.nombreCompleto}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">DNI</p>
                  <p className="font-semibold">{insurance.propietario.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                  <p className="font-semibold">{insurance.propietario.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-sm">{insurance.propietario.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Vigencia del Seguro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Inicio</p>
                  <p className="font-semibold">{formatDate(insurance.fechas.inicio)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Vencimiento</p>
                  <p className="font-semibold">{formatDate(insurance.fechas.vencimiento)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Días Restantes</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{insurance.fechas.diasRestantes}</p>
                    <p className="text-sm text-gray-500">días</p>
                  </div>
                  {insurance.fechas.diasRestantes <= 30 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Próximo a vencer
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};