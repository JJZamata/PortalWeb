import { io, Socket } from 'socket.io-client';
import { UserLocation, LocationRealtimePayload, SocketConnectionStatus } from '../types';

const BASE_URL = 'https://backfiscamotov2.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnecting = false;

  connect(): Promise<SocketConnectionStatus> {
    return new Promise((resolve) => {
      // Evitar múltiples conexiones
      if (this.socket?.connected) {
        console.log('> Socket ya conectado');
        resolve({ connected: true, connecting: false, error: null });
        return;
      }

      if (this.isConnecting) {
        console.log('> Conexión en progreso...');
        return;
      }

      this.isConnecting = true;

      this.socket = io(BASE_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        this.isConnecting = false;
        console.log('✅ Socket.IO connected');

        // Registrar listeners después de conectar
        this.setupMainListeners();

        resolve({ connected: true, connecting: false, error: null });

        // Solicitar todas las ubicaciones al conectar
        setTimeout(() => {
          console.log('📡 Emitting location:getAll');
          this.socket?.emit('location:getAll');
        }, 500);
      });

      this.socket.on('disconnect', () => {
        this.isConnecting = false;
        console.log('🔌 Socket.IO disconnected');
      });

      this.socket.on('connect_error', (error) => {
        this.isConnecting = false;
        console.error('❌ Socket.IO connection error:', error);
        resolve({ connected: false, connecting: false, error: error.message });
      });

      this.socket.on('welcome', (data) => {
        console.log('👋 Welcome message:', data);
      });
    });
  }

  private setupMainListeners() {
    if (!this.socket) return;

    // Remover listeners existentes para evitar duplicados
    this.socket.off('location:allLocations');
    this.socket.off('location:realtime');

    // Listener para todas las ubicaciones
    this.socket.on('location:allLocations', (data) => {
      console.log('📍 Received location:allLocations:', data);
      this.notifyListeners('location:allLocations', data);
    });

    // Listener para ubicaciones en tiempo real
    this.socket.on('location:realtime', (data) => {
      console.log('🔄 Received location:realtime:', data);
      this.notifyListeners('location:realtime', data);
    });

    // Listeners de conexión
    this.socket.on('connect', () => {
      this.notifyListeners('connect');
    });

    this.socket.on('disconnect', () => {
      this.notifyListeners('disconnect');
    });
  }

  private notifyListeners(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event);
    if (callbacks && callbacks.size > 0) {
      console.log(`🔔 Notifying ${callbacks.size} listener(s) for event: ${event}`);
      callbacks.forEach(cb => {
        try {
          cb(...args);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    } else {
      console.warn(`⚠️ No listeners registered for event: ${event}`);
    }
  }

  disconnect() {
    if (this.socket?.connected) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
    }
    this.socket = null;
    // No limpiar los listeners aquí para permitir reconexión
    // this.listeners.clear();
    this.isConnecting = false;
  }

  // Event listeners
  onAllLocations(callback: (locations: any[]) => void) {
    console.log('📝 Registering listener for location:allLocations');
    this.addEventListener('location:allLocations', callback);
  }

  onRealtimeLocation(callback: (payload: any) => void) {
    console.log('📝 Registering listener for location:realtime');
    this.addEventListener('location:realtime', callback);
  }

  onConnect(callback: () => void) {
    console.log('📝 Registering listener for connect');
    this.addEventListener('connect', callback);
  }

  onDisconnect(callback: () => void) {
    console.log('📝 Registering listener for disconnect');
    this.addEventListener('disconnect', callback);
  }

  private addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    console.log(`✅ Listener added for ${event}. Total listeners: ${this.listeners.get(event)?.size}`);
  }

  removeEventListener(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      console.log(`🗑️ Listener removed for ${event}. Remaining: ${callbacks.size}`);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();