import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Shield, Activity, Calendar, RefreshCw, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { UsuarioDetallado } from "../types";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UsuarioDetallado | null;
  loading: boolean;
  error: string | null;
}

export const UsuarioDetailDialog = React.memo(({ open, onOpenChange, usuario, loading, error }: Props) => {
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
            <XCircle className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar detalles</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/30">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !usuario) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando detalles del usuario...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Detalles del Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Información completa y detallada del usuario: {usuario.usuario}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Principal con Usuario y Estado */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-950/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-purple-200 dark:border-purple-700 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700">
                  <AvatarFallback className="text-xl font-bold text-white bg-gradient-to-br from-purple-500 to-purple-600">
                    {(usuario.usuario || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {usuario.usuario}
                    </span>
                    <Badge 
                      variant={usuario.isActive ? 'default' : 'secondary'} 
                      className={`text-sm px-3 py-1 font-semibold ${
                        usuario.isActive 
                          ? "bg-emerald-500 text-white" 
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {usuario.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {usuario.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">ID de Usuario</p>
                <p className="font-mono text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {usuario.id}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del Usuario */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuario</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {usuario.usuario}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</Label>
                  <p className="text-sm text-gray-900 dark:text-white break-all">
                    {usuario.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Roles</Label>
                  <div className="flex flex-wrap gap-1">
                    {usuario.roles.map((role) => (
                      <Badge key={role.id} variant="outline" className="text-purple-700 border-purple-300 bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:bg-purple-950/30 text-xs">
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
                    {usuario.lastLogin ? formatDate(usuario.lastLogin) : 'Nunca ha accedido'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">IP del Último Acceso</Label>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {usuario.lastLoginIp || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dispositivo</Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {usuario.lastLoginDevice || 'No disponible'}
                  </p>
                </div>
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
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(usuario.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Última Actualización
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(usuario.updatedAt)}</p>
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

UsuarioDetailDialog.displayName = "UsuarioDetailDialog";
