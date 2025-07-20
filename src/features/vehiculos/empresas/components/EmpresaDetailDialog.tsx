import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, FileText, MapPin, Car, Calendar, Clock, XCircle, RefreshCw, IdCard, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmpresaDetallada } from "../types";
import { Button } from "@/components/ui/button";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: EmpresaDetallada | null;
  loading: boolean;
  error: string | null;
}

export const EmpresaDetailDialog = ({ open, onOpenChange, empresa, loading, error }: Props) => {

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar detalles</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => empresa?.ruc && onOpenChange(true)}
              className="h-10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !empresa) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground">Cargando detalles...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-purple-700 dark:text-purple-300">
            <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Detalles de la Empresa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Principal */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Building2 className="w-8 h-8 text-purple-700 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-purple-900 dark:text-purple-200">{empresa.name || 'No registrado'}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <IdCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium">RUC:</span>
                      <span className="font-mono text-purple-700 dark:text-purple-300">{empresa.ruc || 'No registrado'}</span>
                    </div>
                    {empresa.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>Tel: {empresa.phone}</span>
                      </div>
                    )}
                    {empresa.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>Email: {empresa.email}</span>
                      </div>
                    )}
                    <Badge variant={empresa.rucStatus === 'ACTIVO' ? 'default' : empresa.rucStatus === 'SUSPENDIDO' ? 'secondary' : 'destructive'}>
                      {empresa.rucStatus || 'No registrado'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Empresarial */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Información Empresarial</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">RUC</label>
                    <p className="text-sm font-medium font-mono text-purple-700 dark:text-purple-300">{empresa.ruc || 'No registrado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Razón Social</label>
                    <p className="text-sm font-medium">{empresa.name || 'No registrado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Dirección</label>
                    <p className="text-sm">{empresa.address || 'No registrada'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Representante Legal</label>
                    <p className="text-sm">{empresa.legalRepresentative || 'No registrado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Contacto</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Teléfono</label>
                    <p className="text-sm">{empresa.phone || 'No registrado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{empresa.email || 'No registrado'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Fechas */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Fechas Importantes</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Fecha de Registro</label>
                    <p className="text-sm">{empresa.registrationDate ? new Date(empresa.registrationDate).toLocaleDateString('es-ES') : 'No registrada'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Fecha de Vencimiento</label>
                    <p className="text-sm">{empresa.expirationDate ? new Date(empresa.expirationDate).toLocaleDateString('es-ES') : 'No registrada'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehículos Asociados */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-purple-700 dark:text-purple-300">
                <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Vehículos Asociados ({empresa.vehicles?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {empresa.vehicles && empresa.vehicles.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-10">Placa</TableHead>
                        <TableHead className="h-10">Estado</TableHead>
                        <TableHead className="h-10">Marca</TableHead>
                        <TableHead className="h-10">Modelo</TableHead>
                        <TableHead className="h-10">Año</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {empresa.vehicles.map((veh: any, index: number) => (
                        <TableRow key={veh.plateNumber || index}>
                          <TableCell className="font-mono">{veh.plateNumber || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={veh.vehicleStatus === 'ACTIVO' ? 'default' : 'secondary'} className="text-xs">
                              {veh.vehicleStatus || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{veh.brand || 'N/A'}</TableCell>
                          <TableCell>{veh.model || 'N/A'}</TableCell>
                          <TableCell>{veh.manufacturingYear || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Car className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p>No hay vehículos asociados a esta empresa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};