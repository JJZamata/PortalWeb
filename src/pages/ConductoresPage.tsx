
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Filter, User, RefreshCw, XCircle, Download } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConductoresData } from "@/hooks/useRealTimeData";

const ConductoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Usar datos en tiempo real
  const { data: conductoresData = [], isLoading, error, refetch, isRefetching } = useConductoresData();

  const filteredConductores = conductoresData.filter(conductor =>
    conductor.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conductor.dni_conductor?.includes(searchTerm) ||
    conductor.telefono?.includes(searchTerm)
  );

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de conductores</p>
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
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-lg border border-blue-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Gestión de Conductores
              </h1>
              <p className="text-gray-600 text-lg">Administra la información de licencias y conductores registrados</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {isLoading ? '-' : conductoresData.length}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">
                  {isLoading ? '-' : conductoresData.filter(c => c.estado === 'Activo').length}
                </p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-700">
                  {isLoading ? '-' : conductoresData.filter(c => c.estado !== 'Activo').length}
                </p>
                <p className="text-sm text-gray-600">Inactivos</p>
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
                placeholder="Buscar por nombre, DNI o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-300 focus:border-blue-500 rounded-xl bg-white text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Conductores */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Conductores Registrados
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>Total: {filteredConductores.length} conductores</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Conductor
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl">
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
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Cargando conductores...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-blue-900">Conductor</TableHead>
                        <TableHead className="font-bold text-blue-900">DNI</TableHead>
                        <TableHead className="font-bold text-blue-900">Teléfono</TableHead>
                        <TableHead className="font-bold text-blue-900">Dirección</TableHead>
                        <TableHead className="font-bold text-blue-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConductores.map((conductor) => (
                        <TableRow key={conductor.dni_conductor} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 shadow-lg border border-gray-200">
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-semibold text-sm">
                                  {conductor.nombre_completo?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'NA'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-900">{conductor.nombre_completo || 'N/A'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-800 font-medium font-mono">{conductor.dni_conductor}</TableCell>
                          <TableCell className="text-gray-700">{conductor.telefono || 'N/A'}</TableCell>
                          <TableCell className="text-gray-700 max-w-xs truncate">{conductor.direccion || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
                                <User className="w-4 h-4" />
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

export default ConductoresPage;
