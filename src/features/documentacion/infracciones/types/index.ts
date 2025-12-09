// Tipos base basados en la estructura real de la API
export type ViolationSeverity = 'very_serious' | 'serious' | 'minor';
export type ViolationTarget = 'driver-owner' | 'company';

// Estructura de identificación
export interface Identificacion {
  id: number;
  codigo: string;
}

// Estructura de descripción
export interface Descripcion {
  texto: string;
  resumen: string;
}

// Estructura de clasificación
export interface Clasificacion {
  gravedad: ViolationSeverity;
  objetivo: ViolationTarget;
  gravedadTexto: string;
  objetivoTexto: string;
}

// Estructura de sanción
export interface Sancion {
  porcentajeUIT: string;
  medidaAdministrativa: string;
  montoReferencial: string | null;
}

// Estructura de fechas
export interface Fechas {
  creacion: string | null;
  actualizacion: string | null;
}

// Infracción completa según la API
export interface Violation {
  identificacion: Identificacion;
  descripcion: Descripcion;
  clasificacion: Clasificacion;
  sancion: Sancion;
  fechas?: Fechas; // Opcional porque no siempre viene en listas
}

// Estructura de paginación según la API
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

// Meta información de filtros aplicados
export interface AppliedFilters {
  search: string | null;
  severity: string | null;
  target: string | null;
}

// Meta información de ordenamiento
export interface Sorting {
  sortBy: string;
  sortOrder: string;
}

// Meta información completa
export interface Meta {
  appliedFilters: AppliedFilters;
  sorting: Sorting;
}

// Respuesta de listado de infracciones
export interface ViolationsListResponse {
  success: boolean;
  data: {
    data: Violation[];
    pagination: PaginationData;
  };
  message: string;
  meta: Meta;
}

// Respuesta de infracción individual
export interface ViolationDetailResponse {
  success: boolean;
  data: Violation;
  message: string;
}

// Estadísticas - Distribución por gravedad
export interface DistribucionPorGravedad {
  muyGraves: number;
  graves: number;
  leves: number;
}

// Estadísticas - Distribución por objetivo
export interface DistribucionPorObjetivo {
  conductorPropietario: number;
  empresa: number;
}

// Estadísticas - Porcentajes por gravedad
export interface PorcentajesGravedad {
  muyGraves: number;
  graves: number;
  leves: number;
}

// Estadísticas - Porcentajes por objetivo
export interface PorcentajesObjetivo {
  conductorPropietario: number;
  empresa: number;
}

// Resumen general de estadísticas
export interface ResumenGeneral {
  totalViolaciones: number;
  distribucionPorGravedad: DistribucionPorGravedad;
  distribucionPorObjetivo: DistribucionPorObjetivo;
}

// Estadísticas completas
export interface Stats {
  resumenGeneral: ResumenGeneral;
  porcentajes: {
    porGravedad: PorcentajesGravedad;
    porObjetivo: PorcentajesObjetivo;
  };
}

// Respuesta de estadísticas
export interface StatsResponse {
  success: boolean;
  data: Stats;
  message: string;
}

// Tipos para creación/actualización de infracciones
export interface CreateViolationRequest {
  code: string;
  description: string;
  severity: ViolationSeverity;
  uitPercentage: number;
  target: ViolationTarget;
  administrativeMeasure: string;
}

// Tipos para parámetros de consulta
export interface ViolationsListParams {
  page?: number;
  limit?: number;
  search?: string;
  severity?: ViolationSeverity;
  target?: ViolationTarget;
  sortBy?: 'code' | 'description' | 'severity' | 'uitPercentage' | 'target' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Tipos de errores de la API
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    message: string;
    value?: any;
    location?: string;
    field?: string;
  }>;
  code?: string;
  details?: any;
}

// Para compatibilidad con código existente (deprecated)
export interface ViolationLegacy {
  id: number;
  code: string;
  description: string;
  severity: ViolationSeverity;
  administrativeMeasure: string;
  target: ViolationTarget;
  uitPercentage: string;
}