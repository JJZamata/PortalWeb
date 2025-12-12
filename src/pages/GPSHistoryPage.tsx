import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Search, Calendar, User, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { MapViewHistory } from '@/features/gps-tracking/components/MapViewHistory';
import { UserLocation } from '@/features/gps-tracking/types';
import { fiscalizadoresService } from '@/features/personal/fiscalizadores/services/fiscalizadoresService';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface LocationHistory {
  id: string;
  userId: string;
  username: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: string;
}

export const GPSHistoryPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationHistory | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Establecer fechas por defecto (últimos 7 días)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Buscar usuarios
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fiscalizadoresService.searchFiscalizadores(searchQuery, 1, 20);
      const users = response.data?.data || [];
      const adaptedUsers = users.map((user: any) => ({
        id: user.id.toString(),
        username: user.usuario || user.username,
        email: user.email,
        role: user.rol || user.role || 'Fiscalizador'
      }));

      setSearchResults(adaptedUsers);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      toast.error('Error al buscar usuarios');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Cargar historial de ubicaciones
  const loadLocationHistory = async (user: User) => {
    setSelectedUser(user);
    setIsLoadingHistory(true);
    setLocationHistory([]);
    setSelectedLocation(null);

    try {
      // Convertir las fechas del input a formato ISO con hora
      const startDateTime = new Date(startDate + 'T00:00:00').toISOString();
      const endDateTime = new Date(endDate + 'T23:59:59').toISOString();

      const params = new URLSearchParams({
        startDate: startDateTime,
        endDate: endDateTime,
        limit: '50',
        offset: '0'
      });

      console.log('Solicitando historial para usuario:', user.id);
      console.log('Parámetros:', params.toString());

      const response = await axios.get(`/locations/history/${user.id}?${params}`);
      
      console.log('Respuesta del servidor:', response.data);

      // Estructura correcta: response.data.data.history
      const historyData = response.data?.data?.history || [];
      
      // Adaptar los datos al formato esperado
      const adaptedHistory: LocationHistory[] = historyData.map((loc: any, index: number) => ({
        id: `${user.id}-${index}`,
        userId: user.id,
        username: user.username,
        location: {
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
          accuracy: loc.accuracy ? parseFloat(loc.accuracy) : undefined
        },
        timestamp: loc.timestamp
      }));

      setLocationHistory(adaptedHistory);

      if (adaptedHistory.length === 0) {
        toast.info('No hay datos de ubicación para el período seleccionado');
      } else {
        toast.success(`Se cargaron ${adaptedHistory.length} puntos de ubicación`);
      }
    } catch (error: any) {
      console.error('Error al cargar el historial:', error);
      const errorMessage = error.response?.data?.message || 'Error al cargar el historial de ubicaciones';
      toast.error(errorMessage);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Convertir historial a formato para MapView
  const historyForMap = locationHistory.map((loc, index) => ({
    userId: loc.userId,
    username: loc.username,
    location: loc.location,
    online: true,
    lastUpdate: loc.timestamp,
    isHistory: true,
    order: index
  }));

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 h-full">
        <div className="h-full flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">GPS Historial</h1>
              <p className="text-muted-foreground">
                Consulta el recorrido histórico de fiscalizadores
              </p>
            </div>
          </div>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Búsqueda de Fiscalizador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre de usuario..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {isSearching && <Clock className="h-4 w-4 animate-spin mt-3" />}
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Filtros de fecha */}
              {selectedUser && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fecha inicio</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fecha fin</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => loadLocationHistory(selectedUser)}
                    disabled={isLoadingHistory || !startDate || !endDate}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {isLoadingHistory ? 'Cargando...' : 'Cargar historial'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Map and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: '650px' }}>
            {/* Map */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    {selectedUser ? `Ruta Histórica - ${selectedUser.username}` : 'Mapa de Historial GPS'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] p-0">
                  <MapViewHistory
                    locations={historyForMap}
                    selectedLocation={selectedLocation ? {
                      userId: selectedLocation.userId,
                      username: selectedLocation.username,
                      location: selectedLocation.location,
                      online: true,
                      lastUpdate: selectedLocation.timestamp
                    } : null}
                    onLocationSelect={(location) => {
                      const historyLoc = locationHistory.find(
                        h => h.userId === location.userId && h.timestamp === location.lastUpdate
                      );
                      if (historyLoc) setSelectedLocation(historyLoc);
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {selectedUser ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Información</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Fiscalizador</p>
                        <p className="font-medium">{selectedUser.username}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Correo</p>
                        <p className="text-sm">{selectedUser.email}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Período</p>
                        <p className="text-sm">
                          {startDate && new Date(startDate).toLocaleDateString('es-PE')} - {endDate && new Date(endDate).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground">Puntos registrados</p>
                        <p className="text-2xl font-bold">{locationHistory.length}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {locationHistory.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Estadísticas de Ruta</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Inicio</p>
                          <p className="text-sm">
                            {new Date(locationHistory[0].timestamp).toLocaleString('es-PE')}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Fin</p>
                          <p className="text-sm">
                            {new Date(locationHistory[locationHistory.length - 1].timestamp).toLocaleString('es-PE')}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Duración</p>
                          <p className="text-sm font-medium">
                            {Math.round(
                              (new Date(locationHistory[locationHistory.length - 1].timestamp).getTime() -
                               new Date(locationHistory[0].timestamp).getTime()) / (1000 * 60 * 60)
                            )} horas
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instrucciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">1.</span>
                      <span>Busca un fiscalizador por nombre</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">2.</span>
                      <span>Selecciona un usuario de la lista</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">3.</span>
                      <span>Ajusta las fechas si es necesario</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">4.</span>
                      <span>Haz clic en "Cargar historial"</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">5.</span>
                      <span>Visualiza la ruta en el mapa</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};