import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { licensesService } from '../services/licensesService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conductorDni: string;
  onSuccess: () => void;
}

export const AddLicenseDialog = ({ open, onOpenChange, conductorDni, onSuccess }: Props) => {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [showRestrictions, setShowRestrictions] = useState(false);
  
  const form = useForm({
    defaultValues: { 
      licenseNumber: '', 
      category: '', 
      issueDate: '', 
      expirationDate: '', 
      issuingEntity: 'SUTRAN',
      restrictions: '' 
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
    mutationFn: (data: any) => licensesService.addLicense({ ...data, driverDni: conductorDni }),
    onSuccess: (result: any) => {
      toast({
        title: "Licencia agregada",
        description: result?.recovered
          ? (result?.message || "La licencia se registró y fue confirmada en el detalle del conductor.")
          : "La licencia fue registrada correctamente.",
        variant: "success"
      });
      form.reset();
      setShowRestrictions(false);
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message;
      const firstDetail = Array.isArray(error?.response?.data?.errors) ? error.response.data.errors[0]?.message : null;
      const backendCode = error?.response?.data?.code;

      console.error('Error creando licencia', {
        conductorDni,
        status: error?.response?.status,
        code: backendCode,
        data: error?.response?.data
      });

      toast({
        title: "Error al agregar licencia",
        description: firstDetail || error?.message || apiMessage || 'Error desconocido',
        variant: "destructive"
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-border rounded-xl max-w-2xl bg-background text-foreground">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Agregar Licencia</DialogTitle>
          <DialogDescription className="text-muted-foreground">Ingresa los datos de la nueva licencia para este conductor</DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-4 text-sm text-blue-900 dark:text-blue-200">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Información importante:</p>
          <ul className="list-disc pl-5 space-y-1 text-blue-800 dark:text-blue-200">
            <li>La categoría usa letra I (ej. B-IIa), no el número 1.</li>
            <li>El vencimiento se calcula automáticamente a 5 años desde emisión.</li>
            <li>La Entidad Emisora viene prellenada como "SUTRAN".</li>
          </ul>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => {
            if (!/^\d{8}$/.test(String(conductorDni ?? '').trim())) {
              toast({
                title: "No se pudo registrar la licencia",
                description: "El DNI del conductor no es válido o no está cargado en el detalle.",
                variant: "destructive"
              });
              return;
            }
            // Si restrictions está vacío, enviar "SIN RESTRICCIONES"
            if (!values.restrictions || values.restrictions.trim() === '') {
              values.restrictions = 'SIN RESTRICCIONES';
            }
            mutation.mutate(values);
          })} className="pt-2">
            
            {/* Row 1: License Number & Category */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField name="licenseNumber" control={form.control} rules={{
                required: "El número de licencia es obligatorio",
                maxLength: { value: 15, message: "Máximo 15 caracteres" },
                pattern: { value: /^[A-Za-z0-9-]+$/, message: "Solo letras, números y guiones" }
              }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Licencia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="text"
                      maxLength={15}
                      autoComplete="off"
                      placeholder="Ej: K87654321"
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Máximo 15 caracteres.</p>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="category" control={form.control} rules={{
                required: "La categoría es obligatoria",
                maxLength: { value: 10, message: "Máximo 10 caracteres" },
                validate: (value) => {
                  const trimmed = String(value ?? '').trim();
                  if (!trimmed) return 'La categoría es obligatoria';
                  if (/1/.test(trimmed)) return 'Usa letra I, no número 1';
                  if (!/^[A-Z]-[A-Z]{1,4}[a-z]?$/.test(trimmed)) {
                    return 'Formato inválido. Ejemplos: B-I, B-IIa';
                  }
                  return true;
                }
              }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={10}
                      autoComplete="off"
                      placeholder="Ej: B-IIa"
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                      onChange={(e) => field.onChange(e.target.value.trimStart())}
                      onBlur={(e) => field.onChange(e.target.value.trim())}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Usa letra I, no número 1.</p>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 2: Issue Date & Expiration Date */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField name="issueDate" control={form.control} rules={{ required: "La fecha de emisión es obligatoria" }} render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Emisión</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      max={today}
                      className="bg-background text-foreground border-border [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">No puede ser futura.</p>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField
                name="expirationDate"
                control={form.control}
                rules={{
                  required: "La fecha de vencimiento es obligatoria",
                  validate: (value) => {
                    if (!value) return "La fecha de vencimiento es obligatoria";
                    if (issueDateValue && value < issueDateValue) {
                      return "Debe ser igual o posterior a la emisión";
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        min={issueDateValue || today}
                        className="bg-background text-foreground border-border [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Auto-calculado a 5 años.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Issuing Entity */}
            <FormField name="issuingEntity" control={form.control} rules={{ required: "La entidad emisora es obligatoria" }} render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Entidad Emisora</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={50}
                    autoComplete="organization"
                    placeholder="Ej: SUTRAN, MTC"
                    className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Restrictions Toggle */}
            <div className="mb-4 flex items-center gap-2">
              <Checkbox
                checked={showRestrictions}
                onCheckedChange={(checked) => setShowRestrictions(checked as boolean)}
                id="hasRestrictions"
              />
              <label htmlFor="hasRestrictions" className="text-sm font-medium cursor-pointer">
                Esta licencia tiene restricciones
              </label>
            </div>

            {/* Restrictions Input (Conditional) */}
            {showRestrictions && (
              <FormField name="restrictions" control={form.control} render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Restricciones</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={100}
                      placeholder="Ej: LENTES CORRECTIVOS"
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Submit Button */}
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Agregando...' : 'Agregar Licencia'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};