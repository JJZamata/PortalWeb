import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedViolation: any;
  loadingDetail: boolean;
  errorDetail: string | null;
}

export const InfraccionDetailDialog = React.memo(({ open, onOpenChange, selectedViolation, loadingDetail, errorDetail }: Props) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700';
      case 'very_serious':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  const getTargetBadge = (target: string) => {
    switch (target) {
      case 'driver-owner':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
      case 'company':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  const translateSeverity = (severity: string) => {
    const map = { mild: 'Leve', serious: 'Grave', very_serious: 'Muy Grave' };
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error de Carga</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{errorDetail}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cargando Datos</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Obteniendo detalles de la infracción...</p>
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
            <div className="w-12 h-12 bg-[#812020]/10 dark:bg-[#812020]/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#812020] dark:text-[#fca5a5]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Infracción {selectedViolation.code}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Detalles completos de la infracción seleccionada
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header principal */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#812020]/10 to-[#a94442]/10 dark:from-[#2d0909] dark:to-[#3a1010] rounded-xl">
            <div className="w-16 h-16 flex items-center justify-center bg-[#812020]/10 dark:bg-[#812020]/20 rounded-2xl shadow-lg">
              <AlertTriangle className="w-10 h-10 text-[#812020] dark:text-[#fca5a5]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#812020] dark:text-[#fca5a5] mb-1">{selectedViolation.code}</h2>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{selectedViolation.description}</p>
            </div>
          </div>

          {/* Información detallada en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gravedad */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#812020] dark:text-[#fca5a5]" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gravedad</span>
                </div>
                <Badge variant="secondary" className={`border font-semibold rounded-full text-base ${getSeverityBadge(selectedViolation.severity)}`}>
                  {translateSeverity(selectedViolation.severity)}
                </Badge>
              </CardContent>
            </Card>

            {/* Medida Administrativa */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Medida Administrativa</span>
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-white">{selectedViolation.administrativeMeasure}</span>
              </CardContent>
            </Card>

            {/* Objetivo */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Objetivo</span>
                </div>
                <Badge variant="secondary" className={`border font-semibold rounded-full text-base ${getTargetBadge(selectedViolation.target)}`}>
                  {translateTarget(selectedViolation.target)}
                </Badge>
              </CardContent>
            </Card>

            {/* UIT % */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">UIT %</span>
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-white">{selectedViolation.uitPercentage}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

InfraccionDetailDialog.displayName = "InfraccionDetailDialog";