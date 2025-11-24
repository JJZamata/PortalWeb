export interface Usuario {
  id: number;
  usuario: string;
  email: string;
  rol: string;
  estado: string;
  ultimo_acceso: string;
  dispositivo: string;
}

export interface UsuarioDetallado {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: Array<{ id: number; name: string }>;
  lastLogin: string;
  lastLoginIp: string;
  lastLoginDevice: string;
  deviceConfigured: boolean;
  deviceInfo?: {
    configurado: boolean;
    detalles: {
      deviceName: string;
      platform: string;
      deviceId: string;
      version: string;
      configuredAt: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsuariosApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Usuario[];
    pagination: PaginationData;
  };
  meta: {
    appliedFilters: {
      search: string | null;
      status: string | null;
      role: string | null;
      deviceConfigured: boolean | null;
    };
    sorting: {
      sortBy: string;
      sortOrder: string;
    };
  };
}

export interface UsuarioDetailResponse {
  success: boolean;
  message: string;
  data: UsuarioDetallado;
}

export interface UsuariosQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  deviceConfigured?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface EstadisticasUsuarios {
  total_usuarios: number;
  usuarios_activos: number;
  total_admins: number;
  total_fiscalizadores: number;
}

export interface UsuarioStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    groupBy: 'all' | 'role' | 'device';
    byRole?: {
      admin: number;
      fiscalizador: number;
    };
    deviceConfiguration?: {
      configured: number;
      notConfigured: number;
    };
  };
}

export interface UsuarioStatsParams {
  groupBy?: 'all' | 'role' | 'device';
}

export interface AddUserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
  isActive?: boolean;
  platform?: 'web';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
  isActive?: boolean;
  platform?: 'web';
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    requiresDeviceSetup: boolean;
    instructions: string | null;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  location?: string;
  code?: string;
  allowedPlatforms?: string[];
}

export interface CreateUserError {
  success: false;
  message: string;
  errors?: ValidationError[];
  code?: string;
}

export interface DeleteUserResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface DeleteUserError {
  success: false;
  message: string;
  code?: string;
  details?: {
    id: string;
  };
}

export interface UpdateUserRequest {
  email?: string;
  isActive?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    roles: Array<{
      id: number;
      name: string;
      user_roles: {
        createdAt: string;
        updatedAt: string;
        roleId: number;
        userId: number;
      };
    }>;
    lastLogin: string | null;
    lastLoginIp: string | null;
    lastLoginDevice: string | null;
    deviceConfigured: boolean;
    deviceInfo: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateUserError {
  success: false;
  message: string;
  errors?: Array<{
    message: string;
    value: any;
    location: string;
  }>;
  code?: string;
  details?: {
    id: string;
  };
}

export interface EditUserFormData {
  email: string;
  isActive: boolean;
}

export interface UpdatePasswordRequest {
  newPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface UpdatePasswordError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
    location: string;
  }>;
  code?: string;
}

export interface ResetDeviceResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    roles: Array<{
      id: number;
      name: string;
    }>;
    lastLogin: string | null;
    lastLoginIp: string | null;
    lastLoginDevice: string | null;
    deviceConfigured: boolean;
    deviceInfo: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ResetDeviceError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
    location: string;
  }>;
  code?: string;
}

export interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}
