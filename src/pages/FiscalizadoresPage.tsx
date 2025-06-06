
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye, Filter, Download, Users, RefreshCw, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { useFiscalizadoresData } from "@/hooks/useRealTimeData";

const FiscalizadoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFiscalizador, setNewFiscalizador] = useState({
    nombreCompleto: '',
    codigo: '',
    contacto: '',
    contraseña: ''
  });
  const { toast } = useToast();

  // Usar datos en tiempo real
  const { data: fiscalizadoresData = [], isLoading, error, refetch, isRefetching } = useFiscalizadoresData();

  const handleAddFiscalizador = () => {
    if (!newFiscalizador.nombreCompleto || !newFiscalizador.codigo || !newFiscalizador.contacto) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Fiscalizador agregado",
      description: `${newFiscalizador.nombreCompleto} ha sido registrado exitosamente`,
    });

    setNewFiscalizador({
      nombreCompleto: '',
      codigo: '',
      contacto: '',
      contraseña: ''
    });
    setShowAddDialog(false);
  };

  const filteredFiscalizadores = fiscalizadoresData.filter(fiscalizador =>
    fiscalizador.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiscalizador.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiscalizador.id_usuario?.toString().includes(searchTerm)
  );

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los fiscalizadores</p>
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
        <div className="bg-gradient-to-br from-white to-red-50/30 p-8 rounded-2xl shadow-lg border border-red-200/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent mb-2">
                Gestión de Fiscalizadores
              </h1>
              <p className="text-gray-600 text-base md:text-lg">Administra y supervisa el equipo de fiscalizadores del sistema</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700">
                    {isLoading ? '-' : filteredFiscalizadores.length}
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {isLoading ? '-' : filteredFiscalizadores.filter(f => f.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">Activos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-700">
                    {isLoading ? '-' : filteredFiscalizadores.filter(f => !f.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">Inactivos</p>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo Fiscalizador
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="shadow-xl border border-gray-200 rounded-xl max-w-md">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-2xl font-bold text-gray-800">Agregar Fiscalizador</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Completa la información del nuevo fiscalizador
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombreCompleto" className="text-sm font-semibold text-gray-700">Nombre Completo *</Label>
                        <Input
                          id="nombreCompleto"
                          value={newFiscalizador.nombreCompleto}
                          onChange={(e) => setNewFiscalizador(prev => ({...prev, nombreCompleto: e.target.value}))}
                          placeholder="Ej: Juan Carlos Pérez González"
                          className="h-12 border-2 border-gray-200 focus:border-red-400 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="codigo" className="text-sm font-semibold text-gray-700">Código *</Label>
                        <Input
                          id="codigo"
                          value={newFiscalizador.codigo}
                          onChange={(e) => setNewFiscalizador(prev => ({...prev, codigo: e.target.value}))}
                          placeholder="Ej: SU053224"
                          className="h-12 border-2 border-gray-200 focus:border-red-400 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contacto" className="text-sm font-semibold text-gray-700">Contacto *</Label>
                        <Input
                          id="contacto"
                          value={newFiscalizador.contacto}
                          onChange={(e) => setNewFiscalizador(prev => ({...prev, contacto: e.target.value}))}
                          placeholder="Ej: 987654321"
                          className="h-12 border-2 border-gray-200 focus:border-red-400 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contraseña" className="text-sm font-semibold text-gray-700">Contraseña</Label>
                        <Input
                          id="contraseña"
                          type="password"
                          value={newFiscalizador.contraseña}
                          onChange={(e) => setNewFiscalizador(prev => ({...prev, contraseña: e.target.value}))}
                          placeholder="Contraseña temporal"
                          className="h-12 border-2 border-gray-200 focus:border-red-400 rounded-xl"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleAddFiscalizador} 
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg h-12 rounded-xl font-semibold"
                        >
                          Agregar Fiscalizador
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAddDialog(false)} 
                          className="border-2 border-gray-300 hover:bg-gray-50 h-12 px-6 rounded-xl font-semibold"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
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
        </div>

        {/* Search */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nombre de usuario, email o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-red-500 rounded-xl bg-white text-base"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 border-red-200 text-red-700 hover:bg-red-50 rounded-xl">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Fiscalizadores */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Fiscalizadores Registrados
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-red-600" />}
                </CardTitle>
                <CardDescription>Listado completo de fiscalizadores en el sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                  <span className="ml-2 text-gray-600">Cargando fiscalizadores...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/50">
                      <TableRow>
                        <TableHead className="font-bold text-red-900">ID Usuario</TableHead>
                        <TableHead className="font-bold text-red-900">Usuario</TableHead>
                        <TableHead className="font-bold text-red-900">Email</TableHead>
                        <TableHead className="font-bold text-red-900">Estado</TableHead>
                        <TableHead className="font-bold text-red-900">Último Acceso</TableHead>
                        <TableHead className="font-bold text-red-900">Dispositivo</TableHead>
                        <TableHead className="font-bold text-red-900 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiscalizadores.map((fiscalizador) => (
                        <TableRow key={fiscalizador.id_usuario} className="hover:bg-red-50/50 transition-colors">
                          <TableCell className="font-mono font-semibold text-red-700">{fiscalizador.id_usuario}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{fiscalizador.username}</TableCell>
                          <TableCell className="text-gray-700">{fiscalizador.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={`px-3 py-1 rounded-full font-semibold border ${fiscalizador.isActive 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                            >
                              {fiscalizador.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {fiscalizador.lastLogin ? new Date(fiscalizador.lastLogin).toLocaleDateString() : 'Nunca'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={fiscalizador.deviceConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                              {fiscalizador.deviceConfigured ? 'Configurado' : 'Pendiente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-red-100 rounded-lg">
                                <Edit className="w-4 h-4" />
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

export default FiscalizadoresPage;
