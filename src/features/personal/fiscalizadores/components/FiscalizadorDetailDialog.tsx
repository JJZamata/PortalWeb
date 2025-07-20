import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Activity, Smartphone, Calendar, Clock, XCircle, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FiscalizadorDetallado } from "../types";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fiscalizador: FiscalizadorDetallado | null;
  loading: boolean;
  error: string | null;
}

const FiscalizadorDetailDialog = React.memo(({ open, onOpenChange, fiscalizador, loading, error }: Props) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="w-12 h-12 text-orange-500 dark:text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar detalles</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/30">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !fiscalizador) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-600 dark:text-orange-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando detalles del fiscalizador...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Detalles del Fiscalizador
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Información completa y detallada del fiscalizador
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Principal con Usuario y Estado */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-orange-200 dark:border-orange-700 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700">
                  <AvatarFallback className="text-xl font-bold text-white bg-gradient-to-br from-orange-500 to-orange-600">
                    {(fiscalizador.username || 'F').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {fiscalizador.username || 'Sin nombre'}
                    </span>
                    <Badge 
                      variant={fiscalizador.isActive ? 'default' : 'secondary'} 
                      className={`text-sm px-3 py-1 font-semibold ${
                        fiscalizador.isActive 
                          ? "bg-emerald-500 text-white" 
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {fiscalizador.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {fiscalizador.email || 'No registrado'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">ID de Usuario</p>
                <p className="font-mono text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {fiscalizador.id}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del Usuario */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">ID</Label>
                  <p className="text-lg font-mono font-bold text-orange-700 dark:text-orange-300">
                    {fiscalizador.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuario</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {fiscalizador.username || 'No registrado'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</Label>
                  <p className="text-sm text-gray-900 dark:text-white break-all">
                    {fiscalizador.email || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roles</Label>
                  <div className="flex flex-wrap gap-1">
                    {fiscalizador.roles.map((role) => (
                      <Badge key={role.id} variant="outline" className="text-orange-700 border-orange-300 bg-orange-50 dark:text-orange-400 dark:border-orange-700 dark:bg-orange-950/30 text-xs">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Sesión */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Actividad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Último Acceso</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {fiscalizador.lastLogin ? formatDate(fiscalizador.lastLogin) : 'Nunca ha accedido'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">IP del Último Acceso</Label>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {fiscalizador.lastLoginIp || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dispositivo</Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {fiscalizador.lastLoginDevice || 'No disponible'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Configuración del Dispositivo */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estado</Label>
                  <Badge 
                    variant={fiscalizador.deviceConfigured ? 'default' : 'secondary'}
                    className={`text-xs ${
                      fiscalizador.deviceConfigured 
                        ? "bg-emerald-500 text-white" 
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {fiscalizador.deviceConfigured ? "✓ Configurado" : "⚠ Pendiente"}
                  </Badge>
                </div>
                {fiscalizador.deviceInfo?.detalles && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">ID Dispositivo</Label>
                      <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                        {fiscalizador.deviceInfo.detalles.deviceId}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombre</Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {fiscalizador.deviceInfo.detalles.deviceName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Plataforma</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{fiscalizador.deviceInfo.detalles.platform}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Versión</Label>
                        <p className="text-sm text-gray-900 dark:text-white">{fiscalizador.deviceInfo.detalles.version}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información de Fechas */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Información de Registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Fecha de Creación
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(fiscalizador.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Última Actualización
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(fiscalizador.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

FiscalizadorDetailDialog.displayName = "FiscalizadorDetailDialog";

export default FiscalizadorDetailDialog;