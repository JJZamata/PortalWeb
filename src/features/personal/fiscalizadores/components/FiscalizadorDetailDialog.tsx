import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Activity, Smartphone, Calendar, Clock, XCircle, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FiscalizadorDetallado } from "../types";
import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fiscalizador: FiscalizadorDetallado | null;
  loading: boolean;
  error: string | null;
}

const CardSection = ({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<any>; children: React.ReactNode }) => (
  <Card className="shadow-sm border border-gray-200">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="w-5 h-5 text-red-600" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <div className="mt-1 text-lg font-semibold text-gray-900">{value}</div>
  </div>
);

const FiscalizadorDetailDialog = React.memo(({ open, onOpenChange, fiscalizador, loading, error }: Props) => {
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              Error al cargar detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Ocurrió un problema al cargar la información del fiscalizador
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Reintentar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading || !fiscalizador) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
              Cargando detalles
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Obteniendo información del fiscalizador...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <span className="ml-2 text-gray-600">Por favor espere...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600" />
            Detalles del Fiscalizador
          </DialogTitle>
          <DialogDescription className="text-gray-600">Información completa y detallada</DialogDescription>
        </DialogHeader>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gradient-to-br from-red-50 to-red-100/30 rounded-xl">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-red-600">
              <AvatarFallback className="text-2xl font-bold text-white">
                {(fiscalizador.username || 'F').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{fiscalizador.username || 'Sin nombre'}</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-mono font-semibold text-red-700">ID: {fiscalizador.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <Badge
                    variant="secondary"
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      fiscalizador.isActive ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {fiscalizador.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSection title="Información de Usuario" icon={User}>
              <DetailItem label="ID de Usuario" value={fiscalizador.id} />
              <DetailItem label="Nombre de Usuario" value={fiscalizador.username} />
              <DetailItem label="Email" value={fiscalizador.email} />
              <div>
                <Label className="text-sm font-medium text-gray-700">Roles</Label>
                <div className="mt-1 flex gap-2">
                  {fiscalizador.roles.map((role) => (
                    <Badge key={role.id} variant="outline" className="text-red-700 border-red-200">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardSection>
            <CardSection title="Información de Sesión" icon={Activity}>
              <DetailItem
                label="Último Acceso"
                value={fiscalizador.lastLogin ? formatDate(fiscalizador.lastLogin) : <span className="text-gray-500 italic">Nunca ha accedido</span>}
              />
              <DetailItem
                label="IP del Último Acceso"
                value={fiscalizador.lastLoginIp || <span className="text-gray-500 italic">No disponible</span>}
              />
              <DetailItem
                label="Dispositivo del Último Acceso"
                value={fiscalizador.lastLoginDevice || <span className="text-gray-500 italic">No disponible</span>}
              />
            </CardSection>
            <CardSection title="Configuración del Dispositivo" icon={Smartphone}>
              <DetailItem
                label="Estado de Configuración"
                value={
                  <Badge
                    variant="secondary"
                    className={`px-3 py-1 rounded-full font-semibold border ${
                      fiscalizador.deviceConfigured ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {fiscalizador.deviceConfigured ? "Configurado" : "Pendiente de Configuración"}
                  </Badge>
                }
              />
              {fiscalizador.deviceInfo?.detalles && (
                <>
                  <DetailItem label="ID del Dispositivo" value={fiscalizador.deviceInfo.detalles.deviceId} />
                  <DetailItem label="Nombre del Dispositivo" value={fiscalizador.deviceInfo.detalles.deviceName} />
                  <DetailItem label="Plataforma" value={fiscalizador.deviceInfo.detalles.platform} />
                  <DetailItem label="Versión del Sistema" value={fiscalizador.deviceInfo.detalles.version} />
                  <DetailItem label="Versión de la App" value={fiscalizador.deviceInfo.detalles.appVersion} />
                </>
              )}
            </CardSection>
            <CardSection title="Información de Registro" icon={Calendar}>
              <DetailItem label="Fecha de Creación" value={formatDate(fiscalizador.createdAt)} />
              <DetailItem label="Última Actualización" value={formatDate(fiscalizador.updatedAt)} />
            </CardSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

FiscalizadorDetailDialog.displayName = "FiscalizadorDetailDialog";

export default FiscalizadorDetailDialog;