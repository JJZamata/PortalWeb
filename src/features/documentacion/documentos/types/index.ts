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
  current_page: number;
  total_pages: number;
  total_records: number;
  records_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}