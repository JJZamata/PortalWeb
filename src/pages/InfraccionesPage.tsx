
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
import { AlertTriangle, Search, Plus, Edit, Eye, FileText, Calendar, DollarSign, Filter } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const InfraccionesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para infracciones
  const infracciones = [
    {
      id: "INF-001",
      id_acta: "ACT-002",
      codigo: "F001",
      descripcion: "Conducir vehículo sin Certificado de Inspección Técnica Vehicular (CITV) vigente",
      gravedad: "GRAVE",
      sancion: "0.5 UIT",
      medida_administrativa: "Retención de vehículo hasta subsanar",
      placa: "XYZ-789",
      conductor: "Maria Elena Quispe Torres",
      fecha_infraccion: "2024-12-28",
      fiscalizador: "FISC-002",
      estado: "Pendiente"
    },
    {
      id: "INF-002",
      id_acta: "ACT-004",
      codigo: "F002",
      descripcion: "Circular sin seguro obligatorio de accidentes de tránsito (AFOCAT) vigente",
      gravedad: "GRAVE",
      sancion: "0.3 UIT",
      medida_administrativa: "Multa y retención de licencia",
      placa: "DEF-456",
      conductor: "Pedro Alfonso Silva Diaz",
      fecha_infraccion: "2024-12-27",
      fiscalizador: "FISC-003",
      estado: "En Proceso"
    },
    {
      id: "INF-003",
      id_acta: "ACT-005",
      codigo: "F003",
      descripcion: "Portar documentos personales (licencia de conducir) vencidos",
      gravedad: "LEVE",
      sancion: "0.1 UIT",
      medida_administrativa: "Amonestación escrita",
      placa: "GHI-012",
      conductor: "Carlos Alberto Mendoza",
      fecha_infraccion: "2024-12-26",
      fiscalizador: "FISC-001",
      estado: "Resuelto"
    },
    {
      id: "INF-004",
      id_acta: "ACT-006",
      codigo: "F004",
      descripcion: "No portar Tarjeta Única de Circulación (TUC) vigente",
      gravedad: "GRAVE",
      sancion: "0.4 UIT",
      medida_administrativa: "Retención de vehículo",
      placa: "JKL-345",
      conductor: "Ana Sofia Rodriguez Vega",
      fecha_infraccion: "2024-12-25",
      fiscalizador: "FISC-004",
      estado: "Pendiente"
    },
    {
      id: "INF-005",
      id_acta: "ACT-007",
      codigo: "F005",
      descripcion: "Vehículo sin habilitación municipal vigente para servicio de transporte",
      gravedad: "MUY_GRAVE",
      sancion: "1.0 UIT",
      medida_administrativa: "Internamiento de vehículo",
      placa: "MNO-678",
      conductor: "Luis Fernando Torres Mamani",
      fecha_infraccion: "2024-12-24",
      fiscalizador: "FISC-002",
      estado: "En Proceso"
    }
  ];

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

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'En Proceso':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredInfracciones = infracciones.filter(inf =>
    inf.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.conductor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-red-50/30 p-8 rounded-2xl shadow-lg border border-red-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent mb-2">
                Gestión de Infracciones
              </h1>
              <p className="text-gray-600 text-lg">Registro y seguimiento de infracciones de tránsito</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-700">{infracciones.filter(i => i.gravedad === 'LEVE').length}</p>
                <p className="text-sm text-gray-600">Leves</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-700">{infracciones.filter(i => i.gravedad === 'GRAVE').length}</p>
                <p className="text-sm text-gray-600">Graves</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">{infracciones.filter(i => i.gravedad === 'MUY_GRAVE').length}</p>
                <p className="text-sm text-gray-600">Muy Graves</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Infracciones Registradas</CardTitle>
                <CardDescription>Control y seguimiento de infracciones de tránsito</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Infracción
                </Button>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
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
                placeholder="Buscar por placa, código, conductor o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/50">
                  <TableRow>
                    <TableHead className="font-bold text-red-900">Código</TableHead>
                    <TableHead className="font-bold text-red-900">Vehículo/Conductor</TableHead>
                    <TableHead className="font-bold text-red-900">Descripción</TableHead>
                    <TableHead className="font-bold text-red-900">Gravedad</TableHead>
                    <TableHead className="font-bold text-red-900">Sanción</TableHead>
                    <TableHead className="font-bold text-red-900">Estado</TableHead>
                    <TableHead className="font-bold text-red-900 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInfracciones.map((infraccion) => (
                    <TableRow key={infraccion.id} className="hover:bg-red-50/50 transition-colors">
                      <TableCell className="font-mono font-bold text-red-800">{infraccion.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono font-bold text-gray-900">{infraccion.placa}</p>
                          <p className="text-sm text-gray-600">{infraccion.conductor}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{infraccion.descripcion}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getGravedadBadge(infraccion.gravedad)} font-semibold rounded-full border`}>
                          {infraccion.gravedad.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-700">{infraccion.sancion}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getEstadoBadge(infraccion.estado)} font-semibold rounded-full border`}>
                          {infraccion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5" />
                                  Infracción {infraccion.codigo} - {infraccion.placa}
                                </DialogTitle>
                                <DialogDescription>
                                  Detalles completos de la infracción registrada
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Código Infracción</label>
                                  <p className="font-mono font-bold text-lg text-red-700">{infraccion.codigo}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Estado</label>
                                  <div className="mt-1">
                                    <Badge variant="secondary" className={`${getEstadoBadge(infraccion.estado)} font-semibold rounded-full border`}>
                                      {infraccion.estado}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Placa Vehículo</label>
                                  <p className="font-mono font-bold text-lg">{infraccion.placa}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Conductor</label>
                                  <p className="font-medium">{infraccion.conductor}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                                  <p className="bg-gray-50 p-3 rounded-lg text-sm">{infraccion.descripcion}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Gravedad</label>
                                  <div className="mt-1">
                                    <Badge variant="secondary" className={`${getGravedadBadge(infraccion.gravedad)} font-semibold rounded-full border`}>
                                      {infraccion.gravedad.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Sanción</label>
                                  <p className="font-bold text-lg text-green-700">{infraccion.sancion}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Fecha Infracción</label>
                                  <p>{infraccion.fecha_infraccion}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Fiscalizador</label>
                                  <p className="font-medium">{infraccion.fiscalizador}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Acta Asociada</label>
                                  <p className="font-mono font-medium text-blue-700">{infraccion.id_acta}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-700">Medida Administrativa</label>
                                  <p className="bg-amber-50 p-3 rounded-lg text-sm border border-amber-200">{infraccion.medida_administrativa}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
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

export default InfraccionesPage;
