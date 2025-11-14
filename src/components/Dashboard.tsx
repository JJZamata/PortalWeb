import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";0
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Car, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Building2,
  ClipboardCheck,
  Activity,
  MapPin,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {  
  const { toast } = useToast();

  // Estadísticas relevantes para el sistema FISCAMOTO
  const stats = [
    {
      title: "Fiscalizadores Activos",
      value: "24",
      change: "+3 este mes",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Conductores Registrados",
      value: "1,247",
      change: "+45 este mes",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Mototaxis Activas",
      value: "892",
      change: "+23 este mes",
      icon: Car,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Empresas Operativas",
      value: "15",
      change: "+2 este mes",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const recentActivities = [
    { 
      id: 1, 
      action: "Nuevo conductor registrado", 
      time: "Hace 5 minutos", 
      type: "success",
      details: "Juan Pérez - Zona Norte"
    },
    { 
      id: 2, 
      action: "Infracción registrada", 
      time: "Hace 12 minutos", 
      type: "warning",
      details: "Mototaxi ABC-123 - Exceso de velocidad"
    },
    { 
      id: 3, 
      action: "Documento vencido detectado", 
      time: "Hace 25 minutos", 
      type: "error",
      details: "Licencia de conducir - 5 vencimientos"
    },
    { 
      id: 4, 
      action: "Fiscalización completada", 
      time: "Hace 1 hora", 
      type: "info",
      details: "Zona Centro - 15 mototaxis revisadas"
    },
  ];

  const quickActions = [
    {
      title: "Registrar Conductor",
      description: "Agregar nuevo conductor al sistema",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Registrar Mototaxi",
      description: "Agregar nueva mototaxi al sistema",
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Registrar Infracción",
      description: "Reportar nueva infracción",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Generar Reporte",
      description: "Crear reporte de fiscalización",
      icon: FileCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const systemStatus = [
    { name: "API Backend", status: "online", uptime: "99.9%" },
    { name: "Base de Datos", status: "online", uptime: "99.8%" },
    { name: "Sistema de Notificaciones", status: "online", uptime: "99.7%" },
    { name: "Servicio de Geolocalización", status: "online", uptime: "99.6%" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>;
      case 'info':
        return <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido a FISCAMOTO!</h1>
            <p className="text-red-100 mt-2">Sistema de Control y Fiscalización de Mototaxis</p>
            <p className="text-red-200 text-sm mt-1">Última actualización: {new Date().toLocaleString('es-ES')}</p>
          </div>
          <div className="hidden md:block">
            <Shield className="w-16 h-16 text-red-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Acciones más utilizadas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas actividades registradas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">{activity.time}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          activity.type === 'success' ? 'bg-green-100 text-green-800' :
                          activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          activity.type === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {activity.type === 'success' ? 'Registro' :
                         activity.type === 'warning' ? 'Infracción' :
                         activity.type === 'error' ? 'Vencimiento' :
                         'Fiscalización'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Estado del Sistema
          </CardTitle>
          <CardDescription>
            Monitoreo en tiempo real de los servicios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
