import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Car, Calendar, Building2, AlertCircle } from 'lucide-react';
import tucService from '../services/tucService';
import { vehiculosService } from '../../../vehiculos/mototaxis/services/vehiculosService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
  isRenewal?: boolean;
}

interface FormData {
  tucNumber: string;
  vehiclePlate: string;
  issueDate: string;
  expirationDate: string;
  validityDate: string;
  registralCode: string;
  supportDocument: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface VehicleOption {
  plate: string;
}

export const CreateTUCDialog = ({ open, onOpenChange, onSuccess, initialData, isRenewal = false }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [loadingVehicleOptions, setLoadingVehicleOptions] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    tucNumber: '',
    vehiclePlate: '',
    issueDate: '',
    expirationDate: '',
    validityDate: '',
    registralCode: '',
    supportDocument: '',
  });

  useEffect(() => {
    if (!open) return;

    const today = new Date();
    const issueDate = today.toISOString().split('T')[0];
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);
    const expirationDate = oneYearLater.toISOString().split('T')[0];

    setFormData(() => ({
      tucNumber: '',
      vehiclePlate: String(initialData?.vehiclePlate ?? '').toUpperCase().trim(),
      issueDate: initialData?.issueDate ?? issueDate,
      expirationDate: initialData?.expirationDate ?? initialData?.validityDate ?? expirationDate,
      validityDate: initialData?.validityDate ?? initialData?.expirationDate ?? expirationDate,
      registralCode: initialData?.registralCode ?? '',
      supportDocument: initialData?.supportDocument ?? '',
    }));
    setErrors([]);
  }, [open, initialData]);

  useEffect(() => {
    const loadVehicleOptions = async () => {
      if (!open) return;

      setLoadingVehicleOptions(true);
      try {
        const firstPage = await vehiculosService.getVehiculos(1, '');
        const totalPages = Number(firstPage?.pagination?.totalPages || 1);
        let vehicles = Array.isArray(firstPage?.vehicles) ? firstPage.vehicles : [];

        if (totalPages > 1) {
          const restPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              vehiculosService.getVehiculos(index + 2, '')
            )
          );

          restPages.forEach((pageResult: any) => {
            if (Array.isArray(pageResult?.vehicles)) {
              vehicles = [...vehicles, ...pageResult.vehicles];
            }
          });
        }

        const mappedOptions = vehicles
          .map((vehicle: any) => ({
            plate: String(vehicle?.placa?.plateNumber || vehicle?.placa_v || '').trim().toUpperCase(),
          }))
          .filter((item: VehicleOption) => item.plate.length > 0)
          .filter((item: VehicleOption, index: number, array: VehicleOption[]) =>
            array.findIndex((target: VehicleOption) => target.plate === item.plate) === index
          )
          .sort((a: VehicleOption, b: VehicleOption) => a.plate.localeCompare(b.plate));

        setVehicleOptions(mappedOptions);
      } catch (error) {
        setVehicleOptions([]);
      } finally {
        setLoadingVehicleOptions(false);
      }
    };

    loadVehicleOptions();
  }, [open]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors.length > 0) {
      setErrors(errors.filter((error) => error.field !== field));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.tucNumber.trim()) {
      newErrors.push({ field: 'tucNumber', message: 'El número de TUC es obligatorio' });
    } else if (formData.tucNumber.length > 20) {
      newErrors.push({ field: 'tucNumber', message: 'Máximo 20 caracteres' });
    }

    if (!formData.vehiclePlate.trim()) {
      newErrors.push({ field: 'vehiclePlate', message: 'La placa del vehículo es obligatoria' });
    } else if (formData.vehiclePlate.length < 6 || formData.vehiclePlate.length > 10) {
      newErrors.push({ field: 'vehiclePlate', message: 'La placa debe tener entre 6 y 10 caracteres' });
    }

    if (!formData.issueDate) {
      newErrors.push({ field: 'issueDate', message: 'La fecha de emisión es obligatoria' });
    }

    if (!formData.expirationDate) {
      newErrors.push({ field: 'expirationDate', message: 'La fecha de vencimiento es obligatoria' });
    } else {
      if (formData.issueDate && new Date(formData.expirationDate) <= new Date(formData.issueDate)) {
        newErrors.push({ field: 'expirationDate', message: 'La fecha de vencimiento debe ser posterior a la emisión' });
      }
    }

    if (!formData.registralCode.trim()) {
      newErrors.push({ field: 'registralCode', message: 'El código registral es obligatorio' });
    } else if (formData.registralCode.length > 50) {
      newErrors.push({ field: 'registralCode', message: 'Máximo 50 caracteres' });
    }

    if (!formData.supportDocument.trim()) {
      newErrors.push({ field: 'supportDocument', message: 'El documento soporte es obligatorio' });
    } else if (formData.supportDocument.length > 50) {
      newErrors.push({ field: 'supportDocument', message: 'Máximo 50 caracteres' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Corrige los campos resaltados',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await tucService.createTUC({
        tucNumber: formData.tucNumber,
        vehiclePlate: formData.vehiclePlate.toUpperCase(),
        issueDate: formData.issueDate,
        expirationDate: formData.expirationDate,
        validityDate: formData.expirationDate,
        registralCode: formData.registralCode,
        supportDocument: formData.supportDocument,
      });

      toast({
        title: '✅ TUC creada',
        description: 'La TUC ha sido creada exitosamente',
      });

      onOpenChange(false);
      setFormData({
        tucNumber: '',
        vehiclePlate: '',
        issueDate: '',
        expirationDate: '',
        validityDate: '',
        registralCode: '',
        supportDocument: '',
      });
      onSuccess();
    } catch (error: any) {
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setErrors(error.response.data.errors);
      }
      toast({
        title: '❌ Error al crear',
        description: error?.response?.data?.message || error?.message || 'No se pudo crear la TUC',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => errors.find((err) => err.field === field)?.message;
  const hasError = (field: string) => errors.some((err) => err.field === field);
  const selectedPlate = String(formData.vehiclePlate || '').toUpperCase().trim();
  const plateExistsInOptions = vehicleOptions.some((vehicle) => vehicle.plate === selectedPlate);
  const vehicleOptionsForSelect =
    selectedPlate && !plateExistsInOptions
      ? [{ plate: selectedPlate }, ...vehicleOptions]
      : vehicleOptions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {isRenewal ? 'Renovar TUC' : 'Crear Nueva TUC'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            {isRenewal
              ? 'Registra la renovación de la Tarjeta Única de Circulación manteniendo el historial.'
              : 'Complete la información para registrar una nueva Tarjeta Única de Circulación.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {errors.length > 0 && (
            <div className="p-3 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-800 dark:text-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
                Corrige los errores para continuar:
              </div>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((err, idx) => (
                  <li key={idx}>{err.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Datos de la TUC
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tucNumber" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <FileText className="w-4 h-4" />
                      Número de TUC *
                    </Label>
                    <Input
                      id="tucNumber"
                      value={formData.tucNumber}
                      onChange={(e) => handleInputChange('tucNumber', e.target.value)}
                      placeholder="Ej: TUC001"
                      maxLength={20}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('tucNumber') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('tucNumber') && <p className="text-sm text-red-600">{getFieldError('tucNumber')}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehiclePlate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Car className="w-4 h-4" />
                      Placa del Vehículo *
                    </Label>
                    {isRenewal ? (
                      <Input
                        id="vehiclePlate"
                        value={selectedPlate}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-lg h-11 cursor-not-allowed text-gray-900 dark:text-white"
                      />
                    ) : (
                      <Select
                        value={formData.vehiclePlate}
                        onValueChange={(value) => handleInputChange('vehiclePlate', value)}
                        disabled={loadingVehicleOptions}
                      >
                        <SelectTrigger id="vehiclePlate" className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('vehiclePlate') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder={loadingVehicleOptions ? 'Cargando matrículas...' : 'Selecciona una matrícula'} />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleOptionsForSelect.length > 0 ? (
                            vehicleOptionsForSelect.map((vehicle) => (
                              <SelectItem key={vehicle.plate} value={vehicle.plate}>
                                {vehicle.plate}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__no-vehicles" disabled>
                              No hay matrículas disponibles
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {getFieldError('vehiclePlate') && <p className="text-sm text-red-600">{getFieldError('vehiclePlate')}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isRenewal
                        ? 'Matrícula bloqueada en renovación para mantener el historial de la TUC.'
                        : 'Selecciona una matrícula registrada en el sistema.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Calendar className="w-4 h-4" />
                      Fecha de Emisión *
                    </Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('issueDate') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('issueDate') && <p className="text-sm text-red-600">{getFieldError('issueDate')}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expirationDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Calendar className="w-4 h-4" />
                      Fecha de Vencimiento *
                    </Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={formData.expirationDate}
                      min={formData.issueDate || undefined}
                      onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('expirationDate') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('expirationDate') && <p className="text-sm text-red-600">{getFieldError('expirationDate')}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registralCode" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Building2 className="w-4 h-4" />
                      Código Registral *
                    </Label>
                    <Input
                      id="registralCode"
                      value={formData.registralCode}
                      onChange={(e) => handleInputChange('registralCode', e.target.value)}
                      placeholder="REG123"
                      maxLength={50}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('registralCode') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('registralCode') && <p className="text-sm text-red-600">{getFieldError('registralCode')}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="supportDocument" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <FileText className="w-4 h-4" />
                      Documento Soporte *
                    </Label>
                    <Input
                      id="supportDocument"
                      value={formData.supportDocument}
                      onChange={(e) => handleInputChange('supportDocument', e.target.value)}
                      placeholder="DOC456"
                      maxLength={50}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('supportDocument') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('supportDocument') && <p className="text-sm text-red-600">{getFieldError('supportDocument')}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? (isRenewal ? 'Renovando...' : 'Creando...') : (isRenewal ? 'Renovar TUC' : 'Crear TUC')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
