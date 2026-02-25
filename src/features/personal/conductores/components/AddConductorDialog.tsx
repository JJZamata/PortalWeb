import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, User, Phone, MapPin, Camera, IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { licensesService } from '../services/licensesService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface Props {
  onSuccess: () => void;
}

export const AddConductorDialog = ({ onSuccess }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showLicenseSection, setShowLicenseSection] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  
  const [showRestrictions, setShowRestrictions] = useState(false);

  const form = useForm({
    defaultValues: { 
      dni: "", 
      firstName: "", 
      lastName: "", 
      phoneNumber: "", 
      address: "", 
      photoUrl: "",
      licenseNumber: "",
      category: "",
      issueDate: "",
      expirationDate: "",
      issuingEntity: "SUTRAN",
      restrictions: ""
    },
  });

  const issueDateValue = form.watch('issueDate');

  // Auto-calcular expirationDate a 5 años desde issueDate
  useEffect(() => {
    if (issueDateValue) {
      const issueDate = new Date(issueDateValue);
      const expiryDate = new Date(issueDate.getFullYear() + 5, issueDate.getMonth(), issueDate.getDate());
      const expiryDateString = expiryDate.toISOString().split('T')[0];
      form.setValue('expirationDate', expiryDateString);
    }
  }, [issueDateValue, form]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const conductorPayload = {
        dni: data.dni,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        photoUrl: data.photoUrl
      };

      let conductorCreated = false;

      try {
        await conductoresService.addConductor(conductorPayload);
        conductorCreated = true;

        if (showLicenseSection) {
          const restrictions = !data.restrictions || data.restrictions.trim() === '' ? 'SIN RESTRICCIONES' : data.restrictions;
          await licensesService.addLicense({
            driverDni: data.dni,
            licenseNumber: data.licenseNumber,
            category: data.category,
            issueDate: data.issueDate,
            expirationDate: data.expirationDate,
            issuingEntity: data.issuingEntity,
            restrictions: restrictions
          });
        }
      } catch (error: any) {
        if (showLicenseSection && conductorCreated) {
          const apiMessage = error?.response?.data?.message;
          const firstDetail = Array.isArray(error?.response?.data?.errors)
            ? error.response.data.errors[0]?.message
            : null;
          const licenseErrorMessage = firstDetail || apiMessage || error?.message || 'Error al registrar la licencia';

          try {
            await conductoresService.deleteConductor(data.dni);
            throw new Error(`No se pudo registrar la licencia: ${licenseErrorMessage}. Se revirtió el registro del conductor para evitar datos incompletos.`);
          } catch {
            throw new Error(`No se pudo registrar la licencia: ${licenseErrorMessage}. Además, no se pudo revertir automáticamente el conductor; revisa y elimina manualmente si corresponde.`);
          }
        }

        throw error;
      }

      return { licenseCreated: showLicenseSection };
    },
    onSuccess: (result) => {
      toast({ 
        title: "✅ Conductor agregado", 
        description: result?.licenseCreated
          ? "El conductor y su licencia fueron registrados correctamente."
          : "El conductor fue registrado correctamente en el sistema.", 
        variant: "success" 
      });
      form.reset();
      setShowRestrictions(false);
      setShowLicenseSection(false);
      setOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      // Usar mensaje detallado si viene del backend o del helper handleApiError
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error desconocido al registrar el conductor';

      const details = error.response?.data?.errors || error.details;
      if (Array.isArray(details) && details.length > 0) {
        const firstError = details[0];
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

  const validateLicenseNumber = (licenseNumber: string) => {
    if (!showLicenseSection) return true;
    if (!licenseNumber.trim()) return "El número de licencia es obligatorio";
    if (licenseNumber.length > 15) return "Máximo 15 caracteres";
    if (!/^[A-Za-z0-9-]+$/.test(licenseNumber)) return "Solo letras, números y guiones";
    return true;
  };

  const validateLicenseCategory = (category: string) => {
    if (!showLicenseSection) return true;
    const trimmed = category.trim();
    if (!trimmed) return "La categoría es obligatoria";
    if (trimmed.length > 10) return "Máximo 10 caracteres";
    if (/1/.test(trimmed)) return "Usa letra I, no número 1";
    if (!/^[A-Z]-[A-Z]{1,4}[a-z]?$/.test(trimmed)) return "Formato inválido. Ejemplos: B-I, B-IIa";
    return true;
  };

  const validateIssueDate = (issueDate: string) => {
    if (!showLicenseSection) return true;
    if (!issueDate) return "La fecha de emisión es obligatoria";
    if (issueDate > today) return "La fecha de emisión no puede ser futura";
    return true;
  };

  const validateExpirationDate = (expirationDate: string) => {
    if (!showLicenseSection) return true;
    if (!expirationDate) return "La fecha de vencimiento es obligatoria";
    if (issueDateValue && expirationDate < issueDateValue) return "Debe ser igual o posterior a la emisión";
    return true;
  };

  const validateIssuingEntity = (issuingEntity: string) => {
    if (!showLicenseSection) return true;
    if (!issuingEntity.trim()) return "La entidad emisora es obligatoria";
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
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-6 pt-4"
          >
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
                            onChange={(e) => field.onChange(e.target.value.replace(/\s+/g, '').replace(/\D+/g, ''))}
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
                            onChange={(e) => field.onChange(e.target.value.replace(/\s+/g, '').replace(/\D+/g, ''))}
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

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <IdCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Licencia de Conducir (Opcional)
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Activa esta sección si deseas registrar la licencia junto al conductor.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLicenseSection((prev) => !prev)}
                    className="rounded-lg"
                  >
                    {showLicenseSection ? 'Ocultar licencia' : 'Agregar licencia ahora'}
                  </Button>
                </div>

                {showLicenseSection && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name="licenseNumber"
                        control={form.control}
                        rules={{ validate: validateLicenseNumber }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Número de Licencia *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                maxLength={15}
                                placeholder="Ej: K87654321"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11"
                                onChange={(e) => field.onChange(e.target.value.replace(/\s+/g, '').toUpperCase())}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="category"
                        control={form.control}
                        rules={{ validate: validateLicenseCategory }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Categoría *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                maxLength={10}
                                placeholder="Ej: B-IIa"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11"
                                onChange={(e) => field.onChange(e.target.value.replace(/\s+/g, ''))}
                                onBlur={(e) => field.onChange(e.target.value.replace(/\s+/g, ''))}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name="issueDate"
                        control={form.control}
                        rules={{ validate: validateIssueDate }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Emisión *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="date"
                                max={today}
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 [color-scheme:light] dark:[color-scheme:dark]"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="expirationDate"
                        control={form.control}
                        rules={{ validate: validateExpirationDate }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Vencimiento *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="date"
                                min={issueDateValue || today}
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 [color-scheme:light] dark:[color-scheme:dark]"
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Auto-calculado a 5 años.</p>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      name="issuingEntity"
                      control={form.control}
                      rules={{ validate: validateIssuingEntity }}
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Entidad Emisora *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              maxLength={50}
                              placeholder="Ej: MTC, SUTRAN"
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <div className="mb-4 flex items-center gap-2">
                      <Checkbox
                        checked={showRestrictions}
                        onCheckedChange={(checked) => setShowRestrictions(checked as boolean)}
                        id="hasRestrictions"
                      />
                      <label htmlFor="hasRestrictions" className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300">
                        Esta licencia tiene restricciones
                      </label>
                    </div>

                    {showRestrictions && (
                      <FormField
                        name="restrictions"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Restricciones</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                maxLength={100}
                                placeholder="Ej: LENTES CORRECTIVOS"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11"
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                autoFocus
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
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
