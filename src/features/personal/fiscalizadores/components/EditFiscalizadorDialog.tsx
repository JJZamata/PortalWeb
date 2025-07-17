import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(20, "Máximo 20 caracteres").regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
  email: z.string().email("Debe ser un email válido"),
  isActive: z.boolean(),
});

interface EditFormData {
  username: string;
  email: string;
  isActive: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  initialData?: EditFormData;
  onSave: (values: EditFormData) => void; // Reemplazamos onAdd por onSave para consistencia
}

export const EditFiscalizadorDialog = ({ open, onOpenChange, submitting, initialData, onSave }: Props) => {
  const form = useForm<EditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", isActive: false },
  });

  // Actualizar el formulario cuando cambien los datos iniciales
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (values: EditFormData) => {
    onSave(values);
    onOpenChange(false); // Cierra el diálogo después de guardar
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Edit className="w-6 h-6 text-red-600" />
            Editar Fiscalizador
          </DialogTitle>
          <DialogDescription className="text-gray-600">Modifica la información del fiscalizador</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormLabel>Activo</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full transition-colors"
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};