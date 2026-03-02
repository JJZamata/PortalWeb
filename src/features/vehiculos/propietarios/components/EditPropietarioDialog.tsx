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
import { useEffect } from 'react';

const formSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre debe tener máximo 50 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres").max(50, "El apellido debe tener máximo 50 caracteres"),
  phoneNumber: z.string().min(9, "El teléfono debe tener 9 dígitos").max(9, "El teléfono debe tener 9 dígitos").regex(/^\d{9}$/, "El teléfono solo debe contener 9 números"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner: any | null;
  onSuccess: () => void;
}

export const EditPropietarioDialog = ({ open, onOpenChange, owner, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      photoUrl: '',
    },
  });

  useEffect(() => {
    if (owner && open) {
      form.reset({
        firstName: String(owner?.firstName ?? owner?.nombres ?? '').trim(),
        lastName: String(owner?.lastName ?? owner?.apellidos ?? '').trim(),
        phoneNumber: String(owner?.phoneNumber ?? owner?.phone ?? owner?.telefono ?? '').trim(),
        email: String(owner?.email ?? '').trim(),
        photoUrl: String(owner?.photoUrl ?? '').trim(),
      });
    }
  }, [owner, open, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const ownerDni = String(owner?.dni ?? owner?.ownerDni ?? '').trim();
      return propietariosService.updatePropietario(ownerDni, data);
    },
    onSuccess: () => {
      toast({
        title: "Propietario actualizado",
        description: "Los datos del propietario se actualizaron correctamente.",
        variant: "success",
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      const apiMessage = error?.message || error?.response?.data?.message;
      const firstDetail = Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors[0]?.message
        : null;
      toast({
        title: "Error al actualizar propietario",
        description: firstDetail || apiMessage || 'Error desconocido',
        variant: "destructive",
      });
    },
  });

  const ownerDni = String(owner?.dni ?? owner?.ownerDni ?? '').trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold text-foreground">Editar Propietario</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Actualiza los datos del propietario con DNI {ownerDni || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                      <User className="w-4 h-4" />
                      Nombres *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Juan Carlos" maxLength={50} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
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
                    <FormLabel className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                      <User className="w-4 h-4" />
                      Apellidos *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Pérez García" maxLength={50} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                    <Phone className="w-4 h-4" />
                    Teléfono *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="987654321" maxLength={9} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                    <Mail className="w-4 h-4" />
                    Email (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="propietario@ejemplo.com" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
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
                  <FormLabel className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                    <Image className="w-4 h-4" />
                    URL de Foto (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://ejemplo.com/foto.jpg" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
