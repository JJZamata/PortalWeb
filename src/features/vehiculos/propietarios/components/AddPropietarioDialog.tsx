import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from '@tanstack/react-query';
import { propietariosService } from '../services/propietariosService';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Image } from 'lucide-react';

const formSchema = z.object({
  dni: z.string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos")
    .regex(/^\d{8}$/, "El DNI solo debe contener números"),
  firstName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres"),
  lastName: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido debe tener máximo 50 caracteres"),
  phoneNumber: z.string()
    .min(9, "El teléfono debe tener 9 dígitos")
    .max(9, "El teléfono debe tener 9 dígitos")
    .regex(/^\d{9}$/, "El teléfono solo debe contener 9 números"),
  email: z.string()
    .email("Email inválido")
    .optional()
    .or(z.literal('')),
  photoUrl: z.string()
    .url("URL inválida")
    .optional()
    .or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddPropietarioDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      photoUrl: '',
    }
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => propietariosService.addPropietario(data),
    onSuccess: () => {
      toast({
        title: "Propietario registrado",
        description: "El propietario fue registrado correctamente.",
      });
      form.reset();
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      const apiMessage = error?.message || error?.response?.data?.message;
      const firstDetail = Array.isArray(error?.response?.data?.errors) 
        ? error.response.data.errors[0]?.message 
        : null;
      toast({
        title: "Error al registrar propietario",
        description: firstDetail || apiMessage || 'Error desconocido',
        variant: "destructive"
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">Registrar Propietario</DialogTitle>
          <DialogDescription className="text-gray-600">Ingresa los datos del nuevo propietario de vehículos</DialogDescription>
        </DialogHeader>

        <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold text-blue-900 mb-2">Información importante:</p>
          <ul className="list-disc pl-5 space-y-1 text-blue-800">
            <li>El DNI debe ser único en el sistema</li>
            <li>El propietario podrá tener múltiples vehículos asociados</li>
            <li>El email y la foto son opcionales</li>
          </ul>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      DNI *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="12345678"
                        maxLength={8}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Teléfono *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="987654321"
                        maxLength={9}
                        className="bg-white"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Debe tener exactamente 9 dígitos.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Nombres *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Juan Carlos"
                        maxLength={50}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Apellidos *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Pérez García"
                        maxLength={50}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="propietario@ejemplo.com"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    URL de Foto (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {mutation.isPending ? 'Registrando...' : 'Registrar Propietario'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
