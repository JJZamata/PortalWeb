import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Car, User, FileText, Calendar, Building2, Settings } from "lucide-react";
import { memo } from "react";

const formSchema = z.object({
  plateNumber: z.string()
    .min(6, "La placa debe tener al menos 6 caracteres")
    .max(8, "La placa debe tener máximo 8 caracteres")
    .regex(/^[A-Z0-9-]+$/, "La placa solo puede contener letras mayúsculas, números y guiones"),
  ownerDni: z.string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos")
    .regex(/^\d{8}$/, "El DNI solo debe contener números"),
  ownerName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener máximo 100 caracteres"),
  companyName: z.string()
    .min(2, "El nombre de la empresa debe tener al menos 2 caracteres")
    .max(100, "El nombre de la empresa debe tener máximo 100 caracteres"),
  status: z.string().min(1, "Debe seleccionar un estado"),
  registrationDate: z.string().min(1, "La fecha de registro es obligatoria"),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddVehiculoDialog = memo(({ open, onOpenChange, onSuccess }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: '',
      ownerDni: '',
      ownerName: '',
      companyName: '',
      status: '',
      registrationDate: new Date().toISOString().split('T')[0],
    }
  });

  const handleSubmit = async (values: FormData) => {
    try {
      // Aquí iría la lógica para enviar al servicio
      console.log('Nuevo vehículo:', values);
      
      // Simular éxito
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Registrar Nueva Mototaxi
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete toda la información requerida para registrar una nueva mototaxi en el sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            {/* Información del Vehículo */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Información del Vehículo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Número de Placa *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="ABC-123"
                            value={field.value.toUpperCase()}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Settings className="w-4 h-4" />
                          Estado del Vehículo *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="OPERATIVO">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Operativo</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="REPARACIÓN">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span>En Reparación</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="FUERA DE SERVICIO">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>Fuera de Servicio</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="INSPECCIÓN">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>En Inspección</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="registrationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Fecha de Registro *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Información del Propietario */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Información del Propietario
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerDni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          DNI del Propietario *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="12345678"
                            maxLength={8}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Nombre del Propietario *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Juan Pérez García"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información de la Empresa */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Información de la Empresa
                </h3>
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        Nombre de la Empresa *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Transportes La Joya S.A.C."
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Información importante:</h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• La placa debe seguir el formato estándar (ABC-123)</li>
                    <li>• El DNI debe corresponder al propietario registrado</li>
                    <li>• La empresa debe estar previamente registrada en el sistema</li>
                    <li>• Verificar que la información sea correcta antes de registrar</li>
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Mototaxi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

AddVehiculoDialog.displayName = "AddVehiculoDialog";