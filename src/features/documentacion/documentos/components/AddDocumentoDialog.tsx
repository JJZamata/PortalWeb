import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { usePlacas } from '../hooks/usePlacas';
import { useEmpresas } from '../hooks/useEmpresas';
import { documentosService } from '../services/documentosService';

const documentoSchema = z.object({
  tipo: z.string().min(1, "Tipo de documento es obligatorio"),
  numero: z.string().min(1, "Número de documento es obligatorio"),
  placa: z.string().min(1, "Placa es obligatoria"),
  entidad_empresa: z.string().min(1, "Entidad/Empresa es obligatoria"),
  fecha_emision: z.string().min(1, "Fecha de emisión es obligatoria"),
  fecha_vencimiento: z.string().min(1, "Fecha de vencimiento es obligatoria"),
  observaciones: z.string().optional(),
  inspection_result: z.string().optional(),
  certifying_company: z.string().optional(),
  cobertura: z.string().optional(),
  numero_poliza: z.string().optional(),
});

type DocumentoForm = z.infer<typeof documentoSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddDocumentoDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { placas, loadingPlacas, fetchPlacas } = usePlacas();
  const { empresas, loadingEmpresas, fetchEmpresas } = useEmpresas();
  const [file, setFile] = useState<File | null>(null);
  const [busquedaPlaca, setBusquedaPlaca] = useState('');

  const form = useForm<DocumentoForm>({
    resolver: zodResolver(documentoSchema),
    defaultValues: {
      tipo: '', numero: '', placa: '', entidad_empresa: '', fecha_emision: '', fecha_vencimiento: '', observaciones: '',
      inspection_result: '', certifying_company: '', cobertura: '', numero_poliza: '',
    },
  });

  const tipoDocumento = form.watch('tipo');

  const mutation = useMutation({
    mutationFn: (data: { values: DocumentoForm; archivo?: File | null }) => 
      documentosService.addDocumento({ ...data.values, archivo: data.archivo }),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con documentos
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      
      toast({
        title: '✅ Documento registrado',
        description: 'El documento ha sido agregado exitosamente',
        variant: 'default',
      });
      
      onOpenChange(false);
      onSuccess();
      
      // Reset form and state
      form.reset();
      setFile(null);
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error al registrar',
        description: error.response?.data?.message || 'Error al registrar el documento',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (open) {
      fetchPlacas();
      fetchEmpresas();
    }
  }, [open, fetchPlacas, fetchEmpresas]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: DocumentoForm) => {
    try {
      // Validaciones específicas por tipo
      if (values.tipo === 'REVISION' && (!values.placa || !values.inspection_result || !values.certifying_company || !values.numero)) {
        toast({
          title: 'Error al registrar',
          description: 'Completa todos los campos obligatorios para revisión técnica.',
          variant: 'destructive',
        });
        return;
      }
      
      if (values.tipo === 'AFOCAT' && (!values.cobertura || !values.numero_poliza)) {
        toast({
          title: 'Error al registrar',
          description: 'Completa los campos de cobertura y número de póliza para AFOCAT.',
          variant: 'destructive',
        });
        return;
      }
      
      if (values.tipo !== 'REVISION' && !file) {
        toast({
          title: 'Error al registrar',
          description: 'Debes subir un archivo para este tipo de documento.',
          variant: 'destructive',
        });
        return;
      }
      
      // Ejecutar la mutación
      mutation.mutate({ values, archivo: file });
    } catch (error) {
      toast({
        title: 'Error al registrar',
        description: 'Error al procesar la solicitud',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
            <Plus className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Registrar Nuevo Documento
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">Completa la información del documento</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="tipo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento *</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REVISION">Revisión</SelectItem>
                          <SelectItem value="AFOCAT">Afocat</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              name="numero"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Documento *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: CITV-2024-001234" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {tipoDocumento === 'REVISION' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="inspection_result"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado Inspección *</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar resultado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APROBADO">APROBADO</SelectItem>
                          <SelectItem value="OBSERVADO">OBSERVADO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="certifying_company"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa Certificadora *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: TECSUP S.A." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {tipoDocumento === 'AFOCAT' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="cobertura"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cobertura *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Nacional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="numero_poliza"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° de Póliza *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: POL-123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="placa"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa del Vehículo *</FormLabel>
                  <Input
                    placeholder="Buscar placa..."
                    value={busquedaPlaca}
                    onChange={(e) => setBusquedaPlaca(e.target.value)}
                    className="mb-2"
                  />
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingPlacas}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingPlacas ? 'Cargando placas...' : 'Seleccionar placa'} />
                      </SelectTrigger>
                      <SelectContent>
                        {placas.map((placa) => (
                          placa.plateNumber ? (
                            <SelectItem key={placa.plateNumber} value={placa.plateNumber}>{placa.plateNumber}</SelectItem>
                          ) : null
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="entidad_empresa"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa/Entidad Emisora *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingEmpresas}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingEmpresas ? 'Cargando empresas...' : 'Seleccionar empresa'} />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          empresa.name ? (
                            <SelectItem key={empresa.name} value={empresa.name}>{empresa.name}</SelectItem>
                          ) : null
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="fecha_emision"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Emisión *</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="fecha_vencimiento"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Vencimiento *</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="observaciones"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Observaciones adicionales sobre el documento"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {tipoDocumento !== 'REVISION' && (
            <div>
              <FormLabel>Archivo del Documento</FormLabel>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="fileInput" />
                <label htmlFor="fileInput" className="text-blue-600 dark:text-blue-400 underline cursor-pointer">{file ? file.name : 'Selecciona un archivo'}</label>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, JPG, PNG hasta 10MB</p>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button onClick={form.handleSubmit(onSubmit)} className="flex-1" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registrando...' : 'Registrar Documento'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};