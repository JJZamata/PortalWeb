
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileX, Calendar, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActasNoConformesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const actasNoConformes = [
    {
      id: "ACT-2024-004",
      placa: "VAW-454",
      conductor: "Edwin Alfredo Chambi Basurco",
      dni_conductor: "29570834",
      id_fiscalizador: "FISC-003",
      fecha_hora: "18/06/2024 16:44:30",
      ubicacion: "Av. Ejercito, La Joya - Arequipa",
      tipo_acta: "Control de Infracciones",
      observaciones: "Prestaba servicio sin autorización vigente",
      infracciones: [
        {
          codigo: "M-05",
          descripcion: "Prestar servicio de transporte sin contar con la autorización correspondiente",
          gravedad: "Muy Grave",
          sancion: "S/ 5,150.00",
          medida_administrativa: "Retención de licencia e internamiento del vehículo"
        }
      ],
      estado: "Pendiente"
    },
    {
      id: "ACT-2024-005",
      placa: "XYZ-789",
      conductor: "Carlos Alberto Vidal Luna",
      dni_conductor: "56789012",
      id_fiscalizador: "FISC-002",
      fecha_hora: "17/06/2024 12:30:45",
      ubicacion: "Terminal Terrestre, La Joya - Arequipa",
      tipo_acta: "Control Vehicular",
      observaciones: "Exceso de pasajeros detectado durante control",
      infracciones: [
        {
          codigo: "G-12",
          descripcion: "Conducir vehículo con exceso de pasajeros",
          gravedad: "Grave",
          sancion: "S/ 344.00",
          medida_administrativa: "Retención temporal del vehículo"
        }
      ],
      estado: "En proceso"
    },
    {
      id: "ACT-2024-006",
      placa: "GHI-012", 
      conductor: "Laura Sofia Quispe Flores",
      dni_conductor: "67890123",
      id_fiscalizador: "FISC-001",
      fecha_hora: "16/06/2024 08:15:20",
      ubicacion: "Paradero San Juan, La Joya - Arequipa",
      tipo_acta: "Control de Ruta",
      observaciones: "Circulando fuera de ruta autorizada establecida",
      infracciones: [
        {
          codigo: "G-08",
          descripcion: "Circular fuera de la ruta autorizada",
          gravedad: "Grave",
          sancion: "S/ 344.00",
          medida_administrativa: "Multa"
        }
      ],
      estado: "Resuelto"
    },
    {
      id: "ACT-2024-007",
      placa: "JKL-345",
      conductor: "Pedro Martinez Lopez",
      dni_conductor: "78901234",
      id_fiscalizador: "FISC-003",
      fecha_hora: "15/06/2024 14:20:15",
      ubicacion: "Puente Bolognesi, La Joya - Arequipa",
      tipo_acta: "Control Documentario",
      observaciones: "No presenta SOAT vigente al momento del control",
      infracciones: [
        {
          codigo: "M-02",
          descripcion: "No portar el Seguro Obligatorio de Accidentes de Tránsito vigente",
          gravedad: "Muy Grave",
          sancion: "S/ 516.00",
          medida_administrativa: "Retención del vehículo"
        }
      ],
      estado: "Pendiente"
    },
    {
      id: "ACT-2024-008",
      placa: "MNO-678",
      conductor: "Carmen Rosa Quispe Mamani",
      dni_conductor: "89012345",
      id_fiscalizador: "FISC-002", 
      fecha_hora: "14/06/2024 11:45:30",
      ubicacion: "Av. Principal, La Joya - Arequipa",
      tipo_acta: "Control Técnico",
      observaciones: "Placa de rodaje en mal estado de conservación",
      infracciones: [
        {
          codigo: "L-08",
          descripcion: "Circular con placa de rodaje deteriorada o en mal estado",
          gravedad: "Leve",
          sancion: "S/ 92.00",
          medida_administrativa: "Multa"
        }
      ],
      estado: "Resuelto"
    }
  ];

  const filteredActas = actasNoConformes.filter(acta =>
    acta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.dni_conductor.includes(searchTerm) ||
    acta.id_fiscalizador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.infracciones.some(inf => inf.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'Muy Grave':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Grave':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Leve':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'En proceso':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header profesional */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-gray-50 p-8 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Actas No Conformes</h1>
              <p className="text-gray-600 text-lg">Registro de actas de control con infracciones detectadas</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] px-6 py-2.5 rounded-lg font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                Filtrar por fecha
              </Button>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-red-200/60 shadow-[0_4px_16px_-4px_rgba(239,68,68,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(239,68,68,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Total No Conformes</p>
                  <p className="text-3xl font-bold text-red-800 mt-1">{actasNoConformes.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(239,68,68,0.4)]">
                  <FileX className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 via-white to-orange-50/50 border border-orange-200/60 shadow-[0_4px_16px_-4px_rgba(251,146,60,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(251,146,60,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-800 mt-1">
                    {actasNoConformes.filter(a => a.estado === 'Pendiente').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(251,146,60,0.4)]">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 via-white to-yellow-50/50 border border-yellow-200/60 shadow-[0_4px_16px_-4px_rgba(251,191,36,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(251,191,36,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">En Proceso</p>
                  <p className="text-3xl font-bold text-yellow-800 mt-1">
                    {actasNoConformes.filter(a => a.estado === 'En proceso').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(251,191,36,0.4)]">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200/60 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(16,185,129,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Resueltos</p>
                  <p className="text-3xl font-bold text-emerald-800 mt-1">
                    {actasNoConformes.filter(a => a.estado === 'Resuelto').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]">
                  <FileX className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla principal */}
        <Card className="bg-white border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200/80 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Registro de Actas No Conformes</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {filteredActas.length} actas con infracciones registradas
                </CardDescription>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por ID acta, placa, conductor, DNI, fiscalizador o infracción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-300 focus:border-gray-400 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] rounded-lg bg-white text-base"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/80">
                  <TableRow className="border-b border-gray-200/80">
                    <TableHead className="font-semibold text-gray-800 py-4 px-6">ID Acta</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Placa</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Conductor</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">DNI</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Fecha/Hora</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Infracción Principal</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Gravedad</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Sanción</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Estado</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActas.map((acta) => (
                    <TableRow key={acta.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100/80">
                      <TableCell className="font-mono font-semibold text-red-700 py-4 px-6">
                        {acta.id}
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-gray-900 py-4">{acta.placa}</TableCell>
                      <TableCell className="text-gray-800 font-medium py-4">{acta.conductor}</TableCell>
                      <TableCell className="font-mono text-gray-700 py-4">{acta.dni_conductor}</TableCell>
                      <TableCell className="py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{acta.fecha_hora.split(' ')[0]}</div>
                          <div className="text-sm text-gray-500 font-medium">{acta.fecha_hora.split(' ')[1]}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs py-4">
                        <div className="truncate text-gray-700" title={acta.infracciones[0]?.descripcion}>
                          {acta.infracciones[0]?.codigo}: {acta.infracciones[0]?.descripcion}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className={`${getGravedadColor(acta.infracciones[0]?.gravedad)} border px-3 py-1 rounded-full font-semibold`}>
                          {acta.infracciones[0]?.gravedad}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-700 py-4">{acta.infracciones[0]?.sancion}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className={`${getEstadoColor(acta.estado)} border px-3 py-1 rounded-full font-semibold`}>
                          {acta.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-700 rounded-lg border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]">
                            <FileX className="w-4 h-4" />
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

export default ActasNoConformesPage;
