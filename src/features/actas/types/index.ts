export interface Record {
  id: number;
  recordType: 'conforme' | 'noconforme'; // Mantener compatibilidad
  type: 'CONFORME' | 'NOCONFORME'; // Campo principal para separación
  vehiclePlate: string;
  location: string;
  observations: string;
  inspectionDateTime: string;
  createdAt: string;
  updatedAt: string;
  inspector: {
    id: number;
    username: string;
    email: string;
  };
  driver: {
    name: string;
    dni: string;
    phone: string;
    address: string;
    licenseNumber: string;
    category: string;
  } | null;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
  } | null;
  company: {
    ruc: string;
    name: string;
    address: string;
  } | null;
  checklist: {
    seatbelt: boolean;
    cleanliness: boolean;
    tires: boolean;
    firstAidKit: boolean;
    fireExtinguisher: boolean;
    lights: boolean;
  } | null;
  photosCount: number;
  violations: Array<{
    id: number;
    code: string;
    description: string;
    severity: string;
    uitPercentage: number;
  }>;
  violationsCount: number;
}

export interface RecordDetailed extends Record {
  photos: Array<{
    id: number;
    url: string;
    coordinates: string;
    captureDate: string;
  }>;
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
  totalCompliant: number;
  totalNonCompliant: number;
  totalRecords: number;
}