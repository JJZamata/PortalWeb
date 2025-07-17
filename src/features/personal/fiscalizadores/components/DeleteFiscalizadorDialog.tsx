// src/features/gestion/fiscalizadores/components/DeleteFiscalizadorDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  submitting: boolean;
}

export const DeleteFiscalizadorDialog = ({ open, onOpenChange, onConfirm, submitting }: Props) => {
  const handleDelete = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800">Eliminar Fiscalizador</DialogTitle>
          <DialogDescription className="text-gray-600">¿Estás seguro de eliminar este fiscalizador? Esta acción no se puede deshacer.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};