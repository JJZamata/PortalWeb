
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
  CreditCard,
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
  Shield,
  QrCode,
  RefreshCw,
  XCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAfocatData } from "@/hooks/useRealTimeData";

const AfocatPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Usar datos en tiempo real
  const { data: afocatData = [], isLoading, error, refetch, isRefetching } = useAfocatData();

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

  const getDiasParaVencer = (fechaVencimiento: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  // Calcular estados basado en fechas de vencimiento
  const afocatWithStatus = afocatData.map(afocat => {
    const dias = getDiasParaVencer(afocat.fecha_vencimiento);
    let estado = afocat.estado;
    
    if (dias <= 0) {
      estado = 'Vencido';
    } else if (dias <= 30) {
      estado = 'Por Vencer';
    }
    
    return { ...afocat, estado };
  });

  const filteredData = afocatWithStatus.filter(afocat => {
    const matchesSearch = 
      afocat.placa_v.toLowerCase().includes(searchTerm.toLowerCase()) ||
      afocat.nro_poliza.toLowerCase().includes(searchTerm.toLowerCase()) ||
      afocat.nombre_aseguradora.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || afocat.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de AFOCAT</p>
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
        <div className="bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg border border-orange-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent mb-2">
                Seguros AFOCAT
              </h1>
              <p className="text-gray-600 text-lg">Gestión de seguros obligatorios contra accidentes de tránsito</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-700">
                  {isLoading ? '-' : afocatWithStatus.length}
                </p>
                <p className="text-sm text-gray-600">Total AFOCAT</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">
                  {isLoading ? '-' : afocatWithStatus.filter(a => a.estado === 'Vigente').length}
                </p>
                <p className="text-sm text-gray-600">Vigentes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700">
                  {isLoading ? '-' : afocatWithStatus.filter(a => a.estado === 'Por Vencer').length}
                </p>
                <p className="text-sm text-gray-600">Por Vencer</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">
                  {isLoading ? '-' : afocatWithStatus.filter(a => a.estado === 'Vencido').length}
                </p>
                <p className="text-sm text-gray-600">Vencidos</p>
              </div>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
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
                  Seguros AFOCAT
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-orange-600" />}
                </CardTitle>
                <CardDescription>Registro completo de pólizas de seguros AFOCAT</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo AFOCAT
                </Button>
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, póliza, aseguradora..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Vigente">Vigente</SelectItem>
                  <SelectItem value="Por Vencer">Por Vencer</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
              
              <div></div>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-600">Cargando seguros AFOCAT...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
                    <TableRow>
                      <TableHead className="font-bold text-orange-900">Placa</TableHead>
                      <TableHead className="font-bold text-orange-900">Aseguradora</TableHead>
                      <TableHead className="font-bold text-orange-900">Nº Póliza</TableHead>
                      <TableHead className="font-bold text-orange-900">Categoría</TableHead>
                      <TableHead className="font-bold text-orange-900">Inicio</TableHead>
                      <TableHead className="font-bold text-orange-900">Vencimiento</TableHead>
                      <TableHead className="font-bold text-orange-900">Estado</TableHead>
                      <TableHead className="font-bold text-orange-900 text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((afocat) => (
                      <TableRow key={afocat.id_afocat} className="hover:bg-orange-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-orange-800">{afocat.placa_v}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">{afocat.nombre_aseguradora}</p>
                            <p className="text-sm text-gray-500">ID: {afocat.id_afocat}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm font-medium">{afocat.nro_poliza}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-medium">
                            {afocat.clase_categoria}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{afocat.fecha_inicio}</TableCell>
                        <TableCell className="text-sm font-medium">{afocat.fecha_vencimiento}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getEstadoBadge(afocat.estado)} border text-xs font-semibold rounded-full`}>
                            {afocat.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-orange-100 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Detalle AFOCAT - {afocat.placa_v}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Información completa de la póliza {afocat.nro_poliza}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Placa</label>
                                    <p className="font-mono font-bold text-lg">{afocat.placa_v}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Estado</label>
                                    <div className="mt-1">
                                      <Badge variant="secondary" className={`${getEstadoBadge(afocat.estado)} border text-xs font-semibold rounded-full`}>
                                        {afocat.estado}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Aseguradora</label>
                                    <p className="font-semibold">{afocat.nombre_aseguradora}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Nº Póliza</label>
                                    <p className="font-mono font-medium">{afocat.nro_poliza}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Categoría</label>
                                    <p className="font-medium">{afocat.clase_categoria}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">ID AFOCAT</label>
                                    <p className="font-mono text-sm">{afocat.id_afocat}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                                    <p className="font-medium">{afocat.fecha_inicio}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                                    <p className="font-medium">{afocat.fecha_vencimiento}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Coberturas</label>
                                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{afocat.coberturas}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Firma QR</label>
                                    <p className="font-mono text-sm bg-gray-50 p-2 rounded">{afocat.firma_qr}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm" className="hover:bg-orange-100 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default AfocatPage;
