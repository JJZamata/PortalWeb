
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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Camera,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Clock,
  FileText,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const FotosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actaFilter, setActaFilter] = useState('all');
  const [isRefetching, setIsRefetching] = useState(false);

  // Datos de ejemplo para Fotos
  const fotosData = [
    {
      id: "FOTO-001",
      id_acta: "ACT-001",
      url: "/placeholder.svg",
      coordenadas: "-16.3988,-71.5369",
      fecha: "2024-12-28 14:30:15",
      tipo: "Vehículo Frontal",
      placa: "ABC-123",
      fiscalizador: "Carlos Alberto Mendoza Silva",
      ubicacion: "Av. Principal con Jr. Los Andes"
    },
    {
      id: "FOTO-002",
      id_acta: "ACT-001",
      url: "/placeholder.svg",
      coordenadas: "-16.3988,-71.5369",
      fecha: "2024-12-28 14:30:45",
      tipo: "Documentos",
      placa: "ABC-123",
      fiscalizador: "Carlos Alberto Mendoza Silva",
      ubicacion: "Av. Principal con Jr. Los Andes"
    },
    {
      id: "FOTO-003",
      id_acta: "ACT-002",
      url: "/placeholder.svg",
      coordenadas: "-16.3995,-71.5375",
      fecha: "2024-12-28 15:45:20",
      tipo: "Vehículo Lateral",
      placa: "XYZ-789",
      fiscalizador: "Ana Lucia Herrera Torres",
      ubicacion: "Plaza de Armas"
    },
    {
      id: "FOTO-004",
      id_acta: "ACT-002",
      url: "/placeholder.svg",
      coordenadas: "-16.3995,-71.5375",
      fecha: "2024-12-28 15:45:50",
      tipo: "Infracción",
      placa: "XYZ-789",
      fiscalizador: "Ana Lucia Herrera Torres",
      ubicacion: "Plaza de Armas"
    },
    {
      id: "FOTO-005",
      id_acta: "ACT-003",
      url: "/placeholder.svg",
      coordenadas: "-16.4010,-71.5380",
      fecha: "2024-12-28 16:20:30",
      tipo: "Vehículo Frontal",
      placa: "DEF-456",
      fiscalizador: "Miguel Angel Quispe Flores",
      ubicacion: "Terminal Terrestre"
    },
    {
      id: "FOTO-006",
      id_acta: "ACT-003",
      url: "/placeholder.svg",
      coordenadas: "-16.4010,-71.5380",
      fecha: "2024-12-28 16:21:00",
      tipo: "Control Técnico",
      placa: "DEF-456",
      fiscalizador: "Miguel Angel Quispe Flores",
      ubicacion: "Terminal Terrestre"
    }
  ];

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Vehículo Frontal':
      case 'Vehículo Lateral':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Documentos':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Infracción':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Control Técnico':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredData = fotosData.filter(foto => {
    const matchesSearch = 
      foto.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      foto.id_acta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      foto.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      foto.fiscalizador.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActa = actaFilter === 'all' || foto.id_acta === actaFilter;
    
    return matchesSearch && matchesActa;
  });

  const uniqueActas = [...new Set(fotosData.map(foto => foto.id_acta))];

  const handleRefetch = () => {
    setIsRefetching(true);
    setTimeout(() => setIsRefetching(false), 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-2xl shadow-lg border border-purple-200/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent mb-2">
                Archivo Fotográfico
              </h1>
              <p className="text-gray-600 text-lg">Gestión de evidencias fotográficas de operativos</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700">{fotosData.length}</p>
                <p className="text-sm text-gray-600">Total Fotos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-700">{uniqueActas.length}</p>
                <p className="text-sm text-gray-600">Actas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">
                  {fotosData.filter(f => f.tipo.includes('Vehículo')).length}
                </p>
                <p className="text-sm text-gray-600">Vehículos</p>
              </div>
              <Button 
                onClick={handleRefetch} 
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

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Archivo Fotográfico
                  {isRefetching && <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />}
                </CardTitle>
                <CardDescription>Gestión de evidencias fotográficas</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Subir Foto
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, acta o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <Select value={actaFilter} onValueChange={setActaFilter}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Filtrar por Acta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las actas</SelectItem>
                  {uniqueActas.map(acta => (
                    <SelectItem key={acta} value={acta}>{acta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredData.map((foto) => (
                <Card key={foto.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 border border-purple-100">
                  <div className="relative">
                    <AspectRatio ratio={4/3}>
                      <img
                        src={foto.url}
                        alt={`Foto ${foto.id}`}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className={`${getTipoBadge(foto.tipo)} border text-xs font-semibold rounded-full`}>
                        {foto.tipo}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-purple-600">{foto.id}</span>
                      <span className="font-mono text-sm text-gray-600">{foto.id_acta}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-mono font-bold">{foto.placa}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{new Date(foto.fecha).toLocaleString()}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate" title={foto.ubicacion}>
                        📍 {foto.ubicacion}
                      </p>
                      
                      <p className="text-xs text-gray-500 truncate" title={foto.fiscalizador}>
                        👮 {foto.fiscalizador}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="ghost" size="sm" className="flex-1 hover:bg-purple-100 rounded-lg">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Table View */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                  <TableRow>
                    <TableHead className="font-bold text-purple-900">ID Foto</TableHead>
                    <TableHead className="font-bold text-purple-900">Acta</TableHead>
                    <TableHead className="font-bold text-purple-900">Placa</TableHead>
                    <TableHead className="font-bold text-purple-900">Tipo</TableHead>
                    <TableHead className="font-bold text-purple-900">Fecha/Hora</TableHead>
                    <TableHead className="font-bold text-purple-900">Ubicación</TableHead>
                    <TableHead className="font-bold text-purple-900">Coordenadas</TableHead>
                    <TableHead className="font-bold text-purple-900 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((foto) => (
                    <TableRow key={foto.id} className="hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-mono font-bold text-purple-800">{foto.id}</TableCell>
                      <TableCell className="font-mono text-sm">{foto.id_acta}</TableCell>
                      <TableCell className="font-mono font-bold">{foto.placa}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getTipoBadge(foto.tipo)} border text-xs font-semibold rounded-full`}>
                          {foto.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(foto.fecha).toLocaleString()}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{foto.ubicacion}</TableCell>
                      <TableCell className="font-mono text-xs">{foto.coordenadas}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-purple-100 rounded-lg">
                            <Download className="w-4 h-4" />
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FotosPage;
