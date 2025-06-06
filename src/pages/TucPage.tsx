
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
  FileText,
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
  QrCode,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const TucPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefetching, setIsRefetching] = useState(false);

  // Datos de ejemplo para TUC
  const tucData = [
    {
      id: "TUC-001",
      placa: "ABC-123",
      entidad_otorgante: "Municipalidad La Joya",
      nro_tuc: "TUC20240001",
      empresa: "20123456789",
      ruta_autorizada: "Ruta A - Centro",
      tipo_servicio: "Taxi",
      nombre_titular: "Juan Carlos Mendez Lopez",
      fecha_emision: "2024-01-15",
      fecha_vencimiento: "2025-01-15",
      codigo_qr: "QR001TUC2024",
      estado: "Vigente"
    },
    {
      id: "TUC-002",
      placa: "XYZ-789",
      entidad_otorgante: "Municipalidad La Joya",
      nro_tuc: "TUC20240002",
      empresa: "20123456790",
      ruta_autorizada: "Ruta B - Terminal",
      tipo_servicio: "Mototaxi",
      nombre_titular: "Maria Elena Quispe Torres",
      fecha_emision: "2024-02-20",
      fecha_vencimiento: "2025-02-20",
      codigo_qr: "QR002TUC2024",
      estado: "Vigente"
    },
    {
      id: "TUC-003",
      placa: "DEF-456",
      entidad_otorgante: "Municipalidad La Joya",
      nro_tuc: "TUC20230015",
      empresa: "20123456791",
      ruta_autorizada: "Ruta C - Periférico",
      tipo_servicio: "Mototaxi",
      nombre_titular: "Pedro Alfonso Silva Diaz",
      fecha_emision: "2023-12-10",
      fecha_vencimiento: "2024-12-10",
      codigo_qr: "QR003TUC2023",
      estado: "Por Vencer"
    },
    {
      id: "TUC-004",
      placa: "GHI-012",
      entidad_otorgante: "Municipalidad La Joya",
      nro_tuc: "TUC20230008",
      empresa: "20123456789",
      ruta_autorizada: "Ruta D - Industrial",
      tipo_servicio: "Taxi",
      nombre_titular: "Ana Lucia Herrera Torres",
      fecha_emision: "2023-06-15",
      fecha_vencimiento: "2024-06-15",
      codigo_qr: "QR004TUC2023",
      estado: "Vencido"
    }
  ];

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

  const filteredData = tucData.filter(tuc => {
    const matchesSearch = 
      tuc.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuc.nro_tuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuc.nombre_titular.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tuc.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefetch = () => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg border border-orange-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent mb-2">
                Tarjetas Únicas de Circulación (TUC)
              </h1>
              <p className="text-gray-600 text-lg">Gestión de documentos de autorización vehicular</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-700">
                  {tucData.filter(t => t.estado === 'Vigente').length}
                </p>
                <p className="text-sm text-gray-600">Vigentes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700">
                  {tucData.filter(t => t.estado === 'Por Vencer').length}
                </p>
                <p className="text-sm text-gray-600">Por Vencer</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">
                  {tucData.filter(t => t.estado === 'Vencido').length}
                </p>
                <p className="text-sm text-gray-600">Vencidos</p>
              </div>
              <Button 
                onClick={handleRefetch} 
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
                  Tarjetas Únicas de Circulación
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>Gestión de documentos TUC y autorizaciones</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo TUC
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, TUC o titular..."
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
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
                  <TableRow>
                    <TableHead className="font-bold text-orange-900">Placa</TableHead>
                    <TableHead className="font-bold text-orange-900">Nº TUC</TableHead>
                    <TableHead className="font-bold text-orange-900">Titular</TableHead>
                    <TableHead className="font-bold text-orange-900">Empresa</TableHead>
                    <TableHead className="font-bold text-orange-900">Tipo Servicio</TableHead>
                    <TableHead className="font-bold text-orange-900">Vencimiento</TableHead>
                    <TableHead className="font-bold text-orange-900">Estado</TableHead>
                    <TableHead className="font-bold text-orange-900 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((tuc) => {
                    const diasVencer = getDiasParaVencer(tuc.fecha_vencimiento);
                    return (
                      <TableRow key={tuc.id} className="hover:bg-orange-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-orange-800">{tuc.placa}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">{tuc.nro_tuc}</p>
                            <p className="text-sm text-gray-500">ID: {tuc.id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{tuc.nombre_titular}</TableCell>
                        <TableCell className="font-mono text-sm">{tuc.empresa}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                            {tuc.tipo_servicio}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">{tuc.fecha_vencimiento}</span>
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
                            {getEstadoIcon(tuc.estado)}
                            <Badge variant="secondary" className={`${getEstadoBadge(tuc.estado)} font-semibold rounded-full border text-xs`}>
                              {tuc.estado}
                            </Badge>
                          </div>
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
                                    <FileText className="w-5 h-5" />
                                    TUC - {tuc.placa}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Detalles del documento {tuc.nro_tuc}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Placa</label>
                                    <p className="font-mono font-bold text-lg">{tuc.placa}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Estado</label>
                                    <div className="mt-1 flex items-center gap-2">
                                      {getEstadoIcon(tuc.estado)}
                                      <Badge variant="secondary" className={`${getEstadoBadge(tuc.estado)} font-semibold rounded-full border`}>
                                        {tuc.estado}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Número TUC</label>
                                    <p className="font-semibold">{tuc.nro_tuc}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Tipo Servicio</label>
                                    <p className="font-medium">{tuc.tipo_servicio}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Titular</label>
                                    <p className="font-medium">{tuc.nombre_titular}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Empresa</label>
                                    <p className="font-mono">{tuc.empresa}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Ruta Autorizada</label>
                                    <p>{tuc.ruta_autorizada}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Entidad Otorgante</label>
                                    <p>{tuc.entidad_otorgante}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha Emisión</label>
                                    <p>{tuc.fecha_emision}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                                    <p>{tuc.fecha_vencimiento}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Código QR</label>
                                    <p className="font-mono text-sm">{tuc.codigo_qr}</p>
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TucPage;
