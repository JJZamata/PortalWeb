import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Empresa } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const empresaEditSchema = z.object({
  name: z.string().min(3, "Nombre requerido"),
  address: z.string().min(3, "Dirección requerida"),
  expirationDate: z.string().min(8, "Fecha requerida"),
  rucStatus: z.enum(["ACTIVO", "SUSPENDIDO", "BAJA PROV."]),
});

type EmpresaEditForm = z.infer<typeof empresaEditSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: Empresa | null;
  onSuccess: () => void;
}

export const EditEmpresaDialog = ({ open, onOpenChange, empresa, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<EmpresaEditForm>({
    resolver: zodResolver(empresaEditSchema),
    defaultValues: { name: "", address: "", expirationDate: "", rucStatus: "ACTIVO" },
  });

  const mutation = useMutation({
    mutationFn: (data: EmpresaEditForm) => empresasService.updateEmpresa(empresa?.ruc || '', data),
    onSuccess: () => {
      toast({ title: "Empresa actualizada", description: "La empresa fue actualizada exitosamente.", variant: "success" });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al actualizar", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  useEffect(() => {
    if (empresa) {
      form.reset({
        name: empresa.nombre,
        address: empresa.direccion,
        expirationDate: empresa.fecha_vencimiento?.slice(0, 10) || "",
        rucStatus: empresa.estado as any,
      });
    }
  }, [empresa, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Editar Empresa</DialogTitle>
          <DialogDescription className="text-gray-600">Modifica los datos de la empresa</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Razón Social</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="address" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="expirationDate" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Fecha Vencimiento</FormLabel><FormControl><Input {...field} type="date" className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="rucStatus" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Estado RUC</FormLabel><FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                    <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};