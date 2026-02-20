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
  Database,
  Eye,
  ChevronRight,
  AlertCircle,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useActasDiarias } from '@/features/actas/hooks/useActasDiarias';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { actasPorDia, actasPorTipo, loading: loadingActasDiarias, error: errorActasDiarias } = useActasDiarias();

  // Datos para el gráfico de dona - Infracciones por Gravedad
  const infraccionesPorGravedadData = [
    { name: 'Leve', value: 50, color: '#f59e0b' },
    { name: 'Grave', value: 33, color: '#fb923c' },
    { name: 'Muy Grave', value: 17, color: '#ef4444' },
  ];

  // Datos de actas recientes
  const actasRecientes = [
    {
      numeroActa: 'ACT-2024-001',
      fecha: '31/01/2024 09:45',
      placa: 'AQP-123',
      conductor: 'Juan Pérez Mamani',
      fiscalizador: 'Carlos Quispe',
      tipo: 'Conforme',
      estado: 'Validada',
    },
    {
      numeroActa: 'ACT-2024-002',
      fecha: '31/01/2024 10:20',
      placa: 'AQP-456',
      conductor: 'María López Cruz',
      fiscalizador: 'Ana Torres',
      tipo: 'No Conforme',
      estado: 'Pendiente',
    },
    {
      numeroActa: 'ACT-2024-003',
      fecha: '31/01/2024 11:15',
      placa: 'AQP-789',
      conductor: 'Pedro Huanca Flores',
      fiscalizador: 'Carlos Quispe',
      tipo: 'Conforme',
      estado: 'Validada',
    },
    {
      numeroActa: 'ACT-2024-004',
      fecha: '31/01/2024 12:30',
      placa: 'AQP-234',
      conductor: 'Rosa Choque Apaza',
      fiscalizador: 'Luis Mendoza',
      tipo: 'Conforme',
      estado: 'Validada',
    },
  ];

  // Actividad reciente
  const actividadReciente = [
    {
      id: 1,
      accion: 'Nuevo conductor registrado',
      detalles: 'Juan Pérez - Zona Norte',
      tiempo: 'Hace 5 minutos',
      tipo: 'success',
      icono: Users,
    },
    {
      id: 2,
      accion: 'Infracción registrada',
      detalles: 'Mototaxi ABC-123 - Exceso de velocidad',
      tiempo: 'Hace 12 minutos',
      tipo: 'warning',
      icono: AlertTriangle,
    },
    {
      id: 3,
      accion: 'Documento vencido detectado',
      detalles: 'Licencia de conducir - 5 vencimientos',
      tiempo: 'Hace 25 minutos',
      tipo: 'error',
      icono: FileText,
    },
    {
      id: 4,
      accion: 'Fiscalización completada',
      detalles: 'Zona Centro - 15 mototaxis revisadas',
      tiempo: 'Hace 1 hora',
      tipo: 'info',
      icono: Shield,
    },
  ];

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
        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-gray-800 hover:scale-105"
              onClick={action.onClick}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos estadísticos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actas por Tipo (Última Semana) */}
          <Card className="border-0 shadow-lg bg-background dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Actas por Tipo (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              {errorActasDiarias ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-500 font-medium">Error al cargar datos</p>
                    <p className="text-sm text-muted-foreground mt-2">{errorActasDiarias}</p>
                  </div>
                </div>
              ) : loadingActasDiarias ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-muted-foreground">Cargando datos...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={actasPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="conformes" fill="#22c55e" radius={[8, 8, 0, 0]} name="Conformes" />
                    <Bar dataKey="noConformes" fill="#ef4444" radius={[8, 8, 0, 0]} name="No Conformes" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Infracciones por Gravedad */}
          <Card className="border-0 shadow-lg bg-background dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Infracciones por Gravedad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={infraccionesPorGravedadData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {infraccionesPorGravedadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Actas Registradas por Día */}
          <Card className="border-0 shadow-lg bg-background dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Actas Registradas por Día (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              {errorActasDiarias ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-500 font-medium">Error al cargar datos</p>
                    <p className="text-sm text-muted-foreground mt-2">{errorActasDiarias}</p>
                  </div>
                </div>
              ) : loadingActasDiarias ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-muted-foreground">Cargando datos...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={actasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#1e3a8a" 
                      strokeWidth={2}
                      dot={{ fill: '#1e3a8a', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Total Actas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actas Recientes y Actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actas Recientes */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-background dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Actas Recientes</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:hover:bg-gray-800">
                    Todos
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:hover:bg-gray-800">
                    Todos
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:hover:bg-gray-800">
                    <Filter className="w-4 h-4 mr-1" />
                    Más filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">N° ACTA</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">FECHA Y HORA</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">PLACA</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">CONDUCTOR</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">FISCALIZADOR</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">TIPO</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ESTADO</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actasRecientes.map((acta) => (
                      <tr key={acta.numeroActa} className="border-b dark:border-gray-800 hover:bg-accent/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-2 text-sm text-foreground">{acta.numeroActa}</td>
                        <td className="py-3 px-2 text-sm text-foreground">{acta.fecha}</td>
                        <td className="py-3 px-2 text-sm font-medium text-foreground">{acta.placa}</td>
                        <td className="py-3 px-2 text-sm text-foreground">{acta.conductor}</td>
                        <td className="py-3 px-2 text-sm text-foreground">{acta.fiscalizador}</td>
                        <td className="py-3 px-2">
                          <Badge 
                            className={`text-xs ${
                              acta.tipo === 'Conforme' 
                                ? 'bg-blue-900 text-white hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700' 
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {acta.tipo}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge 
                            className={`text-xs ${
                              acta.estado === 'Validada'
                                ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700'
                            }`}
                            variant="outline"
                          >
                            {acta.estado}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate('/actas')}
                            className="dark:hover:bg-gray-800"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card className="lg:col-span-1 border-0 shadow-lg bg-background dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {actividadReciente.map((actividad) => (
                <div
                  key={actividad.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 dark:hover:bg-gray-800/50 transition-colors border border-border dark:border-gray-700"
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    actividad.tipo === 'success'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : actividad.tipo === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : actividad.tipo === 'error'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <actividad.icono className={`w-4 h-4 ${
                      actividad.tipo === 'success'
                        ? 'text-green-600 dark:text-green-400'
                        : actividad.tipo === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : actividad.tipo === 'error'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{actividad.accion}</p>
                    <p className="text-xs text-muted-foreground mt-1">{actividad.detalles}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{actividad.tiempo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;