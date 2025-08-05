import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, User, Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AddUserFormData } from "../types";

const formSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(20, "Máximo 20 caracteres").regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "Mínimo 6 caracteres").regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|~`])/, "Debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial"),
  confirmPassword: z.string(),
  roles: z.array(z.string()).min(1, "Debe seleccionar un rol"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (values: AddUserFormData) => void;
  submitting: boolean;
}

export const AddUsuarioDialog = ({ open, onOpenChange, onAdd, submitting }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      roles: []
    }
  });

  const handleSubmit = (values: AddUserFormData) => {
    onAdd(values);
    form.reset();
    setSelectedRole('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-md bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Agregar Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Completa la información del nuevo usuario
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField 
              name="username" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Nombre de usuario *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: admin_user" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField 
              name="email" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="usuario@ejemplo.com" type="email" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField 
              name="roles" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Rol *
                  </FormLabel>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => {
                      setSelectedRole(value);
                      field.onChange([value]);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="fiscalizador">Fiscalizador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField 
              name="password" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    Contraseña *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="Ej: Admin123@" type={showPassword ? "text" : "password"} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500 pr-10" />
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
              name="confirmPassword" 
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    Confirmar Contraseña *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="Repita la contraseña" type={showConfirmPassword ? "text" : "password"} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500 pr-10" />
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

            <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
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
                    Agregando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Usuario
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
