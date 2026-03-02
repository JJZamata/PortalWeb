import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { documentosService } from '../services/documentosService';
import { vehiculosService } from '../../../vehiculos/mototaxis/services/vehiculosService';
import { conductoresService } from '../../../personal/conductores/services/conductoresService';
import { useToast } from "@/hooks/use-toast";
import { Shield, Calendar, Car, AlertCircle, FileText, Info } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  insuranceCompanyName: string;
  policyNumber: string;
  vehiclePlate: string;
  startDate: string;
  expirationDate: string;
  coverage: string;
  driverDni: string;
  ownerDni: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface VehicleOption {
  plate: string;
  ownerDni: string;
  ownerName: string;
}

export const CreateInsuranceDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [loadingVehicleOptions, setLoadingVehicleOptions] = useState(false);
  const [autoFillingVehicleData, setAutoFillingVehicleData] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    insuranceCompanyName: '',
    policyNumber: '',
    vehiclePlate: '',
    startDate: '',
    expirationDate: '',
    coverage: '',
    driverDni: '',
    ownerDni: '',
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];
      const oneYearLater = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      
      setFormData({
        insuranceCompanyName: '',
        policyNumber: '',
        vehiclePlate: '',
        startDate: today,
        expirationDate: oneYearLater,
        coverage: '',
        driverDni: '',
        ownerDni: '',
      });
      setErrors([]);
    }
  }, [open]);

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
            ownerDni: String(vehicle?.propietario?.dni || vehicle?.ownerDni || '').trim(),
            ownerName: String(vehicle?.propietario?.nombreCompleto || vehicle?.ownerName || '').trim(),
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

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar errores al cambiar el campo
    if (errors.length > 0) {
      setErrors(errors.filter(error => error.field !== field));
    }
  };

  const handleVehicleSelection = async (selectedPlate: string) => {
    const normalizedPlate = String(selectedPlate || '').toUpperCase().trim();
    const selectedVehicle = vehicleOptions.find((vehicle) => vehicle.plate === normalizedPlate);

    setFormData((prev) => ({
      ...prev,
      vehiclePlate: normalizedPlate,
      ownerDni: selectedVehicle?.ownerDni || prev.ownerDni,
    }));

    setErrors((prev) => prev.filter((error) => !['vehiclePlate', 'ownerDni'].includes(error.field)));

    if (!normalizedPlate) return;

    setAutoFillingVehicleData(true);
    try {
      const detail = await vehiculosService.getVehiculoDetail(normalizedPlate);
      const ownerDniFromDetail = String(detail?.propietario?.dni || detail?.ownerDni || selectedVehicle?.ownerDni || '').trim();

      setFormData((prev) => ({
        ...prev,
        vehiclePlate: normalizedPlate,
        ownerDni: ownerDniFromDetail || prev.ownerDni,
      }));
    } catch (error) {
      toast({
        title: 'No se pudo autocompletar',
        description: 'No se pudieron recuperar todos los datos del vehículo. Verifica matrícula y conductor.',
        variant: 'destructive',
      });
    } finally {
      setAutoFillingVehicleData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    // Validación del nombre de la compañía (2-100 caracteres)
    if (!formData.insuranceCompanyName.trim()) {
      newErrors.push({
        field: 'insuranceCompanyName',
        message: 'El nombre de la compañía de seguros es obligatorio'
      });
    } else if (formData.insuranceCompanyName.length < 2 || formData.insuranceCompanyName.length > 100) {
      newErrors.push({
        field: 'insuranceCompanyName',
        message: 'El nombre debe tener entre 2 y 100 caracteres'
      });
    }

    // Validación del número de póliza (5-20 caracteres, formato XXX-YYYY-NNN)
    if (!formData.policyNumber.trim()) {
      newErrors.push({
        field: 'policyNumber',
        message: 'El número de póliza es obligatorio'
      });
    } else if (formData.policyNumber.length < 5 || formData.policyNumber.length > 20) {
      newErrors.push({
        field: 'policyNumber',
        message: 'El número de póliza debe tener entre 5 y 20 caracteres'
      });
    } else if (!/^[A-Z0-9-]+$/.test(formData.policyNumber)) {
      newErrors.push({
        field: 'policyNumber',
        message: 'Solo se permiten letras mayúsculas, números y guiones (Ej: POL-2025-002)'
      });
    }

    // Validación de la placa (6-10 caracteres alfanuméricos)
    if (!formData.vehiclePlate.trim()) {
      newErrors.push({
        field: 'vehiclePlate',
        message: 'La placa del vehículo es obligatoria'
      });
    } else if (formData.vehiclePlate.length < 6 || formData.vehiclePlate.length > 10) {
      newErrors.push({
        field: 'vehiclePlate',
        message: 'La placa debe tener entre 6 y 10 caracteres'
      });
    } else if (!/^[A-Z0-9]+$/.test(formData.vehiclePlate)) {
      newErrors.push({
        field: 'vehiclePlate',
        message: 'La placa solo puede contener letras y números'
      });
    }

    // Validación de fechas
    if (!formData.startDate) {
      newErrors.push({
        field: 'startDate',
        message: 'La fecha de inicio es obligatoria'
      });
    }

    if (!formData.expirationDate) {
      newErrors.push({
        field: 'expirationDate',
        message: 'La fecha de vencimiento es obligatoria'
      });
    } else if (formData.startDate && new Date(formData.expirationDate) <= new Date(formData.startDate)) {
      newErrors.push({
        field: 'expirationDate',
        message: 'La fecha de vencimiento debe ser posterior a la fecha de inicio'
      });
    }

    // Validación de la cobertura (10-1000 caracteres)
    if (!formData.coverage.trim()) {
      newErrors.push({
        field: 'coverage',
        message: 'Debe seleccionar un tipo de cobertura'
      });
    } else if (formData.coverage.length < 10 || formData.coverage.length > 1000) {
      newErrors.push({
        field: 'coverage',
        message: 'La cobertura debe tener entre 10 y 1000 caracteres'
      });
    }

    // Validación del DNI del conductor (exactamente 8 dígitos)
    if (!formData.driverDni.trim()) {
      newErrors.push({
        field: 'driverDni',
        message: 'El DNI del conductor es obligatorio'
      });
    } else if (!/^\d{8}$/.test(formData.driverDni)) {
      newErrors.push({
        field: 'driverDni',
        message: 'El DNI del conductor debe contener exactamente 8 dígitos numéricos'
      });
    }

    // Validación del DNI del propietario (exactamente 8 dígitos)
    if (!formData.ownerDni.trim()) {
      newErrors.push({
        field: 'ownerDni',
        message: 'El DNI del propietario es obligatorio'
      });
    } else if (!/^\d{8}$/.test(formData.ownerDni)) {
      newErrors.push({
        field: 'ownerDni',
        message: 'El DNI debe contener exactamente 8 dígitos numéricos'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los campos resaltados",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const conductorDetail = await conductoresService.getConductorDetail(formData.driverDni);
      const licencias = Array.isArray(conductorDetail?.licencias) ? conductorDetail.licencias : [];

      const sortedLicencias = [...licencias].sort((a: any, b: any) => {
        const aDays = Number(a?.diasParaVencimiento ?? Number.MAX_SAFE_INTEGER);
        const bDays = Number(b?.diasParaVencimiento ?? Number.MAX_SAFE_INTEGER);

        const aIsValid = aDays >= 0;
        const bIsValid = bDays >= 0;

        if (aIsValid !== bIsValid) return aIsValid ? -1 : 1;
        return aDays - bDays;
      });

      const selectedLicense = sortedLicencias[0];
      const resolvedLicenseId = Number(selectedLicense?.licenseId ?? selectedLicense?.id ?? 0);

      if (!resolvedLicenseId || resolvedLicenseId < 1) {
        throw new Error('El conductor no tiene una licencia válida registrada para asociar al AFOCAT.');
      }

      const response = await documentosService.createInsurance({
        insuranceCompanyName: formData.insuranceCompanyName,
        policyNumber: formData.policyNumber,
        vehiclePlate: formData.vehiclePlate,
        startDate: formData.startDate,
        expirationDate: formData.expirationDate,
        coverage: formData.coverage,
        licenseId: resolvedLicenseId,
        ownerDni: formData.ownerDni,
      });

      if (response.success) {
        toast({
          title: "✅ Seguro AFOCAT creado",
          description: response.message || "El seguro ha sido creado exitosamente",
        });

        onOpenChange(false);
        onSuccess();
      }
    } catch (error: any) {
      // Manejar errores específicos del backend
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setErrors(error.response.data.errors);
      }

      toast({
        title: "❌ Error al crear",
        description: error?.response?.data?.message || error?.message || "No se pudo crear el seguro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error?.message;
  };

  const hasError = (field: string) => {
    return errors.some(err => err.field === field);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Crear Nuevo Seguro AFOCAT
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Complete los datos para registrar un nuevo seguro AFOCAT en el sistema
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
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Información de la Aseguradora
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceCompanyName" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Shield className="w-4 h-4" />
                      Compañía de Seguros *
                    </Label>
                    <Input
                      id="insuranceCompanyName"
                      value={formData.insuranceCompanyName}
                      onChange={(e) => handleInputChange('insuranceCompanyName', e.target.value)}
                      placeholder="Ej: MAPFRE Seguros"
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('insuranceCompanyName') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('insuranceCompanyName') && <p className="text-sm text-red-600">{getFieldError('insuranceCompanyName')}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">De 2 a 100 caracteres.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyNumber" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <FileText className="w-4 h-4" />
                      Número de Póliza *
                    </Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value.toUpperCase())}
                      placeholder="POL-2025-002"
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('policyNumber') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('policyNumber') && <p className="text-sm text-red-600">{getFieldError('policyNumber')}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Formato: XXX-YYYY-NNN (5-20 caracteres).</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Car className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Información del Vehículo y Conductor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehiclePlate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Car className="w-4 h-4" />
                      Placa del Vehículo *
                    </Label>
                    <Select
                      value={formData.vehiclePlate}
                      onValueChange={handleVehicleSelection}
                      disabled={loadingVehicleOptions}
                    >
                      <SelectTrigger id="vehiclePlate" className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('vehiclePlate') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                        <SelectValue placeholder={loadingVehicleOptions ? 'Cargando matrículas...' : 'Selecciona una matrícula'} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleOptions.length > 0 ? (
                          vehicleOptions.map((vehicle) => (
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
                    {getFieldError('vehiclePlate') && <p className="text-sm text-red-600">{getFieldError('vehiclePlate')}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selecciona matrícula para autocompletar el propietario.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerDni" className="text-gray-700 dark:text-gray-300 font-medium">DNI del Propietario *</Label>
                    <Input
                      id="ownerDni"
                      value={formData.ownerDni}
                      onChange={() => {}}
                      placeholder="12345678"
                      maxLength={8}
                      readOnly
                      disabled
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 ${hasError('ownerDni') ? 'border-red-500' : ''}`}
                    />
                    {getFieldError('ownerDni') && <p className="text-sm text-red-600">{getFieldError('ownerDni')}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Campo autocompletado por matrícula.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driverDni" className="text-gray-700 dark:text-gray-300 font-medium">DNI del Conductor *</Label>
                    <Input
                      id="driverDni"
                      value={formData.driverDni}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 8) {
                          handleInputChange('driverDni', value);
                        }
                      }}
                      placeholder="12345678"
                      maxLength={8}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('driverDni') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('driverDni') && <p className="text-sm text-red-600">{getFieldError('driverDni')}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {autoFillingVehicleData
                        ? 'Cargando datos del vehículo seleccionado...'
                        : 'Ingresa el DNI; el sistema resolverá automáticamente una licencia vigente.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Período de Cobertura
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Calendar className="w-4 h-4" />
                      Fecha de Inicio *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('startDate') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('startDate') && <p className="text-sm text-red-600">{getFieldError('startDate')}</p>}
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
                      onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      min={formData.startDate || undefined}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('expirationDate') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {getFieldError('expirationDate') && <p className="text-sm text-red-600">{getFieldError('expirationDate')}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Tipo de Cobertura
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="coverage" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <FileText className="w-4 h-4" />
                    Cobertura del Seguro *
                  </Label>
                  <Select
                    value={formData.coverage}
                    onValueChange={(value) => handleInputChange('coverage', value)}
                  >
                    <SelectTrigger className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500 ${hasError('coverage') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder="Selecciona el tipo de cobertura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cobertura completa contra accidentes de tránsito, daños a terceros, lesiones personales y daños materiales">
                        COMPREHENSIVE - Cobertura Completa
                      </SelectItem>
                      <SelectItem value="Cobertura básica contra accidentes de tránsito y responsabilidad civil frente a terceros">
                        BASIC - Cobertura Básica
                      </SelectItem>
                      <SelectItem value="Cobertura únicamente para responsabilidad civil frente a terceros según normativa vigente">
                        THIRD PARTY - Solo Terceros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('coverage') && <p className="text-sm text-red-600">{getFieldError('coverage')}</p>}
                </div>

                {formData.coverage && (
                  <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5" />
                    <span>{formData.coverage}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Crear Seguro AFOCAT
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};