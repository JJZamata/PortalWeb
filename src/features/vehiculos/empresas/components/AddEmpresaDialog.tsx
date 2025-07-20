import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const empresaSchema = z.object({
  ruc: z.string().min(11, "El RUC debe tener 11 dígitos").max(11),
  name: z.string().min(3, "Nombre requerido"),
  address: z.string().min(3, "Dirección requerida"),
  registrationDate: z.string().min(8, "Fecha requerida"),
  expirationDate: z.string().min(8, "Fecha requerida"),
  rucStatus: z.enum(["ACTIVO", "SUSPENDIDO", "BAJA PROV."]),
});

type EmpresaForm = z.infer<typeof empresaSchema>;

interface Props {
  onSuccess: () => void;
}

export const AddEmpresaDialog = ({ onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
    defaultValues: { ruc: "", name: "", address: "", registrationDate: "", expirationDate: "", rucStatus: "ACTIVO" },
  });

  const mutation = useMutation({
    mutationFn: (data: EmpresaForm) => empresasService.addEmpresa(data),
    onSuccess: () => {
      toast({ title: "Empresa registrada", description: "La empresa fue creada exitosamente.", variant: "success" });
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al registrar", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Nueva Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Registrar Nueva Empresa</DialogTitle>
          <DialogDescription className="text-gray-600">Completa los datos para registrar una empresa</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
            <FormField name="ruc" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>RUC</FormLabel><FormControl><Input {...field} placeholder="Ej: 20123456789" className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Razón Social</FormLabel><FormControl><Input {...field} placeholder="Ej: Transportes XYZ" className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="address" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} placeholder="Ej: Av. Principal 123" className="bg-white" /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex gap-2">
              <FormField name="registrationDate" control={form.control} render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>Fecha Registro</FormLabel><FormControl><Input {...field} type="date" className="bg-white" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="expirationDate" control={form.control} render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>Fecha Vencimiento</FormLabel><FormControl><Input {...field} type="date" className="bg-white" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
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
              {mutation.isPending ? 'Registrando...' : 'Registrar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};