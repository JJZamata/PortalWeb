// fiscalizadores.types.ts

// ✅ Estructura REAL de cada usuario que viene del backend
export interface UsuarioBackend {
  id: number;
  usuario: string;
  email: string;
  rol: string;
  estado: string;
  ultimo_acceso: string;
  dispositivo: string;
}

// ✅ Paginación REAL del backend
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  offset: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

// ✅ Si igual quieres un modelo "normalizado" para frontend
export interface Fiscalizador {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  deviceConfigured?: boolean;
  lastLogin?: string;
  dni?: string;
  nombreCompleto?: string;
  telefono?: string;
  direccion?: string;
}

// ✅ Respuesta real del backend
export interface FiscalizadoresApiResponse {
  success: boolean;
  data: {
    data: UsuarioBackend[];
    pagination: Pagination;
  };
  message: string;
}

// ✅ Detalle (si algún endpoint lo usa)
export interface FiscalizadorDetailResponse {
  success: boolean;
  data: UsuarioBackend;
}

// ✅ Crear fiscalizador
export interface CreateFiscalizadorRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

// ✅ Manejo de errores
export interface ApiError {
  success: boolean;
  message: string;
  errors?: {
    field?: string;
    message: string;
    value?: any;
    location?: string;
  }[];
}
