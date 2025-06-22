
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClipboardCheck,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building2,
  Car,
  FileCheck,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useHabilitacionesData } from "@/hooks/useRealTimeData";

const HabilitacionesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Usar datos en tiempo real
  const { data: habilitacionesData = [], isLoading, error, refetch, isRefetching } = useHabilitacionesData();

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Vigente':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Por Vencer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Vencido':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Vigente':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'Por Vencer':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'Vencido':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getDiasParaVencer = (fechaVencimiento: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  const filteredData = habilitacionesData.filter(hab => {
    const matchesSearch = 
      hab.ruc_empresa.includes(searchTerm) ||
      hab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hab.nro_resolucion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || hab.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de habilitaciones</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-lg border border-blue-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Habilitaciones Vehiculares
              </h1>
              <p className="text-gray-600 text-lg">
                Gestión de habilitaciones empresariales por vehículo
                {isRefetching && <span className="ml-2 text-blue-600">(Actualizando...)</span>}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {isLoading ? '-' : habilitacionesData.filter(h => h.estado === 'Vigente').length}
                </p>
                <p className="text-sm text-gray-600">Vigentes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700">
                  {isLoading ? '-' : habilitacionesData.filter(h => h.estado === 'Por Vencer').length}
                </p>
                <p className="text-sm text-gray-600">Por Vencer</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">
                  {isLoading ? '-' : habilitacionesData.filter(h => h.estado === 'Vencido').length}
                </p>
                <p className="text-sm text-gray-600">Vencidas</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={isRefetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Habilitaciones Vehiculares
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>Gestión de habilitaciones empresariales</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Habilitación
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por RUC, empresa o resolución..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Vigente">Vigente</SelectItem>
                  <SelectItem value="Por Vencer">Por Vencer</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Cargando habilitaciones...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                    <TableRow>
                      <TableHead className="font-bold text-blue-900">RUC</TableHead>
                      <TableHead className="font-bold text-blue-900">Empresa</TableHead>
                      <TableHead className="font-bold text-blue-900">Resolución</TableHead>
                      <TableHead className="font-bold text-blue-900">Representante</TableHead>
                      <TableHead className="font-bold text-blue-900">Vencimiento</TableHead>
                      <TableHead className="font-bold text-blue-900">Estado</TableHead>
                      <TableHead className="font-bold text-blue-900 text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((hab) => {
                      const diasVencer = getDiasParaVencer(hab.fecha_vencimiento);
                      return (
                        <TableRow key={hab.ruc_empresa} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-mono font-bold text-blue-800">{hab.ruc_empresa}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-gray-900 max-w-xs truncate">{hab.nombre}</p>
                              <p className="text-sm text-gray-500">{hab.entidad_emisora}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">{hab.nro_resolucion}</TableCell>
                          <TableCell className="text-sm font-medium">{hab.firma_representante}</TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">{hab.fecha_vencimiento}</span>
                              </div>
                              {diasVencer <= 30 && diasVencer > 0 && (
                                <p className="text-xs text-amber-600 font-medium">Vence en {diasVencer} días</p>
                              )}
                              {diasVencer <= 0 && (
                                <p className="text-xs text-red-600 font-medium">Vencido</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEstadoIcon(hab.estado)}
                              <Badge variant="secondary" className={`${getEstadoBadge(hab.estado)} font-semibold rounded-full border text-xs`}>
                                {hab.estado}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <ClipboardCheck className="w-5 h-5" />
                                      Habilitación - {hab.ruc_empresa}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Detalles de la habilitación {hab.nro_resolucion}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">RUC</label>
                                      <p className="font-mono font-bold text-lg">{hab.ruc_empresa}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Estado</label>
                                      <div className="mt-1 flex items-center gap-2">
                                        {getEstadoIcon(hab.estado)}
                                        <Badge variant="secondary" className={`${getEstadoBadge(hab.estado)} font-semibold rounded-full border`}>
                                          {hab.estado}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm font-medium text-gray-700">Empresa</label>
                                      <p className="font-semibold">{hab.nombre}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm font-medium text-gray-700">Dirección</label>
                                      <p>{hab.direccion}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Resolución</label>
                                      <p className="font-mono font-medium">{hab.nro_resolucion}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Representante</label>
                                      <p className="font-medium">{hab.firma_representante}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Fecha Emisión</label>
                                      <p>{hab.fecha_emision}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                                      <p>{hab.fecha_vencimiento}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm font-medium text-gray-700">Entidad Emisora</label>
                                      <p>{hab.entidad_emisora}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default HabilitacionesPage;
