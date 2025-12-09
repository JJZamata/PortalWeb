import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Mail, Shield, User, Info, X } from "lucide-react";
import { useState, memo, useEffect } from "react";
import { Usuario, EditUserFormData } from "../types";

const formSchema = z
  .object({
    email: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
    isActive: z.boolean(),
  })
  .refine((data) => {
    // Si el email está vacío o no ha cambiado, no validar
    if (!data.email || data.email.trim() === "") {
      return true;
    }
    return data.email.length > 0;
  }, {
    message: "El email debe ser válido si se proporciona",
    path: ["email"]
  });

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  loading: boolean;
  onUpdate: (id: number, values: EditUserFormData) => void;
}

export const EditUsuarioDialog = memo(({ open, onOpenChange, usuario, loading, onUpdate }: Props) => {
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      isActive: true,
    }
  });

  // Reset form cuando el usuario cambia o el diálogo se abre
  useEffect(() => {
    if (usuario && open) {
      form.reset({
        email: usuario.email,
        isActive: usuario.estado === 'Activo',
      });
      setHasChanges(false);
    }
  }, [usuario, open, form]);

  // Detectar cambios en el formulario
  const watchedValues = form.watch();
  useEffect(() => {
    if (usuario) {
      const originalEmail = usuario.email;
      const originalIsActive = usuario.estado === 'Activo';

      // El email solo se considera modificado si tiene un valor válido y es diferente al original
      const hasEmailChanged = watchedValues.email &&
        watchedValues.email.trim() !== '' &&
        watchedValues.email !== originalEmail;

      const hasStatusChanged = watchedValues.isActive !== originalIsActive;

      setHasChanges(hasEmailChanged || hasStatusChanged);
    }
  }, [watchedValues, usuario]);

  const handleSubmit = async (values: EditUserFormData) => {
    if (!usuario) return;

    try {
      // Solo enviar campos que han cambiado
      const changedValues: Partial<EditUserFormData> = {};

      // Verificar si el email cambió y no está vacío
      const originalEmail = usuario.email;
      const originalIsActive = usuario.estado === 'Activo';

      if (values.email && values.email !== originalEmail) {
        changedValues.email = values.email;
      }

      // Verificar si el estado cambió
      if (values.isActive !== originalIsActive) {
        changedValues.isActive = values.isActive;
      }

      // Si hay cambios, enviarlos
      if (Object.keys(changedValues).length > 0) {
        await onUpdate(usuario.id, changedValues as EditUserFormData);
        onOpenChange(false);
      }
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
        <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getRoleBadge(role)}`}>
          {getRoleDisplayName(role)}
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`border font-semibold rounded-full px-2 py-1 text-xs ${getRoleBadge(role)}`}
          >
            {getRoleDisplayName(role)}
          </Badge>
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
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Actualice la información del usuario. Solo se pueden modificar el email y el estado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información actual del usuario */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Información Actual
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
                    <div className="ml-2 inline-block">
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
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Último Acceso:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                      {usuario.ultimo_acceso}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerta informativa */}
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <strong>Nota:</strong> El nombre de usuario (username) y los roles no se pueden modificar.
              Para cambiar la contraseña, use la función específica de restablecimiento de contraseña.
            </AlertDescription>
          </Alert>

          {/* Formulario de edición */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="usuario@ejemplo.com"
                          type="email"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                          Estado del Usuario
                        </FormLabel>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {field.value ? "El usuario podrá acceder al sistema" : "El usuario no podrá acceder al sistema"}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                    disabled={loading || !hasChanges}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Actualizar Usuario
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

EditUsuarioDialog.displayName = "EditUsuarioDialog";