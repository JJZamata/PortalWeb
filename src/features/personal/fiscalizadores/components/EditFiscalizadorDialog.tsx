import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, User, Mail, Shield, Save, Settings } from "lucide-react";
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
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-700 to-red-600 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent flex items-center gap-2">
            <Edit className="w-6 h-6 text-red-600 dark:text-red-400" />
            Editar Información del Fiscalizador
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            {initialData && (
              <div className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{initialData.username}</span>
                <span className="text-sm text-gray-500">({initialData.email})</span>
              </div>
            )}
            Modifica los datos de acceso y configuración del fiscalizador
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Información de Acceso
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Nombre de Usuario *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="fiscal30_test" 
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          Correo Electrónico *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="fiscalizador@lajoya.gob.pe" 
                            type="email" 
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-300 dark:border-gray-600 rounded"
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1 cursor-pointer">
                            <Shield className="w-4 h-4" />
                            Estado Activo
                          </FormLabel>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Cuando está marcado, el fiscalizador puede acceder al sistema
                          </p>
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};