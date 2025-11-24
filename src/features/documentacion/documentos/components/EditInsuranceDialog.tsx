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
import { InsuranceDetail } from "../types";
import { documentosService } from "../services/documentosService";
import { useToast } from "@/hooks/use-toast";
import { Shield, Calendar, DollarSign, User, Mail, Phone, Car } from "lucide-react";

interface Props {
  insurance: InsuranceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditInsuranceDialog = ({ insurance, open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    expirationDate: "",
    coverage: "",
    premiumAmount: "",
    ownerPhone: "",
    ownerEmail: "",
    vehiclePlate: "",
    certificateUrl: "",
  });

  // Initialize form data when insurance changes
  useEffect(() => {
    if (insurance && open) {
      setFormData({
        expirationDate: insurance.fechas.vencimiento.split('T')[0] || "",
        coverage: insurance.seguro?.cobertura || "",
        premiumAmount: insurance.seguro?.montoPrima?.toString() || "",
        ownerPhone: insurance.propietario?.telefono || "",
        ownerEmail: insurance.propietario?.email || "",
        vehiclePlate: insurance.vehiculo?.placa || "",
        certificateUrl: insurance.seguro?.urlCertificado || "",
      });
    }
  }, [insurance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!insurance) return;

    setLoading(true);
    try {
      const updateData = {
        expirationDate: formData.expirationDate || undefined,
        coverage: formData.coverage || undefined,
        premiumAmount: formData.premiumAmount ? parseFloat(formData.premiumAmount) : undefined,
        ownerPhone: formData.ownerPhone || undefined,
        ownerEmail: formData.ownerEmail || undefined,
        vehiclePlate: formData.vehiclePlate || undefined,
        certificateUrl: formData.certificateUrl || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await documentosService.updateInsurance(insurance.seguro.numeroPoliza, updateData);

      toast({
        title: "Seguro actualizado",
        description: "El seguro AFOCAT ha sido actualizado exitosamente.",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error?.message || "No se pudo actualizar el seguro. Inténtalo nuevamente.",
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

  if (!insurance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Editar Seguro AFOCAT
            <Badge variant="secondary" className="ml-2">
              {insurance.seguro.numeroPoliza}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Actual */}
            <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Información Actual</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Propietario:</span>
                  <p className="font-medium">{insurance.propietario.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Vehículo:</span>
                  <p className="font-medium">{insurance.vehiculo.placa}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Empresa:</span>
                  <p className="font-medium">{insurance.seguro.empresaAseguradora}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                  <Badge variant="secondary" className={insurance.estado.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                    {insurance.estado.descripcion}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Campos Editables */}

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

            {/* Cobertura */}
            <div className="space-y-2">
              <Label htmlFor="coverage" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cobertura
              </Label>
              <Select value={formData.coverage} onValueChange={(value) => handleInputChange("coverage", value)}>
                <SelectTrigger className="border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Seleccionar cobertura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPREHENSIVE">COMPREHENSIVE</SelectItem>
                  <SelectItem value="BASIC">BASIC</SelectItem>
                  <SelectItem value="THIRD_PARTY">THIRD_PARTY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Monto Prima */}
            <div className="space-y-2">
              <Label htmlFor="premiumAmount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Monto Prima
              </Label>
              <Input
                id="premiumAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.premiumAmount}
                onChange={(e) => handleInputChange("premiumAmount", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Teléfono Propietario */}
            <div className="space-y-2">
              <Label htmlFor="ownerPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono Propietario
              </Label>
              <Input
                id="ownerPhone"
                type="tel"
                placeholder="999888777"
                value={formData.ownerPhone}
                onChange={(e) => handleInputChange("ownerPhone", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Email Propietario */}
            <div className="space-y-2">
              <Label htmlFor="ownerEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Propietario
              </Label>
              <Input
                id="ownerEmail"
                type="email"
                placeholder="email@ejemplo.com"
                value={formData.ownerEmail}
                onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

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

            {/* URL Certificado */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="certificateUrl" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                URL Certificado Digital
              </Label>
              <Input
                id="certificateUrl"
                type="url"
                placeholder="https://ejemplo.com/certificado.pdf"
                value={formData.certificateUrl}
                onChange={(e) => handleInputChange("certificateUrl", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
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
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};