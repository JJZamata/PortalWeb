import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { TechnicalReviewDetail } from "../types";
import { documentosService } from "../services/documentosService";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Calendar, Building2, Car, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface Props {
  technicalReview: TechnicalReviewDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditTechnicalReviewDialog = ({ technicalReview, open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    vehiclePlate: "",
    inspectionResult: "" as '' | 'APROBADO' | 'OBSERVADO',
    certifyingCompany: "",
  });

  // Initialize form data when technicalReview changes
  useEffect(() => {
    if (technicalReview && open) {
      setFormData({
        vehiclePlate: technicalReview.vehiculo.placa || "",
        inspectionResult: (technicalReview.revision.inspectionResult as 'APROBADO' | 'OBSERVADO' | '') || "",
        certifyingCompany: technicalReview.revision.certifyingCompany || "",
      });
    }
  }, [technicalReview, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!technicalReview) return;

    setLoading(true);
    try {
      // Enviar solo los campos editables sin reviewId ni vehiclePlate (ya están en la URL)
      const updateData: {
        inspectionResult?: 'APROBADO' | 'OBSERVADO';
        certifyingCompany?: string;
      } = {};

      // Solo incluir campos que realmente cambiaron
      if (formData.inspectionResult && formData.inspectionResult !== technicalReview.revision.inspectionResult) {
        updateData.inspectionResult = formData.inspectionResult;
      }
      if (formData.certifyingCompany && formData.certifyingCompany !== technicalReview.revision.certifyingCompany) {
        updateData.certifyingCompany = formData.certifyingCompany;
      }

      // Si no hay cambios, enviar al menos los valores actuales
      if (Object.keys(updateData).length === 0) {
        updateData.inspectionResult = technicalReview.revision.inspectionResult as 'APROBADO' | 'OBSERVADO';
        updateData.certifyingCompany = technicalReview.revision.certifyingCompany;
      }

      await documentosService.updateTechnicalReview(technicalReview.revision.reviewId, updateData);

      toast({
        title: "Revisión técnica actualizada",
        description: "La revisión técnica ha sido actualizada exitosamente.",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error?.message || "No se pudo actualizar la revisión técnica. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'vehiclePlate' | 'inspectionResult' | 'certifyingCompany', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'inspectionResult' ? (value as 'APROBADO' | 'OBSERVADO') : value,
    }));
  };

  const getIconForResult = (result: string) => {
    switch (result?.toUpperCase()) {
      case 'APROBADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'OBSERVADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!technicalReview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            Editar Revisión Técnica
            <Badge variant="secondary" className="ml-2">
              {technicalReview.revision.reviewId}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Modifica los datos editables de la revisión técnica seleccionada.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 md:p-5 dark:border-gray-700 dark:bg-gray-800/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campos Editables */}

            {/* Placa Vehículo */}
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Placa Vehículo (no editable)
              </Label>
              <Input
                id="vehiclePlate"
                placeholder="ABC123"
                value={formData.vehiclePlate}
                disabled
                className="bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 rounded-lg h-11 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Para cambiar la placa crea una nueva revisión técnica.</p>
            </div>

            {/* Fechas (solo lectura, gestionadas por el sistema) */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fechas de la Revisión (solo lectura)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400">Emisión</p>
                  <p className="font-medium">
                    {technicalReview.fechas.emision
                      ? new Date(technicalReview.fechas.emision).toLocaleDateString('es-PE')
                      : 'No disponible'}
                  </p>
                </div>
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400">Vencimiento</p>
                  <p className="font-medium">
                    {technicalReview.fechas.vencimiento
                      ? new Date(technicalReview.fechas.vencimiento).toLocaleDateString('es-PE')
                      : 'No disponible'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Las fechas las calcula y actualiza el sistema automáticamente.</p>
            </div>

            {/* Empresa Certificadora */}
            <div className="space-y-2">
              <Label htmlFor="certifyingCompany" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresa Certificadora
              </Label>
              <Input
                id="certifyingCompany"
                placeholder="Nombre de la certificadora"
                value={formData.certifyingCompany}
                onChange={(e) => handleInputChange("certifyingCompany", e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Resultado de Inspección */}
            <div className="space-y-2">
              <Label htmlFor="inspectionResult" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resultado Inspección
              </Label>
              <Select
                value={formData.inspectionResult}
                onValueChange={(value: 'APROBADO' | 'OBSERVADO') => handleInputChange("inspectionResult", value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Seleccionar resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APROBADO">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      APROBADO
                    </div>
                  </SelectItem>
                  <SelectItem value="OBSERVADO">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      OBSERVADO
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};