import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Car,
  Building2,
  FileText,
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  FileCheck,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap,
  Target,
  Award,
  Globe,
  Smartphone,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import DocumentacionImg from '@/assets/images/documentacion.png';

const AdminPanel = () => {
  const navigate = useNavigate();

  // Solo las estadísticas más relevantes para FISCAMOTO
  const stats = [
    {
      title: "Fiscalizadores",
      value: "24",
      change: "+3 este mes",
      icon: Shield,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      color: "text-blue-600",
      onClick: () => navigate('/fiscalizadores')
    },
    {
      title: "Conductores",
      value: "1,089",
      change: "+45 este mes",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      color: "text-emerald-600",
      onClick: () => navigate('/conductores')
    },
    {
      title: "Mototaxis",
      value: "892",
      change: "+23 este mes",
      icon: Car,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      color: "text-orange-600",
      onClick: () => navigate('/vehiculos')
    }
  ];

  // Actividades recientes con mejor diseño
  const recentActivities = [
    { 
      id: "ACT-001", 
      action: "Nuevo conductor registrado", 
      time: "Hace 5 minutos", 
      type: "success",
      details: "Juan Pérez - Zona Norte",
      icon: Users,
      gradient: "from-green-400 to-emerald-500"
    },
    { 
      id: "ACT-002", 
      action: "Infracción registrada", 
      time: "Hace 12 minutos", 
      type: "warning",
      details: "Mototaxi ABC-123 - Exceso de velocidad",
      icon: AlertTriangle,
      gradient: "from-yellow-400 to-orange-500"
    },
    { 
      id: "ACT-003", 
      action: "Documento vencido detectado", 
      time: "Hace 25 minutos", 
      type: "error",
      details: "Licencia de conducir - 5 vencimientos",
      icon: FileText,
      gradient: "from-red-400 to-pink-500"
    },
    { 
      id: "ACT-004", 
      action: "Fiscalización completada", 
      time: "Hace 1 hora", 
      type: "info",
      details: "Zona Centro - 15 mototaxis revisadas",
      icon: Shield,
      gradient: "from-blue-400 to-cyan-500"
    },
  ];

  // Acciones rápidas con mejor diseño
  const quickActions = [
    {
      title: "Registrar Conductor",
      description: "Agregar nuevo conductor al sistema",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      onClick: () => navigate('/conductores')
    },
    {
      title: "Registrar Mototaxi",
      description: "Agregar nueva mototaxi al sistema",
      icon: Car,
      gradient: "from-emerald-500 to-teal-500",
      onClick: () => navigate('/vehiculos')
    },
    {
      title: "Registrar Infracción",
      description: "Reportar nueva infracción",
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500",
      onClick: () => navigate('/infracciones')
    },
    {
      title: "Gestionar Documentos",
      description: "Revisar documentos y certificaciones",
      icon: FileCheck,
      gradient: "from-purple-500 to-pink-500",
      onClick: () => navigate('/documentos')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hero Section con color azul */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-900 dark:via-blue-950 dark:to-gray-900 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/20 dark:bg-white/10 p-3 backdrop-blur-sm">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">FISCAMOTO</h1>
                    <p className="text-blue-100 dark:text-blue-200 text-lg">Sistema de Control y Fiscalización</p>
                  </div>
                </div>
                <p className="text-blue-200 dark:text-blue-300 max-w-2xl">
                  Monitoreo en tiempo real del sistema de mototaxis. Control total sobre fiscalizadores, 
                  conductores, vehículos y empresas operativas.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">1,247</div>
                  <div className="text-sm text-blue-200 dark:text-blue-300">Vehículos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">94.2%</div>
                  <div className="text-sm text-blue-200 dark:text-blue-300">Conformidad</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-blue-200 dark:text-blue-300">Fiscalizadores</div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-72 w-72 rounded-full bg-white/5 dark:bg-white/10"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-48 w-48 rounded-full bg-white/5 dark:bg-white/10"></div>
        </div>

        {/* Hero Section de Documentación */}
        <div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 dark:from-red-900 dark:via-red-950 dark:to-gray-900 p-8 text-white shadow-2xl cursor-pointer group hover:scale-[1.02] transition-all duration-500"
          onClick={() => window.open('https://documenter.getpostman.com/view/39175030/2sB2x9jqSU', '_blank')}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/20 dark:bg-white/10 p-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">DOCUMENTACIÓN API</h1>
                    <p className="text-red-100 dark:text-red-200 text-lg">Guía Completa de Endpoints FISCAMOTO</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-red-200 dark:text-red-300 max-w-2xl text-lg leading-relaxed">
                    Documentación completa desarrollada en <span className="font-semibold text-white">Postman</span> con todos los endpoints, 
                    ejemplos de uso, códigos de respuesta y modelos de datos del sistema FISCAMOTO.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 rounded-full px-4 py-2 backdrop-blur-sm">
                      <Database className="w-4 h-4" />
                      <span className="text-sm font-medium">+50 Endpoints</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 rounded-full px-4 py-2 backdrop-blur-sm">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Autenticación JWT</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 rounded-full px-4 py-2 backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Ejemplos Completos</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button 
                      className="bg-background text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 font-bold py-3 px-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://documenter.getpostman.com/view/39175030/2sB2x9jqSU', '_blank');
                      }}
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      Ver Documentación Completa
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Contenedor de la imagen - Efecto asomándose desde abajo */}
              <div className="hidden lg:block flex-shrink-0 ml-8">
                <div className="relative h-64 w-80">
                  {/* Contenedor con overflow hidden para crear el efecto de corte */}
                  <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
                    {/* Imagen posicionada para que se vea parcialmente */}
                    <div className="relative transform translate-y-16 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      <div className="w-80 h-64 rounded-t-2xl overflow-hidden shadow-2xl border-t border-l border-r border-white/20">
                        <img 
                          src={DocumentacionImg} 
                          alt="Documentación API FISCAMOTO" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Efecto de sombra para dar profundidad */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent dark:from-black/60 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  {/* Efecto de brillo opcional */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-72 w-72 rounded-full bg-white/5 dark:bg-white/10"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-48 w-48 rounded-full bg-white/5 dark:bg-white/10"></div>
          
          {/* Efecto de hover adicional */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-400/5 to-red-500/0 dark:from-red-900/0 dark:via-red-900/10 dark:to-red-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Stats Grid - Solo 3 tarjetas más relevantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105"
              onClick={stat.onClick}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <CardContent className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} dark:from-gray-900 dark:to-gray-800 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 ${stat.color} dark:text-gray-200 opacity-60`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-6 h-6 text-orange-500" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Acceso directo a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <div 
                  key={index}
                  className="group flex items-center p-4 rounded-xl border border-border hover:border-accent hover:bg-background dark:hover:bg-accent/10 cursor-pointer transition-all duration-300 hover:shadow-md"
                  onClick={action.onClick}
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} dark:from-gray-900 dark:to-gray-800 shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-muted-foreground transition-colors">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="w-6 h-6 text-blue-500" />
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Últimas actividades registradas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="group flex items-start space-x-4 p-4 rounded-xl border border-border hover:border-accent hover:bg-background dark:hover:bg-accent/10 transition-all duration-300 hover:shadow-md">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.gradient} dark:from-gray-900 dark:to-gray-800 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs border ${getActivityBadge(activity.type)}`}
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
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;