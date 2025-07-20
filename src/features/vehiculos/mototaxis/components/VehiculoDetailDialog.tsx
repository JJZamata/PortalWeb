import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Building2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Vehiculo } from "../types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCw, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Props {
  open: boolean;  
  onOpenChange: (open: boolean) => void;
  vehiculo: any | null; // Cambiar a any para manejar tanto formato nuevo como viejo
  loading: boolean;
  error: string | null;
}

export const VehiculoDetailDialog = ({ open, onOpenChange, vehiculo, loading, error }: Props) => {
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar detalles</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
            <Button variant="outline" onClick={() => vehiculo && onOpenChange(true)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !vehiculo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando detalles del vehículo...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Detalles del Vehículo
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Información completa y detallada del vehículo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Principal con Placa y Estado */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-mono font-bold text-blue-800 dark:text-blue-200">
                    {vehiculo.placa?.plateNumber || vehiculo.plateNumber || vehiculo.placa_v || 'N/A'}
                  </span>
                  <Badge 
                    variant={vehiculo.estado === 'OPERATIVO' ? 'default' : 'secondary'} 
                    className="text-sm px-3 py-1 font-semibold"
                  >
                    {vehiculo.estado || vehiculo.vehicleStatus || 'Sin estado'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {vehiculo.tipo?.vehicleInfo || 
                   `${vehiculo.tipo?.marca || vehiculo.brand || ''} ${vehiculo.tipo?.modelo || vehiculo.model || ''}`.trim() ||
                   'Información del vehículo no disponible'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">RUC Empresa</p>
                <p className="font-mono text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {vehiculo.placa?.companyRuc || vehiculo.empresa?.ruc || vehiculo.companyRuc || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del Vehículo */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Placa</Label>
                  <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-300">
                    {vehiculo.placa?.plateNumber || vehiculo.plateNumber || vehiculo.placa_v || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estado</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {vehiculo.estado || vehiculo.vehicleStatus || 'Sin estado'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Marca</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{vehiculo.tipo?.marca || vehiculo.brand || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Modelo</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{vehiculo.tipo?.modelo || vehiculo.model || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Año</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{vehiculo.tipo?.año || vehiculo.manufacturingYear || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categoría</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{vehiculo.tipo?.categoria || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Propietario */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Propietario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombre Completo</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {vehiculo.propietario?.nombreCompleto || vehiculo.ownerName || 'No registrado'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">DNI</Label>
                  <p className="text-lg font-mono font-semibold text-gray-800 dark:text-gray-200">
                    {vehiculo.propietario?.dni || vehiculo.ownerDni || 'N/A'}
                  </p>
                </div>
                {vehiculo.propietario?.nombres && vehiculo.propietario?.apellidos && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombres</Label>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{vehiculo.propietario.nombres}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Apellidos</Label>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{vehiculo.propietario.apellidos}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de la Empresa */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Empresa Operadora
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Razón Social</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {vehiculo.empresa?.nombre || vehiculo.companyName || 'No registrada'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">RUC</Label>
                  <p className="text-lg font-mono font-semibold text-gray-800 dark:text-gray-200">
                    {vehiculo.placa?.companyRuc || vehiculo.empresa?.ruc || vehiculo.companyRuc || 'N/A'}
                  </p>
                </div>
                {vehiculo.empresa?.estado && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estado Empresa</Label>
                    <Badge 
                      variant={vehiculo.empresa.estado === 'ACTIVO' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {vehiculo.empresa.estado}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información Técnica Adicional */}
          {(vehiculo.tipo?.vehicleInfo || vehiculo.tipo?.id) && (
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Información Técnica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehiculo.tipo?.vehicleInfo && (
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Información del Vehículo
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">{vehiculo.tipo.vehicleInfo}</p>
                    </div>
                  )}
                  {vehiculo.tipo?.id && (
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Tipo de Vehículo ID
                      </Label>
                      <p className="text-sm font-mono text-gray-900 dark:text-white">{vehiculo.tipo.id}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};