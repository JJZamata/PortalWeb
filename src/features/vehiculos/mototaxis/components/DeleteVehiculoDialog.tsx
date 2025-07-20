import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plate: string | null;
  onConfirm: () => void;
  onSuccess: () => void;
}

export const DeleteVehiculoDialog = ({ open, onOpenChange, plate, onConfirm, onSuccess }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      toast({ title: "Vehículo eliminado", description: "El vehículo fue eliminado exitosamente.", variant: "success" });
      onOpenChange(false); // Cerrar dialog después
      onSuccess(); // Invalidar queries para refrescar tabla
    } catch (error: any) {
      console.error('Error eliminando vehículo:', error);
      toast({ 
        title: "Error al eliminar vehículo", 
        description: error.response?.data?.message || error.message || 'Error desconocido', 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Eliminar Vehículo</DialogTitle>
          <DialogDescription className="text-gray-600">
            ¿Estás seguro de que deseas eliminar el vehículo con placa <strong>{plate}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={submitting}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};