import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { documentosService } from '../services/documentosService';
import { useToast } from "@/hooks/use-toast";
import { Shield, Calendar, Car, CreditCard, User, Building2 } from "lucide-react";

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
      setFormData({
        insuranceCompanyName: '',
        policyNumber: '',
        vehiclePlate: '',
        startDate: new Date().toISOString().split('T')[0], // Hoy
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 año después
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

    // Validación del nombre de la compañía
    if (!formData.insuranceCompanyName.trim()) {
      newErrors.push({
        field: 'insuranceCompanyName',
        message: 'El nombre de la compañía de seguros es obligatorio'
      });
    } else if (formData.insuranceCompanyName.length > 100) {
      newErrors.push({
        field: 'insuranceCompanyName',
        message: 'El nombre de la compañía no debe exceder los 100 caracteres'
      });
    }

    // Validación del número de póliza
    if (!formData.policyNumber.trim()) {
      newErrors.push({
        field: 'policyNumber',
        message: 'El número de póliza es obligatorio'
      });
    } else if (formData.policyNumber.length > 20) {
      newErrors.push({
        field: 'policyNumber',
        message: 'El número de póliza no debe exceder los 20 caracteres'
      });
    }

    // Validación de la placa
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
        message: 'La placa solo puede contener letras mayúsculas y números'
      });
    }

    // Validación de la fecha de inicio
    if (!formData.startDate) {
      newErrors.push({
        field: 'startDate',
        message: 'La fecha de inicio es obligatoria'
      });
    } else {
      const startDate = new Date(formData.startDate);
      const maxFutureDate = new Date();
      maxFutureDate.setDate(maxFutureDate.getDate() + 30); // 30 días en el futuro

      if (startDate > maxFutureDate) {
        newErrors.push({
          field: 'startDate',
          message: 'La fecha de inicio no puede ser más de 30 días en el futuro'
        });
      }
    }

    // Validación de la fecha de vencimiento
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
    } else if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const expirationDate = new Date(formData.expirationDate);
      const minExpirationDate = new Date(startDate);
      minExpirationDate.setDate(minExpirationDate.getDate() + 30); // Mínimo 30 días
      const maxExpirationDate = new Date(startDate);
      maxExpirationDate.setFullYear(maxExpirationDate.getFullYear() + 2); // Máximo 2 años

      if (expirationDate < minExpirationDate) {
        newErrors.push({
          field: 'expirationDate',
          message: 'La cobertura debe tener una duración mínima de 30 días'
        });
      } else if (expirationDate > maxExpirationDate) {
        newErrors.push({
          field: 'expirationDate',
          message: 'La cobertura no puede exceder los 2 años'
        });
      }
    }

    // Validación de la cobertura
    if (!formData.coverage.trim()) {
      newErrors.push({
        field: 'coverage',
        message: 'La cobertura es obligatoria'
      });
    }

    // Validación del ID de licencia
    if (!formData.licenseId || formData.licenseId <= 0) {
      newErrors.push({
        field: 'licenseId',
        message: 'El ID de licencia es obligatorio'
      });
    }

    // Validación del DNI del propietario
    if (!formData.ownerDni.trim()) {
      newErrors.push({
        field: 'ownerDni',
        message: 'El DNI del propietario es obligatorio'
      });
    } else if (!/^\d{8}$/.test(formData.ownerDni)) {
      newErrors.push({
        field: 'ownerDni',
        message: 'El DNI debe tener exactamente 8 dígitos numéricos'
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
      console.error('Error al crear seguro:', error);

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Crear Nuevo Seguro AFOCAT
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre de la Compañía */}
            <div className="space-y-2">
              <Label htmlFor="insuranceCompanyName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Compañía de Seguros *
              </Label>
              <Input
                id="insuranceCompanyName"
                value={formData.insuranceCompanyName}
                onChange={(e) => handleInputChange('insuranceCompanyName', e.target.value)}
                placeholder="Ej: MAPFRE Seguros, Rímac Seguros"
                className={`border-gray-200 dark:border-gray-700 ${hasError('insuranceCompanyName') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('insuranceCompanyName') && (
                <p className="text-sm text-red-600">{getFieldError('insuranceCompanyName')}</p>
              )}
            </div>

            {/* Número de Póliza */}
            <div className="space-y-2">
              <Label htmlFor="policyNumber" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Número de Póliza *
              </Label>
              <Input
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                placeholder="Ej: POL-2024-123456"
                className={`border-gray-200 dark:border-gray-700 ${hasError('policyNumber') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('policyNumber') && (
                <p className="text-sm text-red-600">{getFieldError('policyNumber')}</p>
              )}
            </div>

            {/* Placa del Vehículo */}
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Placa del Vehículo *
              </Label>
              <Input
                id="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={(e) => handleInputChange('vehiclePlate', e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                className={`border-gray-200 dark:border-gray-700 ${hasError('vehiclePlate') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('vehiclePlate') && (
                <p className="text-sm text-red-600">{getFieldError('vehiclePlate')}</p>
              )}
            </div>

            {/* ID de Licencia */}
            <div className="space-y-2">
              <Label htmlFor="licenseId" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                ID de Licencia *
              </Label>
              <Input
                id="licenseId"
                type="number"
                value={formData.licenseId || ''}
                onChange={(e) => handleInputChange('licenseId', parseInt(e.target.value) || 0)}
                placeholder="Ej: 12345"
                min="1"
                className={`border-gray-200 dark:border-gray-700 ${hasError('licenseId') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('licenseId') && (
                <p className="text-sm text-red-600">{getFieldError('licenseId')}</p>
              )}
            </div>

            {/* Fecha de Inicio */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de Inicio *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                max={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}
                className={`border-gray-200 dark:border-gray-700 ${hasError('startDate') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('startDate') && (
                <p className="text-sm text-red-600">{getFieldError('startDate')}</p>
              )}
            </div>

            {/* Fecha de Vencimiento */}
            <div className="space-y-2">
              <Label htmlFor="expirationDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de Vencimiento *
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                min={formData.startDate || undefined}
                className={`border-gray-200 dark:border-gray-700 ${hasError('expirationDate') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('expirationDate') && (
                <p className="text-sm text-red-600">{getFieldError('expirationDate')}</p>
              )}
            </div>

            {/* DNI del Propietario */}
            <div className="space-y-2">
              <Label htmlFor="ownerDni" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                DNI del Propietario *
              </Label>
              <Input
                id="ownerDni"
                value={formData.ownerDni}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Solo números
                  if (value.length <= 8) {
                    handleInputChange('ownerDni', value);
                  }
                }}
                placeholder="Ej: 12345678"
                maxLength={8}
                className={`border-gray-200 dark:border-gray-700 ${hasError('ownerDni') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('ownerDni') && (
                <p className="text-sm text-red-600">{getFieldError('ownerDni')}</p>
              )}
            </div>

            {/* Cobertura */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="coverage" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cobertura *
              </Label>
              <Input
                id="coverage"
                value={formData.coverage}
                onChange={(e) => handleInputChange('coverage', e.target.value)}
                placeholder="Ej: Cobertura completa contra accidentes, Robo, Incendio"
                className={`border-gray-200 dark:border-gray-700 ${hasError('coverage') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('coverage') && (
                <p className="text-sm text-red-600">{getFieldError('coverage')}</p>
              )}
            </div>
          </div>

          <DialogFooter>
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
              {loading ? "Creando..." : "Crear Seguro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};