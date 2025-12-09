import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteInfraccionMutation } from '../queries/useInfraccionesMutations';
import { Violation } from '../types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violation: Violation | null;
  onSuccess: () => void;
}

export const DeleteInfraccionDialog = ({ open, onOpenChange, violation, onSuccess }: Props) => {
  const deleteMutation = useDeleteInfraccionMutation();

  const handleClose = () => {
    if (!deleteMutation.isPending) {
      onOpenChange(false);
    }
  };

  const handleConfirm = async () => {
    if (!violation) return;

    try {
      await deleteMutation.mutateAsync(violation.identificacion.codigo);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      // El manejo de errores se hace en el mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Eliminar Infracción
          </DialogTitle>
          <DialogDescription>
            Esta acción es irreversible. ¿Estás seguro de que deseas eliminar esta infracción?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {violation ? (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-800">Código:</span>
                  <span className="font-mono font-bold text-red-900">{violation.identificacion.codigo}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-red-800">Descripción:</span>
                  <p className="text-sm text-red-700 mt-1">{violation.descripcion.texto}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-800">Gravedad:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    violation.clasificacion.gravedad === 'very_serious'
                      ? 'bg-red-200 text-red-800'
                      : violation.clasificacion.gravedad === 'serious'
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {violation.clasificacion.gravedadTexto}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Advertencia:</p>
                    <p>Al eliminar esta infracción, se perderá toda la información asociada y no podrá ser recuperada.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No se ha seleccionado ninguna infracción</p>
            </div>
          )}

          {/* Error de la mutación */}
          {deleteMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-red-600">
                {deleteMutation.error.message || 'Error al eliminar la infracción'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending || !violation}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Eliminar Infracción
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};