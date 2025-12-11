export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
}

export interface UserLocation {
  userId: number;
  location: Location;
  online: boolean;
  username: string | null;
  lastUpdate: string;
}

export interface LocationRealtimePayload {
  userId: number;
  location: Location;
}

export interface SocketConnectionStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}