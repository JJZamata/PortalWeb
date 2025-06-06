
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
  Wrench,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useControlesTecnicosData } from "@/hooks/useRealTimeData";

const ControlesTecnicosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Usar datos en tiempo real
  const { data: controlesTecnicosData = [], isLoading, error, refetch, isRefetching } = useControlesTecnicosData();

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case 'CONFORME':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OBSERVADO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NO_CONFORME':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const CheckIcon = ({ checked }: { checked: boolean }) => (
    checked ? (
      <CheckCircle className="w-4 h-4 text-emerald-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    )
  );

  const filteredData = controlesTecnicosData.filter(control => {
    const matchesSearch = 
      control.placa_v?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.id_control?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || control.resultado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalControles = controlesTecnicosData.length;
  const conformes = controlesTecnicosData.filter(c => c.cinturon && c.limpieza && c.neumaticos && c.botiquin && c.extintor && c.luces).length;
  const observados = controlesTecnicosData.filter(c => !(c.cinturon && c.limpieza && c.neumaticos && c.botiquin && c.extintor && c.luces) && (c.cinturon || c.limpieza || c.neumaticos || c.botiquin || c.extintor || c.luces)).length;
  const noConformes = controlesTecnicosData.filter(c => !c.cinturon && !c.limpieza && !c.neumaticos && !c.botiquin && !c.extintor && !c.luces).length;

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los controles técnicos</p>
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
      <div className="space-y-6">
        {/* Header moderno */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 p-6 md:p-8 rounded-2xl shadow-lg border border-purple-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-2">
                Controles Técnicos
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Gestión de inspecciones técnicas en operativos</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="text-center bg-white/60 p-3 rounded-xl border border-purple-100">
                  <p className="text-xl font-bold text-purple-700">{isLoading ? '-' : totalControles}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xl font-bold text-emerald-700">{isLoading ? '-' : conformes}</p>
                  <p className="text-xs text-gray-600">Conformes</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-amber-100">
                  <p className="text-xl font-bold text-amber-700">{isLoading ? '-' : observados}</p>
                  <p className="text-xs text-gray-600">Observados</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-red-100">
                  <p className="text-xl font-bold text-red-700">{isLoading ? '-' : noConformes}</p>
                  <p className="text-xs text-gray-600">No Conformes</p>
                </div>
              </div>
              <Button 
                onClick={() => refetch()} 
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

        {/* Gestión de Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Controles Técnicos
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />}
                </CardTitle>
                <CardDescription>{filteredData.length} controles encontrados</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Control
                </Button>
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl">
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
                  placeholder="Buscar por placa o ID control..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los resultados</SelectItem>
                  <SelectItem value="CONFORME">Conforme</SelectItem>
                  <SelectItem value="OBSERVADO">Observado</SelectItem>
                  <SelectItem value="NO_CONFORME">No Conforme</SelectItem>
                </SelectContent>
              </Select>
              
              <div></div>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Cargando controles técnicos...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-purple-900">ID Control</TableHead>
                        <TableHead className="font-bold text-purple-900">Placa</TableHead>
                        <TableHead className="font-bold text-purple-900">Cinturón</TableHead>
                        <TableHead className="font-bold text-purple-900">Limpieza</TableHead>
                        <TableHead className="font-bold text-purple-900">Neumáticos</TableHead>
                        <TableHead className="font-bold text-purple-900">Botiquín</TableHead>
                        <TableHead className="font-bold text-purple-900">Extintor</TableHead>
                        <TableHead className="font-bold text-purple-900">Luces</TableHead>
                        <TableHead className="font-bold text-purple-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((control) => (
                        <TableRow key={control.id_control} className="hover:bg-purple-50/50 transition-colors">
                          <TableCell className="font-mono font-medium text-purple-600">{control.id_control}</TableCell>
                          <TableCell className="font-mono font-medium">{control.placa_v || 'N/A'}</TableCell>
                          <TableCell className="text-center">
                            <CheckIcon checked={control.cinturon} />
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckIcon checked={control.limpieza} />
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckIcon checked={control.neumaticos} />
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckIcon checked={control.botiquin} />
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckIcon checked={control.extintor} />
                          </TableCell>
                          <TableCell className="text-center">
                            <CheckIcon checked={control.luces} />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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

export default ControlesTecnicosPage;
