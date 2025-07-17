import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductor: ConductorDetalladoNuevo | null;
  onSuccess: () => void;
}

export const EditConductorDialog = ({ open, onOpenChange, conductor, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { phoneNumber: '', address: '', photoUrl: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => conductoresService.updateConductor(conductor!.dni, data),
    onSuccess: () => {
      toast({ title: "Conductor actualizado", description: "Los datos fueron actualizados correctamente.", variant: "success" });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al actualizar conductor", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  const validatePhone = (phone: string) => {
    if (phone.length !== 9 || !/^\d+$/.test(phone)) return "El teléfono debe tener 9 dígitos numéricos";
    return true;
  };

  useEffect(() => {
    if (conductor) {
      form.reset({
        phoneNumber: conductor.phoneNumber || '',
        address: conductor.address || '',
        photoUrl: conductor.photoUrl || '',
      });
    }
  }, [conductor, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Editar Conductor</DialogTitle>
          <DialogDescription className="text-gray-600">Modifica los datos del conductor</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4 pt-2">
            <FormField name="phoneNumber" control={form.control} rules={{ required: "El teléfono es obligatorio", validate: validatePhone }} render={({ field }) => (
              <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} maxLength={9} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="address" control={form.control} rules={{ required: "La dirección es obligatoria" }} render={({ field }) => (
              <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="photoUrl" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Foto de Perfil (URL)</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Actualizando...' : 'Actualizar Conductor'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};