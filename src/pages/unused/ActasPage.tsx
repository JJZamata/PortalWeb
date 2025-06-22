
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Eye, Download, Filter, Plus, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const ActasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [selectedActa, setSelectedActa] = useState<any>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const actas = [
    {
      id: "AC001",
      fecha: "18/06/2024 16:44:43",
      placa: "VAW454",
      conductor: "Edwin Alfredo Chambi Basurco",
      licencia: "29570834",
      infractor: "Solórzano Mamán Susy Mónica",
      dni: "29703081",
      infraccion: "Prestaba servicio sin autorización",
      gravedad: "Muy Grave",
      multa: "S/ 5,150",
      inspector: "SU053221",
      estado: "No Conforme",
      lugar: "Arequipa, La Joya, Km 959-213"
    },
    {
      id: "AC002",
      fecha: "18/06/2024 14:30:15",
      placa: "MTC123",
      conductor: "María González López",
      licencia: "28765432",
      infractor: "María González López",
      dni: "28765432",
      infraccion: "Documentos en orden",
      gravedad: "Ninguna",
      multa: "S/ 0",
      inspector: "SU053222",
      estado: "Conforme",
      lugar: "Arequipa, La Joya, Km 960-100"
    }
  ];

  const infracciones = {
    "Muy Grave (M)": { rango: "M1-M28", multa: "≥ S/ 516", accion: "Multa + Retención/Internamiento" },
    "Grave (G)": { rango: "G1-G69", multa: "≥ S/ 344", accion: "Multa + Posible retención" },
    "Leve (L)": { rango: "L1-L21", multa: "≥ S/ 92", accion: "Multa" }
  };

  const filteredActas = actas.filter(acta => {
    const matchesSearch = acta.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acta.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acta.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || acta.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const totalActas = actas.length;
  const conformes = actas.filter(a => a.estado === 'Conforme').length;
  const noConformes = actas.filter(a => a.estado === 'No Conforme').length;

  const handleRefetch = () => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header moderno */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Gestión de Actas
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Administra las actas de control conformes y no conformes</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="text-center bg-white/60 p-3 rounded-xl border border-blue-100">
                  <p className="text-xl font-bold text-blue-700">{totalActas}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xl font-bold text-emerald-700">{conformes}</p>
                  <p className="text-xs text-gray-600">Conformes</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-red-100">
                  <p className="text-xl font-bold text-red-700">{noConformes}</p>
                  <p className="text-xs text-gray-600">No Conformes</p>
                </div>
              </div>
              <Button 
                onClick={handleRefetch} 
                variant="outline" 
                disabled={isRefetching}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Clasificación de Infracciones */}
        <Card className="bg-white border border-gray-200/80 shadow-lg rounded-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200/80 p-6">
            <CardTitle className="text-xl font-bold text-gray-900">Clasificación de Infracciones (RNT)</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Rangos y sanciones según el Reglamento Nacional de Tránsito
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(infracciones).map(([gravedad, info]) => (
                <div key={gravedad} className="p-6 border border-gray-200/80 rounded-xl bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{gravedad}</h4>
                  <p className="text-sm text-gray-600 mb-3 font-medium">Códigos: {info.rango}</p>
                  <p className="text-sm font-semibold text-gray-800 mb-2">Multa: {info.multa}</p>
                  <p className="text-xs text-gray-600 font-medium">{info.accion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Actas */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Actas Registradas
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>{filteredActas.length} actas encontradas</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Acta
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por placa, conductor o ID de acta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="No Conforme">No Conforme</SelectItem>
                </SelectContent>
              </Select>
              <div></div>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                  <TableRow>
                    <TableHead className="font-bold text-blue-900">ID Acta</TableHead>
                    <TableHead className="font-bold text-blue-900">Fecha/Hora</TableHead>
                    <TableHead className="font-bold text-blue-900">Placa</TableHead>
                    <TableHead className="font-bold text-blue-900">Conductor</TableHead>
                    <TableHead className="font-bold text-blue-900">Estado</TableHead>
                    <TableHead className="font-bold text-blue-900">Gravedad</TableHead>
                    <TableHead className="font-bold text-blue-900">Inspector</TableHead>
                    <TableHead className="font-bold text-blue-900 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActas.map((acta) => (
                    <TableRow key={acta.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-mono font-semibold text-blue-800">{acta.id}</TableCell>
                      <TableCell className="text-gray-700 font-medium">{acta.fecha}</TableCell>
                      <TableCell className="font-mono font-semibold text-gray-900">{acta.placa}</TableCell>
                      <TableCell className="text-gray-800 font-medium">{acta.conductor}</TableCell>
                      <TableCell>
                        <Badge variant={acta.estado === 'Conforme' ? 'default' : 'destructive'} 
                               className={`px-3 py-1 rounded-full font-semibold border ${
                                 acta.estado === 'Conforme' 
                                   ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                   : 'bg-red-100 text-red-800 border-red-200'
                               }`}>
                          {acta.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {acta.gravedad !== 'Ninguna' && (
                          <Badge variant="outline" className="border-gray-300 text-gray-700 px-3 py-1 rounded-full font-semibold">
                            {acta.gravedad}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-gray-700">{acta.inspector}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedActa(acta)} 
                                      className="hover:bg-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl shadow-xl border border-gray-200 rounded-xl">
                              <DialogHeader>
                                <DialogTitle>Detalle del Acta {selectedActa?.id}</DialogTitle>
                                <DialogDescription>
                                  Información completa del acta de control
                                </DialogDescription>
                              </DialogHeader>
                              {selectedActa && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Fecha y Hora</label>
                                      <p className="text-sm text-gray-600">{selectedActa.fecha}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Lugar</label>
                                      <p className="text-sm text-gray-600">{selectedActa.lugar}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Placa</label>
                                      <p className="text-sm text-gray-600">{selectedActa.placa}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Conductor</label>
                                      <p className="text-sm text-gray-600">{selectedActa.conductor}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">N° Licencia</label>
                                      <p className="text-sm text-gray-600">{selectedActa.licencia}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">DNI Infractor</label>
                                      <p className="text-sm text-gray-600">{selectedActa.dni}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Infracción</label>
                                    <p className="text-sm text-gray-600">{selectedActa.infraccion}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Gravedad</label>
                                      <p className="text-sm text-gray-600">{selectedActa.gravedad}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Multa</label>
                                      <p className="text-sm text-gray-600">{selectedActa.multa}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Inspector</label>
                                    <p className="text-sm text-gray-600">{selectedActa.inspector}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
                            <Download className="w-4 h-4" />
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

export default ActasPage;
