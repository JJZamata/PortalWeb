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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { documentosService } from '../services/documentosService';
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Calendar, Car, CheckCircle, Clock, Building2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  reviewId: string;
  vehiclePlate: string;
  issueDate: string;
  expirationDate: string;
  inspectionResult: 'APROBADO' | 'OBSERVADO';
  certifyingCompany: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export const CreateTechnicalReviewDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    reviewId: '',
    vehiclePlate: '',
    issueDate: '',
    expirationDate: '',
    inspectionResult: '',
    certifyingCompany: '',
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        reviewId: generateReviewId(),
        vehiclePlate: '',
        issueDate: new Date().toISOString().split('T')[0], // Hoy
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 año después
        inspectionResult: '',
        certifyingCompany: '',
      });
      setErrors([]);
    }
  }, [open]);

  // Generar ID único para reviewId
  const generateReviewId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `RT-${year}-${randomNum}`;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
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

    // Validación del reviewId
    if (!formData.reviewId.trim()) {
      newErrors.push({
        field: 'reviewId',
        message: 'El ID de revisión es obligatorio'
      });
    } else if (formData.reviewId.length < 10 || formData.reviewId.length > 30) {
      newErrors.push({
        field: 'reviewId',
        message: 'El ID de revisión debe tener entre 10 y 30 caracteres'
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

    // Validación de la fecha de emisión
    if (!formData.issueDate) {
      newErrors.push({
        field: 'issueDate',
        message: 'La fecha de emisión es obligatoria'
      });
    } else {
      const issueDate = new Date(formData.issueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Solo comparar fechas sin horas

      if (issueDate > today) {
        newErrors.push({
          field: 'issueDate',
          message: 'La fecha de emisión no puede ser futura'
        });
      }
    }

    // Validación de la fecha de vencimiento
    if (!formData.expirationDate) {
      newErrors.push({
        field: 'expirationDate',
        message: 'La fecha de vencimiento es obligatoria'
      });
    } else if (formData.issueDate && new Date(formData.expirationDate) <= new Date(formData.issueDate)) {
      newErrors.push({
        field: 'expirationDate',
        message: 'La fecha de vencimiento debe ser posterior a la fecha de emisión'
      });
    }

    // Validación del resultado de inspección
    if (!formData.inspectionResult) {
      newErrors.push({
        field: 'inspectionResult',
        message: 'El resultado de inspección es obligatorio'
      });
    }

    // Validación de la empresa certificadora
    if (!formData.certifyingCompany.trim()) {
      newErrors.push({
        field: 'certifyingCompany',
        message: 'La empresa certificadora es obligatoria'
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
      const response = await documentosService.createTechnicalReview({
        reviewId: formData.reviewId,
        vehiclePlate: formData.vehiclePlate,
        issueDate: formData.issueDate,
        expirationDate: formData.expirationDate,
        inspectionResult: formData.inspectionResult,
        certifyingCompany: formData.certifyingCompany,
      });

      if (response.success) {
        toast({
          title: "✅ Revisión técnica creada",
          description: response.message || "La revisión técnica ha sido creada exitosamente",
        });

        onOpenChange(false);
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error al crear revisión técnica:', error);

      // Manejar errores específicos del backend
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setErrors(error.response.data.errors);
      }

      toast({
        title: "❌ Error al crear",
        description: error?.response?.data?.message || error?.message || "No se pudo crear la revisión técnica",
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
            <FileCheck className="w-6 h-6 text-green-600" />
            Crear Nueva Revisión Técnica
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID de Revisión */}
            <div className="space-y-2">
              <Label htmlFor="reviewId" className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                ID de Revisión *
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, reviewId: generateReviewId() }))}
                  className="ml-2 h-6 px-2 text-xs text-cyan-600 hover:text-cyan-700"
                >
                  🔄 Generar
                </Button>
              </Label>
              <Input
                id="reviewId"
                value={formData.reviewId}
                onChange={(e) => handleInputChange('reviewId', e.target.value)}
                placeholder="Ej: RT-2024-123456"
                className={`border-gray-200 dark:border-gray-700 ${hasError('reviewId') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('reviewId') && (
                <p className="text-sm text-red-600">{getFieldError('reviewId')}</p>
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

            {/* Fecha de Emisión */}
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de Emisión *
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`border-gray-200 dark:border-gray-700 ${hasError('issueDate') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('issueDate') && (
                <p className="text-sm text-red-600">{getFieldError('issueDate')}</p>
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
                min={formData.issueDate || undefined}
                className={`border-gray-200 dark:border-gray-700 ${hasError('expirationDate') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('expirationDate') && (
                <p className="text-sm text-red-600">{getFieldError('expirationDate')}</p>
              )}
            </div>

            {/* Empresa Certificadora */}
            <div className="space-y-2">
              <Label htmlFor="certifyingCompany" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresa Certificadora *
              </Label>
              <Input
                id="certifyingCompany"
                value={formData.certifyingCompany}
                onChange={(e) => handleInputChange('certifyingCompany', e.target.value)}
                placeholder="Ej: TECSUP S.A."
                className={`border-gray-200 dark:border-gray-700 ${hasError('certifyingCompany') ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {getFieldError('certifyingCompany') && (
                <p className="text-sm text-red-600">{getFieldError('certifyingCompany')}</p>
              )}
            </div>

            {/* Resultado de Inspección */}
            <div className="space-y-2">
              <Label htmlFor="inspectionResult" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resultado de Inspección *
              </Label>
              <Select
                value={formData.inspectionResult}
                onValueChange={(value: 'APROBADO' | 'OBSERVADO') => handleInputChange('inspectionResult', value)}
              >
                <SelectTrigger className={`border-gray-200 dark:border-gray-700 ${hasError('inspectionResult') ? 'border-red-500 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Seleccionar resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APROBADO">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      APROBADO
                    </div>
                  </SelectItem>
                  <SelectItem value="OBSERVADO">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      OBSERVADO
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {getFieldError('inspectionResult') && (
                <p className="text-sm text-red-600">{getFieldError('inspectionResult')}</p>
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Creando..." : "Crear Revisión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};