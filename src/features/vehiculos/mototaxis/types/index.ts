export interface Vehiculo {
  placa: {
    plateNumber: string;
    companyRuc: string;
  };
  propietario: {
    dni: string;
    nombreCompleto: string;
    nombres?: string;
    apellidos?: string;
  };
  empresa: {
    nombre: string;
    ruc: string;
    estado: string;
  };
  tipo: {
    id: number;
    categoria: string;
    marca: string;
    modelo: string;
    año: number;
    vehicleInfo: string;
  };
  estado: string;
  placa_v: string;
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
  totalVehicles: number;
  byStatus: { [key: string]: number };
  byType?: { [key: string]: number };
  byBrand?: { [key: string]: number };
  byYear?: { [key: string]: number };
  dateRange: {
    from: string | null;
    to: string | null;
  };
  groupBy: string;
}