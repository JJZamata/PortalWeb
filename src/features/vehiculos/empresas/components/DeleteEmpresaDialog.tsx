import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruc: string | null;
  onConfirm: (forceCascade?: boolean) => Promise<void> | void;
}

export const DeleteEmpresaDialog = ({ open, onOpenChange, ruc, onConfirm }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [showCascadeOption, setShowCascadeOption] = useState(false);

  const handleDelete = async (forceCascade: boolean = false) => {
    setSubmitting(true);
    try {
      await onConfirm(forceCascade);
      setShowCascadeOption(false);
    } catch (error: any) {
      const errorText = `${error?.message ?? ''} ${JSON.stringify(error ?? {})}`.toLowerCase();
      const shouldShowCascade = error?.code === 'HAS_ASSOCIATED_VEHICLES'
        || error?.status === 409
        || /veh[ií]culo|vehicle|placa|associated|asociad|vinculad|foreign key|constraint/i.test(errorText);

      if (shouldShowCascade) {
        setShowCascadeOption(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setShowCascadeOption(false);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Eliminar Empresa</DialogTitle>
          <DialogDescription className="text-base text-gray-700 dark:text-gray-200">
            ¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        {showCascadeOption && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-base font-medium leading-relaxed text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
            Esta empresa tiene vehículos asociados. Si continúas, se eliminarán las vinculaciones con todos los vehículos asociados y luego se eliminará la empresa.
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleDialogChange(false)} disabled={submitting}>Cancelar</Button>
          {showCascadeOption ? (
            <Button variant="destructive" onClick={() => handleDelete(true)} disabled={submitting}>
              {submitting ? 'Eliminando...' : 'Confirmar eliminación total'}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => handleDelete(false)} disabled={submitting}>
              {submitting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          )}
          {showCascadeOption && (
            <Button variant="secondary" onClick={() => setShowCascadeOption(false)} disabled={submitting}>
              Volver
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};