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
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { InsuranceDetail } from "../types";
import { documentosService } from "../services/documentosService";
import { useToast } from "@/hooks/use-toast";
import { Shield, Calendar, Building, Car, FileText } from "lucide-react";

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
    coverage: "",
  });

  // Initialize form data when insurance changes
  useEffect(() => {
    if (insurance && open) {
      // Extraer solo la fecha (YYYY-MM-DD) de la fecha de vencimiento
      setFormData({
        insuranceCompanyName: insurance.seguro?.insuranceCompanyName || "",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 rounded-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Editar Seguro AFOCAT
            <Badge variant="secondary" className="ml-2">
              {insurance.seguro.policyNumber}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
            Actualiza la información del seguro manteniendo consistencia con los datos vinculados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Campos editables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCompanyName" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Building className="w-4 h-4" />
                    Empresa Aseguradora
                  </Label>
                  <Input
                    id="insuranceCompanyName"
                    placeholder="Nombre de la aseguradora"
                    value={formData.insuranceCompanyName}
                    onChange={(e) => handleInputChange("insuranceCompanyName", e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="coverage" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Shield className="w-4 h-4" />
                    Cobertura
                  </Label>
                  <Select value={formData.coverage} onValueChange={(value) => handleInputChange("coverage", value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 focus:border-cyan-500 focus:ring-cyan-500">
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
            </CardContent>
          </Card>

          <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50/50 dark:bg-gray-800/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Datos de referencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="policyNumber" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <FileText className="w-4 h-4" />
                    Número de Póliza
                  </Label>
                  <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 min-h-11">
                    {insurance?.seguro?.policyNumber || 'No disponible'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Car className="w-4 h-4" />
                    Placa Vehículo
                  </Label>
                  <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 min-h-11">
                    {insurance?.vehiculo?.placa || 'No disponible'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Calendar className="w-4 h-4" />
                    Fecha Inicio
                  </Label>
                  <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 min-h-11">
                    {insurance?.fechas?.inicio ? new Date(insurance.fechas.inicio).toLocaleDateString('es-PE') : 'No disponible'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Calendar className="w-4 h-4" />
                    Fecha Vencimiento
                  </Label>
                  <div className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 min-h-11">
                    {insurance?.fechas?.vencimiento ? new Date(insurance.fechas.vencimiento).toLocaleDateString('es-PE') : 'No disponible'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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