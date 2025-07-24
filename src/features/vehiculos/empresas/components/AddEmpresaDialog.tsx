import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Building2, FileText, MapPin, Calendar, IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const empresaSchema = z.object({
  ruc: z.string()
    .min(11, "El RUC debe tener 11 dígitos")
    .max(11, "El RUC debe tener 11 dígitos")
    .regex(/^\d{11}$/, "El RUC debe contener solo números"),
  name: z.string()
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(100, "La razón social no puede exceder 100 caracteres"),
  address: z.string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  registrationDate: z.string().min(1, "La fecha de registro es requerida"),
  expirationDate: z.string().min(1, "La fecha de vencimiento es requerida"),
  rucStatus: z.enum(["ACTIVO", "SUSPENDIDO", "BAJA PROV."]),
}).refine((data) => {
  const registrationDate = new Date(data.registrationDate);
  const expirationDate = new Date(data.expirationDate);
  return expirationDate > registrationDate;
}, {
  message: "La fecha de vencimiento debe ser posterior a la fecha de registro",
  path: ["expirationDate"],
});

type EmpresaForm = z.infer<typeof empresaSchema>;

interface Props {
  onSuccess: () => void;
}

export const AddEmpresaDialog = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
    defaultValues: { 
      ruc: "", 
      name: "", 
      address: "", 
      registrationDate: new Date().toISOString().split('T')[0], 
      expirationDate: "", 
      rucStatus: "ACTIVO" 
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EmpresaForm) => empresasService.addEmpresa(data),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con empresas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresas-stats'] });
      
      toast({ 
        title: "✅ Empresa registrada", 
        description: "La empresa fue registrada correctamente en el sistema.", 
        variant: "default" 
      });
      form.reset({
        ruc: "", 
        name: "", 
        address: "", 
        registrationDate: new Date().toISOString().split('T')[0], 
        expirationDate: "", 
        rucStatus: "ACTIVO" 
      });
      setOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Error al registrar empresa", 
        description: error.response?.data?.message || 'Error desconocido al registrar la empresa', 
        variant: "destructive" 
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0">
          <Plus className="w-4 h-4 mr-2" /> 
          Nueva Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Registrar Nueva Empresa
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete toda la información requerida para registrar una nueva empresa de transporte en el sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6 pt-4">
            {/* Información Empresarial */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <IdCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Información Empresarial
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="ruc" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">RUC *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          maxLength={11}
                          placeholder="20123456789"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} />
                  
                  <FormField name="rucStatus" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Estado RUC *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <SelectItem value="ACTIVO">Activo</SelectItem>
                            <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
                            <SelectItem value="BAJA PROV.">Baja Provisional</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} />
                </div>

                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Razón Social *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Transportes La Joya S.A.C."
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )} />
                
                <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Dirección Comercial *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Av. Los Arequipeños 123, La Joya, Arequipa"
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Información de Fechas */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Información de Registro y Vigencia
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="registrationDate" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Registro *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} />
                  
                  <FormField name="expirationDate" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Vencimiento *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-purple-500 focus:ring-purple-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} />
                </div>
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
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200" 
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
                    Registrar Empresa
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