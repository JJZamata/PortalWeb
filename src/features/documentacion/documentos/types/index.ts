export interface Documento {
  tipo: string;
  numero: string;
  placa: string;
  entidad_empresa: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: string;
  detalles?: {
    inspection_result?: string;
    resultado_inspeccion?: string;
    cobertura?: string;
    clase_vehiculo?: string;
  };
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  offset: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
}

// Tipos simplificados para la API V2
export interface DocumentoV2 {
  id: number;
  type: 'INSURANCE' | 'TECHNICALREVIEW';
  policyNumber?: string; // Para seguros
  reviewId?: string; // Para revisiones técnicas
  vehiclePlate: string;
  insuranceCompanyName?: string; // Para seguros
  certifyingCompany?: string; // Para revisiones técnicas
  issueDate: string;
  startDate?: string; // Para seguros
  expirationDate: string;
  status: string;
  inspectionResult?: string; // Para revisiones técnicas
  coverage?: string; // Para seguros
  vehicleClass?: string; // Para revisiones técnicas
  createdAt: string;
}

export interface AppliedFilters {
  type: string;
  search: string | null;
}

export interface SortingInfo {
  sortBy: string;
  sortOrder: string;
}

export interface DocumentosResponse {
  documents: Documento[];
  pagination: PaginationData;
  appliedFilters?: AppliedFilters;
  sorting?: SortingInfo;
}

// Tipos para el endpoint específico de seguros (estructura real del backend)
export interface InsuranceDetail {
  seguro: {
    id: number;
    policyNumber: string;
    insuranceCompanyName: string;
    coverage: string;
    vehiclePlate: string;
  };
  vehiculo: {
    placa: string;
    marca: string;
    modelo: string;
    año: number;
    vehicleInfo: string;
    tipo: {
      categoria: string;
      descripcion: string;
    };
  };
  propietario: {
    nombreCompleto: string;
    dni: string;
    telefono: string;
    email: string;
  };
  fechas: {
    inicio: string;
    vencimiento: string;
    diasRestantes: number;
  };
  estado: {
    codigo: string;
    descripcion: string;
    color: string;
    icon: string;
  };
}

// Tipos para el endpoint específico de revisiones técnicas (estructura real del backend)
export interface TechnicalReviewDetail {
  revision: {
    reviewId: string;
    vehiclePlate: string;
    inspectionResult: string;
    certifyingCompany: string;
  };
  vehiculo: {
    placa: string;
    marca: string;
    modelo: string;
    año: number;
    vehicleInfo: string;
    tipo: {
      categoria: string;
      descripcion: string;
    };
  };
  fechas: {
    emision: string;
    vencimiento: string;
    diasRestantes: number;
  };
  estado: {
    codigo: string;
    descripcion: string;
    color: string;
    icon: string;
  };
}