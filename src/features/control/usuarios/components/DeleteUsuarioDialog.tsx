import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Trash2, User, Shield, X } from "lucide-react";
import { Usuario } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  loading: boolean;
  onConfirm: () => void;
}

export const DeleteUsuarioDialog = ({ open, onOpenChange, usuario, loading, onConfirm }: Props) => {
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

  const getStatusBadge = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
  };

  if (!usuario) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border-0 rounded-xl max-w-lg bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación de Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Esta acción no se puede deshacer. Por favor, revise la información del usuario antes de confirmar.
          </DialogDescription>
        </DialogHeader>

        {/* Alerta de advertencia */}
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-300">
            <strong>Atención:</strong> La eliminación del usuario es permanente y no se puede revertir.
          </AlertDescription>
        </Alert>

        {/* Información del usuario a eliminar */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
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
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
                <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getStatusBadge(usuario.estado)}`}>
                  {usuario.estado}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Último Acceso:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {usuario.ultimo_acceso}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

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
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Usuario
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};