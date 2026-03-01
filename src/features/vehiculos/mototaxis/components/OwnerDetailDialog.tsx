import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { User, FileText, Car, Phone, Mail, RefreshCw, XCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner: any | null;
  vehiclePlates: string[];
  loading: boolean;
  error: string | null;
}

export const OwnerDetailDialog = ({ open, onOpenChange, owner, vehiclePlates, loading, error }: Props) => {
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar propietario</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando información del propietario...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!owner) {
    return null;
  }

  const ownerDni = owner?.dni || owner?.ownerDni || 'N/A';
  const ownerName = owner?.nombreCompleto
    || owner?.fullName
    || `${owner?.firstName || owner?.nombres || ''} ${owner?.lastName || owner?.apellidos || ''}`.trim()
    || 'Sin nombre';

  const ownerPhone = owner?.phone || owner?.phoneNumber || owner?.telefono || 'No registrado';
  const ownerEmail = owner?.email || 'No registrado';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            Detalle del Propietario
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Información del propietario y vehículos asociados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Card className="border border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Datos del propietario</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Nombre completo
                </Label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ownerName}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  DNI
                </Label>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">{ownerDni}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Teléfono
                </Label>
                <p className="text-sm text-gray-900 dark:text-white">{ownerPhone}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </Label>
                <p className="text-sm text-gray-900 dark:text-white break-all">{ownerEmail}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Vehículos asociados
                <Badge variant="secondary" className="ml-1">{vehiclePlates.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehiclePlates.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vehiclePlates.map((plate) => (
                    <Badge key={plate} variant="outline" className="font-mono text-xs border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200">
                      {plate}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">No se encontraron vehículos asociados para este propietario.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
