import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePlacas } from '../hooks/usePlacas';
import { useEmpresas } from '../hooks/useEmpresas';
import { documentosService } from '../services/documentosService';

// Utilidades optimizadas para fechas
const getTodayDate = () => new Date().toISOString().split('T')[0];
const getDateInMonths = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};

// Schema optimizado con validaciones inteligentes
const documentoSchema = z.object({
  tipo: z.string().min(1, "Tipo de documento es obligatorio"),
  numero: z.string().optional(),
  placa: z.string().min(1, "Placa es obligatoria"),
  entidad_empresa: z.string().min(1, "Entidad/Empresa es obligatoria"),
  fecha_emision: z.string().min(1, "Fecha de emisión es obligatoria"),
  fecha_vencimiento: z.string().min(1, "Fecha de vencimiento es obligatoria"),
  observaciones: z.string().optional(),
  inspection_result: z.string().optional(),
  certifying_company: z.string().optional(),
  cobertura: z.string().optional(),
  numero_poliza: z.string().optional(),
  owner_dni: z.string().optional(),
}).refine((data) => {
  // Validaciones específicas por tipo
  if (data.tipo === 'REVISION') {
    return data.inspection_result && data.certifying_company && data.numero;
  }
  if (data.tipo === 'AFOCAT') {
    // Validar que todos los campos requeridos para AFOCAT estén presentes
    return data.cobertura && data.cobertura.trim() !== '' &&
           data.numero_poliza && data.numero_poliza.trim() !== '' &&
           data.owner_dni && data.owner_dni.trim() !== '' &&
           data.entidad_empresa && data.entidad_empresa.trim() !== '';
  }
  // Para otros tipos, numero es requerido
  if (data.tipo && data.tipo !== 'AFOCAT' && data.tipo !== 'REVISION') {
    return data.numero && data.numero.trim() !== '';
  }
  return true;
}, {
  message: "Completa todos los campos obligatorios para el tipo de documento seleccionado",
  path: ["tipo"],
}).refine((data) => {
  // Validar que la fecha de vencimiento sea posterior a la fecha de emisión
  if (data.fecha_emision && data.fecha_vencimiento) {
    return new Date(data.fecha_vencimiento) > new Date(data.fecha_emision);
  }
  return true;
}, {
  message: "La fecha de vencimiento debe ser posterior a la fecha de emisión",
  path: ["fecha_vencimiento"],
});

// Componentes memoizados para mejor rendimiento - Sin iconos
const FormSection = memo(({ title, children, className = "" }: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={`border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50 ${className}`}>
    <CardContent className="p-6 space-y-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </CardContent>
  </Card>
));

const OptimizedSelect = memo(({ 
  items, 
  loading, 
  placeholder, 
  searchValue, 
  searchPlaceholder,
  onSearchChange,
  ...props 
}: any) => (
  <div className="space-y-2">
    <Input
      placeholder={searchPlaceholder}
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
    />
    <Select {...props} disabled={loading}>
      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500">
        <SelectValue placeholder={loading ? 'Cargando...' : placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
        {items.map((item: any, index: number) => (
          <SelectItem key={item.value || index} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
        {items.length === 0 && searchValue.length >= 2 && (
          <div className="px-2 py-1 text-xs text-gray-500 text-center">
            No se encontraron resultados
          </div>
        )}
        {items.length > 15 && searchValue.length < 2 && (
          <div className="px-2 py-1 text-xs text-gray-500 text-center">
            Escribe al menos 2 caracteres para buscar
          </div>
        )}
      </SelectContent>
    </Select>
  </div>
));

type DocumentoForm = z.infer<typeof documentoSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddDocumentoDialog = memo(({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { placas, loadingPlacas, fetchPlacas } = usePlacas();
  const { empresas, loadingEmpresas, fetchEmpresas } = useEmpresas();
  const [file, setFile] = useState<File | null>(null);
  const [busquedaPlaca, setBusquedaPlaca] = useState('');
  const [busquedaEmpresa, setBusquedaEmpresa] = useState('');
  
  // Estados de debounce optimizados
  const [debouncedBusquedaPlaca, setDebouncedBusquedaPlaca] = useState('');
  const [debouncedBusquedaEmpresa, setDebouncedBusquedaEmpresa] = useState('');

  // Valores por defecto inteligentes
  const defaultValues = useMemo(() => ({
    tipo: '', 
    numero: '', 
    placa: '', 
    entidad_empresa: '', 
    fecha_emision: getTodayDate(), // Fecha actual por defecto
    fecha_vencimiento: getDateInMonths(12), // 12 meses después por defecto
    observaciones: '',
    inspection_result: '', 
    certifying_company: '', 
    cobertura: '', 
    numero_poliza: '',
    owner_dni: '',
  }), []);

  const form = useForm<DocumentoForm>({
    resolver: zodResolver(documentoSchema),
    defaultValues,
  });

  const tipoDocumento = form.watch('tipo');

  // Debounce optimizado para búsquedas
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusquedaPlaca(busquedaPlaca);
    }, 300);
    return () => clearTimeout(timer);
  }, [busquedaPlaca]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusquedaEmpresa(busquedaEmpresa);
    }, 300);
    return () => clearTimeout(timer);
  }, [busquedaEmpresa]);

  // Filtros optimizados con memoización avanzada
  const placasFinales = useMemo(() => {
    if (!debouncedBusquedaPlaca || debouncedBusquedaPlaca.length < 2) {
      return placas.slice(0, 30); // Reducir aún más para mejor performance
    }
    return placas.filter(placa => 
      placa.plateNumber?.toLowerCase().includes(debouncedBusquedaPlaca.toLowerCase())
    ).slice(0, 15);
  }, [placas, debouncedBusquedaPlaca]);

  const empresasFiltradas = useMemo(() => {
    if (!debouncedBusquedaEmpresa || debouncedBusquedaEmpresa.length < 2) {
      return empresas.slice(0, 30);
    }
    return empresas.filter(empresa => 
      empresa.name?.toLowerCase().includes(debouncedBusquedaEmpresa.toLowerCase())
    ).slice(0, 15);
  }, [empresas, debouncedBusquedaEmpresa]);

  // Memoizar validación de archivo para evitar re-renders innecesarios
  const validateFile = useCallback((file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file.size > maxSize) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo no debe superar los 10MB',
        variant: 'destructive',
      });
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten archivos PDF, JPG y PNG',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  }, [toast]);

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

  // Auto-generar número de documento según tipo
  const generateDocumentNumber = useCallback((tipo: string) => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    
    switch (tipo) {
      case 'REVISION':
        return `CITV-${year}-${randomNum}`;
      case 'AFOCAT':
        return `AFC-${year}-${randomNum}`;
      default:
        return `DOC-${year}-${randomNum}`;
    }
  }, []);

  // Auto-completar número cuando cambia el tipo
  useEffect(() => {
    if (tipoDocumento && !form.getValues('numero')) {
      form.setValue('numero', generateDocumentNumber(tipoDocumento));
    }
  }, [tipoDocumento, form, generateDocumentNumber]);
  
  // NUEVO: Reset campos específicos cuando cambia el tipo de documento
  useEffect(() => {
    if (tipoDocumento) {
      // Limpiar campos específicos del tipo anterior
      form.setValue('numero', generateDocumentNumber(tipoDocumento)); // Siempre generar nuevo número
      
      // Reset campos específicos por tipo
      if (tipoDocumento === 'AFOCAT') {
        // Limpiar campos de revisión técnica
        form.setValue('inspection_result', '');
        form.setValue('certifying_company', '');
        // Asegurar que los campos AFOCAT estén inicializados
        if (!form.getValues('numero_poliza')) form.setValue('numero_poliza', '');
        if (!form.getValues('cobertura')) form.setValue('cobertura', '');
        if (!form.getValues('owner_dni')) form.setValue('owner_dni', '');
      } else if (tipoDocumento === 'REVISION') {
        // Limpiar campos de AFOCAT
        form.setValue('numero_poliza', '');
        form.setValue('cobertura', '');
        form.setValue('owner_dni', '');
        // Asegurar que los campos de revisión estén inicializados
        if (!form.getValues('inspection_result')) form.setValue('inspection_result', '');
        if (!form.getValues('certifying_company')) form.setValue('certifying_company', '');
      } else {
        // Para otros tipos, limpiar todos los campos específicos
        form.setValue('inspection_result', '');
        form.setValue('certifying_company', '');
        form.setValue('numero_poliza', '');
        form.setValue('cobertura', '');
        form.setValue('owner_dni', '');
      }
    }
  }, [tipoDocumento, form, generateDocumentNumber]);

  // Auto-completar fecha de vencimiento según tipo de documento
  useEffect(() => {
    if (tipoDocumento && form.getValues('fecha_emision')) {
      const fechaEmision = new Date(form.getValues('fecha_emision'));
      let mesesVencimiento = 12; // Por defecto 12 meses
      
      // Configurar según tipo de documento
      switch (tipoDocumento) {
        case 'REVISION':
          mesesVencimiento = 12; // Revisión técnica: 1 año
          break;
        case 'AFOCAT':
          mesesVencimiento = 12; // AFOCAT: 1 año
          break;
        default:
          mesesVencimiento = 12;
      }
      
      const fechaVencimiento = new Date(fechaEmision);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + mesesVencimiento);
      
      form.setValue('fecha_vencimiento', fechaVencimiento.toISOString().split('T')[0]);
    }
  }, [tipoDocumento, form]);

  // Optimizar efectos con menos dependencias y memoización
  useEffect(() => {
    if (open) {
      // Siempre fetch cuando se abre el diálogo para asegurar datos actualizados
      fetchPlacas();
      fetchEmpresas();
      
      // SIEMPRE reset completo cuando se abre el diálogo
      form.reset({
        ...defaultValues,
        fecha_emision: getTodayDate(), // Siempre fecha actual
        fecha_vencimiento: getDateInMonths(12), // Auto-calcular
      });
      setFile(null);
      setBusquedaPlaca('');
      setBusquedaEmpresa('');
    }
  }, [open, fetchPlacas, fetchEmpresas, form, defaultValues]);

  // Memoizar handlers para evitar re-renders con indicadores de carga
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        toast({
          title: '✅ Archivo cargado',
          description: `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`,
          variant: 'default',
        });
      }
    }
  }, [validateFile, toast]);

  const removeFile = useCallback(() => {
    setFile(null);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, []);

  // Eliminar cálculo de progreso del formulario
  // const formProgress = useMemo(() => {
  //   const values = form.getValues();
  //   const requiredFields = ['tipo', 'numero', 'placa', 'entidad_empresa', 'fecha_emision', 'fecha_vencimiento'];
  //   const completedFields = requiredFields.filter(field => values[field as keyof DocumentoForm]).length;
  //   return Math.round((completedFields / requiredFields.length) * 100);
  // }, [form]);

  // Optimizar onSubmit con useCallback y validaciones mejoradas
  const onSubmit = useCallback(async (values: DocumentoForm) => {
    try {
      // Solo validar archivo para tipos que lo requieren (no REVISION ni AFOCAT)
      if (values.tipo !== 'REVISION' && values.tipo !== 'AFOCAT' && !file) {
        toast({
          title: 'Archivo requerido',
          description: 'Debes subir un archivo para este tipo de documento.',
          variant: 'destructive',
        });
        return;
      }
      
      mutation.mutate({ values, archivo: file });
    } catch (error) {
      toast({
        title: 'Error al registrar',
        description: 'Error al procesar la solicitud',
        variant: 'destructive',
      });
    }
  }, [file, mutation, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl border-0 rounded-2xl max-w-4xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent">
            Registrar Nuevo Documento
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete toda la información requerida para registrar un nuevo documento vehicular en el sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            {/* Paso 1: Selección del Tipo de Documento */}
            <FormSection title="Seleccione el Tipo de Documento">
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium text-center block mb-4">
                          ¿Qué tipo de documento desea registrar? *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-12 focus:border-cyan-500 focus:ring-cyan-500 text-center">
                              <SelectValue placeholder="👆 Seleccionar tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="REVISION" className="py-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">📋</span>
                                <div>
                                  <div className="font-medium">Revisión Técnica</div>
                                  <div className="text-xs text-gray-500">Certificado de inspección vehicular</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="AFOCAT" className="py-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">🛡️</span>
                                <div>
                                  <div className="font-medium">AFOCAT</div>
                                  <div className="text-xs text-gray-500">Seguro obligatorio de accidentes</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm text-center" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FormSection>

            {/* Paso 2: Formulario específico del tipo seleccionado */}
            {tipoDocumento && (
              <>
                {/* Información Principal del Documento */}
                <FormSection title={`Información del ${tipoDocumento === 'REVISION' ? 'Certificado de Revisión Técnica' : 'Seguro AFOCAT'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Número de Documento - Solo para tipos que no sean AFOCAT */}
                    {tipoDocumento !== 'AFOCAT' && (
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              Número de Documento *
                              {field.value && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => tipoDocumento && form.setValue('numero', generateDocumentNumber(tipoDocumento))}
                                  className="ml-2 h-6 px-2 text-xs text-cyan-600 hover:text-cyan-700"
                                >
                                  🔄 Generar
                                </Button>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={tipoDocumento ? `Ej: ${generateDocumentNumber(tipoDocumento)}` : "Selecciona tipo primero"}
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Fecha de Emisión */}
                    <FormField
                      control={form.control}
                      name="fecha_emision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Fecha de Emisión *
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => form.setValue('fecha_emision', getTodayDate())}
                              className="ml-2 h-6 px-2 text-xs text-cyan-600 hover:text-cyan-700"
                            >
                              📅 Hoy
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Fecha de Vencimiento */}
                    <FormField
                      control={form.control}
                      name="fecha_vencimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Fecha de Vencimiento *
                            <span className="text-xs text-gray-500">(Auto-calculada)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                    </FormSection>

                {/* Información del Vehículo y Empresa */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información del Vehículo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placa Vehicular */}
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Placa Vehicular *</FormLabel>
                        <div className="space-y-2">
                          <Input
                            placeholder="Buscar placa vehicular..."
                            value={busquedaPlaca}
                            onChange={(e) => setBusquedaPlaca(e.target.value.toUpperCase())}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                          />
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={loadingPlacas}
                            >
                              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500">
                                <SelectValue placeholder={loadingPlacas ? 'Cargando placas...' : 'Seleccionar placa'} />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                                {placasFinales.map((placa) => (
                                  placa.plateNumber ? (
                                    <SelectItem key={placa.plateNumber} value={placa.plateNumber}>
                                      {placa.plateNumber}
                                    </SelectItem>
                                  ) : null
                                ))}
                                {placas.length > 50 && busquedaPlaca.length < 2 && (
                                  <div className="px-2 py-1 text-xs text-gray-500 text-center">
                                    Escribe al menos 2 caracteres para buscar
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Empresa/Entidad Emisora */}
                  <FormField
                    control={form.control}
                    name="entidad_empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                          Empresa/Entidad Emisora *
                        </FormLabel>
                        <div className="space-y-2">
                          <Input
                            placeholder="Buscar empresa..."
                            value={busquedaEmpresa}
                            onChange={(e) => setBusquedaEmpresa(e.target.value)}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                          />
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={loadingEmpresas}
                            >
                              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500">
                                <SelectValue placeholder={loadingEmpresas ? 'Cargando empresas...' : 'Seleccionar empresa'} />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                                {empresasFiltradas.map((empresa) => (
                                  empresa.name ? (
                                    <SelectItem key={empresa.name} value={empresa.name}>
                                      {empresa.name}
                                    </SelectItem>
                                  ) : null
                                ))}
                                {empresas.length > 50 && busquedaEmpresa.length < 2 && (
                                  <div className="px-2 py-1 text-xs text-gray-500 text-center">
                                    Escribe al menos 2 caracteres para buscar
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Campos Específicos por Tipo de Documento */}
            {(tipoDocumento === 'REVISION' || tipoDocumento === 'AFOCAT') && (
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Específica del {tipoDocumento === 'REVISION' ? 'Revisión Técnica' : 'AFOCAT'}
                  </h3>
                  
                  {tipoDocumento === 'REVISION' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="inspection_result"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Resultado de Inspección *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500">
                                  <SelectValue placeholder="Seleccionar resultado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectItem value="APROBADO">APROBADO</SelectItem>
                                <SelectItem value="OBSERVADO">OBSERVADO</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="certifying_company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Empresa Certificadora *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ej: TECSUP S.A."
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {tipoDocumento === 'AFOCAT' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="cobertura"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Cobertura *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresa el tipo de cobertura (ej: Nacional, Internacional)"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numero_poliza"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">N° de Póliza *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ej: POL-123456"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="owner_dni"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">DNI del Propietario *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ej: 12345678"
                                maxLength={8}
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Observaciones y Archivo - Solo para tipos que no sean AFOCAT */}
            {tipoDocumento !== 'AFOCAT' && (
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
                <CardContent className="p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Adicional
                  </h3>
                  
                  {/* Observaciones */}
                  <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Observaciones</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Observaciones adicionales sobre el documento..."
                            rows={3}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* File Upload Section - Optimizado */}
                  {tipoDocumento !== 'REVISION' && (
                    <div className="space-y-3">
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Archivo del Documento
                      </FormLabel>
                      
                      {!file ? (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
                              📁
                            </div>
                            <div>
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileInput"
                              />
                              <label
                                htmlFor="fileInput"
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                Seleccionar Archivo
                              </label>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF, JPG, PNG • Máx. 10MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center">
                                📄
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
              </>
            )}

            {/* Action Buttons - Solo se muestran si hay tipo seleccionado */}
            {tipoDocumento && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                className="rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 disabled:opacity-50"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg px-6 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Registrando...
                  </>
                ) : (
                  <>
                    Registrar Documento
                  </>
                )}
              </Button>
            </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});