import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Smartphone, RefreshCw, User, Shield, X, CheckCircle } from "lucide-react";
import { useState, memo } from "react";
import { Usuario } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  loading: boolean;
  onReset: (id: number) => void;
}

export const ResetDeviceDialog = memo(({ open, onOpenChange, usuario, loading, onReset }: Props) => {
  const handleConfirmReset = async () => {
    if (!usuario) return;

    try {
      await onReset(usuario.id);
      onOpenChange(false);
    } catch (error) {
      // Error manejado por el componente padre
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800';
      case 'web_admin':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
      case 'fiscalizador':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'web_operator':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'admin': 'Administrador',
      'web_admin': 'Admin Web',
      'fiscalizador': 'Fiscalizador',
      'web_operator': 'Operador Web'
    };
    return roleNames[role as keyof typeof roleNames] || 'Sin Rol';
  };

  const renderRoles = (rolesString: string) => {
    if (!rolesString) return <span className="text-gray-500">Sin roles</span>;

    const roles = rolesString.split(',').map(role => role.trim()).filter(role => role);

    if (roles.length === 0) return <span className="text-gray-500">Sin roles</span>;

    if (roles.length === 1) {
      const role = roles[0];
      return (
        <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getRoleBadge(role)}`}>
          {getRoleDisplayName(role)}
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`border font-semibold rounded-full px-2 py-1 text-xs ${getRoleBadge(role)}`}
          >
            {getRoleDisplayName(role)}
          </Badge>
        ))}
      </div>
    );
  };

  const getDeviceStatusBadge = (dispositivo: string) => {
    // Si el dispositivo está configurado, mostrar badge verde
    if (dispositivo && dispositivo !== 'No disponible' && dispositivo !== 'N/A') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
    }
    // Si no está configurado, mostrar badge rojo
    return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
  };

  const getDeviceStatusText = (dispositivo: string) => {
    if (dispositivo && dispositivo !== 'No disponible' && dispositivo !== 'N/A') {
      return 'Configurado';
    }
    return 'No configurado';
  };

  const isFiscalizador = usuario?.rol?.toLowerCase().includes('fiscalizador');

  if (!usuario) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border-0 rounded-xl max-w-lg bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Resetear Dispositivo
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Esta acción eliminará la configuración del dispositivo del usuario y requerirá que vuelva a configurarlo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alerta de advertencia */}
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-300">
              <strong>Atención:</strong> Al resetear el dispositivo, el usuario deberá volver a iniciar sesión y configurar su dispositivo desde cero.
            </AlertDescription>
          </Alert>

          {/* Información del usuario */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Información del Usuario
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ID:</span>
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                    #{usuario.id}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {usuario.usuario}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                    {usuario.email}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Roles:</span>
                  <div className="flex justify-end">
                    {renderRoles(usuario.rol)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado Dispositivo:</span>
                  <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getDeviceStatusBadge(usuario.dispositivo)}`}>
                    {getDeviceStatusText(usuario.dispositivo)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dispositivo Actual:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                    {usuario.dispositivo}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información sobre el reset */}
          <Card className="shadow-sm border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ¿Qué sucede al resetear?
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Se elimina la configuración actual del dispositivo
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    El usuario deberá volver a configurar su dispositivo
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Se revoca el acceso desde el dispositivo actual
                  </p>
                </div>
                {isFiscalizador && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <strong>Importante:</strong> Como es un fiscalizador, deberá configurar su dispositivo para poder realizar tareas de fiscalización.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReset}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Reseteando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resetear Dispositivo
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ResetDeviceDialog.displayName = "ResetDeviceDialog";