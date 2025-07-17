import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dni: string | null;
  onConfirm: () => void;
}

export const DeleteConductorDialog = ({ open, onOpenChange, dni, onConfirm }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      toast({ title: "Conductor eliminado", description: "El conductor fue eliminado exitosamente.", variant: "success" });
    } catch (error) {
      toast({ title: "Error al eliminar conductor", description: "Error desconocido", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Eliminar Conductor</DialogTitle>
          <DialogDescription className="text-gray-600">
            ¿Estás seguro de que deseas eliminar este conductor? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};