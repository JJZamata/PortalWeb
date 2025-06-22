
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileCheck, Search, Plus, Edit, Eye, Download, Calendar, Car, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useCitvData } from "@/hooks/useRealTimeData";

const CitvPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Usar datos en tiempo real
  const { data: citv = [], isLoading, error, refetch, isRefetching } = useCitvData();

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case 'Aprobado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Observado':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Desaprobado':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getResultadoIcon = (resultado: string) => {
    switch (resultado) {
      case 'Aprobado':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'Observado':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'Desaprobado':
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

  const filteredCitv = citv.filter(cert =>
    cert.placa_v.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.nro_certificado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.resultado_inspeccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de CITV</p>
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
        <div className="bg-gradient-to-br from-white to-green-50/30 p-8 rounded-2xl shadow-lg border border-green-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-2">
                Certificados CITV
              </h1>
              <p className="text-gray-600 text-lg">Gestión de Certificados de Inspección Técnica Vehicular</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">
                  {isLoading ? '-' : citv.filter(c => c.resultado_inspeccion === 'Aprobado').length}
                </p>
                <p className="text-sm text-gray-600">Aprobados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-700">
                  {isLoading ? '-' : citv.filter(c => c.resultado_inspeccion === 'Observado').length}
                </p>
                <p className="text-sm text-gray-600">Observados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">
                  {isLoading ? '-' : citv.filter(c => c.resultado_inspeccion === 'Desaprobado').length}
                </p>
                <p className="text-sm text-gray-600">Desaprobados</p>
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
                  Certificados CITV
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>Registro completo de inspecciones técnicas vehiculares</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo CITV
                </Button>
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Buscador */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por placa, certificado o resultado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Cargando certificados CITV...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                    <TableRow>
                      <TableHead className="font-bold text-green-900">Placa</TableHead>
                      <TableHead className="font-bold text-green-900">Certificado</TableHead>
                      <TableHead className="font-bold text-green-900">Clase/Categoría</TableHead>
                      <TableHead className="font-bold text-green-900">Resultado</TableHead>
                      <TableHead className="font-bold text-green-900">Vencimiento</TableHead>
                      <TableHead className="font-bold text-green-900">Inspector</TableHead>
                      <TableHead className="font-bold text-green-900 text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCitv.map((cert) => {
                      const diasVencer = getDiasParaVencer(cert.fecha_vencimiento);
                      return (
                        <TableRow key={cert.id_revisionT} className="hover:bg-green-50/50 transition-colors">
                          <TableCell className="font-mono font-bold text-green-800">{cert.placa_v}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-gray-900">{cert.nro_certificado}</p>
                              <p className="text-sm text-gray-500">ID: {cert.id_revisionT}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">Clase: {cert.clase_vehiculo}</p>
                              <p className="text-sm text-gray-500">Cat: {cert.categoria}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getResultadoIcon(cert.resultado_inspeccion)}
                              <Badge variant="secondary" className={`${getResultadoBadge(cert.resultado_inspeccion)} font-semibold rounded-full border`}>
                                {cert.resultado_inspeccion}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">{cert.fecha_vencimiento}</span>
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
                            <p className="text-sm font-medium">{cert.firma_inspector}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="hover:bg-green-100 rounded-lg">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <FileCheck className="w-5 h-5" />
                                      Certificado CITV - {cert.placa_v}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Detalles completos del certificado {cert.nro_certificado}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Placa</label>
                                      <p className="font-mono font-bold text-lg">{cert.placa_v}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Resultado</label>
                                      <div className="mt-1 flex items-center gap-2">
                                        {getResultadoIcon(cert.resultado_inspeccion)}
                                        <Badge variant="secondary" className={`${getResultadoBadge(cert.resultado_inspeccion)} font-semibold rounded-full border`}>
                                          {cert.resultado_inspeccion}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Certificado</label>
                                      <p className="font-semibold">{cert.nro_certificado}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">ID Revisión</label>
                                      <p>{cert.id_revisionT}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Clase Vehículo</label>
                                      <p className="font-medium">{cert.clase_vehiculo}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Categoría</label>
                                      <p className="font-medium">{cert.categoria}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Fecha Emisión</label>
                                      <p>{cert.fecha_emision}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                                      <p>{cert.fecha_vencimiento}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm font-medium text-gray-700">Inspector</label>
                                      <p className="font-medium">{cert.firma_inspector}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" className="hover:bg-green-100 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-green-100 rounded-lg">
                                <Download className="w-4 h-4" />
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

export default CitvPage;
