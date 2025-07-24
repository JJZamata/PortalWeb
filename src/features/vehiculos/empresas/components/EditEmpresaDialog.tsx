import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Building2, MapPin, Calendar, IdCard, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Empresa } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const empresaEditSchema = z.object({
  name: z.string()
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(100, "La razón social no puede exceder 100 caracteres"),
  address: z.string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  expirationDate: z.string().min(1, "La fecha de vencimiento es requerida"),
  rucStatus: z.enum(["ACTIVO", "SUSPENDIDO", "BAJA PROV."]),
});

type EmpresaEditForm = z.infer<typeof empresaEditSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: Empresa | null;
  onSuccess: () => void;
}

export const EditEmpresaDialog = ({ open, onOpenChange, empresa, onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<EmpresaEditForm>({
    resolver: zodResolver(empresaEditSchema),
    defaultValues: { name: "", address: "", expirationDate: "", rucStatus: "ACTIVO" },
  });

  const mutation = useMutation({
    mutationFn: (data: EmpresaEditForm) => empresasService.updateEmpresa(empresa?.ruc || '', data),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con empresas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresas-stats'] });
      
      toast({ title: "Empresa actualizada", description: "La empresa fue actualizada exitosamente.", variant: "success" });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al actualizar", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  useEffect(() => {
    if (empresa) {
      // Función para manejar fechas correctamente sin problemas de zona horaria
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        
        // Si la fecha ya está en formato YYYY-MM-DD, usarla directamente
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }
        
        // Si la fecha incluye tiempo, extraer solo la parte de la fecha
        if (dateString.includes('T')) {
          return dateString.split('T')[0];
        }
        
        // Para otros formatos, intentar parsear y formatear
        try {
          const date = new Date(dateString + 'T00:00:00'); // Agregar tiempo local para evitar zona horaria
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.warn('Error al parsear fecha:', dateString);
          return "";
        }
      };

      form.reset({
        name: empresa.nombre,
        address: empresa.direccion,
        expirationDate: formatDateForInput(empresa.fecha_vencimiento || ""),
        rucStatus: empresa.estado as any,
      });
    }
  }, [empresa, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-4xl bg-white dark:bg-gray-900 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Editar Empresa
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Modifique la información de la empresa. Los cambios se aplicarán inmediatamente al sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información Empresarial */}
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Información Empresarial</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Razón Social</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ingrese la razón social"
                                className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dirección</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ingrese la dirección completa"
                                className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="rucStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estado RUC</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400">
                                  <SelectValue placeholder="Seleccione el estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVO">Activo</SelectItem>
                                <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                                <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Fechas */}
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Fecha de Vencimiento</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha de Vencimiento</FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Información adicional en texto simple */}
                    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                        <IdCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">RUC:</span>
                        <span className="font-mono text-purple-700 dark:text-purple-300">{empresa?.ruc || "No disponible"}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Estado Actual:</span>
                        <span className="text-gray-600 dark:text-gray-400">{empresa?.estado || "No disponible"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                className="h-12 px-8 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};