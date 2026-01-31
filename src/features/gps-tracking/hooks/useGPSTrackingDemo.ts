import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { UserLocation, SocketConnectionStatus } from '../types';

// Datos de demostración para fiscalizadores en Lima
const demoLocations: UserLocation[] = [
  {
    userId: 1,
    username: "Carlos García",
    location: {
      latitude: -12.0453,
      longitude: -77.0428,
      accuracy: 10,
      timestamp: new Date().toISOString(),
    },
    online: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    userId: 2,
    username: "María Rodríguez",
    location: {
      latitude: -12.0464,
      longitude: -77.0415,
      accuracy: 15,
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    online: true,
    lastUpdate: new Date(Date.now() - 60000).toISOString(),
  },
  {
    userId: 3,
    username: "Juan Pérez",
    location: {
      latitude: -12.0475,
      longitude: -77.0440,
      accuracy: 20,
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
    online: false,
    lastUpdate: new Date(Date.now() - 120000).toISOString(),
  },
  {
    userId: 4,
    username: "Ana López",
    location: {
      latitude: -12.0435,
      longitude: -77.0450,
      accuracy: 12,
      timestamp: new Date().toISOString(),
    },
    online: true,
    lastUpdate: new Date().toISOString(),
  },
];

export const useGPSTrackingDemo = () => {
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
  });

  const handleAllLocations = useCallback((allLocations: UserLocation[]) => {
    setLocations(allLocations);
  }, []);

  const handleRealtimeLocation = useCallback((payload: { userId: number; location: any }) => {
    setLocations(prevLocations => {
      const existingIndex = prevLocations.findIndex(loc => loc.userId === payload.userId);

      if (existingIndex >= 0) {
        // Actualizar ubicación existente
        const updatedLocations = [...prevLocations];
        updatedLocations[existingIndex] = {
          ...updatedLocations[existingIndex],
          location: payload.location,
          lastUpdate: payload.location.timestamp,
          online: true,
        };
        return updatedLocations;
      } else {
        // Agregar nueva ubicación
        return [...prevLocations, {
          userId: payload.userId,
          location: payload.location,
          online: true,
          username: `Usuario ${payload.userId}`,
          lastUpdate: payload.location.timestamp,
        }];
      }
    });
  }, []);

  const handleConnect = useCallback(() => {
    setConnectionStatus({ connected: true, connecting: false, error: null });
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnectionStatus(prev => ({ ...prev, connected: false }));
  }, []);

  const connect = useCallback(async () => {
    setConnectionStatus(prev => ({ ...prev, connecting: true, error: null }));

    try {
      // Simular conexión
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Usar datos de demo
      setLocations(demoLocations);
      setConnectionStatus({ connected: true, connecting: false, error: null });

      // Intentar conexión real con socket
      const status = await socketService.connect();
      if (!status.connected) {
        console.log('Usando modo demo - no se pudo conectar al backend');
      }
    } catch (error) {
      // Si falla la conexión, usar datos de demo
      setLocations(demoLocations);
      setConnectionStatus({
        connected: true,
        connecting: false,
        error: 'Modo demo - usando datos simulados'
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setLocations([]);
    setConnectionStatus({ connected: false, connecting: false, error: null });
  }, []);

  useEffect(() => {
    // Configurar event listeners
    socketService.onAllLocations(handleAllLocations);
    socketService.onRealtimeLocation(handleRealtimeLocation);
    socketService.onConnect(handleConnect);
    socketService.onDisconnect(handleDisconnect);

    // Limpiar listeners al desmontar
    return () => {
      socketService.removeEventListener('location:allLocations', handleAllLocations);
      socketService.removeEventListener('location:realtime', handleRealtimeLocation);
      socketService.removeEventListener('connect', handleConnect);
      socketService.removeEventListener('disconnect', handleDisconnect);
    };
  }, [handleAllLocations, handleRealtimeLocation, handleConnect, handleDisconnect]);

  useEffect(() => {
    // Conectar automáticamente al montar el hook
    connect();

    // Desconectar al desmontar
    return () => {
      disconnect();
    };
  }, []); // Solo en el primer montaje

  // Simular actualizaciones en tiempo real para demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (locations.length > 0 && Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * locations.length);
        const location = locations[randomIndex];

        // Simular pequeño movimiento
        const newLocation = {
          ...location,
          location: {
            ...location.location,
            latitude: location.location.latitude + (Math.random() - 0.5) * 0.001,
            longitude: location.location.longitude + (Math.random() - 0.5) * 0.001,
            timestamp: new Date().toISOString(),
          },
          lastUpdate: new Date().toISOString(),
        };

        setLocations(prev => {
          const updated = [...prev];
          updated[randomIndex] = newLocation;
          return updated;
        });
      }
    }, 5000); // Actualizar cada 5 segundos aleatoriamente

    return () => clearInterval(interval);
  }, [locations.length]);

  // Actualizar estado de offline para usuarios que no se han actualizado en los últimos 2 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      setLocations(prevLocations =>
        prevLocations.map(loc => ({
          ...loc,
          online: loc.lastUpdate > twoMinutesAgo,
        }))
      );
    }, 30000); // Verificar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return {
    locations,
    connectionStatus,
    connect,
    disconnect,
    isConnected: connectionStatus.connected,
  };
};