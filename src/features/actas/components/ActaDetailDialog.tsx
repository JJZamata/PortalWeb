import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle, MapPin, FileText, Camera, Shield, User, Car, Building2, ClipboardCheck, Eye, RefreshCw } from "lucide-react";
import { RecordDetailed } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordDetailed: RecordDetailed | null;
  loadingDetail: boolean;
  errorDetail: string | null;
  fetchRecordDetail: (id: number, type: 'conforme' | 'noconforme') => void;
}

export const ActaDetailDialog = ({ open, onOpenChange, recordDetailed, loadingDetail, errorDetail, fetchRecordDetail }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'conforme': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'noconforme': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'conforme': return <CheckCircle className="w-4 h-4" />;
      case 'noconforme': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (errorDetail) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600" />
              Detalles del Acta
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Información completa y detallada del acta de inspección
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
            <p className="text-gray-600 mb-4 text-center">{errorDetail}</p>
            <Button
              onClick={() => recordDetailed && fetchRecordDetail(recordDetailed.id, recordDetailed.recordType)}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-600" />
            Detalles del Acta
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Información completa y detallada del acta de inspección
          </DialogDescription>
        </DialogHeader>
        {loadingDetail ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Cargando detalles del acta...</span>
          </div>
        ) : recordDetailed ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-red-50 to-red-100/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Acta #{recordDetailed.id}
                  </h2>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className={`px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${getRecordTypeColor(recordDetailed.recordType)}`}
                    >
                      {getRecordTypeIcon(recordDetailed.recordType)}
                      {recordDetailed.recordType === 'conforme' ? 'Acta Conforme' : 'Acta No Conforme'}
                    </Badge>
                    <span className="text-gray-600">Placa: <strong>{recordDetailed.vehiclePlate}</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fecha de Inspección</p>
                  <p className="text-lg font-semibold">{formatDate(recordDetailed.inspectionDateTime)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    Inspector
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.inspector.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="mt-1 text-gray-900">{recordDetailed.inspector.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">ID Inspector</Label>
                    <p className="mt-1 font-mono font-semibold text-red-700">{recordDetailed.inspector.id}</p>
                  </div>
                </CardContent>
              </Card>

              {recordDetailed.driver && (
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-red-600" />
                      Conductor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.driver.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">DNI</Label>
                      <p className="mt-1 font-mono text-gray-900">{recordDetailed.driver.dni}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                      <p className="mt-1 text-gray-900">{recordDetailed.driver.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Licencia</Label>
                      <p className="mt-1 text-gray-900">{recordDetailed.driver.licenseNumber} - {recordDetailed.driver.category}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {recordDetailed.vehicle && (
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Car className="w-5 h-5 text-red-600" />
                      Vehículo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Placa</Label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.vehicle.plateNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Marca y Modelo</Label>
                      <p className="mt-1 text-gray-900">{recordDetailed.vehicle.brand} {recordDetailed.vehicle.model}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Año</Label>
                      <p className="mt-1 text-gray-900">{recordDetailed.vehicle.year}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {recordDetailed.company && (
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-red-600" />
                      Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{recordDetailed.company.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">RUC</Label>
                      <p className="mt-1 font-mono text-gray-900">{recordDetailed.company.ruc}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                      <p className="mt-1 text-gray-900">{recordDetailed.company.address}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {recordDetailed.checklist && (
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-red-600" />
                    Lista de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries({
                      'Cinturón de Seguridad': recordDetailed.checklist.seatbelt,
                      'Limpieza': recordDetailed.checklist.cleanliness,
                      'Neumáticos': recordDetailed.checklist.tires,
                      'Botiquín': recordDetailed.checklist.firstAidKit,
                      'Extintor': recordDetailed.checklist.fireExtinguisher,
                      'Luces': recordDetailed.checklist.lights
                    }).map(([item, status]) => (
                      <div key={item} className="flex items-center gap-2">
                        {status ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-medium ${status ? 'text-emerald-700' : 'text-red-700'}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recordDetailed.violations && recordDetailed.violations.length > 0 && (
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Infracciones Detectadas ({recordDetailed.violations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recordDetailed.violations.map((violation, index) => (
                      <div key={violation.id} className="p-4 border border-red-200 rounded-lg bg-red-50/50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-red-900">
                            {violation.code} - {violation.description}
                          </h4>
                          <Badge variant="outline" className="text-red-700">
                            {violation.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          UIT: {violation.uitPercentage}%
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900">{recordDetailed.location}</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" />
                    Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900">{recordDetailed.observations || 'Sin observaciones'}</p>
                </CardContent>
              </Card>
            </div>

            {recordDetailed.photos && recordDetailed.photos.length > 0 && (
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-red-600" />
                    Fotos de la Inspección ({recordDetailed.photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recordDetailed.photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={`Foto ${photo.id}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(photo.url, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        {photo.captureDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(photo.captureDate)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};