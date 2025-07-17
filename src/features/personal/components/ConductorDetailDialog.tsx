import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Calendar, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { XCircle, RefreshCw } from "lucide-react";
import { ConductorDetalladoNuevo, Licencia, LicenciasSummary } from "../types";

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
        <DialogContent>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            <Button variant="outline" onClick={() => conductor && onOpenChange(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !conductor) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Cargando detalles del conductor...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-green-600" />
            Detalles del Conductor
          </DialogTitle>
          <DialogDescription className="text-gray-600">Información completa y detallada del conductor</DialogDescription>
        </DialogHeader>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={conductor.photoUrl} alt={conductor.nombreCompleto} />
              <AvatarFallback className="text-2xl font-bold bg-green-600 text-white">
                {conductor.firstName.charAt(0)}{conductor.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">{conductor.nombreCompleto}</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-mono font-semibold text-green-700">{conductor.dni}</span>
                </div>
                {conductor.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{conductor.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">DNI</Label>
                  <p className="mt-1 text-lg font-mono font-semibold text-green-700">{conductor.dni}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                  <p className="mt-1 text-lg font-semibold text-foreground">{conductor.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Apellidos</Label>
                  <p className="mt-1 text-lg font-semibold text-foreground">{conductor.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                  <p className="mt-1 text-lg font-semibold text-foreground">{conductor.nombreCompleto}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {conductor.phoneNumber || <span className="text-gray-500 italic">No registrado</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {conductor.address || <span className="text-gray-500 italic">No registrada</span>}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Licencias de Conducir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenciasSummary && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    <Badge className="bg-green-100 text-green-800">Total: {licenciasSummary.total}</Badge>
                    <Badge className="bg-green-100 text-green-800">Vigentes: {licenciasSummary.vigentes}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">Por vencer: {licenciasSummary.porVencer}</Badge>
                    <Badge className="bg-red-100 text-red-800">Vencidas: {licenciasSummary.vencidas}</Badge>
                  </div>
                )}
                {licencias.length === 0 ? (
                  <div className="text-gray-500 italic">No se encontraron licencias para este conductor.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold text-green-900">ID</TableHead>
                          <TableHead className="font-bold text-green-900">Número</TableHead>
                          <TableHead className="font-bold text-green-900">Categoría</TableHead>
                          <TableHead className="font-bold text-green-900">Entidad</TableHead>
                          <TableHead className="font-bold text-green-900">Estado</TableHead>
                          <TableHead className="font-bold text-green-900">Vencimiento</TableHead>
                          <TableHead className="font-bold text-green-900">Restricciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {licencias.map((lic) => (
                          <TableRow key={lic.licenseId}>
                            <TableCell className="font-mono text-green-700">{lic.licenseId}</TableCell>
                            <TableCell>{lic.licenseNumber}</TableCell>
                            <TableCell>{lic.category}</TableCell>
                            <TableCell>{lic.issuingEntity}</TableCell>
                            <TableCell>
                              <Badge className={
                                lic.estado === 'vigente' ? 'bg-green-200 text-green-800' :
                                lic.estado === 'por vencer' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-red-200 text-red-800'
                              }>{lic.estado}</Badge>
                            </TableCell>
                            <TableCell>{new Date(lic.expirationDate).toLocaleDateString('es-ES')}</TableCell>
                            <TableCell>{lic.restrictions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Información de Registro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Fecha de Registro
                    </Label>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {new Date(conductor.fechaRegistro).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Última Actualización
                    </Label>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {new Date(conductor.ultimaActualizacion).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {conductor && (
            <div className="flex justify-end mb-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl" onClick={onAddLicense}>
                + Agregar Licencia
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};