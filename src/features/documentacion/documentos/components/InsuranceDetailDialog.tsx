import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  UserCheck
} from "lucide-react";

interface Props {
  insurance: InsuranceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InsuranceDetailDialog = ({ insurance, open, onOpenChange }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!insurance) return null;

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