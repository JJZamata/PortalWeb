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
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { documentosService } from "../services/documentosService";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Car, CheckCircle, Clock, Building2, AlertCircle, Info } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  reviewId: string;
  vehiclePlate: string;
  inspectionResult: "APROBADO" | "OBSERVADO" | "";
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

  const [formData, setFormData] = useState<FormData>({
    reviewId: "",
    vehiclePlate: "",
    inspectionResult: "",
    certifyingCompany: "",
  });

  const generateReviewId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, "0");
    return `REV-${year}-${randomNum}`;
  };

  useEffect(() => {
    if (open) {
      setFormData({
        reviewId: generateReviewId(),
        vehiclePlate: "",
        inspectionResult: "",
        certifyingCompany: "",
      });
      setErrors([]);
    }
  }, [open]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "inspectionResult" ? (value as "APROBADO" | "OBSERVADO" | "") : value,
    }));
    if (errors.length > 0) {
      setErrors(errors.filter((error) => error.field !== field));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.reviewId.trim()) {
      newErrors.push({ field: "reviewId", message: "El ID de revisión es obligatorio" });
    } else if (formData.reviewId.length < 10 || formData.reviewId.length > 30) {
      newErrors.push({ field: "reviewId", message: "El ID debe tener entre 10 y 30 caracteres" });
    }

    if (!formData.vehiclePlate.trim()) {
      newErrors.push({ field: "vehiclePlate", message: "La placa es obligatoria" });
    } else if (formData.vehiclePlate.length < 6 || formData.vehiclePlate.length > 10) {
      newErrors.push({ field: "vehiclePlate", message: "La placa debe tener entre 6 y 10 caracteres" });
    } else if (!/^[A-Z0-9]+$/.test(formData.vehiclePlate)) {
      newErrors.push({ field: "vehiclePlate", message: "Solo letras mayúsculas y números" });
    }

    if (!formData.inspectionResult) {
      newErrors.push({ field: "inspectionResult", message: "El resultado es obligatorio" });
    }

    if (!formData.certifyingCompany.trim()) {
      newErrors.push({ field: "certifyingCompany", message: "La empresa certificadora es obligatoria" });
    } else if (formData.certifyingCompany.length > 500) {
      newErrors.push({ field: "certifyingCompany", message: "Máximo 500 caracteres" });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Corrige los campos resaltados",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await documentosService.createTechnicalReview({
        reviewId: formData.reviewId,
        vehiclePlate: formData.vehiclePlate,
        inspectionResult: formData.inspectionResult as "APROBADO" | "OBSERVADO",
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

  const getFieldError = (field: string) => errors.find((err) => err.field === field)?.message;
  const hasError = (field: string) => errors.some((err) => err.field === field);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600" />
            Crear Nueva Revisión Técnica
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Complete los datos solicitados. Las fechas de emisión y vencimiento las calcula el sistema automáticamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            {/* ID de Revisión */}
            <div className="space-y-2">
              <Label htmlFor="reviewId" className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                ID de Revisión *
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, reviewId: generateReviewId() }))}
                  className="ml-2 h-6 px-2 text-xs text-cyan-600 hover:text-cyan-700"
                >
                  🔄 Generar
                </Button>
              </Label>
              <Input
                id="reviewId"
                value={formData.reviewId}
                onChange={(e) => handleInputChange("reviewId", e.target.value)}
                placeholder="Ej: REV-2025-000001"
                className={`border-gray-200 dark:border-gray-700 ${hasError("reviewId") ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {getFieldError("reviewId") && <p className="text-sm text-red-600">{getFieldError("reviewId")}</p>}
              <p className="text-xs text-gray-500">10-30 caracteres. Debe ser único.</p>
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
                onChange={(e) => handleInputChange("vehiclePlate", e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                className={`border-gray-200 dark:border-gray-700 ${hasError("vehiclePlate") ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {getFieldError("vehiclePlate") && <p className="text-sm text-red-600">{getFieldError("vehiclePlate")}</p>}
              <p className="text-xs text-gray-500">6-10 caracteres alfanuméricos.</p>
            </div>

            {/* Empresa Certificadora */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="certifyingCompany" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresa Certificadora *
              </Label>
              <Input
                id="certifyingCompany"
                value={formData.certifyingCompany}
                onChange={(e) => handleInputChange("certifyingCompany", e.target.value)}
                placeholder="Ej: CERTITEC PERU S.A.C."
                className={`border-gray-200 dark:border-gray-700 ${hasError("certifyingCompany") ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {getFieldError("certifyingCompany") && <p className="text-sm text-red-600">{getFieldError("certifyingCompany")}</p>}
              <p className="text-xs text-gray-500">1-500 caracteres.</p>
            </div>

            {/* Resultado de Inspección */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="inspectionResult" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Resultado de Inspección *
              </Label>
              <Select
                value={formData.inspectionResult}
                onValueChange={(value: "APROBADO" | "OBSERVADO") => handleInputChange("inspectionResult", value)}
              >
                <SelectTrigger className={`border-gray-200 dark:border-gray-700 ${hasError("inspectionResult") ? "border-red-500 focus:border-red-500" : ""}`}>
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
              {getFieldError("inspectionResult") && <p className="text-sm text-red-600">{getFieldError("inspectionResult")}</p>}
              <p className="text-xs text-gray-500">Valores permitidos: APROBADO u OBSERVADO.</p>
            </div>

            <div className="md:col-span-2 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5" />
              <span>Las fechas de emisión y vencimiento las calcula el sistema automáticamente al crear la revisión.</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Creando..." : "Crear Revisión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
