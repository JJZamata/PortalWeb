import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruc: string | null;
  onConfirm: () => void;
}

export const DeleteEmpresaDialog = ({ open, onOpenChange, ruc, onConfirm }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      toast({ title: "Empresa eliminada", description: "La empresa fue eliminada exitosamente.", variant: "success" });
    } catch (error) {
      toast({ title: "Error al eliminar empresa", description: "Error desconocido", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Eliminar Empresa</DialogTitle>
          <DialogDescription className="text-gray-600">¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};