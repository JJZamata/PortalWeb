import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, User, Mail, Lock, Shield, Eye, EyeOff, UserPlus, X } from "lucide-react";
import { useState, memo } from "react";
import { AddUserFormData } from "../types";

const formSchema = z
  .object({
    username: z.string()
      .min(3, "El nombre de usuario debe tener entre 3 y 20 caracteres")
      .max(20, "El nombre de usuario debe tener entre 3 y 20 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos"),
    email: z.string().email("Debe ser un email válido"),
    password: z.string()
      .min(6, "La contraseña debe tener entre 6 y 100 caracteres")
      .max(100, "La contraseña debe tener entre 6 y 100 caracteres"),
    confirmPassword: z.string().min(1, "La confirmación de la contraseña es obligatoria"),
    roles: z.array(z.string()).min(1, "Debe seleccionar al menos un rol"),
    isActive: z.boolean().optional(),
    platform: z.literal('web').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (values: AddUserFormData) => void;
  submitting: boolean;
}

export const AddUsuarioDialog = memo(({ open, onOpenChange, onAdd, submitting }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      roles: [],
      isActive: true,
      platform: 'web'
    }
  });

  const handleSubmit = async (values: AddUserFormData) => {
    try {
      // Preparar los datos para la API
      const submitData = {
        ...values,
        isActive: values.isActive !== undefined ? values.isActive : true,
        platform: 'web' as const
      };

      await onAdd(submitData);
      form.reset();
      setSelectedRoles([]);
      setShowPassword(false);
      setShowConfirmPassword(false);
      onOpenChange(false);
    } catch (error) {
      // Error manejado por el componente padre
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Registrar Nuevo Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete toda la información requerida para registrar un nuevo usuario en el sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
                            placeholder="admin_user" 
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
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
                            placeholder="usuario@lajoya.gob.pe" 
                            type="email" 
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Roles del Usuario *
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="role-admin"
                                checked={selectedRoles.includes('admin')}
                                onCheckedChange={(checked) => {
                                  const newRoles = checked
                                    ? [...selectedRoles, 'admin']
                                    : selectedRoles.filter(role => role !== 'admin');
                                  setSelectedRoles(newRoles);
                                  field.onChange(newRoles);
                                }}
                              />
                              <label
                                htmlFor="role-admin"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                              >
                                <Shield className="w-4 h-4 text-purple-600" />
                                Administrador
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="role-fiscalizador"
                                checked={selectedRoles.includes('fiscalizador')}
                                onCheckedChange={(checked) => {
                                  const newRoles = checked
                                    ? [...selectedRoles, 'fiscalizador']
                                    : selectedRoles.filter(role => role !== 'fiscalizador');
                                  setSelectedRoles(newRoles);
                                  field.onChange(newRoles);
                                }}
                              />
                              <label
                                htmlFor="role-fiscalizador"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                              >
                                <User className="w-4 h-4 text-blue-600" />
                                Fiscalizador
                              </label>
                            </div>
                          </div>

                          {selectedRoles.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedRoles.map((role) => (
                                <Badge
                                  key={role}
                                  variant="secondary"
                                  className={`${
                                    role === 'admin'
                                      ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800'
                                      : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800'
                                  }`}
                                >
                                  {role === 'admin' ? 'Administrador' : 'Fiscalizador'}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

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
                          <div className="relative">
                            <Input 
                              {...field} 
                              placeholder="Mínimo 8 caracteres" 
                              type={showPassword ? "text" : "password"} 
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500 pr-10" 
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              tabIndex={-1}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
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
                          <div className="relative">
                            <Input 
                              {...field} 
                              placeholder="Repita la contraseña" 
                              type={showConfirmPassword ? "text" : "password"} 
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500 pr-10" 
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              tabIndex={-1}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
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
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200"
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
                    Registrar Usuario
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

AddUsuarioDialog.displayName = "AddUsuarioDialog";
