export interface Empresa {
  ruc: string;
  nombre: string;
  direccion: string;
  nro_resolucion: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  entidad_emisora: string;
  estado: string;
  vehiculos_asociados: number;
}

export interface EmpresaDetallada {
  ruc: string;
  name: string;
  address: string;
  legalRepresentative?: string;
  rucStatus: string;
  registrationDate: string;
  expirationDate: string;
  rucUpdateDate?: string | null;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  email?: string;
  vehicles: Array<{
    plateNumber: string;
    vehicleStatus: string;
    brand: string;
    model: string;
    manufacturingYear: number;
  }>;
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

export interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
  lowProvCompanies: number;
  totalVehicles: number;
  companiesWithVehicles: number;
}