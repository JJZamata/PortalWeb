import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { UserLocation, SocketConnectionStatus } from '../types';

export const useGPSTracking = () => {
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
  });

  const handleAllLocations = useCallback((allLocations: any[]) => {
    // Transformar los datos al formato esperado
    const transformedLocations = allLocations.map(loc => ({
      userId: loc.userId,
      username: loc.username || `Usuario ${loc.userId}`,
      online: true, // Asumir que están online si vienen en la lista
      lastUpdate: loc.timestamp || new Date().toISOString(),
      location: {
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy || null,
        timestamp: loc.timestamp || new Date().toISOString(),
      }
    }));
    setLocations(transformedLocations);
  }, []);

  const handleRealtimeLocation = useCallback((payload: any) => {
    console.log('Processing realtime payload:', payload);

    // El payload puede venir con diferentes estructuras
    const userId = typeof payload.userId === 'string' ? parseInt(payload.userId) : payload.userId;
    const location = payload.location || payload; // A veces viene anidado, a veces plano

    setLocations(prevLocations => {
      const existingIndex = prevLocations.findIndex(loc => loc.userId === userId);

      if (existingIndex >= 0) {
        // Actualizar ubicación existente
        const updatedLocations = [...prevLocations];
        updatedLocations[existingIndex] = {
          ...updatedLocations[existingIndex],
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy || null,
            timestamp: payload.timestamp || location.timestamp || new Date().toISOString(),
          },
          lastUpdate: payload.timestamp || location.timestamp || new Date().toISOString(),
          online: true,
        };
        return updatedLocations;
      } else {
        // Agregar nueva ubicación
        return [...prevLocations, {
          userId: userId,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy || null,
            timestamp: payload.timestamp || location.timestamp || new Date().toISOString(),
          },
          online: true,
          username: `Usuario ${userId}`,
          lastUpdate: payload.timestamp || location.timestamp || new Date().toISOString(),
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
      const status = await socketService.connect();
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus({
        connected: false,
        connecting: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }, []);

  const disconnect = useCallback((isReconnecting = false) => {
    socketService.disconnect();
    if (!isReconnecting) {
      setLocations([]);
    }
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

  // Efecto separado para manejar la conexión inicial
  useEffect(() => {
    // Conectar automáticamente al montar el hook
    connect();

    // Desconectar al desmontar
    return () => {
      socketService.disconnect();
    };
  }, []); // Solo en el primer montaje

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