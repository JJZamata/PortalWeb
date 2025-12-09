import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, Shield, User, Info, Eye, EyeOff, X } from "lucide-react";
import { useState, memo } from "react";
import { Usuario, ChangePasswordFormData } from "../types";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "La contraseña debe tener entre 6 y 100 caracteres")
      .max(100, "La contraseña debe tener entre 6 y 100 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
      .regex(/\d/, "La contraseña debe contener al menos un número")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "La contraseña debe contener al menos un carácter especial"),
    confirmPassword: z.string().min(1, "La confirmación de la contraseña es obligatoria"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  loading: boolean;
  onUpdate: (id: number, newPassword: string) => void;
}

export const ChangePasswordDialog = memo(({ open, onOpenChange, usuario, loading, onUpdate }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: ChangePasswordFormData) => {
    if (!usuario) return;

    try {
      await onUpdate(usuario.id, values.newPassword);
      form.reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
      onOpenChange(false);
    } catch (error) {
      // Error manejado por el componente padre
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800';
      case 'web_admin':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
      case 'fiscalizador':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'web_operator':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'admin': 'Administrador',
      'web_admin': 'Admin Web',
      'fiscalizador': 'Fiscalizador',
      'web_operator': 'Operador Web'
    };
    return roleNames[role as keyof typeof roleNames] || 'Sin Rol';
  };

  const renderRoles = (rolesString: string) => {
    if (!rolesString) return <span className="text-gray-500">Sin roles</span>;

    const roles = rolesString.split(',').map(role => role.trim()).filter(role => role);

    if (roles.length === 0) return <span className="text-gray-500">Sin roles</span>;

    if (roles.length === 1) {
      const role = roles[0];
      return (
        <div className={`border font-semibold rounded-full px-3 py-1 ${getRoleBadge(role)}`}>
          {getRoleDisplayName(role)}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <div
            key={index}
            className={`border font-semibold rounded-full px-2 py-1 text-xs ${getRoleBadge(role)}`}
          >
            {getRoleDisplayName(role)}
          </div>
        ))}
      </div>
    );
  };

  if (!usuario) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border-0 rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-orange-600 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent flex items-center gap-2">
            <Key className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Establezca una nueva contraseña para el usuario. La acción requiere confirmación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del usuario */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Información del Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ID:</span>
                    <span className="ml-2 font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                      #{usuario.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                      {usuario.usuario}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Roles:</span>
                    <div className="ml-2 mt-1">
                      {renderRoles(usuario.rol)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100 break-all">
                      {usuario.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.estado === 'Activo'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800'
                    }`}>
                      {usuario.estado}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerta informativa */}
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-300">
              <strong>Requisitos de contraseña:</strong> La contraseña debe tener entre 6 y 100 caracteres,
              e incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial.
              El usuario deberá usar esta nueva contraseña en su próximo inicio de sesión.
            </AlertDescription>
          </Alert>

          {/* Formulario de cambio de contraseña */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Key className="w-4 h-4" />
                        Nueva Contraseña
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingrese la nueva contraseña"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 pr-10 focus:border-orange-500 focus:ring-orange-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
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
                        <Shield className="w-4 h-4" />
                        Confirmar Contraseña
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme la nueva contraseña"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 pr-10 focus:border-orange-500 focus:ring-orange-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white border-0"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Cambiar Contraseña
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ChangePasswordDialog.displayName = "ChangePasswordDialog";