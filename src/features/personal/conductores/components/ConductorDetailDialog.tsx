import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Calendar, Clock, Users, MapPin, IdCard, Image, Plus, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ConductorDetalladoNuevo } from "../types";
import { Licencia } from "../types";
import { LicenciasSummary } from "../types";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductor: ConductorDetalladoNuevo | null;
  licencias: Licencia[];
  licenciasSummary: LicenciasSummary | null;
  loading: boolean;
  error: string | null;
  onAddLicense: () => void;
}

export const ConductorDetailDialog = React.memo(({ open, onOpenChange, conductor, licencias, licenciasSummary, loading, error, onAddLicense }: Props) => {
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
      year: 'numeric'
    });
  };

  const summaryData = (licenciasSummary ?? {}) as Record<string, any>;
  const totalLicencias = Number(summaryData.total ?? summaryData.totalLicencias ?? summaryData.cantidadTotal ?? licencias.length ?? 0);
  const vigentesLicencias = Number(summaryData.vigentes ?? summaryData.totalVigentes ?? 0);
  const porVencerLicencias = Number(summaryData.porVencer ?? summaryData.por_vencer ?? summaryData.totalPorVencer ?? 0);
  const vencidasLicencias = Number(summaryData.vencidas ?? summaryData.totalVencidas ?? 0);

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error de Carga</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button onClick={() => conductor && onOpenChange(true)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !conductor) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cargando Datos</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Obteniendo información del conductor...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900">
        {/* Header Profesional */}
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {conductor.nombreCompleto}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  DNI: {conductor.dni} - Información detallada del conductor
                </DialogDescription>
              </div>
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
                    <IdCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">DNI</Label>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                    {conductor.dni}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">TELÉFONO</Label>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {conductor.phoneNumber || 'No registrado'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">LICENCIAS</Label>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {licencias?.length || 0} registradas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Grid Principal de Información */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Datos Personales */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Datos Personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Nombre Completo
                    </Label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {conductor.nombreCompleto}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Nombres
                      </Label>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {conductor.firstName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Apellidos
                      </Label>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {conductor.lastName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      DNI
                    </Label>
                    <p className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 mt-1">
                      {conductor.dni}
                    </p>
                  </div>
                  {conductor.photoUrl && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Foto de Perfil
                      </Label>
                      <div className="mt-2">
                        <Avatar className="w-16 h-16 border-2 border-gray-200 dark:border-gray-700">
                          <AvatarImage src={conductor.photoUrl} alt={conductor.nombreCompleto} />
                          <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                            {conductor.firstName.charAt(0)}{conductor.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Información de Contacto */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Teléfono
                    </Label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {conductor.phoneNumber || (
                        <span className="text-gray-500 dark:text-gray-400 italic font-normal text-sm">
                          No registrado
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Dirección
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 leading-relaxed">
                      {conductor.address || (
                        <span className="text-gray-500 dark:text-gray-400 italic">
                          No registrada
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Fechas de Registro */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Fechas de Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Fecha de Registro
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(conductor.fechaRegistro)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Última Actualización
                    </Label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(conductor.ultimaActualizacion)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sección de Licencias */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Licencias de Conducir
                  </CardTitle>
                  <Button 
                    onClick={onAddLicense}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Licencia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(licenciasSummary || licencias.length > 0) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700">
                        {totalLicencias}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Vigentes</span>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {vigentesLicencias}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Por Vencer</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {porVencerLicencias}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Vencidas</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        {vencidasLicencias}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {licencias.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Sin licencias registradas</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Este conductor no tiene licencias de conducir registradas.</p>
                    <Button 
                      onClick={onAddLicense}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Licencia
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <Table>
                      <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                          <TableHead className="font-bold text-gray-900 dark:text-white py-3">Número</TableHead>
                          <TableHead className="font-bold text-gray-900 dark:text-white py-3">Categoría</TableHead>
                          <TableHead className="font-bold text-gray-900 dark:text-white py-3">Entidad</TableHead>
                          <TableHead className="font-bold text-gray-900 dark:text-white py-3">Estado</TableHead>
                          <TableHead className="font-bold text-gray-900 dark:text-white py-3">Vencimiento</TableHead>
                          <TableHead className="font-bold text-gray-900 dark:text-white py-3">Restricciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {licencias.map((lic) => (
                          <TableRow key={lic.licenseId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                            <TableCell className="font-mono font-semibold text-gray-900 dark:text-white py-3">{lic.licenseNumber}</TableCell>
                            <TableCell className="py-3">
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-0">
                                {lic.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300 py-3">{lic.issuingEntity}</TableCell>
                            <TableCell className="py-3">
                              <Badge className={
                                lic.estado === 'vigente' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700 border' :
                                lic.estado === 'por vencer' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700 border' :
                                'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 border'
                              }>
                                {lic.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300 py-3">
                              {formatDateShort(lic.expirationDate)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300 py-3">
                              {lic.restrictions || <span className="text-gray-400 italic">Ninguna</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});