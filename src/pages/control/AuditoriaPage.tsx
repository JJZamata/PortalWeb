
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Search, Filter, Download, Eye, Calendar, User, Database, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const AuditoriaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Datos simulados de auditoría que representan la estructura de audit_logs
  const auditLogs = [
    {
      id: 1,
      table_name: 'vehiculos',
      operation: 'INSERT',
      record_id: 'VAW-454',
      old_values: null,
      new_values: {
        placa_v: 'VAW-454',
        dni_propietario: '12345678',
        estado: 'Activo'
      },
      user_id: 1,
      username: 'admin_user',
      timestamp: '2024-01-15T10:30:00Z',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      table_name: 'conductores',
      operation: 'UPDATE',
      record_id: '87654321',
      old_values: {
        telefono: '987654321',
        direccion: 'Av. Principal 123'
      },
      new_values: {
        telefono: '912345678',
        direccion: 'Jr. Los Andes 456'
      },
      user_id: 2,
      username: 'fiscalizador_01',
      timestamp: '2024-01-15T14:20:00Z',
      ip_address: '192.168.1.105',
      user_agent: 'Mozilla/5.0 (Android 11; Mobile; rv:112.0) Gecko/112.0 Firefox/112.0'
    },
    {
      id: 3,
      table_name: 'acta_control',
      operation: 'INSERT',
      record_id: 'ACT-2024-001',
      old_values: null,
      new_values: {
        id_acta: 'ACT-2024-001',
        placa_v: 'VAW-454',
        resultado: 'CONFORME',
        observaciones: 'Vehículo en buen estado'
      },
      user_id: 2,
      username: 'fiscalizador_01',
      timestamp: '2024-01-15T16:45:00Z',
      ip_address: '192.168.1.105',
      user_agent: 'Mozilla/5.0 (Android 11; Mobile; rv:112.0) Gecko/112.0 Firefox/112.0'
    },
    {
      id: 4,
      table_name: 'usuarios',
      operation: 'DELETE',
      record_id: '15',
      old_values: {
        username: 'temp_user',
        email: 'temp@example.com',
        role: 'fiscalizador'
      },
      new_values: null,
      user_id: 1,
      username: 'admin_user',
      timestamp: '2024-01-16T09:15:00Z',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ];

  const getOperationBadge = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTableBadge = (tableName: string) => {
    const colors = {
      'vehiculos': 'bg-blue-50 text-blue-700 border-blue-200',
      'conductores': 'bg-purple-50 text-purple-700 border-purple-200',
      'usuarios': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'acta_control': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'empresas': 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[tableName as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.operation === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent mb-2">
                Auditoría del Sistema
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Registro completo de todas las operaciones realizadas en el sistema</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="text-center bg-white/60 p-3 rounded-xl border border-indigo-100">
                  <p className="text-xl font-bold text-indigo-700">{filteredLogs.length}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-emerald-100">
                  <p className="text-xl font-bold text-emerald-700">
                    {filteredLogs.filter(l => l.operation === 'INSERT').length}
                  </p>
                  <p className="text-xs text-gray-600">Creaciones</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-amber-100">
                  <p className="text-xl font-bold text-amber-700">
                    {filteredLogs.filter(l => l.operation === 'UPDATE').length}
                  </p>
                  <p className="text-xs text-gray-600">Actualizaciones</p>
                </div>
                <div className="text-center bg-white/60 p-3 rounded-xl border border-red-100">
                  <p className="text-xl font-bold text-red-700">
                    {filteredLogs.filter(l => l.operation === 'DELETE').length}
                  </p>
                  <p className="text-xs text-gray-600">Eliminaciones</p>
                </div>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Registros de Auditoría */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Registro de Actividades
                </CardTitle>
                <CardDescription>{filteredLogs.length} registros de auditoría</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por tabla, usuario o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las operaciones</SelectItem>
                  <SelectItem value="INSERT">Creaciones</SelectItem>
                  <SelectItem value="UPDATE">Actualizaciones</SelectItem>
                  <SelectItem value="DELETE">Eliminaciones</SelectItem>
                </SelectContent>
              </Select>
              
              <div></div>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50">
                    <TableRow>
                      <TableHead className="font-bold text-indigo-900">Fecha/Hora</TableHead>
                      <TableHead className="font-bold text-indigo-900">Tabla</TableHead>
                      <TableHead className="font-bold text-indigo-900">Operación</TableHead>
                      <TableHead className="font-bold text-indigo-900">Registro</TableHead>
                      <TableHead className="font-bold text-indigo-900">Usuario</TableHead>
                      <TableHead className="font-bold text-indigo-900">IP</TableHead>
                      <TableHead className="font-bold text-indigo-900 text-center">Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-indigo-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`${getTableBadge(log.table_name)} font-semibold rounded-full border`}
                          >
                            <Database className="w-3 h-3 mr-1" />
                            {log.table_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`${getOperationBadge(log.operation)} font-semibold rounded-full border`}
                          >
                            {log.operation}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-medium text-gray-900">{log.record_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{log.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-700">{log.ip_address}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-indigo-100 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Detalles de Auditoría
                                  </DialogTitle>
                                  <DialogDescription>
                                    Información completa del registro de auditoría
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Tabla</label>
                                      <p className="font-mono">{log.table_name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Operación</label>
                                      <p className="font-medium">{log.operation}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">ID Registro</label>
                                      <p className="font-mono">{log.record_id}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Usuario</label>
                                      <p className="font-medium">{log.username} (ID: {log.user_id})</p>
                                    </div>
                                  </div>
                                  
                                  {log.old_values && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Valores Anteriores</label>
                                      <ScrollArea className="h-32 w-full border rounded-lg p-3 bg-red-50">
                                        <pre className="text-sm text-red-800">
                                          {JSON.stringify(log.old_values, null, 2)}
                                        </pre>
                                      </ScrollArea>
                                    </div>
                                  )}
                                  
                                  {log.new_values && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Valores Nuevos</label>
                                      <ScrollArea className="h-32 w-full border rounded-lg p-3 bg-emerald-50">
                                        <pre className="text-sm text-emerald-800">
                                          {JSON.stringify(log.new_values, null, 2)}
                                        </pre>
                                      </ScrollArea>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">User Agent</label>
                                    <p className="text-sm text-gray-600 break-all">{log.user_agent}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AuditoriaPage;
