import axiosInstance from '@/lib/axios';
import {
  TUCListResponse,
  TUCDetailResponse,
  CreateTUCPayload,
  UpdateTUCPayload,
  TUCFilters,
  TUCData,
} from '../types';

const tucService = {
  /**
   * Obtener listado paginado de TUCs
   */
  getTUCs: async (filters: TUCFilters = {}): Promise<TUCListResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    try {
      const response = await axiosInstance.get(`/tucs?${params.toString()}`);
      
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al obtener TUCs');
    } catch (error: any) {
      // Retornar estructura vacía en caso de error
      if (error.response?.status === 404) {
        return {
          success: true,
          data: {
            data: [],
            pagination: {
              currentPage: 1,
              limit: 10,
              totalItems: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
          message: 'No hay TUCs registradas',
          meta: {
            appliedFilters: filters,
            sorting: {},
          },
        };
      }
      throw error;
    }
  },

  /**
   * Obtener TUC por número
   */
  getTUCByNumber: async (tucNumber: string): Promise<TUCDetailResponse> => {
    try {
      const response = await axiosInstance.get(`/tucs/${tucNumber}`);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al obtener TUC');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener TUC por placa de vehículo
   */
  getTUCByPlate: async (plateNumber: string): Promise<TUCDetailResponse> => {
    try {
      const response = await axiosInstance.get(`/tucs/by-vehicle/${plateNumber}`);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al obtener TUC');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear TUC
   */
  createTUC: async (payload: CreateTUCPayload): Promise<any> => {
    try {
      const response = await axiosInstance.post('/tucs', payload);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al crear TUC');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar TUC (PUT - actualización completa)
   */
  updateTUC: async (tucNumber: string, payload: UpdateTUCPayload): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/tucs/${tucNumber}`, payload);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al actualizar TUC');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar TUC (PATCH - actualización parcial)
   */
  patchTUC: async (tucNumber: string, payload: Partial<UpdateTUCPayload>): Promise<any> => {
    try {
      const response = await axiosInstance.patch(`/tucs/${tucNumber}`, payload);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al actualizar TUC');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar TUC
   */
  deleteTUC: async (tucNumber: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/tucs/${tucNumber}`);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al eliminar TUC');
    } catch (error) {
      throw error;
    }
  },
};

export default tucService;
