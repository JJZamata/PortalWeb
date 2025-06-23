import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
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
import { Building2, Search, Plus, Edit, Eye, FileText, Calendar, MapPin, Filter, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const EmpresasPage = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginacion, setPaginacion] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchEmpresas = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/companies?page=${page}`);

      const companiesData = response.data?.data?.companies || [];
      const paginationData = response.data?.data?.pagination || {};

      const empresasTransformadas = companiesData.map(company => ({
        ruc: company.ruc || '',
        nombre: company.name || '',
        direccion: company.address || 'Dirección no disponible',
        nro_resolucion: "RES-2024-001",
        fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
        fecha_vencimiento: company.expirationDate || '',
        entidad_emisora: "Municipalidad Distrital La Joya",
        estado: company.rucStatus || 'Sin Estado',
        vehiculos_asociados: company.vehicleCount || 0
      }));

      setEmpresas(empresasTransformadas);
      setPaginacion(paginationData);
      setLoading(false);
    } catch (error) {
      console.error('Error completo:', error);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || "Error al cargar las empresas"
        : "Error al cargar las empresas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas(1);
  }, []);

  const handleNextPage = () => {
    if (paginacion.hasNextPage) {
      fetchEmpresas(paginacion.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginacion.hasPrevPage) {
      fetchEmpresas(paginacion.currentPage - 1);
    }
  };

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

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.ruc.includes(searchTerm) ||
    empresa.nro_resolucion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-2xl shadow-lg border border-purple-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-2">
                Gestión de Empresas
              </h1>
              <p className="text-gray-600 text-lg">Administración de empresas de transporte registradas</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700">{empresas.length}</p>
                <p className="text-sm text-gray-600">Total Empresas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">{empresas.filter(e => e.estado === 'Vigente').length}</p>
                <p className="text-sm text-gray-600">Vigentes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Empresas Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
                </CardTitle>
                <CardDescription>Gestión completa de empresas de transporte</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Empresa
                </Button>
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Buscador */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, RUC o resolución..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                  <TableRow>
                    <TableHead className="font-bold text-purple-900">RUC</TableHead>
                    <TableHead className="font-bold text-purple-900">Empresa</TableHead>
                    <TableHead className="font-bold text-purple-900">Resolución</TableHead>
                    <TableHead className="font-bold text-purple-900">Vencimiento</TableHead>
                    <TableHead className="font-bold text-purple-900">Estado</TableHead>
                    <TableHead className="font-bold text-purple-900">Vehículos</TableHead>
                    <TableHead className="font-bold text-purple-900 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                          <span className="ml-2 text-gray-600">Cargando empresas...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32">
                        <div className="flex flex-col items-center justify-center text-red-600">
                          <p>Error al cargar los datos</p>
                          <Button 
                            variant="outline" 
                            onClick={() => fetchEmpresas(paginacion.currentPage)}
                            className="mt-2"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmpresas.map((empresa) => (
                      <TableRow key={empresa.ruc} className="hover:bg-purple-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-purple-800">{empresa.ruc}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">{empresa.nombre}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {empresa.direccion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{empresa.nro_resolucion}</p>
                            <p className="text-sm text-gray-500">{empresa.entidad_emisora}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{empresa.fecha_vencimiento}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getEstadoBadge(empresa.estado)} font-semibold rounded-full border`}>
                            {empresa.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="font-bold text-lg text-purple-700">{empresa.vehiculos_asociados}</span>
                            <p className="text-xs text-gray-500">vehículos</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Detalles de Empresa
                                  </DialogTitle>
                                  <DialogDescription>
                                    Información completa de {empresa.nombre}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">RUC</label>
                                    <p className="font-mono font-bold text-lg">{empresa.ruc}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Estado</label>
                                    <div className="mt-1">
                                      <Badge variant="secondary" className={`${getEstadoBadge(empresa.estado)} font-semibold rounded-full border`}>
                                        {empresa.estado}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Razón Social</label>
                                    <p className="font-semibold">{empresa.nombre}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Dirección</label>
                                    <p>{empresa.direccion}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Resolución</label>
                                    <p className="font-medium">{empresa.nro_resolucion}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Vehículos Asociados</label>
                                    <p className="font-bold text-lg text-purple-700">{empresa.vehiculos_asociados}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha Emisión</label>
                                    <p>{empresa.fecha_emision}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                                    <p>{empresa.fecha_vencimiento}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Entidad Emisora</label>
                                    <p>{empresa.entidad_emisora}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Mostrando página {paginacion.currentPage} de {paginacion.totalPages} ({paginacion.totalCompanies} empresas en total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!paginacion.hasPrevPage || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!paginacion.hasNextPage || loading}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EmpresasPage;
