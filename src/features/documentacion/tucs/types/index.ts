// Tipos para TUC (Tarjeta Única de Circulación)

export interface Propietario {
  nombreCompleto?: string;
  nombre?: string;
  dni?: string;
  ruc?: string;
}

export interface Empresa {
  nombre?: string;
  ruc?: string;
}

export interface VehicleType {
  categoria: string;
  descripcion: string;
}

export interface Vehiculo {
  placa: string;
  marca?: string;
  modelo?: string;
  año?: number;
  vehicleInfo: string;
  tipo?: VehicleType;
}

export interface TUCInfo {
  tucNumber: string;
  validityDate: string;
  registralCode: string;
  supportDocument: string;
  vehiclePlate: string;
}

export interface Fechas {
  vigencia: string;
  diasRestantes: number;
}

export interface Estado {
  codigo: string;
  descripcion: string;
  color: string;
  icon?: string;
}

export interface Auditoria {
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface TUCData {
  // Estructura anidada (según documentación más reciente)
  tuc: TUCInfo;
  vehiculo: Vehiculo;
  propietario: Propietario | string;
  empresa: Empresa | string;
  fechas: Fechas;
  estado: Estado;
  auditoria: Auditoria;

  // Campos planos (según respuestas actuales del API) - opcionales para compatibilidad
  tucNumber?: string;
  vehiclePlate?: string;
  vehicleInfo?: string;
  validityDate?: string;
  registralCode?: string;
  supportDocument?: string;
  diasRestantes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TUCListResponse {
  success: boolean;
  data: {
    data: TUCData[];
    pagination: {
      currentPage: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
  meta: {
    appliedFilters: Record<string, any>;
    sorting: Record<string, any>;
  };
}

export interface TUCDetailResponse {
  success: boolean;
  data: TUCData;
  message: string;
}

export interface CreateTUCPayload {
  tucNumber: string;
  validityDate: string; // YYYY-MM-DD
  registralCode: string;
  supportDocument: string;
  vehiclePlate: string;
}

export interface UpdateTUCPayload {
  tucNumber?: string;
  validityDate?: string;
  registralCode?: string;
  supportDocument?: string;
  vehiclePlate?: string;
}

export interface TUCFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'vigente' | 'por_vencer' | 'vencido';
  sortBy?: 'tucNumber' | 'validityDate' | 'registralCode' | 'supportDocument' | 'vehiclePlate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

