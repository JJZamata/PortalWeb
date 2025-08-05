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
  current_page: number;
  total_pages: number;
  total_records: number;
  has_next: boolean;
  has_previous: boolean;
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
