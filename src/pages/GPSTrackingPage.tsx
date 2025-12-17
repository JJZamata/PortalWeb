import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGPSTracking } from '@/features/gps-tracking/hooks/useGPSTracking';
import { MapView } from '@/features/gps-tracking/components/MapView';
import { ConnectionStatus } from '@/features/gps-tracking/components/ConnectionStatus';
import { UserLocation } from '@/features/gps-tracking/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, MapPin, RefreshCw, Power } from 'lucide-react';
import { toast } from 'sonner';

export const GPSTrackingPage = () => {
  const {
    locations,
    connectionStatus,
    connect,
    disconnect,
    isConnected,
    trackingActive,
    toggleTracking,
  } = useGPSTracking();

  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);

  const handleMarkerClick = (location: UserLocation) => {
    setSelectedLocation(location);
    toast.success(`Seleccionado: ${location.username || `Usuario ${location.userId}`}`);
  };

  const handleRefresh = () => {
    if (isConnected) {
      disconnect();
      setTimeout(() => {
        connect();
      }, 1000);
    } else {
      connect();
    }
  };

  const onlineCount = locations.filter(loc => loc.online).length;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 h-full">
        <div className="h-full flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">GPS Tracking</h1>
              <p className="text-muted-foreground">
                Seguimiento en tiempo real de fiscalizadores
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus status={connectionStatus} />
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={connectionStatus.connecting}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus.connecting ? 'animate-spin' : ''}`} />
                {isConnected ? 'Reconectar' : 'Conectar'}
              </Button>
              <Button
                variant={trackingActive ? "destructive" : "default"}
                onClick={toggleTracking}
                disabled={!isConnected}
                className="flex items-center gap-2"
              >
                <Power className="h-4 w-4" />
                {trackingActive ? '🔴 Desactivar Tracking' : '🟢 Activar Tracking'}
              </Button>
            </div>
          </div>

          {/* Status del Tracking */}
          <Card className={`border-2 ${trackingActive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${trackingActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <div>
                    <p className="text-lg font-semibold">
                      Sistema de Tracking: <span className={trackingActive ? 'text-green-600' : 'text-red-600'}>
                        {trackingActive ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {trackingActive
                        ? 'Recibiendo ubicaciones de fiscalizadores en tiempo real'
                        : 'El sistema no está recibiendo ubicaciones. Haz clic en "Activar Tracking" para iniciar.'
                      }
                    </p>
                  </div>
                </div>
                {!trackingActive && isConnected && (
                  <Badge variant="destructive" className="animate-pulse">
                    Sistema Desactivado
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fiscalizadores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{locations.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Línea</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Desconectados</CardTitle>
                <div className="h-4 w-4 bg-gray-300 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{locations.length - onlineCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado del Tracking</CardTitle>
                <Power className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${trackingActive ? 'text-green-600' : 'text-red-600'}`}>
                  {trackingActive ? 'ACTIVO' : 'INACTIVO'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: '650px' }}>
            {/* Map */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Mapa de Ubicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] p-0">
                  <MapView
                    locations={locations}
                    onMarkerClick={handleMarkerClick}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Selected Location */}
              {selectedLocation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fiscalizador Seleccionado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">
                        {selectedLocation.username || `Usuario ${selectedLocation.userId}`}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge variant={selectedLocation.online ? 'default' : 'secondary'}>
                        {selectedLocation.online ? 'En línea' : 'Desconectado'}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Última actualización</p>
                      <p className="text-sm">
                        {new Date(selectedLocation.lastUpdate).toLocaleString('es-PE')}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Coordenadas</p>
                      <p className="text-sm font-mono">
                        {selectedLocation.location.latitude.toFixed(6)},{' '}
                        {selectedLocation.location.longitude.toFixed(6)}
                      </p>
                    </div>
                    {selectedLocation.location.accuracy && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Precisión</p>
                          <p className="text-sm">±{Math.round(selectedLocation.location.accuracy)} metros</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Active Users List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fiscalizadores Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {locations.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No hay fiscalizadores conectados
                      </p>
                    ) : (
                      locations.map(location => (
                        <div
                          key={location.userId}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => setSelectedLocation(location)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              location.online ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <span className="text-sm font-medium">
                              {location.username || `Usuario ${location.userId}`}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(location.lastUpdate).toLocaleTimeString('es-PE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};