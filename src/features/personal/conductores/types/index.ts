export interface Conductor {
    dni: string;
    nombreCompleto: string;
    telefono: string;
    direccion: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    photoUrl?: string;
  }
  
  export interface Licencia {
    licenseId: string;
    licenseNumber: string;
    category: string;
    issueDate: string;
    expirationDate: string;
    issuingEntity: string;
    restrictions: string;
    estado: string;
    diasParaVencimiento: number;
    fechaCreacion: string;
    ultimaActualizacion: string;
  }
  
  export interface LicenciasSummary {
    total: number;
    vigentes: number;
    porVencer: number;
    vencidas: number;
  }
  
  export interface ConductorDetalladoNuevo {
    dni: string;
    nombreCompleto: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    photoUrl: string;
    fechaRegistro: string;
    ultimaActualizacion: string;
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
  
  export interface SummaryData {
    total: number;
    conTelefono: number;
    sinTelefono: number;
    conDireccion: number;
    sinDireccion: number;
  }