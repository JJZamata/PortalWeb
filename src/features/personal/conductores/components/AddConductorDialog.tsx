import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, User, Phone, MapPin, Camera, IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Props {
  onSuccess: () => void;
}

export const AddConductorDialog = ({ onSuccess }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const form = useForm({
    defaultValues: { 
      dni: "", 
      firstName: "", 
      lastName: "", 
      phoneNumber: "", 
      address: "", 
      photoUrl: "" 
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => conductoresService.addConductor(data),
    onSuccess: () => {
      toast({ 
        title: "✅ Conductor agregado", 
        description: "El conductor fue registrado correctamente en el sistema.", 
        variant: "success" 
      });
      form.reset();
      setOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      // Manejo mejorado de errores
      let errorMessage = error.response?.data?.message || 'Error desconocido al registrar el conductor';

      // Si hay errores específicos de validación, mostrar el primer error
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.message || errorMessage;
      }

      toast({
        title: "❌ Error al registrar conductor",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  const validateDNI = (dni: string) => {
    if (!dni.trim()) return "El DNI es obligatorio";
    if (dni.length !== 8) return "El DNI debe tener exactamente 8 dígitos";
    if (!/^\d+$/.test(dni)) return "El DNI solo debe contener números";
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return "El teléfono es obligatorio";
    if (phone.length !== 9) return "El teléfono debe tener exactamente 9 dígitos";
    if (!/^9\d{8}$/.test(phone)) return "El teléfono debe empezar con 9 y tener 9 dígitos";
    return true;
  };

  const validateName = (name: string) => {
    if (!name.trim()) return "Este campo es obligatorio";
    if (name.length < 2) return "Debe tener al menos 2 caracteres";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return "Solo se permiten letras y espacios";
    return true;
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) return "La dirección es obligatoria";
    if (address.length < 10) return "La dirección debe ser más específica (mín. 10 caracteres)";
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0">
          <Plus className="w-4 h-4 mr-2" /> 
          Nuevo Conductor
        </Button>
      </DialogTrigger>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent flex items-center gap-2">
            <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            Registrar Nuevo Conductor
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete toda la información requerida para registrar un nuevo conductor en el sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6 pt-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <IdCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    name="dni" 
                    control={form.control} 
                    rules={{ required: "El DNI es obligatorio", validate: validateDNI }} 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">DNI *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            maxLength={8} 
                            placeholder="12345678"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )} 
                  />
                  
                  <FormField 
                    name="phoneNumber" 
                    control={form.control} 
                    rules={{ required: "El teléfono es obligatorio", validate: validatePhone }} 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          Teléfono *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            maxLength={9} 
                            placeholder="987654321"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    name="firstName" 
                    control={form.control} 
                    rules={{ required: "El nombre es obligatorio", validate: validateName }} 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Nombres *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Juan Carlos"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )} 
                  />
                  
                  <FormField 
                    name="lastName" 
                    control={form.control} 
                    rules={{ required: "Los apellidos son obligatorios", validate: validateName }} 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Apellidos *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Pérez García"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )} 
                  />
                </div>

                <FormField 
                  name="address" 
                  control={form.control} 
                  rules={{ required: "La dirección es obligatoria", validate: validateAddress }} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Dirección Completa *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Av. Los Próceres 123, Urb. San Martín, La Joya"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} 
                />

                <FormField 
                  name="photoUrl" 
                  control={form.control} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        Foto de Perfil (URL) - Opcional
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://ejemplo.com/foto.jpg"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} 
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Conductor
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