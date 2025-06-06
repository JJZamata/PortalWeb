
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
import { Building2, Search, Plus, Edit, Eye, FileText, Calendar, MapPin, Filter } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const EmpresasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para empresas
  const empresas = [
    {
      ruc: "20123456789",
      nombre: "Transportes La Joya S.A.C.",
      direccion: "Av. Principal 123, La Joya",
      nro_resolucion: "RES-2024-001",
      fecha_emision: "2024-01-15",
      fecha_vencimiento: "2025-01-15",
      entidad_emisora: "Municipalidad Distrital La Joya",
      estado: "Vigente",
      vehiculos_asociados: 45
    },
    {
      ruc: "20123456790",
      nombre: "Mototaxis del Sur E.I.R.L.",
      direccion: "Jr. Los Andes 456, La Joya",
      nro_resolucion: "RES-2024-002",
      fecha_emision: "2024-02-10",
      fecha_vencimiento: "2025-02-10",
      entidad_emisora: "Municipalidad Distrital La Joya",
      estado: "Vigente",
      vehiculos_asociados: 32
    },
    {
      ruc: "20123456791",
      nombre: "Servicios Rapidos Unidos S.A.",
      direccion: "Calle Nueva 789, La Joya",
      nro_resolucion: "RES-2024-003",
      fecha_emision: "2024-03-05",
      fecha_vencimiento: "2025-03-05",
      entidad_emisora: "Municipalidad Distrital La Joya",
      estado: "Por Vencer",
      vehiculos_asociados: 28
    },
    {
      ruc: "20123456792",
      nombre: "Transporte Familiar Express S.R.L.",
      direccion: "Av. Libertad 321, La Joya",
      nro_resolucion: "RES-2023-089",
      fecha_emision: "2023-12-01",
      fecha_vencimiento: "2024-12-01",
      entidad_emisora: "Municipalidad Distrital La Joya",
      estado: "Vencido",
      vehiculos_asociados: 15
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
                <CardTitle className="text-xl font-bold text-gray-900">Empresas Registradas</CardTitle>
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
                  {filteredEmpresas.map((empresa) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EmpresasPage;
