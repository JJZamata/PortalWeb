
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Search, Plus, Upload, Calendar, FileText, RefreshCw, XCircle, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { useDocumentosData } from "@/hooks/useRealTimeData";

const DocumentosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const { toast } = useToast();

  // Usar datos en tiempo real
  const { data: documentosData = [], isLoading, error, refetch, isRefetching } = useDocumentosData();

  const tiposDocumento = [
    "CITV",
    "TUC", 
    "AFOCAT",
    "Habilitación",
    "Licencia de Conducir"
  ];

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Vigente': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Por Vencer': 
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Vencido': 
        return 'bg-red-50 text-red-700 border-red-200';
      default: 
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredDocumentos = documentosData.filter(doc =>
    doc.placa_v?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDocumento = () => {
    toast({
      title: "Documento registrado",
      description: "El documento ha sido agregado exitosamente",
    });
    setShowAddDialog(false);
  };

  const contarPorEstado = (estado: string) => {
    return documentosData.filter(doc => doc.estado === estado).length;
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los documentos</p>
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
        <div className="bg-gradient-to-br from-white to-cyan-50/30 p-8 rounded-2xl shadow-lg border border-cyan-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-800 to-cyan-600 bg-clip-text text-transparent mb-2">
                Gestión de Documentos
              </h1>
              <p className="text-gray-600 text-lg">Administra la documentación vehicular, CITV, TUC, AFOCAT y habilitaciones</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">
                  {isLoading ? '-' : contarPorEstado('Vigente')}
                </p>
                <p className="text-sm text-gray-600">Vigentes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-700">
                  {isLoading ? '-' : contarPorEstado('Por Vencer')}
                </p>
                <p className="text-sm text-gray-600">Por Vencer</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">
                  {isLoading ? '-' : contarPorEstado('Vencido')}
                </p>
                <p className="text-sm text-gray-600">Vencidos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-700">
                  {isLoading ? '-' : documentosData.length}
                </p>
                <p className="text-sm text-gray-600">Total</p>
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

        {/* Búsqueda */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por placa, número de documento o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-300 focus:border-cyan-500 rounded-xl bg-white text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Documentos */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Documentos Registrados
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-cyan-600" />}
                </CardTitle>
                <CardDescription>Total: {filteredDocumentos.length} documentos</CardDescription>
              </div>
              <div className="flex gap-3">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Documento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.2)] border border-gray-200/80 rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Nuevo Documento</DialogTitle>
                      <DialogDescription>
                        Completa la información del documento
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tipoDoc">Tipo de Documento *</Label>
                          <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tiposDocumento.map(tipo => (
                                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="numero">Número de Documento *</Label>
                          <Input id="numero" placeholder="Ej: CITV-2024-001234" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="placa">Placa del Vehículo *</Label>
                          <Input id="placa" placeholder="Ej: VAW-454" />
                        </div>
                        <div>
                          <Label htmlFor="empresa">Empresa/Entidad Emisora *</Label>
                          <Input id="empresa" placeholder="Ej: Municipalidad La Joya" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fechaEmision">Fecha de Emisión *</Label>
                          <Input id="fechaEmision" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="fechaVencimiento">Fecha de Vencimiento *</Label>
                          <Input id="fechaVencimiento" type="date" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea 
                          id="observaciones" 
                          placeholder="Observaciones adicionales sobre el documento"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Archivo del Documento</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Arrastra el archivo aquí o <button className="text-blue-600 underline">selecciona un archivo</button>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG hasta 10MB</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddDocumento} className="flex-1">
                          Registrar Documento
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                
                <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-600" />
                  <span className="ml-2 text-gray-600">Cargando documentos...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-cyan-900">Tipo</TableHead>
                        <TableHead className="font-bold text-cyan-900">Número</TableHead>
                        <TableHead className="font-bold text-cyan-900">Placa</TableHead>
                        <TableHead className="font-bold text-cyan-900">Entidad/Empresa</TableHead>
                        <TableHead className="font-bold text-cyan-900">Fecha Emisión</TableHead>
                        <TableHead className="font-bold text-cyan-900">Vencimiento</TableHead>
                        <TableHead className="font-bold text-cyan-900">Estado</TableHead>
                        <TableHead className="font-bold text-cyan-900">Detalles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocumentos.map((documento) => (
                        <TableRow key={documento.id} className="hover:bg-cyan-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{documento.tipo}</TableCell>
                          <TableCell className="font-mono text-gray-700">{documento.numero}</TableCell>
                          <TableCell className="font-mono font-semibold text-gray-900">{documento.placa_v}</TableCell>
                          <TableCell className="text-gray-800 font-medium">
                            {documento.entidad || documento.aseguradora || "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-700">{documento.fecha_emision}</TableCell>
                          <TableCell className="text-gray-700">{documento.fecha_vencimiento}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`${getBadgeVariant(documento.estado)} border px-3 py-1 rounded-full font-semibold`}>
                              {documento.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {documento.detalles || 'Sin detalles'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DocumentosPage;
