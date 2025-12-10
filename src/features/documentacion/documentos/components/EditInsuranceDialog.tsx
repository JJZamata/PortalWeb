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
import { Shield, Calendar, Building, Car, FileText, CreditCard } from "lucide-react";

interface Props {
  insurance: InsuranceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditInsuranceDialog = ({ insurance, open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state - solo campos editables
  const [formData, setFormData] = useState({
    insuranceCompanyName: "",
    expirationDate: "",
    coverage: "",
  });

  // Initialize form data when insurance changes
  useEffect(() => {
    if (insurance && open) {
      // Extraer solo la fecha (YYYY-MM-DD) de la fecha de vencimiento
      const expirationDateValue = insurance.fechas?.vencimiento 
        ? (insurance.fechas.vencimiento.includes('T') 
            ? insurance.fechas.vencimiento.split('T')[0] 
            : insurance.fechas.vencimiento.substring(0, 10))
        : "";

      setFormData({
        insuranceCompanyName: insurance.seguro?.insuranceCompanyName || "",
        expirationDate: expirationDateValue,
        coverage: insurance.seguro?.coverage || "",
      });
    }
  }, [insurance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!insurance) return;

    setLoading(true);
    try {
      const updateData = {
        insuranceCompanyName: formData.insuranceCompanyName || undefined,
        expirationDate: formData.expirationDate || undefined,
        coverage: formData.coverage || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await documentosService.updateInsurance(insurance.seguro.policyNumber, updateData);

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
                  <span className="text-gray-600 dark:text-gray-400">Fecha de Emisión:</span>
                  <p className="font-medium">{insurance.fechas.emision?.split('T')[0]}</p>
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

            {/* Empresa Aseguradora */}
            <div className="space-y-2">
              <Label htmlFor="insuranceCompanyName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Empresa Aseguradora
              </Label>
              <Input
                id="insuranceCompanyName"
                placeholder="Nombre de la aseguradora"
                value={formData.insuranceCompanyName}
                onChange={(e) => handleInputChange("insuranceCompanyName", e.target.value)}
                className="border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Número de Póliza */}
            <div className="space-y-2">
              <Label htmlFor="policyNumber" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Número de Póliza
                <span className="text-xs text-gray-500 dark:text-gray-400">(No editable)</span>
              </Label>
              <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100">
                {insurance?.seguro?.policyNumber || 'No disponible'}
              </div>
            </div>

            {/* Placa Vehículo - No editable */}
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Placa Vehículo
                <span className="text-xs text-gray-500 dark:text-gray-400">(No editable)</span>
              </Label>
              <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100">
                {insurance?.vehiculo?.placa || 'No disponible'}
              </div>
            </div>

            {/* Fecha de Inicio */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha Inicio
                <span className="text-xs text-gray-500 dark:text-gray-400">(No editable)</span>
              </Label>
              <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100">
                {insurance?.fechas?.inicio ? new Date(insurance.fechas.inicio).toLocaleDateString('es-PE') : 'No disponible'}
              </div>
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
                  <SelectItem value="Cobertura completa contra accidentes de tránsito, daños a terceros, lesiones personales y daños materiales">
                    COMPREHENSIVE - Cobertura Completa
                  </SelectItem>
                  <SelectItem value="Cobertura básica contra accidentes de tránsito y responsabilidad civil frente a terceros">
                    BASIC - Cobertura Básica
                  </SelectItem>
                  <SelectItem value="Cobertura únicamente para responsabilidad civil frente a terceros según normativa vigente">
                    THIRD PARTY - Solo Terceros
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