import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import React from "react";
import { Violation } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedViolation: Violation | null;
  loadingDetail: boolean;
  errorDetail: string | null;
}

export const InfraccionDetailDialog = React.memo(({ open, onOpenChange, selectedViolation, loadingDetail, errorDetail }: Props) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800';
      case 'very_serious':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const getTargetBadge = (target: string) => {
    switch (target) {
      case 'driver-owner':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
      case 'company':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const translateSeverity = (severity: string) => {
    const map = { minor: 'Leve', serious: 'Grave', very_serious: 'Muy Grave' };
    return map[severity] || 'Desconocida';
  };

  const translateTarget = (target: string) => {
    const map = { 'driver-owner': 'Conductor/Propietario', company: 'Empresa' };
    return map[target] || 'Desconocido';
  };

  if (errorDetail) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
              Error al Cargar Infracción
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              No se pudo obtener la información detallada de la infracción
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error de Carga</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{errorDetail}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loadingDetail || !selectedViolation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#74140B] dark:text-red-400">
              Cargando Detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Obteniendo información detallada de la infracción seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin text-[#74140B] dark:text-red-400" />
              </div>
              <div className="absolute inset-0 border-4 border-red-200 dark:border-red-800 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-2 border-red-300 dark:border-red-700 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center space-x-1 mb-4">
              <div className="w-2 h-2 bg-[#74140B] dark:bg-red-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#74140B] dark:bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#74140B] dark:bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cargando información</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Procesando detalles de la infracción...
            </p>
            
            {/* Skeleton loading para preview */}
            <div className="w-full mt-6 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#74140B] dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Infracción {selectedViolation.identificacion.codigo}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Detalles completos de la infracción seleccionada
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header principal */}
          <div className="flex items-center gap-4 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/40 dark:border-red-800/30">
            <div className="w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/40 rounded-2xl">
              <AlertTriangle className="w-10 h-10 text-[#74140B] dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#74140B] dark:text-red-400 mb-1">{selectedViolation.identificacion.codigo}</h2>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{selectedViolation.descripcion.texto}</p>
            </div>
          </div>

          {/* Información detallada en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gravedad */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#74140B] dark:text-red-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gravedad</span>
                </div>
                <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getSeverityBadge(selectedViolation.clasificacion.gravedad)}`}>
                  {translateSeverity(selectedViolation.clasificacion.gravedad)}
                </Badge>
              </CardContent>
            </Card>

            {/* Medida Administrativa */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Medida Administrativa</span>
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-white">{selectedViolation.sancion.medidaAdministrativa}</span>
              </CardContent>
            </Card>

            {/* Objetivo */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Objetivo</span>
                </div>
                <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getTargetBadge(selectedViolation.clasificacion.objetivo)}`}>
                  {translateTarget(selectedViolation.clasificacion.objetivo)}
                </Badge>
              </CardContent>
            </Card>

            {/* UIT % */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">UIT %</span>
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-white">{selectedViolation.sancion.porcentajeUIT}</span>
              </CardContent>
            </Card>
          </div>

          {/* Fechas si existen */}
          {selectedViolation.fechas && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de creación */}
              {selectedViolation.fechas.creacion && (
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fecha de Creación</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedViolation.fechas.creacion).toLocaleString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </CardContent>
                </Card>
              )}

              {/* Fecha de actualización */}
              {selectedViolation.fechas.actualizacion && (
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Última Actualización</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedViolation.fechas.actualizacion).toLocaleString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

InfraccionDetailDialog.displayName = "InfraccionDetailDialog";