// src/features/gestion/fiscalizadores/types/index.ts
export interface Fiscalizador {
  idUsuario: number;
  usuario: string;
  email: string;
  isActive: boolean;
  deviceConfigured: boolean;
  lastLogin: string | null;
  estado: string;
  dispositivo: string;
  ultimoAcceso: string;
  dni: string;
  nombreCompleto: string;
  telefono: string | null;
  direccion: string | null;
}

export interface FiscalizadorDetallado {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: Array<{ id: number; name: string }>;
  lastLogin: string;
  lastLoginIp: string;
  lastLoginDevice: string;
  deviceConfigured: boolean;
  deviceInfo: {
    configurado: boolean;
    detalles: {
      deviceId: string;
      deviceName: string;
      platform: string;
      version: string;
      appVersion: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface SummaryData {
  total: number;
  activos: number;
  inactivos: number;
  configurados: number;
  pendientes: number;
}