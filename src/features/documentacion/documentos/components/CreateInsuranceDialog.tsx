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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { documentosService } from '../services/documentosService';
import { useToast } from "@/hooks/use-toast";
import { Shield, Calendar, Car, CreditCard, User, Building2, AlertCircle, FileText, Info } from "lucide-react";

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
  licenseId: number;
  ownerDni: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export const CreateInsuranceDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    insuranceCompanyName: '',
    policyNumber: '',
    vehiclePlate: '',
    startDate: '',
    expirationDate: '',
    coverage: '',
    licenseId: 0,
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
        licenseId: 0,
        ownerDni: '',
      });
      setErrors([]);
    }
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

    // Validación del ID de licencia del conductor (número entero positivo >= 1)
    if (!formData.licenseId || formData.licenseId < 1) {
      newErrors.push({
        field: 'licenseId',
        message: 'El ID de la licencia del conductor es obligatorio y debe ser un número válido'
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
      const response = await documentosService.createInsurance({
        insuranceCompanyName: formData.insuranceCompanyName,
        policyNumber: formData.policyNumber,
        vehiclePlate: formData.vehiclePlate,
        startDate: formData.startDate,
        expirationDate: formData.expirationDate,
        coverage: formData.coverage,
        licenseId: formData.licenseId,
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            Crear Nuevo Seguro AFOCAT
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Complete los datos para registrar un nuevo seguro AFOCAT en el sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerta de errores generales */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor corrija los siguientes errores antes de continuar:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Información de la Compañía Aseguradora */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Información de la Aseguradora</h3>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre de la Compañía */}
              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyName" className="flex items-center gap-1">
                  Compañía de Seguros
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="insuranceCompanyName"
                  value={formData.insuranceCompanyName}
                  onChange={(e) => handleInputChange('insuranceCompanyName', e.target.value)}
                  placeholder="Ej: MAPFRE Seguros"
                  className={hasError('insuranceCompanyName') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('insuranceCompanyName') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('insuranceCompanyName')}
                  </p>
                )}
                <p className="text-xs text-gray-500">De 2 a 100 caracteres</p>
              </div>

              {/* Número de Póliza */}
              <div className="space-y-2">
                <Label htmlFor="policyNumber" className="flex items-center gap-1">
                  Número de Póliza
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value.toUpperCase())}
                  placeholder="POL-2025-002"
                  className={hasError('policyNumber') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('policyNumber') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('policyNumber')}
                  </p>
                )}
                <p className="text-xs text-gray-500">Formato: XXX-YYYY-NNN (5-20 caracteres)</p>
              </div>
            </div>
          </div>

          {/* Información del Vehículo y Conductor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Información del Vehículo y Conductor</h3>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Placa del Vehículo */}
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate" className="flex items-center gap-1">
                  Placa del Vehículo
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={(e) => handleInputChange('vehiclePlate', e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={10}
                  className={hasError('vehiclePlate') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('vehiclePlate') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('vehiclePlate')}
                  </p>
                )}
                <p className="text-xs text-gray-500">6-10 caracteres alfanuméricos</p>
              </div>

              {/* DNI del Propietario */}
              <div className="space-y-2">
                <Label htmlFor="ownerDni" className="flex items-center gap-1">
                  DNI del Propietario
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerDni"
                  value={formData.ownerDni}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) {
                      handleInputChange('ownerDni', value);
                    }
                  }}
                  placeholder="12345678"
                  maxLength={8}
                  className={hasError('ownerDni') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('ownerDni') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('ownerDni')}
                  </p>
                )}
                <p className="text-xs text-gray-500">8 dígitos numéricos</p>
              </div>

              {/* ID de Licencia del Conductor */}
              <div className="space-y-2">
                <Label htmlFor="licenseId" className="flex items-center gap-1">
                  ID Licencia del Conductor
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="licenseId"
                  type="number"
                  value={formData.licenseId || ''}
                  onChange={(e) => handleInputChange('licenseId', parseInt(e.target.value) || 0)}
                  placeholder="Ej: 1, 2, 3..."
                  min="1"
                  className={hasError('licenseId') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('licenseId') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('licenseId')}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  <Info className="w-3 h-3 inline mr-1" />
                  ID interno del conductor en el sistema (consultar en Gestión de Conductores)
                </p>
              </div>
            </div>
          </div>

          {/* Período de Cobertura */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Período de Cobertura</h3>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Inicio */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-1">
                  Fecha de Inicio
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={hasError('startDate') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('startDate') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('startDate')}
                  </p>
                )}
                <p className="text-xs text-gray-500">Formato: YYYY-MM-DD</p>
              </div>

              {/* Fecha de Vencimiento */}
              <div className="space-y-2">
                <Label htmlFor="expirationDate" className="flex items-center gap-1">
                  Fecha de Vencimiento
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  min={formData.startDate || undefined}
                  className={hasError('expirationDate') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {getFieldError('expirationDate') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('expirationDate')}
                  </p>
                )}
                <p className="text-xs text-gray-500">Debe ser posterior a la fecha de inicio</p>
              </div>
            </div>
          </div>

          {/* Tipo de Cobertura */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Tipo de Cobertura</h3>
            </div>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="coverage" className="flex items-center gap-1">
                Cobertura del Seguro
                <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.coverage} 
                onValueChange={(value) => handleInputChange('coverage', value)}
              >
                <SelectTrigger className={hasError('coverage') ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                  <SelectValue placeholder="Seleccione el tipo de cobertura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cobertura completa contra accidentes de tránsito, daños a terceros, lesiones personales y daños materiales">
                    <div className="flex flex-col gap-1 py-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">COMPREHENSIVE</Badge>
                        <span className="font-semibold">Cobertura Completa</span>
                      </div>
                      <span className="text-xs text-gray-600">Accidentes, daños a terceros, lesiones y daños materiales</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Cobertura básica contra accidentes de tránsito y responsabilidad civil frente a terceros">
                    <div className="flex flex-col gap-1 py-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-blue-600">BASIC</Badge>
                        <span className="font-semibold">Cobertura Básica</span>
                      </div>
                      <span className="text-xs text-gray-600">Accidentes de tránsito y responsabilidad civil</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Cobertura únicamente para responsabilidad civil frente a terceros según normativa vigente">
                    <div className="flex flex-col gap-1 py-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-orange-600">THIRD PARTY</Badge>
                        <span className="font-semibold">Solo Terceros</span>
                      </div>
                      <span className="text-xs text-gray-600">Únicamente responsabilidad civil frente a terceros</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {getFieldError('coverage') && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('coverage')}
                </p>
              )}
              {formData.coverage && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{formData.coverage}</span>
                  </p>
                </div>
              )}
            </div>
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