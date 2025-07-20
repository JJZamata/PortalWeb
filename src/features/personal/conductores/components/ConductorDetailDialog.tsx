import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Calendar, Clock, Users, MapPin, IdCard, Image, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw } from "lucide-react";
import { ConductorDetalladoNuevo } from "../types";
import { Licencia } from "../types";
import { LicenciasSummary } from "../types";
import { Label } from "@/components/ui/label";

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

export const ConductorDetailDialog = ({ open, onOpenChange, conductor, licencias, licenciasSummary, loading, error, onAddLicense }: Props) => {
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Error al cargar información</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => conductor && onOpenChange(true)} 
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !conductor) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <RefreshCw className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cargando información</h3>
            <span className="text-gray-600 dark:text-gray-300">Obteniendo detalles del conductor...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            Perfil del Conductor
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-lg mt-2">
            Información completa y detallada del conductor registrado en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Header del conductor */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-green-100/50 to-green-200/30 dark:from-green-950/50 dark:via-green-900/30 dark:to-green-800/20 p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-700/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-300/20 dark:bg-green-600/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 shadow-2xl ring-4 ring-green-100 dark:ring-green-900/50">
                  <AvatarImage src={conductor.photoUrl} alt={conductor.nombreCompleto} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-green-600 to-green-700 text-white">
                    {conductor.firstName.charAt(0)}{conductor.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {conductor.nombreCompleto}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-sm">
                      <IdCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-mono font-bold text-green-700 dark:text-green-400 text-lg">{conductor.dni}</span>
                    </div>
                    {conductor.phoneNumber && (
                      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-sm">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{conductor.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {conductor.address && (
                  <div className="flex items-start gap-2 bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg shadow-sm max-w-lg">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{conductor.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-b border-blue-100 dark:border-blue-800/50">
                <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Datos Personales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">DNI</Label>
                  <p className="text-xl font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-2 rounded-lg">
                    {conductor.dni}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombres</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{conductor.firstName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Apellidos</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{conductor.lastName}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-b border-purple-100 dark:border-purple-800/50">
                <CardTitle className="text-xl font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teléfono</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {conductor.phoneNumber || (
                      <span className="text-gray-500 dark:text-gray-400 italic font-normal">
                        No registrado
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Dirección
                  </Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
                    {conductor.address || (
                      <span className="text-gray-500 dark:text-gray-400 italic font-normal">
                        No registrada
                      </span>
                    )}
                  </p>
                </div>
                {conductor.photoUrl && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      Foto de Perfil
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Disponible</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de Registro */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 border-b border-orange-100 dark:border-orange-800/50">
                <CardTitle className="text-xl font-bold text-orange-900 dark:text-orange-300 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Registro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Fecha de Registro
                  </Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(conductor.fechaRegistro).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(conductor.fechaRegistro).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Última Actualización
                  </Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(conductor.ultimaActualizacion).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(conductor.ultimaActualizacion).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección de Licencias */}
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 border-b border-green-100 dark:border-green-800/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-300 flex items-center gap-3">
                  <Users className="w-7 h-7" />
                  Licencias de Conducir
                </CardTitle>
                <Button 
                  onClick={onAddLicense}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Licencia
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {licenciasSummary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{licenciasSummary.total}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">{licenciasSummary.vigentes}</div>
                    <div className="text-sm text-green-600 dark:text-green-300 font-medium">Vigentes</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{licenciasSummary.porVencer}</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">Por Vencer</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">{licenciasSummary.vencidas}</div>
                    <div className="text-sm text-red-600 dark:text-red-300 font-medium">Vencidas</div>
                  </div>
                </div>
              )}
              
              {licencias.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sin licencias registradas</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Este conductor aún no tiene licencias de conducir registradas en el sistema.</p>
                  <Button 
                    onClick={onAddLicense}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Primera Licencia
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow className="border-b border-gray-200 dark:border-gray-700">
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">ID</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">Número</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">Categoría</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">Entidad</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">Estado</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">Vencimiento</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-white py-4">Restricciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {licencias.map((lic) => (
                        <TableRow key={lic.licenseId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                          <TableCell className="font-mono font-semibold text-green-600 dark:text-green-400 py-4">{lic.licenseId}</TableCell>
                          <TableCell className="font-semibold text-gray-900 dark:text-white py-4">{lic.licenseNumber}</TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                              {lic.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300 py-4">{lic.issuingEntity}</TableCell>
                          <TableCell className="py-4">
                            <Badge className={
                              lic.estado === 'vigente' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                              lic.estado === 'por vencer' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            }>
                              {lic.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                            {new Date(lic.expirationDate).toLocaleDateString('es-ES')}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300 py-4">
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
      </DialogContent>
    </Dialog>
  );
};