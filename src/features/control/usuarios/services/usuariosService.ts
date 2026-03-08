import axiosInstance from '@/lib/axios';
import {
  Usuario,
  UsuarioDetallado,
  AddUserFormData,
  UsuariosQueryParams,
  UsuariosApiResponse,
  UsuarioDetailResponse,
  UsuarioStatsParams,
  UsuarioStatsResponse,
  CreateUserRequest,
  CreateUserResponse,
  CreateUserError,
  DeleteUserResponse,
  DeleteUserError,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserError,
  EditUserFormData,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdatePasswordError,
  ResetDeviceResponse,
  ResetDeviceError,
  ChangePasswordFormData
} from '../types';

const normalizeRoleValue = (value: string) => value.toLowerCase().replace(/[\s_-]/g, '');

const roleAliases: Record<string, string[]> = {
  admin: ['admin'],
  fiscalizador: ['fiscalizador'],
  dispositivogps: ['dispositivogps', 'dispositivo_gps', 'dispositivo gps', 'dispositivogps', 'gpsdevice', 'gps_device']
};

const getNormalizedRoleAliases = (role: string) => {
  const normalizedRole = normalizeRoleValue(role);
  const aliases = roleAliases[normalizedRole] ?? [normalizedRole];
  return aliases.map((alias) => normalizeRoleValue(alias));
};

const userHasRole = (rolesValue: string, targetRole: string) => {
  if (!rolesValue) return false;

  const targetAliases = getNormalizedRoleAliases(targetRole);
  const userRoles = rolesValue
    .split(',')
    .map((role) => normalizeRoleValue(role.trim()))
    .filter(Boolean);

  return userRoles.some((userRole) => targetAliases.includes(userRole));
};

export const usuariosService = {
  getUsuarios: async (params: UsuariosQueryParams = {}) => {
    try {
      const {
        page = 1,
        limit = 6,
        search,
        status,
        role,
        deviceConfigured,
        sortBy = 'id',
        sortOrder = 'ASC'
      } = params;

      const buildQueryString = ({
        roleValue,
        pageValue,
        limitValue
      }: {
        roleValue?: string;
        pageValue?: number;
        limitValue?: number;
      } = {}) => {
        const queryParams = new URLSearchParams({
          page: (pageValue ?? page).toString(),
          limit: (limitValue ?? limit).toString(),
          sortBy,
          sortOrder
        });

        if (search && search.trim().length >= 2) {
          queryParams.append('search', search.trim());
        }

        if (status) {
          queryParams.append('status', status);
        }

        if (roleValue) {
          queryParams.append('role', roleValue);
        }

        if (deviceConfigured !== undefined) {
          queryParams.append('deviceConfigured', deviceConfigured.toString());
        }

        return queryParams.toString();
      };

      const queryString = buildQueryString({ roleValue: role });
      const response = await axiosInstance.get<UsuariosApiResponse>(`/users?${queryString}`);
      let finalResponse = response;

      // Compatibilidad con distintos nombres de rol GPS del backend.
      if (role === 'dispositivoGPS' && (response.data?.data?.pagination?.totalItems ?? 0) === 0) {
        const fallbackRoles = ['dispositivoGps', 'dispositivo_gps', 'gps_device'];

        for (const fallbackRole of fallbackRoles) {
          const fallbackQueryString = buildQueryString({ roleValue: fallbackRole });
          const fallbackResponse = await axiosInstance.get<UsuariosApiResponse>(`/users?${fallbackQueryString}`);

          if ((fallbackResponse.data?.data?.pagination?.totalItems ?? 0) > 0) {
            finalResponse = fallbackResponse;
            break;
          }
        }
      }

      if (role) {
        const users = finalResponse.data?.data?.data ?? [];
        const serverAppliedRoleFilter = users.every((user) => userHasRole(user.rol, role));

        if (!serverAppliedRoleFilter) {
          const SCAN_PAGE_SIZE = 100;
          const MAX_SCAN_PAGES = 30;
          const collectedUsers: Usuario[] = [];
          let scanPage = 1;

          while (scanPage <= MAX_SCAN_PAGES) {
            const scanQueryString = buildQueryString({
              pageValue: scanPage,
              limitValue: SCAN_PAGE_SIZE
            });
            const scanResponse = await axiosInstance.get<UsuariosApiResponse>(`/users?${scanQueryString}`);
            const pageUsers = scanResponse.data?.data?.data ?? [];
            collectedUsers.push(...pageUsers);

            const hasNextPage = scanResponse.data?.data?.pagination?.hasNextPage ?? false;
            if (!hasNextPage) {
              break;
            }

            scanPage += 1;
          }

          const filteredUsers = collectedUsers.filter((user) => userHasRole(user.rol, role));
          const pageStart = (page - 1) * limit;
          const paginatedUsers = filteredUsers.slice(pageStart, pageStart + limit);
          const totalItems = filteredUsers.length;
          const totalPages = Math.max(1, Math.ceil(totalItems / limit));

          return {
            ...finalResponse.data,
            data: {
              ...finalResponse.data.data,
              data: paginatedUsers,
              pagination: {
                ...finalResponse.data.data.pagination,
                currentPage: page,
                itemsPerPage: limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
              }
            },
            meta: {
              ...finalResponse.data.meta,
              appliedFilters: {
                ...finalResponse.data.meta.appliedFilters,
                role
              }
            }
          };
        }
      }

      return finalResponse.data;
    } catch (error) {
      throw error;
    }
  },

  getUsuarioDetail: async (id: number) => {
    try {
      const response = await axiosInstance.get<UsuarioDetailResponse>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addUsuario: async (formData: AddUserFormData): Promise<CreateUserResponse> => {
    try {
      const payload: CreateUserRequest = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        roles: formData.roles,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        platform: 'web'
      };

      const response = await axiosInstance.post<CreateUserResponse>('/users', payload);
      return response.data;
    } catch (error: any) {
      // Si el error tiene la estructura esperada de la API, lanzarlo como está
      if (error.response?.data) {
        const errorData = error.response.data as CreateUserError;
        throw errorData;
      }

      // Si es un error de red u otro tipo, lanzar un error genérico
      throw {
        success: false,
        message: 'Error de conexión al crear el usuario',
        errors: [{
          field: 'network',
          message: error.message || 'Error desconocido',
          value: null,
          location: 'network'
        }]
      } as CreateUserError;
    }
  },

  updateUsuario: async (id: number, formData: EditUserFormData): Promise<UpdateUserResponse> => {
    try {
      // Preparar payload solo con los campos permitidos
      const payload: UpdateUserRequest = {};

      // Solo incluir campos si están definidos en formData
      if (formData.email !== undefined && formData.email !== '') {
        payload.email = formData.email.trim().toLowerCase();
      }

      if (formData.isActive !== undefined) {
        payload.isActive = formData.isActive;
      }

      // Si no hay campos para actualizar, lanzar error
      if (Object.keys(payload).length === 0) {
        throw {
          success: false,
          message: 'No se proporcionaron campos para actualizar',
          errors: [{
            message: 'Debe proporcionar al menos un campo para actualizar (email o isActive)',
            value: null,
            location: 'body'
          }]
        } as UpdateUserError;
      }

      const response = await axiosInstance.put<UpdateUserResponse>(`/users/${id}`, payload);
      return response.data;
    } catch (error: any) {
      // Si el error tiene la estructura esperada de la API, lanzarlo como está
      if (error.response?.data) {
        const errorData = error.response.data as UpdateUserError;
        throw errorData;
      }

      // Si es un error de red u otro tipo, lanzar un error genérico
      throw {
        success: false,
        message: 'Error de conexión al actualizar el usuario',
        errors: [{
          message: error.message || 'Error desconocido',
          value: null,
          location: 'network'
        }]
      } as UpdateUserError;
    }
  },

  deleteUsuario: async (id: number): Promise<DeleteUserResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteUserResponse>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      // Si el error tiene la estructura esperada de la API, lanzarlo como está
      if (error.response?.data) {
        const errorData = error.response.data as DeleteUserError;
        throw errorData;
      }

      // Si es un error de red u otro tipo, lanzar un error genérico
      throw {
        success: false,
        message: 'Error de conexión al eliminar el usuario',
        details: {
          id: id.toString()
        }
      } as DeleteUserError;
    }
  },

  searchUsuarios: async (searchTerm: string, page: number = 1, additionalFilters: Partial<UsuariosQueryParams> = {}) => {
    try {
      return await usuariosService.getUsuarios({
        page,
        search: searchTerm,
        ...additionalFilters
      });
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (id: number, newPassword: string): Promise<UpdatePasswordResponse> => {
    try {
      const payload: UpdatePasswordRequest = {
        newPassword
      };

      const response = await axiosInstance.patch<UpdatePasswordResponse>(`/users/${id}/password`, payload);
      return response.data;
    } catch (error: any) {
      // Si el error tiene la estructura esperada de la API, lanzarlo como está
      if (error.response?.data) {
        const errorData = error.response.data as UpdatePasswordError;
        throw errorData;
      }

      // Si es un error de red u otro tipo, lanzar un error genérico
      throw {
        success: false,
        message: 'Error de conexión al actualizar la contraseña',
        errors: [{
          message: error.message || 'Error desconocido',
          value: null,
          location: 'network'
        }]
      } as UpdatePasswordError;
    }
  },

  resetDevice: async (id: number): Promise<ResetDeviceResponse> => {
    try {
      const response = await axiosInstance.patch<ResetDeviceResponse>(`/users/${id}/reset-device`);
      return response.data;
    } catch (error: any) {
      // Si el error tiene la estructura esperada de la API, lanzarlo como está
      if (error.response?.data) {
        const errorData = error.response.data as ResetDeviceError;
        throw errorData;
      }

      // Si es un error de red u otro tipo, lanzar un error genérico
      throw {
        success: false,
        message: 'Error de conexión al resetear el dispositivo',
        errors: [{
          message: error.message || 'Error desconocido',
          value: null,
          location: 'network'
        }]
      } as ResetDeviceError;
    }
  },

  getUsuariosStats: async (params: UsuarioStatsParams = {}) => {
    try {
      const { groupBy = 'all' } = params;

      const queryParams = new URLSearchParams();
      if (groupBy && groupBy !== 'all') {
        queryParams.append('groupBy', groupBy);
      }

      const url = queryParams.toString() ? `/users/stats?${queryParams.toString()}` : '/users/stats';
      const response = await axiosInstance.get<UsuarioStatsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
