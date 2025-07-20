import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { memo } from "react";
import { User, Mail, Lock, Shield, Plus, UserPlus } from "lucide-react";

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
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-700 to-red-600 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-red-600 dark:text-red-400" />
            Registrar Nuevo Fiscalizador
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete toda la información requerida para registrar un nuevo fiscalizador en el sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          Contraseña *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Mínimo 8 caracteres" 
                            type="password" 
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Lock className="w-4 h-4" />
                          Confirmar Contraseña *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Repita la contraseña" 
                            type="password" 
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Requisitos de la contraseña:</h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Mínimo 8 caracteres</li>
                    <li>• Al menos una letra mayúscula y una minúscula</li>
                    <li>• Al menos un número</li>
                    <li>• Al menos un carácter especial (!@#$%^&*)</li>
                  </ul>
                </div>
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
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Fiscalizador
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

AddFiscalizadorDialog.displayName = "AddFiscalizadorDialog";