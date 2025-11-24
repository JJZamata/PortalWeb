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
    issueDate: "",
    expirationDate: "",
    inspectionResult: "",
    certifyingCompany: "",
  });

  // Initialize form data when technicalReview changes
  useEffect(() => {
    if (technicalReview && open) {
      setFormData({
        vehiclePlate: technicalReview.vehiculo.placa || "",
        issueDate: technicalReview.fechas.emision?.split('T')[0] || "",
        expirationDate: technicalReview.fechas.vencimiento?.split('T')[0] || "",
        inspectionResult: technicalReview.revision.inspectionResult || "",
        certifyingCompany: technicalReview.revision.certifyingCompany || "",
      });
    }
  }, [technicalReview, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!technicalReview) return;

    setLoading(true);
    try {
      const updateData = {
        vehiclePlate: formData.vehiclePlate || undefined,
        issueDate: formData.issueDate || undefined,
        expirationDate: formData.expirationDate || undefined,
        inspectionResult: formData.inspectionResult || undefined,
        certifyingCompany: formData.certifyingCompany || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getResultColor = (result: string) => {
    switch (result?.toUpperCase()) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-700';
      case 'REJECTED':
        return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-700';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-700';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-900/30 dark:border-gray-700';
    }
  };

  const getIconForResult = (result: string) => {
    switch (result?.toUpperCase()) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!technicalReview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600" />
            Editar Revisión Técnica
            <Badge variant="secondary" className="ml-2">
              {technicalReview.revision.reviewId}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Actual */}
            <div className="md:col-span-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Información Actual</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Vehículo:</span>
                  <p className="font-medium">{technicalReview.vehiculo.placa} ({technicalReview.vehiculo.marca} {technicalReview.vehiculo.modelo})</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Empresa Actual:</span>
                  <p className="font-medium">{technicalReview.revision.certifyingCompany}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Resultado Actual:</span>
                  <Badge
                    variant="secondary"
                    className={`${getResultColor(technicalReview.revision.inspectionResult)} flex items-center gap-1 w-fit`}
                  >
                    {getIconForResult(technicalReview.revision.inspectionResult)}
                    {technicalReview.revision.inspectionResult}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Campos Editables */}

            {/* Placa Vehículo */}
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Placa Vehículo
              </Label>
              <Input
                id="vehiclePlate"
                placeholder="ABC123"
                value={formData.vehiclePlate}
                onChange={(e) => handleInputChange("vehiclePlate", e.target.value.toUpperCase())}
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Fecha de Emisión */}
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha Emisión
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange("issueDate", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Fecha de Vencimiento */}
            <div className="space-y-2">
              <Label htmlFor="expirationDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha Vencimiento
              </Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
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
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Resultado de Inspección */}
            <div className="space-y-2">
              <Label htmlFor="inspectionResult" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resultado Inspección
              </Label>
              <Select value={formData.inspectionResult} onValueChange={(value) => handleInputChange("inspectionResult", value)}>
                <SelectTrigger className="border-gray-200 dark:border-gray-700">
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