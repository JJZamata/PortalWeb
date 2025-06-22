
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileCheck, Calendar, User } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActasConformesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const actasConformes = [
    {
      id: "ACT-2024-001",
      placa: "ABC-123",
      conductor: "Luis Alberto Gomez Perez",
      dni_conductor: "52345873",
      id_fiscalizador: "FISC-001",
      fecha_hora: "18/06/2024 10:30:15",
      ubicacion: "Av. La Marina, La Joya - Arequipa",
      tipo_acta: "Control Rutinario",
      observaciones: "Documentación completa y vigente. Vehículo en óptimas condiciones."
    },
    {
      id: "ACT-2024-002",
      placa: "DEF-456", 
      conductor: "Maria Fernanda Rojas Silva",
      dni_conductor: "45678901",
      id_fiscalizador: "FISC-002",
      fecha_hora: "17/06/2024 14:15:30",
      ubicacion: "Plaza de Armas, La Joya - Arequipa",
      tipo_acta: "Control de Documentos",
      observaciones: "Subsanación correcta de documentos presentados anteriormente."
    },
    {
      id: "ACT-2024-003",
      placa: "GHI-789",
      conductor: "Ana Lucia Torres Mendez", 
      dni_conductor: "87654321",
      id_fiscalizador: "FISC-001",
      fecha_hora: "16/06/2024 09:45:20",
      ubicacion: "Mercado Central, La Joya - Arequipa",
      tipo_acta: "Control de Ruta",
      observaciones: "Circulando dentro de ruta autorizada. Todo conforme."
    }
  ];

  const filteredActas = actasConformes.filter(acta =>
    acta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acta.dni_conductor.includes(searchTerm) ||
    acta.id_fiscalizador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header profesional */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-gray-50 p-8 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Actas Conformes</h1>
              <p className="text-gray-600 text-lg">Registro de actas de control con resultado conforme</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-emerald-200/60 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(16,185,129,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Total Conformes</p>
                  <p className="text-3xl font-bold text-emerald-800 mt-1">{actasConformes.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-blue-200/60 shadow-[0_4px_16px_-4px_rgba(59,130,246,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(59,130,246,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Este Mes</p>
                  <p className="text-3xl font-bold text-blue-800 mt-1">3</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(59,130,246,0.4)]">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-violet-50 via-white to-violet-50/50 border border-violet-200/60 shadow-[0_4px_16px_-4px_rgba(139,92,246,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(139,92,246,0.3)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-violet-700 uppercase tracking-wide">Promedio Diario</p>
                  <p className="text-3xl font-bold text-violet-800 mt-1">1.2</p>
                </div>
                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(139,92,246,0.4)]">
                  <FileCheck className="w-6 h-6 text-white" />
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
                <CardTitle className="text-xl font-bold text-gray-900">Registro de Actas Conformes</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {filteredActas.length} actas conformes registradas
                </CardDescription>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por ID acta, placa, conductor, DNI o fiscalizador..."
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
                    <TableHead className="font-semibold text-gray-800 py-4">Fiscalizador</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Ubicación</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Tipo</TableHead>
                    <TableHead className="font-semibold text-gray-800 py-4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActas.map((acta) => (
                    <TableRow key={acta.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100/80">
                      <TableCell className="font-mono font-semibold text-emerald-700 py-4 px-6">
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
                      <TableCell className="font-mono text-gray-700 py-4">{acta.id_fiscalizador}</TableCell>
                      <TableCell className="max-w-xs truncate text-gray-700 py-4" title={acta.ubicacion}>{acta.ubicacion}</TableCell>
                      <TableCell className="text-gray-700 py-4">{acta.tipo_acta}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]">
                            <FileCheck className="w-4 h-4" />
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

export default ActasConformesPage;
