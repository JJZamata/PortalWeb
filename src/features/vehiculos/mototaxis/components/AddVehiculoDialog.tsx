import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Car, User, FileText, Calendar, Building2, Settings, UserPlus } from "lucide-react";
import { memo, useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';
import { propietariosService } from '../../propietarios/services/propietariosService';
import { AddPropietarioDialog } from '../../propietarios/components/AddPropietarioDialog';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  plateNumber: z.string()
    .min(6, "La placa debe tener al menos 6 caracteres")
    .max(10, "La placa debe tener máximo 10 caracteres")
    .regex(/^[A-Z0-9-]+$/, "La placa solo puede contener letras mayúsculas, números y guiones"),
  companyRuc: z.string()
    .min(11, "El RUC debe tener 11 dígitos")
    .max(11, "El RUC debe tener 11 dígitos")
    .regex(/^\d{11}$/, "El RUC solo debe contener números"),
  ownerDni: z.string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos")
    .regex(/^\d{8}$/, "El DNI solo debe contener números"),
  typeId: z.number().min(1, "Debe seleccionar un tipo de vehículo"),
  vehicleStatus: z.string().min(1, "Debe seleccionar un estado"),
  brand: z.string()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(50, "La marca debe tener máximo 50 caracteres"),
  model: z.string()
    .min(2, "El modelo debe tener al menos 2 caracteres")
    .max(50, "El modelo debe tener máximo 50 caracteres"),
  manufacturingYear: z.number()
    .min(1990, "El año debe ser mayor a 1990")
    .max(new Date().getFullYear() + 1, "El año no puede ser futuro"),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddVehiculoDialog = memo(({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPropietarioDialog, setShowPropietarioDialog] = useState(false);
  const [propietarioName, setPropietarioName] = useState('');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: '',
      companyRuc: '',
      ownerDni: '',
      typeId: 1,
      vehicleStatus: '',
      brand: '',
      model: '',
      manufacturingYear: new Date().getFullYear(),
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Validar que el propietario existe
      try {
        const propietario = await propietariosService.getPropietarioDetail(data.ownerDni);
        setPropietarioName(propietario?.firstName && propietario?.lastName 
          ? `${propietario.firstName} ${propietario.lastName}`
          : 'Propietario encontrado');
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || `Propietario con DNI ${data.ownerDni} no encontrado`;
        throw new Error(errorMsg);
      }
      // Si el propietario existe, proceder a crear el vehículo
      return vehiculosService.addVehiculo(data);
    },
    onSuccess: () => {
      toast({
        title: "Vehículo agregado",
        description: "El vehículo fue registrado correctamente.",
        variant: "default"
      });
      form.reset();
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message;
      const firstDetail = Array.isArray(error?.response?.data?.errors) 
        ? error.response.data.errors[0]?.message 
        : null;
      toast({
        title: "Error al agregar vehículo",
        description: firstDetail || apiMessage || error.message || 'Error desconocido',
        variant: "destructive"
      });
    },
  });

  const handleSubmit = async (values: FormData) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-4xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
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
                
                <div className="grid grid-cols-3 gap-4">
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
                            maxLength={10}
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
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          Marca *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Nissan"
                            maxLength={50}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          Modelo *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Sentra"
                            maxLength={50}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturingYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Año de Fabricación *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            placeholder="2021"
                            min={1990}
                            max={new Date().getFullYear() + 1}
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleStatus"
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

                  <FormField
                    control={form.control}
                    name="typeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Settings className="w-4 h-4" />
                          Tipo de Vehículo *
                        </FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="1">Mototaxi</SelectItem>
                            <SelectItem value="2">Taxi</SelectItem>
                            <SelectItem value="3">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información del Propietario y Empresa */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Información del Propietario y Empresa
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerDni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1 justify-between">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            DNI del Propietario *
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowPropietarioDialog(true)}
                            className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Nuevo
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="12345678"
                            maxLength={8}
                            onBlur={async (e) => {
                              field.onBlur();
                              const dni = e.target.value;
                              if (dni.length === 8) {
                                try {
                                  const propietario = await propietariosService.getPropietarioDetail(dni);
                                  if (propietario?.firstName && propietario?.lastName) {
                                    setPropietarioName(`${propietario.firstName} ${propietario.lastName}`);
                                    toast({
                                      title: "Propietario encontrado",
                                      description: `${propietario.firstName} ${propietario.lastName}`,
                                    });
                                  }
                                } catch (error) {
                                  setPropietarioName('');
                                  toast({
                                    title: "Propietario no encontrado",
                                    description: "Puedes registrar un nuevo propietario haciendo clic en 'Nuevo'",
                                    variant: "destructive"
                                  });
                                }
                              }
                            }}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        {propietarioName && (
                          <p className="text-xs text-green-600 font-medium">✓ {propietarioName}</p>
                        )}
                        <p className="text-xs text-muted-foreground">El propietario debe estar registrado en el sistema.</p>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyRuc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          RUC de la Empresa *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="20123456789"
                            maxLength={11}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500" 
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">La empresa debe estar previamente registrada.</p>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Información importante:</h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• La placa debe seguir el formato estándar (ABC-123)</li>
                    <li>• El DNI del propietario debe estar registrado previamente</li>
                    <li>• El RUC debe corresponder a una empresa registrada</li>
                    <li>• Puedes crear un nuevo propietario usando el botón "Nuevo"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                {mutation.isPending ? 'Registrando...' : 'Registrar Mototaxi'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      {/* Dialog para registrar nuevo propietario */}
      <AddPropietarioDialog
        open={showPropietarioDialog}
        onOpenChange={setShowPropietarioDialog}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['propietarios'] });
          toast({
            title: "Propietario registrado",
            description: "Ahora puedes usarlo para el vehículo",
          });
        }}
      />
    </Dialog>
  );
});

AddVehiculoDialog.displayName = "AddVehiculoDialog";