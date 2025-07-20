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
  legalRepresentative: string;
  rucStatus: string;
  registrationDate: string;
  expirationDate: string;
  phone: string;
  email: string;
  vehicles: any[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
  lowProvCompanies: number;
  totalVehicles: number;
  companiesWithVehicles: number;
}