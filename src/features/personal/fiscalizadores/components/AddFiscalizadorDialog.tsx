import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { memo } from "react";

const formSchema = z
  .object({
    username: z.string()
      .min(3, "El nombre de usuario debe tener entre 3 y 20 caracteres")
      .max(20, "El nombre de usuario debe tener entre 3 y 20 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos"),
    email: z.string().email("Debe ser un email válido"),
    password: z.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
      .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
      .regex(/\d/, "La contraseña debe contener al menos un número")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "La contraseña debe contener al menos un carácter especial"),
    confirmPassword: z.string().min(1, "La confirmación de la contraseña es obligatoria"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (values: z.infer<typeof formSchema>) => void;
  submitting: boolean;
}

export const AddFiscalizadorDialog = memo(({ open, onOpenChange, onAdd, submitting }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onAdd(values); // Esperamos la resolución de onAdd
      form.reset(); // Reset solo si tiene éxito
      onOpenChange(false);
    } catch (error) {
      // Error manejado por el componente padre
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800">Agregar Fiscalizador</DialogTitle>
          <DialogDescription className="text-gray-600">Completa la información del nuevo fiscalizador</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: fiscal30_test" className="bg-white" />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese el email" type="email" className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Fiscal123@" type="password" className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Repita la contraseña" type="password" className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full transition-colors"
                disabled={submitting}
              >
                {submitting ? "Agregando..." : "Agregar Fiscalizador"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

AddFiscalizadorDialog.displayName = "AddFiscalizadorDialog";