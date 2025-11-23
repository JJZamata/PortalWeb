import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";
import { useUpdateInfraccionMutation } from '../queries/useInfraccionesMutations';
import { CreateViolationRequest, ViolationSeverity, ViolationTarget, Violation } from '../types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  violation: Violation | null;
  onSuccess: () => void;
}

export const EditInfraccionDialog = ({ open, onOpenChange, violation, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Partial<CreateViolationRequest>>({
    code: '',
    description: '',
    severity: undefined,
    uitPercentage: 0,
    administrativeMeasure: '',
    target: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateMutation = useUpdateInfraccionMutation();

  // Inicializar el formulario cuando cambia la infracción
  useEffect(() => {
    if (violation) {
      setFormData({
        code: violation.identificacion.codigo,
        description: violation.descripcion.texto,
        severity: violation.clasificacion.gravedad,
        uitPercentage: parseFloat(violation.sancion.porcentajeUIT.replace('%', '')) || 0,
        administrativeMeasure: violation.sancion.medidaAdministrativa,
        target: violation.clasificacion.objetivo
      });
      setErrors({});
    }
  }, [violation]);

  const handleClose = () => {
    if (!updateMutation.isPending) {
      setFormData({
        code: '',
        description: '',
        severity: undefined,
        uitPercentage: 0,
        administrativeMeasure: '',
        target: undefined
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.code && formData.code.trim()) {
      if (formData.code.length > 10) {
        newErrors.code = 'El código no puede exceder 10 caracteres';
      }
    }

    if (formData.description && formData.description.trim()) {
      if (formData.description.length > 2000) {
        newErrors.description = 'La descripción no puede exceder 2000 caracteres';
      }
    }

    if (formData.uitPercentage !== undefined && (formData.uitPercentage < 0 || formData.uitPercentage > 100)) {
      newErrors.uitPercentage = 'El porcentaje UIT debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!violation || !validateForm()) return;

    try {
      await updateMutation.mutateAsync({
        code: violation.identificacion.codigo,
        data: formData as Partial<CreateViolationRequest>
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      // El manejo de errores se hace en el mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-6 w-6 text-blue-600" />
            Editar Infracción
          </DialogTitle>
          <DialogDescription>
            Actualiza los datos de la infracción seleccionada. Solo modifica los campos que necesites cambiar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Infracción actual: <span className="font-bold">{violation?.identificacion.codigo}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                placeholder="Código de la infracción"
                value={formData.code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={errors.code ? 'border-red-500' : ''}
                maxLength={10}
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>

            {/* Porcentaje UIT */}
            <div className="space-y-2">
              <Label htmlFor="uitPercentage">Porcentaje UIT</Label>
              <Input
                id="uitPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Ej: 2.50"
                value={formData.uitPercentage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, uitPercentage: parseFloat(e.target.value) || 0 }))}
                className={errors.uitPercentage ? 'border-red-500' : ''}
              />
              {errors.uitPercentage && <p className="text-sm text-red-500">{errors.uitPercentage}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe detalladamente la infracción..."
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
              maxLength={2000}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            <p className="text-xs text-gray-500">{formData.description?.length || 0}/2000 caracteres</p>
          </div>

          {/* Medida Administrativa */}
          <div className="space-y-2">
            <Label htmlFor="administrativeMeasure">Medida Administrativa</Label>
            <Textarea
              id="administrativeMeasure"
              placeholder="Describe la medida administrativa a aplicar..."
              value={formData.administrativeMeasure || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, administrativeMeasure: e.target.value }))}
              rows={2}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">{formData.administrativeMeasure?.length || 0}/2000 caracteres</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gravedad */}
            <div className="space-y-2">
              <Label htmlFor="severity">Gravedad</Label>
              <Select
                value={formData.severity || ''}
                onValueChange={(value: ViolationSeverity) => setFormData(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar gravedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Leve</SelectItem>
                  <SelectItem value="serious">Grave</SelectItem>
                  <SelectItem value="very_serious">Muy Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="target">Objetivo</Label>
              <Select
                value={formData.target || ''}
                onValueChange={(value: ViolationTarget) => setFormData(prev => ({ ...prev, target: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver-owner">Conductor/Propietario</SelectItem>
                  <SelectItem value="company">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error de la mutación */}
          {updateMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">
                {updateMutation.error.message || 'Error al actualizar la infracción'}
              </p>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Actualizar Infracción
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};