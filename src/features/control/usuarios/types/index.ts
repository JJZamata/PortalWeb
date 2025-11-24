export interface Usuario {
  id: number;
  usuario: string;
  email: string;
  rol: string;
  estado: string;
  ultimo_acceso: string;
  dispositivo: string;
}

export interface UsuarioDetallado extends Usuario {
  isActive: boolean;
  roles: Array<{ id: number; name: string }>;
  lastLogin: string;
  lastLoginIp: string;
  lastLoginDevice: string;
  deviceConfigured: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface EstadisticasUsuarios {
  total_usuarios: number;
  usuarios_activos: number;
  total_admins: number;
  total_fiscalizadores: number;
}

export interface AddUserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}
