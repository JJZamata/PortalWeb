import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit, Phone, MapPin, Camera, User, Save, Trash2, IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { licensesService } from '../services/licensesService';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { ConductorDetalladoNuevo } from "../types";
import { Licencia } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductor: ConductorDetalladoNuevo | null;
  onSuccess: (type?: 'conductor' | 'license') => void;
  licensesData?: Licencia[];
}

export const EditConductorDialog = ({ open, onOpenChange, conductor, onSuccess, licensesData = [] }: Props) => {
  const { toast } = useToast();
  const [localLicenses, setLocalLicenses] = useState<Licencia[]>(licensesData);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [expandedLicense, setExpandedLicense] = useState<string | undefined>(undefined);
  const [licenseForm, setLicenseForm] = useState({
    category: '',
    expirationDate: '',
    restrictions: 'SIN RESTRICCIONES'
  });
  
  const form = useForm({
    defaultValues: { 
      phoneNumber: '', 
      address: '', 
      photoUrl: ''
    },
  });

  useEffect(() => {
    setLocalLicenses(licensesData);
  }, [licensesData]);

  const mutation = useMutation({
    mutationFn: (data: any) => conductoresService.updateConductor(conductor!.dni, data),
    onSuccess: () => {
      toast({ 
        title: "✅ Conductor actualizado", 
        description: "Los datos del conductor fueron actualizados correctamente.", 
        variant: "success" 
      });
      onOpenChange(false);
      onSuccess('conductor');
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message;
      const firstDetail = Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors[0]?.message
        : null;
      const enhancedError = new Error(firstDetail || apiMessage || error?.message || 'Error al registrar la licencia');
      (enhancedError as any).partialSuccess = true;
      throw enhancedError;
    }
  });

  const mutationDeleteLicense = useMutation({
    mutationFn: (licenseNumber: string) => {
      if (!licenseNumber) {
        throw new Error('No hay licencia para eliminar');
      }
      return licensesService.deleteLicense(licenseNumber);
    },
    onSuccess: () => {
      toast({ 
        title: "✅ Licencia eliminada", 
        description: "La licencia fue eliminada correctamente.", 
        variant: "success" 
      });
      setLocalLicenses((prev) => prev.filter((license) => license.licenseNumber !== expandedLicense));
      setExpandedLicense(undefined);
      setShowRestrictions(false);
      setLicenseForm({
        category: '',
        expirationDate: '',
        restrictions: 'SIN RESTRICCIONES'
      });
      onSuccess('license');
    },
    onError: (error: any) => {
      let errorMessage = error.response?.data?.message || error.message || 'Error desconocido al eliminar la licencia';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.message || errorMessage;
      }
      toast({
        title: "❌ Error al eliminar licencia",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  const mutationUpdateLicense = useMutation({
    mutationFn: ({ licenseNumber, data }: { licenseNumber: string; data: any }) => {
      if (!licenseNumber) {
        throw new Error('No hay licencia para actualizar');
      }
      const updateData: any = {};
      if (data.category) updateData.category = data.category;
      if (data.expirationDate) updateData.expirationDate = data.expirationDate;
      updateData.restrictions = data.restrictions || 'SIN RESTRICCIONES';
      return licensesService.updateLicense(licenseNumber, updateData);
    },
    onSuccess: () => {
      toast({ 
        title: "✅ Licencia actualizada", 
        description: "La licencia fue actualizada correctamente.", 
        variant: "success" 
      });
      setShowRestrictions(false);
      onSuccess('license');
    },
    onError: (error: any) => {
      let errorMessage = error.response?.data?.message || error.message || 'Error desconocido al actualizar la licencia';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.message || errorMessage;
      }
      toast({
        title: "❌ Error al actualizar licencia",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return true; // opcional
    if (phone.length !== 9) return "El teléfono debe tener exactamente 9 dígitos";
    if (!/^9\d{8}$/.test(phone)) return "El teléfono debe empezar con 9 y tener 9 dígitos";
    return true;
  };

  const validateAddress = (address: string) => {
    if (!address.trim()) return true; // opcional
    if (address.length < 10) return "La dirección debe ser más específica (mín. 10 caracteres)";
    return true;
  };

  useEffect(() => {
    if (conductor) {
      form.reset({
        phoneNumber: conductor.phoneNumber || '',
        address: conductor.address || '',
        photoUrl: conductor.photoUrl || ''
      });
    }
  }, [conductor, form]);

  const handleSelectLicense = (licenseNumber: string) => {
    setExpandedLicense(licenseNumber || undefined);
    if (!licenseNumber) return;

    const selectedLicense = localLicenses.find((license) => license.licenseNumber === licenseNumber);
    if (!selectedLicense) return;

    setLicenseForm({
      category: selectedLicense.category || '',
      expirationDate: selectedLicense.expirationDate ? String(selectedLicense.expirationDate).slice(0, 10) : '',
      restrictions: selectedLicense.restrictions || 'SIN RESTRICCIONES'
    });

    setShowRestrictions(
      !!selectedLicense.restrictions && selectedLicense.restrictions.toUpperCase() !== 'SIN RESTRICCIONES'
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent flex items-center gap-2">
            <Edit className="w-6 h-6 text-green-600 dark:text-green-400" />
            Editar Información del Conductor
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            {conductor && (
              <span className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{conductor.nombreCompleto}</span>
                <span className="text-sm text-gray-500">({conductor.dni})</span>
              </span>
            )}
            <span className="block">Actualiza los datos de contacto y información personal</span>
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              const payload: any = {};

              const phone = values.phoneNumber.trim();
              const addr = values.address.trim();
              const photo = values.photoUrl.trim();

              if (phone) payload.phoneNumber = phone;
              if (addr) payload.address = addr;
              if (photo) payload.photoUrl = photo;

              if (Object.keys(payload).length === 0) {
                toast({
                  title: "Sin cambios",
                  description: "Ingresa al menos un campo para actualizar (teléfono, dirección o foto).",
                  variant: "destructive"
                });
                return;
              }

              mutation.mutate(payload);
            })}
            className="space-y-6 pt-4"
          >
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Información de Contacto
                </h3>
                
                <FormField 
                  name="phoneNumber" 
                  control={form.control} 
                  rules={{ validate: validatePhone }} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Número de Teléfono
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

                <FormField 
                  name="address" 
                  control={form.control} 
                  rules={{ validate: validateAddress }} 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Dirección Completa
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

            {localLicenses.length > 0 && (
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <IdCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Editar Licencia
                  </h3>

                  <Accordion type="single" collapsible value={expandedLicense} onValueChange={handleSelectLicense}>
                    {localLicenses.map((license) => (
                      <AccordionItem key={license.licenseNumber} value={license.licenseNumber} className="border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="text-left hover:no-underline py-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-4 gap-1">
                            <span className="font-medium text-gray-900 dark:text-white">{license.licenseNumber}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Categoría: {license.category} · Vence: {String(license.expirationDate).slice(0, 10)}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                          {expandedLicense === license.licenseNumber && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Categoría *</FormLabel>
                                  <Input
                                    value={licenseForm.category}
                                    maxLength={10}
                                    placeholder="Ej: B-IIa"
                                    className="mt-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, category: e.target.value.replace(/\s+/g, '') }))}
                                    onBlur={(e) => setLicenseForm((prev) => ({ ...prev, category: e.target.value.replace(/\s+/g, '') }))}
                                  />
                                </div>

                                <div>
                                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Vencimiento *</FormLabel>
                                  <Input
                                    value={licenseForm.expirationDate}
                                    type="date"
                                    min={String(license.issueDate).slice(0, 10)}
                                    className="mt-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 [color-scheme:light] dark:[color-scheme:dark]"
                                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, expirationDate: e.target.value }))}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={showRestrictions}
                                  onCheckedChange={(checked) => {
                                    const next = checked as boolean;
                                    setShowRestrictions(next);
                                    if (!next) {
                                      setLicenseForm((prev) => ({ ...prev, restrictions: 'SIN RESTRICCIONES' }));
                                    }
                                  }}
                                  id={`hasRestrictions-${license.licenseNumber}`}
                                />
                                <label htmlFor={`hasRestrictions-${license.licenseNumber}`} className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300">
                                  Editar restricciones
                                </label>
                              </div>

                              {showRestrictions && (
                                <div>
                                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Restricciones</FormLabel>
                                  <Input
                                    value={licenseForm.restrictions}
                                    maxLength={100}
                                    placeholder="Ej: LENTES CORRECTIVOS, APARATOS AUDITIVOS"
                                    className="mt-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11"
                                    onChange={(e) => setLicenseForm((prev) => ({ ...prev, restrictions: e.target.value.toUpperCase() }))}
                                  />
                                </div>
                              )}

                              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    if (window.confirm(`¿Eliminar la licencia ${license.licenseNumber}?`)) {
                                      mutationDeleteLicense.mutate(license.licenseNumber);
                                    }
                                  }}
                                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                                  disabled={mutationDeleteLicense.isPending}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {mutationDeleteLicense.isPending ? 'Eliminando...' : 'Eliminar Licencia'}
                                </Button>
                                <Button
                                  type="button"
                                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg"
                                  onClick={() => {
                                    mutationUpdateLicense.mutate({
                                      licenseNumber: license.licenseNumber,
                                      data: licenseForm
                                    });
                                  }}
                                  disabled={mutationUpdateLicense.isPending}
                                >
                                  {mutationUpdateLicense.isPending ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                      Actualizando...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4 mr-2" />
                                      Guardar Cambios
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

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
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
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