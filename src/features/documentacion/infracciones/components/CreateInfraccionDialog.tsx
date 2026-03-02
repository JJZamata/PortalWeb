import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-700 to-red-600 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            Crear Nueva Infracción
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Registra una nueva infracción en el sistema. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Información de la Infracción
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-gray-700 dark:text-gray-300 font-medium">Código *</Label>
                    <Input
                      id="code"
                      placeholder="Ej: G.15"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500 ${errors.code ? 'border-red-500' : ''}`}
                      maxLength={10}
                    />
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uitPercentage" className="text-gray-700 dark:text-gray-300 font-medium">Porcentaje UIT *</Label>
                    <Input
                      id="uitPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Ej: 2.50"
                      value={formData.uitPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, uitPercentage: parseFloat(e.target.value) || 0 }))}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500 ${errors.uitPercentage ? 'border-red-500' : ''}`}
                    />
                    {errors.uitPercentage && <p className="text-sm text-red-500">{errors.uitPercentage}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-medium">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe detalladamente la infracción..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:border-red-500 focus:ring-red-500 ${errors.description ? 'border-red-500' : ''}`}
                    rows={3}
                    maxLength={2000}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formData.description.length}/2000 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="administrativeMeasure" className="text-gray-700 dark:text-gray-300 font-medium">Medida Administrativa</Label>
                  <Textarea
                    id="administrativeMeasure"
                    placeholder="Describe la medida administrativa a aplicar..."
                    value={formData.administrativeMeasure}
                    onChange={(e) => setFormData(prev => ({ ...prev, administrativeMeasure: e.target.value }))}
                    rows={2}
                    maxLength={2000}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:border-red-500 focus:ring-red-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formData.administrativeMeasure.length}/2000 caracteres</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Clasificación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity" className="text-gray-700 dark:text-gray-300 font-medium">Gravedad *</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value: ViolationSeverity) => setFormData(prev => ({ ...prev, severity: value }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Seleccionar gravedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Leve</SelectItem>
                        <SelectItem value="serious">Grave</SelectItem>
                        <SelectItem value="very_serious">Muy Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target" className="text-gray-700 dark:text-gray-300 font-medium">Objetivo *</Label>
                    <Select
                      value={formData.target}
                      onValueChange={(value: ViolationTarget) => setFormData(prev => ({ ...prev, target: value }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Seleccionar objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="driver-owner">Conductor/Propietario</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {createMutation.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-300">
                  {createMutation.error.message || 'Error al crear la infracción'}
                </p>
              </div>
            )}
          </div>
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