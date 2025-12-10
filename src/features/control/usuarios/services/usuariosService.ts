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

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (search && search.trim().length >= 2) {
        queryParams.append('search', search.trim());
      }

      if (status) {
        queryParams.append('status', status);
      }

      if (role) {
        queryParams.append('role', role);
      }

      if (deviceConfigured !== undefined) {
        queryParams.append('deviceConfigured', deviceConfigured.toString());
      }

      const response = await axiosInstance.get<UsuariosApiResponse>(`/users?${queryParams.toString()}`);
      return response.data;
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
