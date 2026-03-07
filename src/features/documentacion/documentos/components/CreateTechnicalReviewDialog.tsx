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
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { documentosService } from "../services/documentosService";
import { vehiculosService } from "../../../vehiculos/mototaxis/services/vehiculosService";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Car, CheckCircle, Clock, Building2, AlertCircle, Info, Calendar } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
  isRenewal?: boolean;
}

interface FormData {
  reviewId: string;
  vehiclePlate: string;
  issueDate: string;
  expirationDate: string;
  inspectionResult: "APROBADO" | "OBSERVADO" | "";
  certifyingCompany: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface VehicleOption {
  plate: string;
}

export const CreateTechnicalReviewDialog = ({ open, onOpenChange, onSuccess, initialData, isRenewal = false }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [loadingVehicleOptions, setLoadingVehicleOptions] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    reviewId: "",
    vehiclePlate: "",
    issueDate: "",
    expirationDate: "",
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
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(today.getFullYear() + 1);
      const oneYearLaterStr = oneYearLater.toISOString().split('T')[0];

      setFormData({
        reviewId: initialData?.reviewId || generateReviewId(),
        vehiclePlate: initialData?.vehiclePlate || "",
        issueDate: initialData?.issueDate || todayStr,
        expirationDate: initialData?.expirationDate || oneYearLaterStr,
        inspectionResult: initialData?.inspectionResult || "",
        certifyingCompany: initialData?.certifyingCompany || "",
      });
      setErrors([]);
    }
  }, [open, initialData]);

  useEffect(() => {
    const loadVehicleOptions = async () => {
      if (!open) return;

      setLoadingVehicleOptions(true);
      try {
        const firstPage = await vehiculosService.getVehiculos(1, '');
        const totalPages = Number(firstPage?.pagination?.totalPages || 1);
        let vehicles = Array.isArray(firstPage?.vehicles) ? firstPage.vehicles : [];

        if (totalPages > 1) {
          const restPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
              vehiculosService.getVehiculos(index + 2, '')
            )
          );

          restPages.forEach((pageResult: any) => {
            if (Array.isArray(pageResult?.vehicles)) {
              vehicles = [...vehicles, ...pageResult.vehicles];
            }
          });
        }

        const mappedOptions = vehicles
          .map((vehicle: any) => ({
            plate: String(vehicle?.placa?.plateNumber || vehicle?.placa_v || '').trim().toUpperCase(),
          }))
          .filter((item: VehicleOption) => item.plate.length > 0)
          .filter((item: VehicleOption, index: number, array: VehicleOption[]) =>
            array.findIndex((target: VehicleOption) => target.plate === item.plate) === index
          )
          .sort((a: VehicleOption, b: VehicleOption) => a.plate.localeCompare(b.plate));

        setVehicleOptions(mappedOptions);
      } catch (error) {
        setVehicleOptions([]);
      } finally {
        setLoadingVehicleOptions(false);
      }
    };

    loadVehicleOptions();
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

    if (!formData.issueDate) {
      newErrors.push({ field: "issueDate", message: "La fecha de emisión es obligatoria" });
    }

    if (!formData.expirationDate) {
      newErrors.push({ field: "expirationDate", message: "La fecha de vencimiento es obligatoria" });
    } else if (formData.issueDate && new Date(formData.expirationDate) <= new Date(formData.issueDate)) {
      newErrors.push({ field: "expirationDate", message: "La fecha de vencimiento debe ser posterior a la emisión" });
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
      const reviewDocuments = await documentosService.getDocumentos(1, 'technicalReview', formData.vehiclePlate, 'createdAt', 'DESC');
      const hasActiveReview = (reviewDocuments?.documents || []).some((doc: any) =>
        String(doc?.placa || '').toUpperCase() === String(formData.vehiclePlate || '').toUpperCase() &&
        String(doc?.estado || '').toLowerCase() === 'vigente'
      );

      if (hasActiveReview) {
        throw new Error('Ya existe una revisión técnica vigente para esta placa. Para mantener historial, registra una nueva cuando la actual venza.');
      }

      const response = await documentosService.createTechnicalReview({
        reviewId: formData.reviewId,
        vehiclePlate: formData.vehiclePlate,
        issueDate: formData.issueDate,
        expirationDate: formData.expirationDate,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            {isRenewal ? 'Renovar Revisión Técnica' : 'Crear Nueva Revisión Técnica'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            {isRenewal
              ? 'Se creará una nueva revisión técnica para conservar el historial de la anterior.'
              : 'Complete los datos solicitados para registrar una nueva revisión técnica.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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

          <div className="space-y-4">
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Información de Revisión
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reviewId" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <FileCheck className="w-4 h-4" />
                      ID de Revisión *
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, reviewId: generateReviewId() }))}
                        className="ml-2 h-6 px-2 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                      >
                        🔄 Generar
                      </Button>
                    </Label>
                    <Input
                      id="reviewId"
                      value={formData.reviewId}
                      onChange={(e) => handleInputChange("reviewId", e.target.value)}
                      placeholder="Ej: REV-2025-000001"
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500 ${hasError("reviewId") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {getFieldError("reviewId") && <p className="text-sm text-red-600">{getFieldError("reviewId")}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">10-30 caracteres. Debe ser único.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehiclePlate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Car className="w-4 h-4" />
                      Placa del Vehículo *
                    </Label>
                    <Select
                      value={formData.vehiclePlate}
                      onValueChange={(value) => handleInputChange("vehiclePlate", value)}
                      disabled={loadingVehicleOptions}
                    >
                      <SelectTrigger id="vehiclePlate" className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500 ${hasError("vehiclePlate") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}>
                        <SelectValue placeholder={loadingVehicleOptions ? 'Cargando matrículas...' : 'Selecciona una matrícula'} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleOptions.length > 0 ? (
                          vehicleOptions.map((vehicle) => (
                            <SelectItem key={vehicle.plate} value={vehicle.plate}>
                              {vehicle.plate}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="__no-vehicles" disabled>
                            No hay matrículas disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {getFieldError("vehiclePlate") && <p className="text-sm text-red-600">{getFieldError("vehiclePlate")}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selecciona una matrícula registrada en el sistema.</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="certifyingCompany" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Building2 className="w-4 h-4" />
                      Empresa Certificadora *
                    </Label>
                    <Input
                      id="certifyingCompany"
                      value={formData.certifyingCompany}
                      onChange={(e) => handleInputChange("certifyingCompany", e.target.value)}
                      placeholder="Ej: CERTITEC PERU S.A.C."
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500 ${hasError("certifyingCompany") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {getFieldError("certifyingCompany") && <p className="text-sm text-red-600">{getFieldError("certifyingCompany")}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">1-500 caracteres.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Calendar className="w-4 h-4" />
                      Fecha de Emisión *
                    </Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange("issueDate", e.target.value)}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500 ${hasError("issueDate") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {getFieldError("issueDate") && <p className="text-sm text-red-600">{getFieldError("issueDate")}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expirationDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Calendar className="w-4 h-4" />
                      Fecha de Vencimiento *
                    </Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={formData.expirationDate}
                      min={formData.issueDate || undefined}
                      onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500 ${hasError("expirationDate") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {getFieldError("expirationDate") && <p className="text-sm text-red-600">{getFieldError("expirationDate")}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Resultado de Inspección
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="inspectionResult" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Resultado de Inspección *
                  </Label>
                  <Select
                    value={formData.inspectionResult}
                    onValueChange={(value: "APROBADO" | "OBSERVADO") => handleInputChange("inspectionResult", value)}
                  >
                    <SelectTrigger className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-emerald-500 focus:ring-emerald-500 ${hasError("inspectionResult") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}>
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
                  {getFieldError("inspectionResult") && <p className="text-sm text-red-600">{getFieldError("inspectionResult")}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valores permitidos: APROBADO u OBSERVADO.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Creando..." : isRenewal ? "Renovar Revisión" : "Crear Revisión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
