import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, User, Calendar, Monitor, AlertTriangle, CheckCircle2, UserCircle2, FileText, Car, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { AuditLog } from "../types";
import React from "react";
import { AuditActionIconKey, translateAuditAction } from "../utils/auditActionTranslator";
import { getActionTypeBadgeClass, getActionTypeLabel, getStatusBadgeClass, getStatusLabel } from "../utils/auditUiLabels";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditLog: AuditLog | null;
}

export const AuditoriaDetailDialog = React.memo(({ open, onOpenChange, auditLog }: Props) => {
  if (!auditLog) return null;

  const action = translateAuditAction(auditLog.method, auditLog.url, auditLog);

  const getActionIcon = (iconKey: AuditActionIconKey) => {
    switch (iconKey) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'user':
        return <UserCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'document':
        return <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'vehicle':
        return <Car className="w-4 h-4 text-gray-600 dark:text-gray-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Detalles de Auditoría
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Información completa del registro de operación
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Tipo de acción
                    </Label>
                    <Badge 
                      variant="secondary" 
                      className={`${getActionTypeBadgeClass(auditLog.method)} font-semibold rounded-full border mt-1`}
                    >
                      {getActionTypeLabel(auditLog.method)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Acción para usuario
                    </Label>
                    <div className="mt-1 flex items-center gap-2">
                      {getActionIcon(action.iconKey)}
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.title}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Resultado de la operación
                    </Label>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusBadgeClass(auditLog.statusCode)} font-semibold rounded-full border mt-1`}
                    >
                      {getStatusLabel(auditLog.statusCode)} ({auditLog.statusCode})
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Usuario
                    </Label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {auditLog.user?.username || '-'}
                    </p>
                    {auditLog.user?.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {auditLog.user.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Dirección IP
                    </Label>
                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-white mt-1">
                      {auditLog.ip}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Fecha y Hora
                  </Label>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {new Date(auditLog.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Tiempo de respuesta
                  </Label>
                  <p className="text-base font-mono font-semibold text-gray-900 dark:text-white mt-1">
                    {auditLog.durationMs} ms
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Código de seguimiento
                  </Label>
                  <p className="text-xs font-mono text-gray-900 dark:text-white mt-1 break-all">
                    {auditLog.correlation || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Agent */}
          {auditLog.userAgent && (
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                  <Monitor className="w-4 h-4" />
                  Navegador o dispositivo
                </Label>
                <ScrollArea className="h-20 w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {auditLog.userAgent}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

AuditoriaDetailDialog.displayName = "AuditoriaDetailDialog";
