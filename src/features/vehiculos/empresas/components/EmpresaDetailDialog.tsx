import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, FileText, MapPin, Car, Calendar, Clock, XCircle, RefreshCw } from "lucide-react";
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
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
      case 'SUSPENDIDO': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
      case 'BAJA PROV.': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar detalles</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
            <Button variant="outline" onClick={() => empresa?.ruc && onOpenChange(true)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando detalles...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Detalles de la Empresa
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">Información completa y detallada de la empresa</DialogDescription>
        </DialogHeader>
        <div className="space-y-8">
          {/* Header Principal */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/30 dark:from-purple-950/50 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800/30">
            <div className="w-20 h-20 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700">
              <Building2 className="w-12 h-12 text-purple-700 dark:text-purple-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{empresa.name || 'No registrado'}</h2>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="font-mono font-semibold text-purple-700 dark:text-purple-300">RUC: {empresa.ruc || 'No registrado'}</span>
                </div>
                {empresa.phone && <div className="flex items-center gap-1"><span className="font-mono">Tel: {empresa.phone}</span></div>}
                {empresa.email && <div className="flex items-center gap-1"><span className="font-mono">Email: {empresa.email}</span></div>}
              </div>
            </div>
          </div>
          {/* Grid de Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-b border-purple-200 dark:border-purple-800/30">
                <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Información Registral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">RUC</label><p className="mt-1 text-lg font-mono font-semibold text-purple-700 dark:text-purple-300">{empresa.ruc || 'No registrado'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Razón Social</label><p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{empresa.name || 'No registrado'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label><p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{empresa.address || 'No registrada'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Representante Legal</label><p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{empresa.legalRepresentative || 'No registrado'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado RUC</label><Badge variant="secondary" className={`${getEstadoBadge(empresa.rucStatus)} font-semibold rounded-full px-3 py-1 text-base border`}>{empresa.rucStatus || 'No registrado'}</Badge></div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-b border-purple-200 dark:border-purple-800/30">
                <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label><p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{empresa.phone || 'No registrado'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{empresa.email || 'No registrado'}</p></div>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-sm border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-600" />
                Vehículos Asociados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {empresa.vehicles && empresa.vehicles.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-purple-900">Placa</TableHead>
                        <TableHead className="font-bold text-purple-900">Estado</TableHead>
                        <TableHead className="font-bold text-purple-900">Marca</TableHead>
                        <TableHead className="font-bold text-purple-900">Modelo</TableHead>
                        <TableHead className="font-bold text-purple-900">Año</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {empresa.vehicles.map((veh: any) => (
                        <TableRow key={veh.plateNumber}>
                          <TableCell>{veh.plateNumber}</TableCell>
                          <TableCell>{veh.vehicleStatus}</TableCell>
                          <TableCell>{veh.brand}</TableCell>
                          <TableCell>{veh.model}</TableCell>
                          <TableCell>{veh.manufacturingYear}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : <p className="text-gray-500 italic">No hay vehículos asociados.</p>}
            </CardContent>
          </Card>
          <Card className="shadow-sm border border-border md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Información de Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Clock className="w-4 h-4" />Fecha de Registro</label><p className="mt-1 text-lg font-semibold text-foreground">{empresa.registrationDate ? new Date(empresa.registrationDate).toLocaleDateString('es-ES') : 'No registrada'}</p></div>
                <div><label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Clock className="w-4 h-4" />Fecha de Vencimiento</label><p className="mt-1 text-lg font-semibold text-foreground">{empresa.expirationDate ? new Date(empresa.expirationDate).toLocaleDateString('es-ES') : 'No registrada'}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};