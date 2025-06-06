import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Car,
  Building2,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Eye,
  Edit,
  Download,
  Filter,
  Calendar,
  MapPin,
  FileCheck,
  FileX,
  Wrench,
  Camera,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const AdminPanel = () => {
  const navigate = useNavigate();

  // Stats principales del sistema - reorganizados por categorías
  const vehiculosStats = [
    {
      title: "Total Mototaxis",
      value: "1,247",
      change: "+12% este mes",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      onClick: () => navigate('/vehiculos')
    },
    {
      title: "Conductores Activos",
      value: "1,089",
      change: "+8% este mes",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      onClick: () => navigate('/conductores')
    },
    {
      title: "Empresas Registradas",
      value: "156",
      change: "+3% este mes",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      onClick: () => navigate('/empresas')
    }
  ];

  const operacionesStats = [
    {
      title: "Fiscalizadores",
      value: "24",
      change: "Personal activo",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      onClick: () => navigate('/fiscalizadores')
    },
    {
      title: "Actas del Mes",
      value: "342",
      change: "+15% vs anterior",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      onClick: () => navigate('/actas')
    },
    {
      title: "Documentos por Vencer",
      value: "89",
      change: "Próximos 30 días",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      onClick: () => navigate('/documentos')
    }
  ];

  // Datos de ejemplo para todas las tablas
  const fiscalizadores = [
    { id: "FISC-001", nombre_completo: "Carlos Alberto Mendoza Silva", codigo: "CAR001", estado: "Activo", contacto: "+51 987654321", imei_autorizado: "123456789012345" },
    { id: "FISC-002", nombre_completo: "Ana Lucia Herrera Torres", codigo: "ANA002", estado: "Activo", contacto: "+51 987654322", imei_autorizado: "123456789012346" },
    { id: "FISC-003", nombre_completo: "Miguel Angel Quispe Flores", codigo: "MIG003", estado: "Activo", contacto: "+51 987654323", imei_autorizado: "123456789012347" },
    { id: "FISC-004", nombre_completo: "Rosa Maria Gutierrez Lopez", codigo: "ROS004", estado: "Inactivo", contacto: "+51 987654324", imei_autorizado: "123456789012348" }
  ];

  const mototaxis = [
    { placa: "ABC-123", ruc_empresa: "20123456789", dni_conductor: "12345678", estado_vehiculo: "Habilitado" },
    { placa: "XYZ-789", ruc_empresa: "20123456790", dni_conductor: "87654321", estado_vehiculo: "Habilitado" },
    { placa: "DEF-456", ruc_empresa: "20123456791", dni_conductor: "11223344", estado_vehiculo: "Suspendido" },
    { placa: "GHI-012", ruc_empresa: "20123456789", dni_conductor: "55667788", estado_vehiculo: "Habilitado" }
  ];

  const empresas = [
    { ruc: "20123456789", nombre: "Transportes La Joya S.A.C.", direccion: "Av. Principal 123", nro_resolucion: "RES-2024-001", fecha_emision: "2024-01-15", fecha_vencimiento: "2025-01-15", entidad_emisora: "Municipalidad La Joya" },
    { ruc: "20123456790", nombre: "Mototaxis del Sur E.I.R.L.", direccion: "Jr. Los Andes 456", nro_resolucion: "RES-2024-002", fecha_emision: "2024-02-10", fecha_vencimiento: "2025-02-10", entidad_emisora: "Municipalidad La Joya" },
    { ruc: "20123456791", nombre: "Servicios Rapidos Unidos S.A.", direccion: "Calle Nueva 789", nro_resolucion: "RES-2024-003", fecha_emision: "2024-03-05", fecha_vencimiento: "2025-03-05", entidad_emisora: "Municipalidad La Joya" }
  ];

  const conductores = [
    { dni: "12345678", nombre_completo: "Juan Carlos Mendez Lopez", nro_licencia: "L12345678", categoria: "AIIB", fecha_emision: "2023-06-15", fecha_vencimiento: "2026-06-15", entidad_emisora: "MTC", restricciones: "Ninguna" },
    { dni: "87654321", nombre_completo: "Maria Elena Quispe Torres", nro_licencia: "L87654321", categoria: "AIIB", fecha_emision: "2023-08-20", fecha_vencimiento: "2026-08-20", entidad_emisora: "MTC", restricciones: "Lentes" },
    { dni: "11223344", nombre_completo: "Pedro Alfonso Silva Diaz", nro_licencia: "L11223344", categoria: "AIIB", fecha_emision: "2023-04-10", fecha_vencimiento: "2026-04-10", entidad_emisora: "MTC", restricciones: "Ninguna" }
  ];

  const citv = [
    { id: "CITV-001", placa: "ABC-123", nro_certificado: "C2024001", clase_vehiculo: "L3", categoria: "M1", fecha_emision: "2024-01-10", fecha_vencimiento: "2025-01-10", resultado: "APROBADO", firma_inspector: "Inspector A" },
    { id: "CITV-002", placa: "XYZ-789", nro_certificado: "C2024002", clase_vehiculo: "L3", categoria: "M1", fecha_emision: "2024-02-15", fecha_vencimiento: "2025-02-15", resultado: "APROBADO", firma_inspector: "Inspector B" },
    { id: "CITV-003", placa: "DEF-456", nro_certificado: "C2024003", clase_vehiculo: "L3", categoria: "M1", fecha_emision: "2024-01-20", fecha_vencimiento: "2025-01-20", resultado: "OBSERVADO", firma_inspector: "Inspector C" }
  ];

  const actasRecientes = [
    { id: "ACT-001", placa: "ABC-123", dni_conductor: "12345678", id_fiscalizador: "FISC-001", fecha_hora: "2024-12-28 14:30:00", ubicacion: "Av. Principal con Jr. Los Andes", tipo_acta: "CONFORME", observaciones: "Documentación en regla" },
    { id: "ACT-002", placa: "XYZ-789", dni_conductor: "87654321", id_fiscalizador: "FISC-002", fecha_hora: "2024-12-28 15:45:00", ubicacion: "Plaza de Armas", tipo_acta: "NO_CONFORME", observaciones: "CITV vencido" },
    { id: "ACT-003", placa: "DEF-456", dni_conductor: "11223344", id_fiscalizador: "FISC-003", fecha_hora: "2024-12-28 16:20:00", ubicacion: "Terminal Terrestre", tipo_acta: "CONFORME", observaciones: "Control rutinario sin observaciones" }
  ];

  const infracciones = [
    { id: "INF-001", id_acta: "ACT-002", codigo: "F001", descripcion: "Conducir sin CITV vigente", gravedad: "GRAVE", sancion: "0.5 UIT", medida_administrativa: "Retención de vehículo" },
    { id: "INF-002", id_acta: "ACT-004", codigo: "F002", descripcion: "Falta de seguro AFOCAT", gravedad: "GRAVE", sancion: "0.3 UIT", medida_administrativa: "Multa" },
    { id: "INF-003", id_acta: "ACT-005", codigo: "F003", descripcion: "Documentos personales vencidos", gravedad: "LEVE", sancion: "0.1 UIT", medida_administrativa: "Amonestación" }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Activo':
      case 'Habilitado':
      case 'APROBADO':
      case 'CONFORME':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OBSERVADO':
      case 'NO_CONFORME':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Inactivo':
      case 'Suspendido':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getGravedadBadge = (gravedad: string) => {
    switch (gravedad) {
      case 'LEVE':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'GRAVE':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MUY_GRAVE':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Compacto */}
        <div className="bg-gradient-to-br from-white to-gray-50/80 p-6 rounded-2xl shadow-lg border border-gray-200/60">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent mb-1">
                Dashboard FISCAMOTO
              </h1>
              <p className="text-gray-600">Sistema Integral de Fiscalización y Control de Mototaxis</p>
              <p className="text-sm text-gray-500">La Joya, Arequipa - Perú</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">1,247</p>
                <p className="text-xs text-gray-600">Vehículos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-700">94%</p>
                <p className="text-xs text-gray-600">Conformidad</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-700">156</p>
                <p className="text-xs text-gray-600">Empresas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Organizadas por Pestañas */}
        <Tabs defaultValue="vehiculos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="vehiculos" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehículos
            </TabsTrigger>
            <TabsTrigger value="operaciones" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Operaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehiculos">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {vehiculosStats.map((stat, index) => (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer border ${stat.borderColor} ${stat.bgColor} hover:scale-102 group rounded-xl overflow-hidden`}
                  onClick={stat.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform bg-white`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <TrendingUp className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600 font-medium">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="operaciones">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {operacionesStats.map((stat, index) => (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer border ${stat.borderColor} ${stat.bgColor} hover:scale-102 group rounded-xl overflow-hidden`}
                  onClick={stat.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform bg-white`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <TrendingUp className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600 font-medium">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Sección Principal de Información Compacta */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Actividad Reciente */}
          <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-sm">
                    Últimos controles y operaciones
                  </CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/actas')}>
                  Ver Todo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {actasRecientes.slice(0, 3).map((acta) => (
                  <div key={acta.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-blue-700">{acta.id}</span>
                      <Badge variant="secondary" className={`${getEstadoBadge(acta.tipo_acta)} font-semibold rounded-full border text-xs`}>
                        {acta.tipo_acta}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p><span className="font-medium">Placa:</span> {acta.placa}</p>
                      <p><span className="font-medium">Fecha:</span> {new Date(acta.fecha_hora).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal y Estado */}
          <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Personal Fiscalizador
                  </CardTitle>
                  <CardDescription className="text-orange-100 text-sm">
                    Personal activo en campo
                  </CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/fiscalizadores')}>
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {fiscalizadores.slice(0, 3).map((fisc) => (
                  <div key={fisc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="w-8 h-8 shadow-sm">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 font-semibold">
                        {fisc.codigo.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{fisc.nombre_completo}</p>
                      <p className="text-xs text-gray-500">Código: {fisc.codigo}</p>
                    </div>
                    <Badge variant="secondary" className={`${getEstadoBadge(fisc.estado)} font-semibold rounded-full border text-xs`}>
                      {fisc.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de Documentos y Certificaciones - Compacta */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* CITV Compacto */}
          <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Certificados CITV
                  </CardTitle>
                  <CardDescription className="text-green-100 text-sm">
                    Estado de inspecciones recientes
                  </CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/citv')}>
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {citv.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-mono font-bold text-sm">{cert.placa}</p>
                      <p className="text-xs text-gray-500">{cert.nro_certificado}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={`${getEstadoBadge(cert.resultado)} font-semibold rounded-full border text-xs mb-1`}>
                        {cert.resultado}
                      </Badge>
                      <p className="text-xs text-gray-500">{cert.fecha_vencimiento}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Infracciones Compactas */}
          <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Infracciones Recientes
                  </CardTitle>
                  <CardDescription className="text-red-100 text-sm">
                    Faltas detectadas en operativos
                  </CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/infracciones')}>
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {infracciones.map((inf) => (
                  <div key={inf.id} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-bold">{inf.codigo}</span>
                      <Badge variant="secondary" className={`${getGravedadBadge(inf.gravedad)} font-semibold rounded-full border text-xs`}>
                        {inf.gravedad}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{inf.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">{inf.sancion}</p>
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
