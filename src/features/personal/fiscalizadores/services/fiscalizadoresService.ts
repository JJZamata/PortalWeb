import axiosInstance from '@/lib/axios';
import {
  FiscalizadoresApiResponse,
  FiscalizadorDetailResponse,
  CreateFiscalizadorRequest,
  ApiError
} from '../types';

export const fiscalizadoresService = {

  // ✅ LISTAR
  getFiscalizadores: async (page: number = 1): Promise<FiscalizadoresApiResponse> => {
    try {
      const response = await axiosInstance.get<FiscalizadoresApiResponse>(
        `/users?page=${page}`
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Error al cargar fiscalizadores');
    }
  },

  // ✅ DETALLE
  getFiscalizadorDetail: async (id: number): Promise<FiscalizadorDetailResponse> => {
    try {
      const response = await axiosInstance.get<FiscalizadorDetailResponse>(
        `/users/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Error al obtener detalle');
    }
  },

  // ✅ CREAR (ARREGLADO)
  createFiscalizador: async (payload: CreateFiscalizadorRequest) => {
    try {
      validateCreatePayload(payload);
      const response = await axiosInstance.post('/users', payload);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Error al crear fiscalizador');
    }
  },

  // ✅ ACTUALIZAR
  updateFiscalizador: async (
    id: number,
    payload: Partial<{ username: string; email: string; isActive: boolean }>
  ) => {
    try {
      if (!id) throw new Error('ID es obligatorio');
      if (Object.keys(payload).length === 0) {
        throw { success: false, message: 'No hay campos para actualizar' };
      }

      const response = await axiosInstance.put(`/users/${id}`, payload);
      return response.data;

    } catch (error: any) {
      throw handleApiError(error, 'Error al actualizar fiscalizador');
    }
  },

  // ✅ DESACTIVAR
  deactivateFiscalizador: async (id: number) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, { isActive: false });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Error al desactivar fiscalizador');
    }
  },

  // ✅ ACTIVAR
  activateFiscalizador: async (id: number) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, { isActive: true });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Error al activar fiscalizador');
    }
  },

  // ✅ ELIMINAR LÓGICO
  deleteFiscalizador: async (id: number) => {
    return fiscalizadoresService.deactivateFiscalizador(id);
  },

  // ✅ BUSCAR
  searchFiscalizadores: async (
    search: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const response = await axiosInstance.get(
        `/users?search=${search}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'Error al buscar fiscalizadores');
    }
  }
};

// =======================
// Helpers
// =======================

function validateCreatePayload(payload: CreateFiscalizadorRequest) {
  if (!payload.username || payload.username.trim().length < 3) {
    throw { success: false, message: 'Username inválido' };
  }
  if (!payload.email || !payload.email.includes('@')) {
    throw { success: false, message: 'Email inválido' };
  }
  if (!payload.password || payload.password.length < 6) {
    throw { success: false, message: 'Contraseña muy corta' };
  }
}

function handleApiError(error: any, defaultMessage: string): ApiError {
  if (error.response?.data) {
    return error.response.data;
  }

  return {
    success: false,
    message: defaultMessage,
    errors: [
      { message: error.message || 'Error desconocido' }
    ]
  };
}
