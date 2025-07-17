import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onSuccess: () => void;
}

export const AddConductorDialog = ({ onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { dni: "", firstName: "", lastName: "", phoneNumber: "", address: "", photoUrl: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => conductoresService.addConductor(data),
    onSuccess: () => {
      toast({ title: "Conductor agregado", description: "El conductor fue registrado correctamente.", variant: "success" });
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al agregar conductor", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  const validateDNI = (dni: string) => {
    if (dni.length !== 8 || !/^\d+$/.test(dni)) return "El DNI debe tener 8 dígitos numéricos";
    return true;
  };

  const validatePhone = (phone: string) => {
    if (phone.length !== 9 || !/^\d+$/.test(phone)) return "El teléfono debe tener 9 dígitos numéricos";
    return true;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Conductor
        </Button>
      </DialogTrigger>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Agregar Conductor</DialogTitle>
          <DialogDescription className="text-gray-600">Completa la información del nuevo conductor</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4 pt-2">
            <FormField name="dni" control={form.control} rules={{ required: "El DNI es obligatorio", validate: validateDNI }} render={({ field }) => (
              <FormItem><FormLabel>DNI</FormLabel><FormControl><Input {...field} maxLength={8} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="firstName" control={form.control} rules={{ required: "El nombre es obligatorio" }} render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="lastName" control={form.control} rules={{ required: "Los apellidos son obligatorios" }} render={({ field }) => (
              <FormItem><FormLabel>Apellidos</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
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
              {mutation.isPending ? 'Agregando...' : 'Agregar Conductor'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};