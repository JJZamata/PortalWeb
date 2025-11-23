import axiosInstance from '@/lib/axios';
import type {
  ViolationsListResponse,
  ViolationDetailResponse,
  StatsResponse,
  CreateViolationRequest,
  ViolationsListParams,
  ApiError
} from '../types';

export const infraccionesService = {
  /**
   * Obtener listado de infracciones con paginación y filtros
   */
  getInfracciones: async (params: ViolationsListParams = {}): Promise<ViolationsListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      // Agregar parámetros solo si tienen valor
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search && params.search.length >= 2) searchParams.append('search', params.search);
      if (params.severity) searchParams.append('severity', params.severity);
      if (params.target) searchParams.append('target', params.target);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const queryString = searchParams.toString();
      const url = `/violations/list${queryString ? `?${queryString}` : ''}`;

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || {
        success: false,
        message: error.message || 'Error desconocido al obtener infracciones'
      };
      throw apiError;
    }
  },

  /**
   * Obtener detalle de una infracción por código
   */
  getInfraccionDetail: async (code: string): Promise<ViolationDetailResponse> => {
    try {
      const response = await axiosInstance.get(`/violations/${encodeURIComponent(code)}`);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || {
        success: false,
        message: error.message || 'Error desconocido al obtener detalle de infracción'
      };
      throw apiError;
    }
  },

  /**
   * Obtener estadísticas de infracciones
   */
  getStats: async (): Promise<StatsResponse> => {
    try {
      const response = await axiosInstance.get('/violations/stats');
      return response.data;
    } catch (error: any) {
      // Retornar estructura vacía en caso de error
      return {
        success: true,
        data: {
          resumenGeneral: {
            totalViolaciones: 0,
            distribucionPorGravedad: {
              muyGraves: 0,
              graves: 0,
              leves: 0
            },
            distribucionPorObjetivo: {
              conductorPropietario: 0,
              empresa: 0
            }
          },
          porcentajes: {
            porGravedad: {
              muyGraves: 0,
              graves: 0,
              leves: 0
            },
            porObjetivo: {
              conductorPropietario: 0,
              empresa: 0
            }
          }
        },
        message: 'Estadísticas no disponibles'
      };
    }
  },

  /**
   * Crear una nueva infracción
   */
  createInfraccion: async (data: CreateViolationRequest): Promise<ViolationDetailResponse> => {
    try {
      const response = await axiosInstance.post('/violations', data);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || {
        success: false,
        message: error.message || 'Error desconocido al crear infracción'
      };
      throw apiError;
    }
  },

  /**
   * Actualizar una infracción existente
   */
  updateInfraccion: async (code: string, data: Partial<CreateViolationRequest>): Promise<ViolationDetailResponse> => {
    try {
      const response = await axiosInstance.put(`/violations/${encodeURIComponent(code)}`, data);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || {
        success: false,
        message: error.message || 'Error desconocido al actualizar infracción'
      };
      throw apiError;
    }
  },

  /**
   * Eliminar una infracción
   */
  deleteInfraccion: async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.delete(`/violations/${encodeURIComponent(code)}`);
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = error.response?.data || {
        success: false,
        message: error.message || 'Error desconocido al eliminar infracción'
      };
      throw apiError;
    }
  },
};

// Métodos de compatibilidad con código existente (deprecated)
export const infraccionesServiceLegacy = {
  getInfracciones: async (page: number, limit: number, severity: string, searchTerm: string, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    const params: ViolationsListParams = {
      page,
      limit,
      search: searchTerm.length >= 2 ? searchTerm : undefined,
      severity: severity !== 'ALL' ? severity as any : undefined,
      sortBy: sortBy as any || 'code',
      sortOrder: (sortOrder?.toUpperCase() as any) || 'ASC'
    };

    const response = await infraccionesService.getInfracciones(params);
    return response.data;
  },

  getInfraccionDetail: async (code: string) => {
    const response = await infraccionesService.getInfraccionDetail(code);
    return response.data;
  },

  getStats: async () => {
    const response = await infraccionesService.getStats();
    return response.data;
  },
};