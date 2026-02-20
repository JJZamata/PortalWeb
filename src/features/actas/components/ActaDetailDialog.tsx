import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertTriangle, MapPin, FileText, Camera, Shield, User, Car, Building2, ClipboardCheck, Eye, RefreshCw, Calendar, Hash, Phone, Mail, IdCard, Download, Printer, Archive } from "lucide-react";
import { RecordDetailed } from "../types";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordDetailed: RecordDetailed | null;
  loadingDetail: boolean;
  errorDetail: string | null;
  fetchRecordDetail: (id: number, type: 'conforme' | 'noconforme') => void;
}

export const ActaDetailDialog = React.memo(({ open, onOpenChange, recordDetailed, loadingDetail, errorDetail, fetchRecordDetail }: Props) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTypeConfig = (type: string) => {
    switch (type) {
      case 'conforme': 
        return { 
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700',
          label: 'CONFORME',
          icon: CheckCircle,
          status: 'Aprobado'
        };
      case 'noconforme': 
        return { 
          badge: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
          label: 'NO CONFORME',
          icon: AlertTriangle,
          status: 'Observado'
        };
      default: 
        return { 
          badge: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600',
          label: 'PENDIENTE',
          icon: FileText,
          status: 'En Proceso'
        };
    }
  };

  if (errorDetail) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="sr-only">Error al cargar acta</DialogTitle>
            <DialogDescription className="sr-only">No se pudo cargar la información del acta de inspección</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error de Carga</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{errorDetail}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button onClick={() => recordDetailed && fetchRecordDetail(recordDetailed.id, recordDetailed.recordType)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loadingDetail || !recordDetailed) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="sr-only">Cargando acta</DialogTitle>
            <DialogDescription className="sr-only">Obteniendo información del acta de inspección</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cargando Datos</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Obteniendo información del acta...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const typeConfig = getRecordTypeConfig(recordDetailed.recordType);
  const IconComponent = typeConfig.icon;
  const buildPdfDocument = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 14;
    const marginRight = 14;
    const usableWidth = pageWidth - marginLeft - marginRight;
    let y = 14;

    const ensureSpace = (needed = 8) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y + needed > pageHeight - 14) {
        doc.addPage();
        y = 14;
      }
    };

    const writeSectionTitle = (title: string) => {
      ensureSpace(10);
      doc.setFillColor(243, 244, 246);
      doc.rect(marginLeft, y - 4, usableWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, marginLeft + 2, y);
      y += 8;
    };

    const writeLine = (label: string, value?: string | number | null) => {
      ensureSpace(6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${label}:`, marginLeft, y);
      doc.setFont('helvetica', 'normal');
      const printable = value !== undefined && value !== null && String(value).trim() !== ''
        ? String(value)
        : 'No disponible';
      const wrapped = doc.splitTextToSize(printable, usableWidth - 35);
      doc.text(wrapped, marginLeft + 35, y);
      y += Math.max(5, wrapped.length * 4.5);
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`ACTA DE INSPECCIÓN Nº ${recordDetailed.id}`, marginLeft, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Tipo: ${typeConfig.label}   |   Estado: ${typeConfig.status}`, marginLeft, y);
    y += 8;

    writeSectionTitle('Datos principales');
    writeLine('Placa', recordDetailed.vehiclePlate);
    writeLine('Ubicación', recordDetailed.location);
    writeLine('Fecha inspección', formatDate(recordDetailed.inspectionDateTime));
    writeLine('Fecha creación', formatDate(recordDetailed.createdAt));

    writeSectionTitle('Inspector');
    writeLine('Nombre', recordDetailed.inspector?.username);
    writeLine('Email', recordDetailed.inspector?.email);
    writeLine('ID', recordDetailed.inspector?.id);

    writeSectionTitle('Conductor');
    writeLine('Nombre', recordDetailed.driver?.name);
    writeLine('DNI', recordDetailed.driver?.dni);
    writeLine('Teléfono', recordDetailed.driver?.phone);
    writeLine('Licencia', recordDetailed.driver?.licenseNumber);
    writeLine('Categoría', recordDetailed.driver?.category);

    writeSectionTitle('Vehículo');
    writeLine('Placa', recordDetailed.vehicle?.plateNumber || recordDetailed.vehiclePlate);
    writeLine('Marca', recordDetailed.vehicle?.brand);
    writeLine('Modelo', recordDetailed.vehicle?.model);
    writeLine('Año', recordDetailed.vehicle?.year);

    writeSectionTitle('Empresa');
    writeLine('Razón social', recordDetailed.company?.name);
    writeLine('RUC', recordDetailed.company?.ruc);
    writeLine('Dirección', recordDetailed.company?.address);

    writeSectionTitle('Checklist');
    if (recordDetailed.checklist) {
      const checklistItems: Array<[string, boolean]> = [
        ['Cinturón de seguridad', recordDetailed.checklist.seatbelt],
        ['Limpieza general', recordDetailed.checklist.cleanliness],
        ['Estado de neumáticos', recordDetailed.checklist.tires],
        ['Botiquín', recordDetailed.checklist.firstAidKit],
        ['Extintor', recordDetailed.checklist.fireExtinguisher],
        ['Sistema de luces', recordDetailed.checklist.lights],
      ];
      checklistItems.forEach(([label, ok]) => writeLine(label, ok ? 'OK' : 'NO'));
    } else {
      writeLine('Estado', 'No registrado');
    }

    writeSectionTitle('Infracciones');
    if (recordDetailed.violations && recordDetailed.violations.length > 0) {
      recordDetailed.violations.forEach((violation, index) => {
        writeLine(`Infracción ${index + 1}`, `${violation.code} - ${violation.description}`);
        writeLine('Severidad', violation.severity);
        writeLine('UIT %', violation.uitPercentage);
      });
    } else {
      writeLine('Detalle', 'Sin infracciones registradas');
    }

    writeSectionTitle('Observaciones y evidencias');
    writeLine('Observaciones', recordDetailed.observations || 'Sin observaciones');
    writeLine('Cantidad de fotos', recordDetailed.photos?.length || 0);

    return doc;
  };

  const handleExportPdf = async () => {
    try {
      const doc = await buildPdfDocument();
      doc.save(`acta-${recordDetailed.id}.pdf`);
    } catch (error) {
      toast({
        title: 'Error al exportar PDF',
        description: 'No se pudo generar el archivo PDF del acta.',
        variant: 'destructive',
      });
    }
  };

  const handlePrint = async () => {
    try {
      const doc = await buildPdfDocument();
      doc.autoPrint();
      const pdfBlobUrl = doc.output('bloburl');
      const printWindow = window.open(pdfBlobUrl, '_blank', 'noopener,noreferrer');

      if (!printWindow) {
        toast({
          title: 'No se pudo abrir vista de impresión',
          description: 'Verifica si el navegador bloqueó la ventana emergente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error al imprimir',
        description: 'No se pudo generar el PDF para impresión.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900">
        {/* Header Profesional */}
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Acta de Inspección Nº {recordDetailed.id}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Registro de inspección vehicular - {formatDateShort(recordDetailed.inspectionDateTime)}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`${typeConfig.badge} font-semibold px-3 py-1 border`}>
                <IconComponent className="w-4 h-4 mr-2" />
                {typeConfig.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6 pr-4">
            {/* Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Car className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">VEHÍCULO</Label>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                    {recordDetailed.vehiclePlate}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">UBICACIÓN</Label>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {recordDetailed.location}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Camera className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">EVIDENCIAS</Label>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {recordDetailed.photos?.length || 0} fotografías
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Grid Principal de Información */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inspector */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Inspector Responsable
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Nombre Completo
                    </Label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {recordDetailed.inspector.username}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Correo Electrónico
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-mono">
                      {recordDetailed.inspector.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      ID de Inspector
                    </Label>
                    <p className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 mt-1">
                      #{recordDetailed.inspector.id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Conductor */}
              {recordDetailed.driver && (
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Conductor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Nombre Completo
                      </Label>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                        {recordDetailed.driver.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          DNI
                        </Label>
                        <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                          {recordDetailed.driver.dni}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Teléfono
                        </Label>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {recordDetailed.driver.phone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Licencia de Conducir
                      </Label>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {recordDetailed.driver.licenseNumber} - Categoría {recordDetailed.driver.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vehículo */}
              {recordDetailed.vehicle && (
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      Información del Vehículo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Placa Vehicular
                      </Label>
                      <p className="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">
                        {recordDetailed.vehicle.plateNumber}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Marca
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {recordDetailed.vehicle.brand}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Modelo
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {recordDetailed.vehicle.model}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Año de Fabricación
                      </Label>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {recordDetailed.vehicle.year}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empresa */}
              {recordDetailed.company && (
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Empresa Operadora
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Razón Social
                      </Label>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                        {recordDetailed.company.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        RUC
                      </Label>
                      <p className="text-sm font-mono font-bold text-purple-700 dark:text-purple-400 mt-1">
                        {recordDetailed.company.ruc}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Dirección
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1 leading-relaxed">
                        {recordDetailed.company.address}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Lista de Verificación */}
            {recordDetailed.checklist && (
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Lista de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries({
                      'Cinturón de Seguridad': recordDetailed.checklist.seatbelt,
                      'Limpieza General': recordDetailed.checklist.cleanliness,
                      'Estado de Neumáticos': recordDetailed.checklist.tires,
                      'Botiquín Primeros Auxilios': recordDetailed.checklist.firstAidKit,
                      'Extintor': recordDetailed.checklist.fireExtinguisher,
                      'Sistema de Luces': recordDetailed.checklist.lights
                    }).map(([item, status]) => (
                      <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item}
                        </span>
                        {status ? (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            OK
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            NO
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Infracciones */}
            {recordDetailed.violations && recordDetailed.violations.length > 0 && (
              <Card className="border border-red-200 dark:border-red-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-red-900 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    Infracciones Detectadas ({recordDetailed.violations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recordDetailed.violations.map((violation) => (
                      <div key={violation.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 font-mono text-xs">
                                {violation.code}
                              </Badge>
                              <Badge variant="outline" className="text-red-700 dark:text-red-300 text-xs">
                                {violation.severity}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
                              {violation.description}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400">
                              Multa: {violation.uitPercentage}% UIT
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observaciones */}
            {recordDetailed.observations && (
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-gray-400 dark:border-gray-500">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {recordDetailed.observations}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Galería de Fotos */}
            {recordDetailed.photos && recordDetailed.photos.length > 0 && (
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      Evidencia Fotográfica ({recordDetailed.photos.length})
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {recordDetailed.photos.map((photo, index) => (
                      <div key={photo.id} className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square">
                        <img
                          src={photo.url}
                          alt={`Evidencia ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(photo.url, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información de Fechas */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  Registro de Fechas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Fecha de Inspección
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(recordDetailed.inspectionDateTime)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Fecha de Creación
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(recordDetailed.createdAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Última Actualización
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(recordDetailed.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer con Acciones */}
        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Archive className="w-4 h-4" />
              Acta #{recordDetailed.id} - {typeConfig.status}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleExportPdf}>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
