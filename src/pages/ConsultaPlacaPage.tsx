import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Car, User, FileText, Calendar, AlertCircle, CheckCircle, XCircle, Filter, Download, Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useVehiculosData, useCitvData, useAfocatData } from "@/hooks/useRealTimeData";

const ConsultaPlacaPage = () => {
  const [searchPlaca, setSearchPlaca] = useState('');
  const [displayedVehicles, setDisplayedVehicles] = useState<any[]>([]);

  // Usar datos en tiempo real
  const { data: vehiculos = [], isLoading: loadingVehiculos, error: errorVehiculos, refetch: refetchVehiculos } = useVehiculosData();
  const { data: citvData = [], isLoading: loadingCitv } = useCitvData();
  const { data: afocatData = [], isLoading: loadingAfocat } = useAfocatData();

  const isLoading = loadingVehiculos || loadingCitv || loadingAfocat;

  // Combinar datos de diferentes fuentes
  const enrichVehicleData = (vehicleData: any[]) => {
    return vehicleData.map(vehicle => {
      // Buscar datos de CITV para este vehículo
      const citv = citvData.find(c => c.placa_v === vehicle.placa_v);
      
      // Buscar datos de AFOCAT para este vehículo
      const afocat = afocatData.find(a => a.placa_v === vehicle.placa_v);

      // Simular otros documentos basados en los datos reales
      const documentos = {
        citv: citv ? {
          estado: citv.resultado_inspeccion === 'Aprobado' ? 'Habilitado' : 'No Habilitado',
          vencimiento: citv.fecha_vencimiento,
          revision: citv.resultado_inspeccion
        } : {
          estado: 'No Vigente',
          vencimiento: 'N/A',
          revision: 'Pendiente'
        },
        soat: afocat ? {
          estado: 'Vigente',
          vencimiento: afocat.fecha_vencimiento
        } : {
          estado: 'Vencido',
          vencimiento: 'N/A'
        },
        tuc: {
          estado: vehicle.tipo_vehiculo.estado_vehiculo === 'Activo' ? 'Vigente' : 'Vencido',
          vencimiento: vehicle.tipo_vehiculo.estado_vehiculo === 'Activo' ? '01/12/2025' : 'N/A'
        },
        tecnica: citv ? {
          estado: citv.resultado_inspeccion,
          vencimiento: citv.fecha_vencimiento
        } : {
          estado: 'Pendiente',
          vencimiento: 'N/A'
        }
      };

      return {
        placa: vehicle.placa_v,
        vehiculo: {
          marca: `${vehicle.tipo_vehiculo.marca} ${vehicle.tipo_vehiculo.modelo}`,
          modelo: vehicle.tipo_vehiculo.nombre,
          año: vehicle.tipo_vehiculo.anio_fabricacion.toString(),
          color: "Amarillo" // Default color, puede ser agregado al esquema de BD
        },
        conductor: {
          nombre: `${vehicle.propietario.nombres} ${vehicle.propietario.apellidos}`,
          licencia: `L${vehicle.dni_propietario}`
        },
        documentos,
        estado: documentos.citv.estado
      };
    });
  };

  useEffect(() => {
    if (!isLoading && vehiculos.length > 0) {
      const enrichedData = enrichVehicleData(vehiculos);
      setDisplayedVehicles(enrichedData);
    }
  }, [vehiculos, citvData, afocatData, isLoading]);

  const handleSearch = () => {
    if (!searchPlaca.trim()) {
      const enrichedData = enrichVehicleData(vehiculos);
      setDisplayedVehicles(enrichedData);
    } else {
      const enrichedData = enrichVehicleData(vehiculos);
      const filtered = enrichedData.filter(vehicle => 
        vehicle.placa.toLowerCase().includes(searchPlaca.toLowerCase()) ||
        vehicle.conductor.nombre.toLowerCase().includes(searchPlaca.toLowerCase()) ||
        vehicle.vehiculo.marca.toLowerCase().includes(searchPlaca.toLowerCase()) ||
        vehicle.vehiculo.modelo.toLowerCase().includes(searchPlaca.toLowerCase())
      );
      setDisplayedVehicles(filtered);
    }
  };

  const clearSearch = () => {
    setSearchPlaca('');
    const enrichedData = enrichVehicleData(vehiculos);
    setDisplayedVehicles(enrichedData);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Habilitado":
      case "Vigente":
      case "Aprobado":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium">{estado}</Badge>;
      case "No Habilitado":
      case "Vencido":
      case "Desaprobado":
        return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-medium">{estado}</Badge>;
      case "Observado":
      case "Pendiente":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-medium">{estado}</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-medium">{estado}</Badge>;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "Habilitado":
      case "Vigente":
      case "Aprobado":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "No Habilitado":
      case "Vencido":
      case "Desaprobado":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Observado":
      case "Pendiente":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (errorVehiculos) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de vehículos</p>
          <Button onClick={() => refetchVehiculos()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Sistema de Consulta Vehicular
              </h1>
              <p className="text-gray-600 font-medium">Panel de administración - Gestión integral de vehículos</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => refetchVehiculos()} 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, marca, modelo o conductor..."
                  value={searchPlaca}
                  onChange={(e) => setSearchPlaca(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button 
                onClick={clearSearch}
                variant="outline"
                className="h-12 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {searchPlaca ? `Resultados de búsqueda: "${searchPlaca}"` : 'Registro de Vehículos'}
          </h2>
          <p className="text-gray-600 font-medium">
            {isLoading ? 'Cargando...' : `${displayedVehicles.length} vehículos ${searchPlaca ? 'encontrados' : 'registrados'}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando datos de vehículos...</span>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && displayedVehicles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedVehicles.map((result, index) => (
              <Card key={index} className="border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
                {/* Card Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{result.placa}</h3>
                        <p className="text-sm text-gray-600">{result.vehiculo.marca} - {result.vehiculo.año}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.estado)}
                      {getEstadoBadge(result.estado)}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-6 space-y-5">
                  {/* Conductor Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Conductor
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">{result.conductor.nombre}</p>
                    <p className="text-xs text-gray-500">Licencia: {result.conductor.licencia}</p>
                  </div>

                  {/* Documents Grid */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Estado de Documentos
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">TUC(E)</span>
                          {getStatusIcon(result.documentos.tuc.estado)}
                        </div>
                        {getEstadoBadge(result.documentos.tuc.estado)}
                        <p className="text-xs text-gray-500 mt-2">
                          Vence: {result.documentos.tuc.vencimiento}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">SOAT</span>
                          {getStatusIcon(result.documentos.soat.estado)}
                        </div>
                        {getEstadoBadge(result.documentos.soat.estado)}
                        <p className="text-xs text-gray-500 mt-2">
                          Vence: {result.documentos.soat.vencimiento}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">CITV</span>
                          {getStatusIcon(result.documentos.citv.estado)}
                        </div>
                        {getEstadoBadge(result.documentos.citv.estado)}
                        <p className="text-xs text-gray-500 mt-2">
                          Vence: {result.documentos.citv.vencimiento}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Rev. Técnica</span>
                          {getStatusIcon(result.documentos.tecnica.estado)}
                        </div>
                        {getEstadoBadge(result.documentos.tecnica.estado)}
                        <p className="text-xs text-gray-500 mt-2">
                          Vence: {result.documentos.tecnica.vencimiento}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                      Ver Detalles Completos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchPlaca && displayedVehicles.length === 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600 mb-2">No hay vehículos registrados con: <strong className="text-blue-600">{searchPlaca}</strong></p>
              <p className="text-sm text-gray-500 mb-6">Verifica que la información esté correctamente escrita</p>
              <Button 
                onClick={clearSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
              >
                Ver Todos los Vehículos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ConsultaPlacaPage;
