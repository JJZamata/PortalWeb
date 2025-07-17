import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { licensesService } from '../services/licensesService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductorDni: string;
  onSuccess: () => void;
}

export const AddLicenseDialog = ({ open, onOpenChange, conductorDni, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { licenseNumber: '', category: '', issueDate: '', expirationDate: '', issuingEntity: '', restrictions: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => licensesService.addLicense({ ...data, driverDni: conductorDni }),
    onSuccess: () => {
      toast({ title: "Licencia agregada", description: "La licencia fue registrada correctamente.", variant: "success" });
      form.reset();
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al agregar licencia", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Agregar Licencia</DialogTitle>
          <DialogDescription className="text-gray-600">Ingresa los datos de la nueva licencia para este conductor</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4 pt-2">
            <FormField name="licenseNumber" control={form.control} rules={{ required: "El número de licencia es obligatorio" }} render={({ field }) => (
              <FormItem><FormLabel>Número de Licencia</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="category" control={form.control} rules={{ required: "La categoría es obligatoria" }} render={({ field }) => (
              <FormItem><FormLabel>Categoría</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="issueDate" control={form.control} rules={{ required: "La fecha de emisión es obligatoria" }} render={({ field }) => (
              <FormItem><FormLabel>Fecha de Emisión</FormLabel><FormControl><Input {...field} type="date" className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="expirationDate" control={form.control} rules={{ required: "La fecha de vencimiento es obligatoria" }} render={({ field }) => (
              <FormItem><FormLabel>Fecha de Vencimiento</FormLabel><FormControl><Input {...field} type="date" className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="issuingEntity" control={form.control} rules={{ required: "La entidad emisora es obligatoria" }} render={({ field }) => (
              <FormItem><FormLabel>Entidad Emisora</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="restrictions" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Restricciones</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Agregando...' : 'Agregar Licencia'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};