import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Car, User, Building2, Settings, Calendar, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Vehiculo } from '../types';

const vehiculoSchema = z.object({
  plateNumber: z.string().min(5, "La placa debe tener al menos 5 caracteres").max(10, "Máximo 10 caracteres"),
  companyRuc: z.string().length(11, "El RUC debe tener 11 dígitos"),
  ownerDni: z.string().length(8, "El DNI debe tener 8 dígitos"),
  typeId: z.coerce.number().int().positive("Debe ser un número positivo"),
  vehicleStatus: z.enum(["OPERATIVO", "REPARACIÓN", "FUERA DE SERVICIO", "INSPECCIÓN"]),
  brand: z.string().min(2, "Marca requerida"),
  model: z.string().min(1, "Modelo requerido"),
  manufacturingYear: z.coerce.number().int().gte(1900, "Año inválido").lte(new Date().getFullYear(), "Año inválido"),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehiculo: any | null; // Cambiar a any para manejar formato de API
  onSuccess: () => void;
}

export const EditVehiculoDialog = ({ open, onOpenChange, vehiculo, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: { plateNumber: "", companyRuc: "", ownerDni: "", typeId: 1, vehicleStatus: "OPERATIVO", brand: "", model: "", manufacturingYear: new Date().getFullYear() },
  });

  const mutation = useMutation({
    mutationFn: (data: VehiculoFormData) => vehiculosService.updateVehiculo(data.plateNumber, data),
    onSuccess: () => {
      toast({ title: "Vehículo actualizado", description: "Los datos fueron actualizados correctamente.", variant: "success" });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Error al actualizar vehículo", description: error.response?.data?.message || 'Error desconocido', variant: "destructive" });
    },
  });

  useEffect(() => {
    if (vehiculo) {
      form.reset({
        plateNumber: vehiculo.placa?.plateNumber || vehiculo.plateNumber || vehiculo.placa_v || '',
        companyRuc: vehiculo.placa?.companyRuc || vehiculo.empresa?.ruc || vehiculo.companyRuc || '',
        ownerDni: vehiculo.propietario?.dni || vehiculo.ownerDni || '',
        typeId: vehiculo.tipo?.id || vehiculo.typeId || 1,
        vehicleStatus: (vehiculo.estado || vehiculo.vehicleStatus || 'OPERATIVO') as "OPERATIVO" | "REPARACIÓN" | "FUERA DE SERVICIO" | "INSPECCIÓN",
        brand: vehiculo.tipo?.marca || vehiculo.brand || '',
        model: vehiculo.tipo?.modelo || vehiculo.model || '',
        manufacturingYear: vehiculo.tipo?.año || vehiculo.manufacturingYear || new Date().getFullYear(),
      });
    }
  }, [vehiculo, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-600" />
            Editar Vehículo
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Modifica los datos del vehículo seleccionado
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6">
            {/* Información del Vehículo */}
            <Card className="border border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Información del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="plateNumber" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      Placa del Vehículo
                    </FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-100 font-mono font-bold text-blue-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="vehicleStatus" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      Estado del Vehículo
                    </FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border border-gray-300 rounded-md h-10 px-3 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="OPERATIVO">🟢 Operativo</option>
                        <option value="REPARACIÓN">⚙️ Reparación</option>
                        <option value="FUERA DE SERVICIO">🔴 Fuera de Servicio</option>
                        <option value="INSPECCIÓN">✅ Inspección</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="brand" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Marca</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Toyota, Honda" className="bg-white border-gray-300 focus:border-blue-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="model" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Modelo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Corolla, Civic" className="bg-white border-gray-300 focus:border-blue-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="manufacturingYear" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Año de Fabricación
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Ej: 2020" className="bg-white border-gray-300 focus:border-blue-500" min="1990" max={new Date().getFullYear() + 1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="typeId" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">ID Tipo de Vehículo</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Ej: 1" className="bg-white border-gray-300 focus:border-blue-500" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Información del Propietario y Empresa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Propietario */}
              <Card className="border border-green-200 bg-green-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Propietario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField name="ownerDni" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">DNI del Propietario</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: 12345678" className="bg-white border-gray-300 focus:border-green-500" maxLength={8} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Empresa */}
              <Card className="border border-purple-200 bg-purple-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Empresa Operadora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField name="companyRuc" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">RUC de la Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: 20123456789" className="bg-white border-gray-300 focus:border-purple-500" maxLength={11} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {mutation.isPending ? "Actualizando..." : "Actualizar Vehículo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};