import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Database, User, Calendar, Monitor, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { AuditLog } from "../types";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditLog: AuditLog | null;
}

export const AuditoriaDetailDialog = React.memo(({ open, onOpenChange, auditLog }: Props) => {
  if (!auditLog) return null;

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
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
                Información completa del registro de auditoría
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      Tabla
                    </Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white font-mono mt-1">
                      {auditLog.table_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Operación
                    </Label>
                    <Badge 
                      variant="secondary" 
                      className={`${getOperationColor(auditLog.operation)} font-semibold rounded-full border mt-1`}
                    >
                      {auditLog.operation}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      ID Registro
                    </Label>
                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-white mt-1">
                      {auditLog.record_id}
                    </p>
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
                      {auditLog.username} (ID: {auditLog.user_id})
                    </p>
                  </div>
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
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Monitor className="w-3 h-3" />
                      Dirección IP
                    </Label>
                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-white mt-1">
                      {auditLog.ip_address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Valores Antiguos */}
          {auditLog.old_values && (
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" />
                  Valores Anteriores
                </Label>
                <ScrollArea className="h-32 w-full border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/20">
                  <pre className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">
                    {JSON.stringify(auditLog.old_values, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Valores Nuevos */}
          {auditLog.new_values && (
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" />
                  Valores Nuevos
                </Label>
                <ScrollArea className="h-32 w-full border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 bg-emerald-50 dark:bg-emerald-900/20">
                  <pre className="text-sm text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap">
                    {JSON.stringify(auditLog.new_values, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* User Agent */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                User Agent
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {auditLog.user_agent}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

AuditoriaDetailDialog.displayName = "AuditoriaDetailDialog";
