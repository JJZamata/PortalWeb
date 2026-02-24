import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Car,
  AlertTriangle,
  Activity,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useActasDiarias } from '@/features/actas/hooks/useActasDiarias';
import { actasService } from '@/features/actas/services/actasService';
import { infraccionesService } from '@/features/documentacion/infracciones/services/infraccionesService';
import { auditoriaService } from '@/features/control/auditoria/services/auditoriaService';
import { translateAuditAction } from '@/features/control/auditoria/utils/auditActionTranslator';

// Funciones de utilidad (fuera del componente para evitar recreaciones)
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date().getTime();
  const time = new Date(timestamp).getTime();
  const diffMs = now - time;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Hace unos segundos';
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes === 1 ? '' : 's'}`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
};

const formatDateTime = (dateValue?: string): string => {
  if (!dateValue) return '—';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '—';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsedDate);
};

// Estilos compartidos para tooltips de gráficos
const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  color: 'hsl(var(--foreground))'
};

const CHART_TOOLTIP_ITEM_STYLE = {
  color: 'hsl(var(--foreground))'
};

// Acciones rápidas (constante estática)
const QUICK_ACTIONS = [
  {
    title: "Registrar Conductor",
    description: "Agregar nuevo conductor al sistema",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    path: '/conductores'
  },
  {
    title: "Registrar Mototaxi",
    description: "Agregar nueva mototaxi al sistema",
    icon: Car,
    gradient: "from-emerald-500 to-teal-500",
    path: '/vehiculos'
  },
  {
    title: "Registrar Infracción",
    description: "Reportar nueva infracción",
    icon: AlertTriangle,
    gradient: "from-orange-500 to-red-500",
    path: '/infracciones'
  },
  {
    title: "Gestionar Documentos",
    description: "Revisar documentos y certificaciones",
    icon: FileCheck,
    gradient: "from-purple-500 to-pink-500",
    path: '/documentos'
  }
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const { actasPorDia, actasPorTipo, loading: loadingActasDiarias, error: errorActasDiarias } = useActasDiarias();
  const [chartKey, setChartKey] = useState(Date.now());
  const animatingRef = useRef(false);

  const { data: actividadReciente = [], isLoading: loadingActividadReciente, error: errorActividadReciente } = useQuery({
    queryKey: ['dashboard-actividad-reciente'],
    queryFn: async () => {
      const allowedMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
      const targetCount = 6;
      const filteredLogs: any[] = [];

      let page = 1;
      let hasNextPage = true;
      const maxPagesToScan = 5;

      // Escanear solo hasta obtener suficientes registros filtrados o alcanzar el límite
      while (hasNextPage && page <= maxPagesToScan && filteredLogs.length < targetCount) {
        const response = await auditoriaService.getAuditLogs(page, 50);
        const logs = response?.data?.logs || [];
        const pagination = response?.data?.pagination || {};

        // Filtrar y agregar solo los necesarios
        const filtered = logs.filter((log: any) => 
          allowedMethods.has(String(log.method || '').toUpperCase())
        );
        
        const remaining = targetCount - filteredLogs.length;
        filteredLogs.push(...filtered.slice(0, remaining));

        // Detenerse si ya tenemos suficientes
        if (filteredLogs.length >= targetCount) break;

        hasNextPage = Boolean(pagination.has_next ?? pagination.hasNextPage ?? false);
        page += 1;
      }

      return filteredLogs
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, targetCount)
        .map((log: any) => {
          const method = String(log.method || '').toUpperCase();
          const action = translateAuditAction(method, log.url || '');

          let tipo: 'success' | 'warning' | 'error' | 'info' = 'info';
          let icono = Eye;

          if (method === 'POST') {
            tipo = 'success';
            icono = CheckCircle;
          } else if (method === 'PUT' || method === 'PATCH') {
            tipo = 'warning';
            icono = Activity;
          } else if (method === 'DELETE') {
            tipo = 'error';
            icono = XCircle;
          }

          return {
            id: log.id,
            accion: action.title,
            detalles: `${method} ${log.url || '/api'}${log.user?.username ? ` · ${log.user.username}` : ''}`,
            tiempo: formatTimeAgo(log.timestamp),
            tipo,
            icono,
          };
        });
    },
    staleTime: 60 * 1000,
  });

  const { data: actasRecientes = [], isLoading: loadingActasRecientes, error: errorActasRecientes } = useQuery({
    queryKey: ['dashboard-actas-recientes'],
    queryFn: async () => {
      const response = await actasService.getActas(1, '', 'all', 'createdAt', 'DESC');

      return (response.records || []).slice(0, 4).map((record: any) => ({
        numeroActa: `ACT-${record.id}`,
        fecha: formatDateTime(record.createdAt || record.inspectionDateTime),
        placa: record.vehiclePlate || record.vehicle?.plateNumber || '—',
        conductor: record.driver?.name || 'Sin conductor',
        fiscalizador: record.inspector?.username || 'Sin fiscalizador',
        tipo: String(record.type || record.recordType || '').toUpperCase() === 'NOCONFORME' ? 'No Conforme' : 'Conforme',
        estado: record.status || 'Registrada',
      }));
    },
    staleTime: 60 * 1000,
  });

  const { data: infraccionesStats, isLoading: loadingInfraccionesStats, error: errorInfraccionesStats } = useQuery({
    queryKey: ['dashboard-infracciones-stats'],
    queryFn: () => infraccionesService.getStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Controlar la key del gráfico para que la animación no se interrumpa
  useEffect(() => {
    if (!loadingInfraccionesStats && infraccionesStats && !animatingRef.current) {
      animatingRef.current = true;
      setChartKey(Date.now());
      
      // Marcar como no animando después de que termine la animación
      const timer = setTimeout(() => {
        animatingRef.current = false;
      }, 1300); // Un poco más que la duración de la animación
      
      return () => clearTimeout(timer);
    }
  }, [loadingInfraccionesStats, infraccionesStats]);

  // Datos para el gráfico de dona - Infracciones por Gravedad (memoizado)
  const infraccionesPorGravedadData = useMemo(() => [
    { name: 'Leve', value: Number(infraccionesStats?.data?.porcentajes?.porGravedad?.leves ?? 0), color: '#f59e0b' },
    { name: 'Grave', value: Number(infraccionesStats?.data?.porcentajes?.porGravedad?.graves ?? 0), color: '#fb923c' },
    { name: 'Muy Grave', value: Number(infraccionesStats?.data?.porcentajes?.porGravedad?.muyGraves ?? 0), color: '#ef4444' },
  ], [infraccionesStats]);


  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, index) => (
            <Card 
              key={index}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-gray-800 hover:scale-105"
              onClick={() => navigate(action.path)}
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
                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
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
              {errorInfraccionesStats ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-500 font-medium">Error al cargar datos</p>
                    <p className="text-sm text-muted-foreground mt-2">No se pudo obtener estadísticas de infracciones</p>
                  </div>
                </div>
              ) : loadingInfraccionesStats ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-muted-foreground">Cargando datos...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart key={chartKey}>
                    <Pie
                      data={infraccionesPorGravedadData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      label={({ name, value }) => `${name} (${Math.round(Number(value))}%)`}
                    >
                      {infraccionesPorGravedadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${Math.round(Number(value))}%`}
                      contentStyle={CHART_TOOLTIP_STYLE}
                      itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                      labelStyle={CHART_TOOLTIP_ITEM_STYLE}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
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
                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
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
              <CardTitle className="text-lg text-foreground">Actas Recientes</CardTitle>
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
                    {errorActasRecientes ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-2 text-center text-sm text-red-500">
                          Error al cargar actas recientes
                        </td>
                      </tr>
                    ) : loadingActasRecientes ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-2 text-center text-sm text-muted-foreground">
                          Cargando actas recientes...
                        </td>
                      </tr>
                    ) : actasRecientes.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 px-2 text-center text-sm text-muted-foreground">
                          No hay actas recientes
                        </td>
                      </tr>
                    ) : actasRecientes.map((acta) => (
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
          <Card className="lg:col-span-1 border-0 shadow-lg bg-background dark:bg-gray-900 flex flex-col h-full">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-[400px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">{errorActividadReciente ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 font-medium text-sm">Error al cargar actividad reciente</p>
                  </div>
                ) : loadingActividadReciente ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">Cargando actividad...</p>
                  </div>
                ) : actividadReciente.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">Sin actividad reciente</p>
                  </div>
                ) : (
                  actividadReciente.map((actividad) => (
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
                ))
              )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;