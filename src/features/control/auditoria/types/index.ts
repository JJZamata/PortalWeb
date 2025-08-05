export interface AuditLog {
  id: number;
  table_name: string;
  operation: string;
  record_id: string;
  old_values: any;
  new_values: any;
  user_id: number;
  username: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_records: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface EstadisticasAuditoria {
  total_registros: number;
  total_inserts: number;
  total_updates: number;
  total_deletes: number;
  tablas_afectadas: number;
  usuarios_activos: number;
}
