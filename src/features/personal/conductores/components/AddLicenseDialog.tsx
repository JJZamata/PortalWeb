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
  const today = new Date().toISOString().split('T')[0];
  const form = useForm({
    defaultValues: { licenseNumber: '', category: '', issueDate: '', expirationDate: '', issuingEntity: '', restrictions: '' },
  });

  const issueDateValue = form.watch('issueDate');

  const mutation = useMutation({
    mutationFn: (data: any) => licensesService.addLicense({ ...data, driverDni: conductorDni }),
    onSuccess: () => {
      toast({ title: "Licencia agregada", description: "La licencia fue registrada correctamente.", variant: "success" });
      form.reset();
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message;
      const firstDetail = Array.isArray(error?.response?.data?.errors) ? error.response.data.errors[0]?.message : null;
      toast({
        title: "Error al agregar licencia",
        description: firstDetail || apiMessage || 'Error desconocido',
        variant: "destructive"
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Agregar Licencia</DialogTitle>
          <DialogDescription className="text-gray-600">Ingresa los datos de la nueva licencia para este conductor</DialogDescription>
        </DialogHeader>
        <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold text-blue-900 mb-2">Información importante:</p>
          <ul className="list-disc pl-5 space-y-1 text-blue-800">
            <li>Si no hay restricciones, escribe "SIN RESTRICCIONES".</li>
            <li>La categoría usa letra I (ej. B-IIa), no el número 1.</li>
          </ul>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="pt-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField name="licenseNumber" control={form.control} rules={{
                required: "El número de licencia es obligatorio",
                maxLength: { value: 15, message: "Máximo 15 caracteres" },
                pattern: { value: /^[A-Za-z0-9-]+$/, message: "Solo letras, números y guiones" }
              }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Licencia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="text"
                      maxLength={15}
                      autoComplete="off"
                      placeholder="Ej: K87654321"
                      className="bg-white"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Máximo 15 caracteres.</p>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="category" control={form.control} rules={{
                required: "La categoría es obligatoria",
                maxLength: { value: 10, message: "Máximo 10 caracteres" }
              }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={10}
                      autoComplete="off"
                      placeholder="Ej: B-IIa"
                      className="bg-white"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Usa letra I, no número 1.</p>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField name="issueDate" control={form.control} rules={{ required: "La fecha de emisión es obligatoria" }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Emisión</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      max={today}
                      className="bg-white"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">No puede ser futura.</p>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField
                name="expirationDate"
                control={form.control}
                rules={{
                  required: "La fecha de vencimiento es obligatoria",
                  validate: (value) => {
                    if (!value) return "La fecha de vencimiento es obligatoria";
                    if (issueDateValue && value < issueDateValue) {
                      return "Debe ser igual o posterior a la emisión";
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Vencimiento</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      min={issueDateValue || today}
                      className="bg-white"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Igual o posterior a emisión.</p>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField name="issuingEntity" control={form.control} rules={{ required: "La entidad emisora es obligatoria" }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidad Emisora</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={50}
                      autoComplete="organization"
                      placeholder="Ej: MTC, SUTRAN"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="restrictions" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricciones</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={100}
                      placeholder="Ej: LENTES CORRECTIVOS"
                      className="bg-white"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">O escribe SIN RESTRICCIONES.</p>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Agregando...' : 'Agregar Licencia'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};