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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar, AlertCircle, Loader } from 'lucide-react';
import tucService from '../services/tucService';
import { TUCData } from '../types';

interface Props {
  tuc: TUCData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  loading?: boolean;
}

interface FormData {
  validityDate: string;
  registralCode: string;
  supportDocument: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export const EditTUCDialog = ({ tuc, open, onOpenChange, onSuccess, loading: externalLoading = false }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const [formData, setFormData] = useState<FormData>({
    validityDate: '',
    registralCode: '',
    supportDocument: '',
  });

  // Actualizar formulario cuando se carga el TUC
  useEffect(() => {
    if (tuc && open) {
      // Convertir validityDate a YYYY-MM-DD
      const dateStr = tuc.tuc.validityDate.split('T')[0];
      setFormData({
        validityDate: dateStr,
        registralCode: tuc.tuc.registralCode || '',
        supportDocument: tuc.tuc.supportDocument || '',
      });
      setErrors([]);
    }
  }, [tuc, open]);

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

    if (!formData.validityDate) {
      newErrors.push({ field: 'validityDate', message: 'La fecha de vigencia es obligatoria' });
    } else {
      const date = new Date(formData.validityDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        newErrors.push({ field: 'validityDate', message: 'La fecha no puede ser pasada' });
      }
    }

    if (formData.registralCode.length > 50) {
      newErrors.push({ field: 'registralCode', message: 'Máximo 50 caracteres' });
    }

    if (formData.supportDocument.length > 50) {
      newErrors.push({ field: 'supportDocument', message: 'Máximo 50 caracteres' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tuc || !validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Corrige los campos resaltados',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await tucService.patchTUC(tuc.tuc.tucNumber, {
        validityDate: formData.validityDate,
        registralCode: formData.registralCode,
        supportDocument: formData.supportDocument,
      });

      toast({
        title: '✅ TUC actualizada',
        description: 'La TUC ha sido actualizada exitosamente',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setErrors(error.response.data.errors);
      }
      toast({
        title: '❌ Error al actualizar',
        description: error?.response?.data?.message || error?.message || 'No se pudo actualizar la TUC',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => errors.find((err) => err.field === field)?.message;
  const hasError = (field: string) => errors.some((err) => err.field === field);

  if (!tuc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Editar TUC
            <Badge variant="secondary" className="ml-2">{tuc.tuc.tucNumber}</Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Modifica los datos editables de la TUC seleccionada.
          </DialogDescription>
        </DialogHeader>

        {externalLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 md:p-5 dark:border-gray-700 dark:bg-gray-800/40"
          >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de Vigencia */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="validityDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Vigencia *
                </Label>
                <Input
                  id="validityDate"
                  type="date"
                  value={formData.validityDate}
                  onChange={(e) => handleInputChange('validityDate', e.target.value)}
                  className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('validityDate') ? 'border-red-500' : ''}`}
                />
                {getFieldError('validityDate') && <p className="text-sm text-red-600">{getFieldError('validityDate')}</p>}
              </div>

              {/* Código Registral */}
              <div className="space-y-2">
                <Label htmlFor="registralCode" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Código Registral
                </Label>
                <Input
                  id="registralCode"
                  value={formData.registralCode}
                  onChange={(e) => handleInputChange('registralCode', e.target.value)}
                  placeholder="REG123"
                  maxLength={50}
                  className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('registralCode') ? 'border-red-500' : ''}`}
                />
                {getFieldError('registralCode') && <p className="text-sm text-red-600">{getFieldError('registralCode')}</p>}
              </div>

              {/* Documento Soporte */}
              <div className="space-y-2">
                <Label htmlFor="supportDocument" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documento Soporte
                </Label>
                <Input
                  id="supportDocument"
                  value={formData.supportDocument}
                  onChange={(e) => handleInputChange('supportDocument', e.target.value)}
                  placeholder="DOC456"
                  maxLength={50}
                  className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-blue-500 focus:ring-blue-500 ${hasError('supportDocument') ? 'border-red-500' : ''}`}
                />
                {getFieldError('supportDocument') && <p className="text-sm text-red-600">{getFieldError('supportDocument')}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
