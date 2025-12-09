import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";
import { useCreateInfraccionMutation } from '../queries/useInfraccionesMutations';
import { CreateViolationRequest, ViolationSeverity, ViolationTarget } from '../types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateInfraccionDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const [formData, setFormData] = useState<CreateViolationRequest>({
    code: '',
    description: '',
    severity: 'minor',
    uitPercentage: 0,
    administrativeMeasure: '',
    target: 'driver-owner'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateInfraccionMutation();

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      severity: 'minor',
      uitPercentage: 0,
      administrativeMeasure: '',
      target: 'driver-owner'
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      resetForm();
      onOpenChange(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (formData.code.length > 10) {
      newErrors.code = 'El código no puede exceder 10 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'La descripción no puede exceder 2000 caracteres';
    }

    if (formData.uitPercentage < 0 || formData.uitPercentage > 100) {
      newErrors.uitPercentage = 'El porcentaje UIT debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createMutation.mutateAsync(formData);
      resetForm();
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
            <PlusCircle className="h-6 w-6 text-green-600" />
            Crear Nueva Infracción
          </DialogTitle>
          <DialogDescription>
            Registra una nueva infracción en el sistema. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                placeholder="Ej: G.15"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={errors.code ? 'border-red-500' : ''}
                maxLength={10}
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>

            {/* Porcentaje UIT */}
            <div className="space-y-2">
              <Label htmlFor="uitPercentage">Porcentaje UIT *</Label>
              <Input
                id="uitPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Ej: 2.50"
                value={formData.uitPercentage}
                onChange={(e) => setFormData(prev => ({ ...prev, uitPercentage: parseFloat(e.target.value) || 0 }))}
                className={errors.uitPercentage ? 'border-red-500' : ''}
              />
              {errors.uitPercentage && <p className="text-sm text-red-500">{errors.uitPercentage}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe detalladamente la infracción..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
              maxLength={2000}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            <p className="text-xs text-gray-500">{formData.description.length}/2000 caracteres</p>
          </div>

          {/* Medida Administrativa */}
          <div className="space-y-2">
            <Label htmlFor="administrativeMeasure">Medida Administrativa</Label>
            <Textarea
              id="administrativeMeasure"
              placeholder="Describe la medida administrativa a aplicar..."
              value={formData.administrativeMeasure}
              onChange={(e) => setFormData(prev => ({ ...prev, administrativeMeasure: e.target.value }))}
              rows={2}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">{formData.administrativeMeasure.length}/2000 caracteres</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gravedad */}
            <div className="space-y-2">
              <Label htmlFor="severity">Gravedad *</Label>
              <Select
                value={formData.severity}
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
              <Label htmlFor="target">Objetivo *</Label>
              <Select
                value={formData.target}
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
          {createMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">
                {createMutation.error.message || 'Error al crear la infracción'}
              </p>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Infracción
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};