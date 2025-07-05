import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Search, Plus, Upload, Calendar, FileText, RefreshCw, XCircle, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";

const DocumentosPage = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const { toast } = useToast();
  const [paginacion, setPaginacion] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    records_per_page: 6,
    has_next: false,
    has_previous: false
  });
  const [tipoFiltro, setTipoFiltro] = useState('ALL');
  const [isSearching, setIsSearching] = useState(false);
  const [nuevoDocumento, setNuevoDocumento] = useState({
    tipo: '',
    numero: '',
    placa: '',
    entidad_empresa: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    observaciones: '',
    archivo: null as File | null,
    inspection_result: '',
    certifying_company: '',
    cobertura: '',
    numero_poliza: '',
  });
  const [registrando, setRegistrando] = useState(false);

  const fetchDocumentos = async (page = 1, tipo = tipoFiltro, query = searchTerm) => {
    try {
      setLoading(true);
      let response;
      const token = localStorage.getItem('token');
      if (query && query.trim().length >= 2) {
        if (tipo && tipo !== 'ALL') {
          response = await axiosInstance.get(`/documents/type/${tipo.toLowerCase()}?page=${page}`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
        } else {
          response = await axiosInstance.get(`/documents?page=${page}`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
        }
        const documentsData = response.data?.data?.documents || [];
        const paginationData = response.data?.data?.pagination || {};
        const filtered = documentsData.filter(doc =>
          (doc.placa || '').toLowerCase().includes(query.toLowerCase()) ||
          (doc.numero || '').toLowerCase().includes(query.toLowerCase()) ||
          (doc.tipo || '').toLowerCase().includes(query.toLowerCase())
        );
        setDocumentos(filtered);
        setPaginacion(paginationData);
        setLoading(false);
        return;
      } else if (tipo && tipo !== 'ALL') {
        response = await axiosInstance.get(`/documents/type/${tipo.toLowerCase()}?page=${page}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      } else {
        response = await axiosInstance.get(`/documents?page=${page}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      }
      const documentsData = response.data?.data?.documents || [];
      const paginationData = response.data?.data?.pagination || {};
      setDocumentos(documentsData);
      setPaginacion(paginationData);
      setLoading(false);
    } catch (error) {
      console.error('Error completo:', error);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || "Error al cargar los documentos"
        : "Error al cargar los documentos");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length === 0 || searchTerm.length >= 2) {
      fetchDocumentos(1, tipoFiltro, searchTerm);
    }
  }, [tipoFiltro, searchTerm]);

  const handleNextPage = () => {
    if (paginacion.has_next) {
      fetchDocumentos(paginacion.current_page + 1, tipoFiltro, searchTerm);
    }
  };

  const handlePrevPage = () => {
    if (paginacion.has_previous) {
      fetchDocumentos(paginacion.current_page - 1, tipoFiltro, searchTerm);
    }
  };

  const getBadgeVariant = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'vigente': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'por vencer': 
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'vencido': 
        return 'bg-red-50 text-red-700 border-red-200';
      default: 
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAddDocumento = () => {
    toast({
      title: "Documento registrado",
      description: "El documento ha sido agregado exitosamente",
    });
    setShowAddDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNuevoDocumento(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNuevoDocumento(prev => ({ ...prev, tipo: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNuevoDocumento(prev => ({ ...prev, archivo: e.target.files![0] }));
    }
  };

  const registrarDocumento = async () => {
    setRegistrando(true);
    try {
      const token = localStorage.getItem('token');
      if (nuevoDocumento.tipo === 'REVISION') {
        const payload = {
          vehicle_plate: nuevoDocumento.placa,
          issue_date: nuevoDocumento.fecha_emision,
          expiration_date: nuevoDocumento.fecha_vencimiento,
          inspection_result: nuevoDocumento.inspection_result,
          certifying_company: nuevoDocumento.certifying_company,
        };
        await axiosInstance.post('/documents/technical-review', payload, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      } else {
        const formData = new FormData();
        formData.append('tipo', nuevoDocumento.tipo);
        formData.append('numero', nuevoDocumento.numero);
        formData.append('placa', nuevoDocumento.placa);
        formData.append('entidad_empresa', nuevoDocumento.entidad_empresa);
        formData.append('fecha_emision', nuevoDocumento.fecha_emision);
        formData.append('fecha_vencimiento', nuevoDocumento.fecha_vencimiento);
        formData.append('observaciones', nuevoDocumento.observaciones);
        if (nuevoDocumento.archivo) {
          formData.append('archivo', nuevoDocumento.archivo);
        }
        if (nuevoDocumento.tipo === 'AFOCAT') {
          formData.append('cobertura', nuevoDocumento.cobertura || '');
          formData.append('numero_poliza', nuevoDocumento.numero_poliza || '');
        }
        await axiosInstance.post('/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      }
      toast({
        title: 'Documento registrado',
        description: 'El documento ha sido agregado exitosamente',
      });
      setShowAddDialog(false);
      setNuevoDocumento({
        tipo: '', numero: '', placa: '', entidad_empresa: '', fecha_emision: '', fecha_vencimiento: '', observaciones: '', archivo: null,
        inspection_result: '', certifying_company: '', cobertura: '', numero_poliza: '',
      });
      fetchDocumentos(1, tipoFiltro, searchTerm);
    } catch (error) {
      toast({
        title: 'Error al registrar',
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || 'Error al registrar el documento'
          : 'Error al registrar el documento',
        variant: 'destructive',
      });
    } finally {
      setRegistrando(false);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los documentos</p>
          <Button onClick={() => fetchDocumentos(1)} variant="outline">
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
                  {loading ? '-' : paginacion.total_records}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <Button 
                onClick={() => fetchDocumentos(1)} 
                variant="outline" 
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Documentos Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-cyan-600" />}
                </CardTitle>
                <CardDescription>
                  Total: {documentos.length} documentos
                  {loading && ' (Cargando...)'}
                </CardDescription>
              </div>
              <div className="flex gap-3 items-center">
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
                          <Select value={nuevoDocumento.tipo} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="REVISION">Revisión</SelectItem>
                              <SelectItem value="AFOCAT">Afocat</SelectItem>
                              {/* Agrega más tipos si es necesario */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="numero">Número de Documento *</Label>
                          <Input id="numero" value={nuevoDocumento.numero} onChange={handleInputChange} placeholder="Ej: CITV-2024-001234" />
                        </div>
                      </div>
                      {/* Campos condicionales según el tipo de documento */}
                      {nuevoDocumento.tipo === 'REVISION' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="inspection_result">Resultado Inspección *</Label>
                            <Input id="inspection_result" value={nuevoDocumento.inspection_result || ''} onChange={handleInputChange} placeholder="APROBADO / DESAPROBADO" />
                          </div>
                          <div>
                            <Label htmlFor="certifying_company">Empresa Certificadora *</Label>
                            <Input id="certifying_company" value={nuevoDocumento.certifying_company || ''} onChange={handleInputChange} placeholder="Ej: TECSUP S.A." />
                          </div>
                        </div>
                      )}
                      {nuevoDocumento.tipo === 'AFOCAT' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cobertura">Cobertura *</Label>
                            <Input id="cobertura" value={nuevoDocumento.cobertura || ''} onChange={handleInputChange} placeholder="Ej: Nacional" />
                          </div>
                          <div>
                            <Label htmlFor="numero_poliza">N° de Póliza *</Label>
                            <Input id="numero_poliza" value={nuevoDocumento.numero_poliza || ''} onChange={handleInputChange} placeholder="Ej: POL-123456" />
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="placa">Placa del Vehículo *</Label>
                          <Input id="placa" value={nuevoDocumento.placa} onChange={handleInputChange} placeholder="Ej: VAW-454" />
                        </div>
                        <div>
                          <Label htmlFor="empresa">Empresa/Entidad Emisora *</Label>
                          <Input id="entidad_empresa" value={nuevoDocumento.entidad_empresa} onChange={handleInputChange} placeholder="Ej: Municipalidad La Joya" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fechaEmision">Fecha de Emisión *</Label>
                          <Input id="fecha_emision" type="date" value={nuevoDocumento.fecha_emision} onChange={handleInputChange} />
                        </div>
                        <div>
                          <Label htmlFor="fechaVencimiento">Fecha de Vencimiento *</Label>
                          <Input id="fecha_vencimiento" type="date" value={nuevoDocumento.fecha_vencimiento} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea 
                          id="observaciones" 
                          value={nuevoDocumento.observaciones}
                          onChange={handleInputChange}
                          placeholder="Observaciones adicionales sobre el documento"
                          rows={3}
                        />
                      </div>
                      {nuevoDocumento.tipo !== 'REVISION' && (
                        <div>
                          <Label>Archivo del Documento</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="archivo" />
                            <label htmlFor="archivo" className="text-blue-600 underline cursor-pointer">{nuevoDocumento.archivo ? nuevoDocumento.archivo.name : 'Selecciona un archivo'}</label>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG hasta 10MB</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button onClick={registrarDocumento} className="flex-1" disabled={registrando}>
                          {registrando ? 'Registrando...' : 'Registrar Documento'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, número de documento o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-cyan-500 rounded-xl bg-white text-base"
                />
              </div>
              <div className="flex gap-2 min-w-[200px]">
                <Select
                  value={tipoFiltro}
                  onValueChange={value => setTipoFiltro(value)}
                >
                  <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-cyan-500">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="REVISION">Revisión</SelectItem>
                    <SelectItem value="AFOCAT">Afocat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-600" />
                  <span className="ml-2 text-gray-600">Cargando documentos...</span>
                </div>
              ) : documentos.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <span className="text-gray-600">No hay documentos disponibles</span>
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
                      {documentos.map((documento, index) => (
                        <TableRow key={index} className="hover:bg-cyan-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{documento.tipo}</TableCell>
                          <TableCell className="font-mono text-gray-700">{documento.numero}</TableCell>
                          <TableCell className="font-mono font-semibold text-gray-900">{documento.placa}</TableCell>
                          <TableCell className="text-gray-800 font-medium">
                            {documento.entidad_empresa}
                          </TableCell>
                          <TableCell className="text-gray-700">{documento.fecha_emision}</TableCell>
                          <TableCell className="text-gray-700">{documento.fecha_vencimiento}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`${getBadgeVariant(documento.estado)} border px-3 py-1 rounded-full font-semibold`}>
                              {documento.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {documento.detalles ? (
                              documento.tipo === 'REVISION' 
                                ? `Resultado: ${documento.detalles.inspection_result}`
                                : `Cobertura: ${documento.detalles.cobertura}`
                            ) : 'Sin detalles'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Controles de paginación */}
            {!loading && documentos.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Mostrando página {paginacion.current_page} de {paginacion.total_pages} ({paginacion.total_records} documentos en total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!paginacion.has_previous}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!paginacion.has_next}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DocumentosPage;
