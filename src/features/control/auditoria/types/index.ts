export interface AuditLog {
  id: number;
  correlation?: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  durationMs: number;
  ip: string;
  userAgent?: string;
  user?: {
    id: number;
    username: string;
    email?: string;
  };
  // Campos heredados (para compatibilidad)
  table_name?: string;
  operation?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  user_id?: number;
  username?: string;
  ip_address?: string;
  user_agent?: string;
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

export interface EstadisticasAuditoria {
  total_registros: number;
  total_inserts: number;
  total_updates: number;
  total_deletes: number;
  tablas_afectadas: number;
  usuarios_activos: number;
}
