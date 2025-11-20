import axiosInstance from '@/lib/axios';

// Función reutilizable para manejo de errores específicos
const handleApiError = (error: any) => {
  // Mejorar manejo de errores con estructura específica
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const firstError = error.response.data.errors[0];
    const enhancedError = new Error(firstError.message || 'Error de validación');
    (enhancedError as any).field = firstError.field;
    (enhancedError as any).value = firstError.value;
    (enhancedError as any).details = error.response.data.errors;
    throw enhancedError;
  }
  throw error;
};

export const conductoresService = {
  // Método principal unificado que maneja búsqueda y paginación
  getConductores: async (page: number, searchTerm: string = '') => {
    try {
      // Validaciones según backend FISCAMOTO para drivers
      const SEARCH_MIN_LENGTH = 2;  // Diferente a empresas (que usa 3)

      // Construir parámetros query según documentación
      const params = new URLSearchParams();
      params.append('page', page.toString());

      const hasSearch = searchTerm && searchTerm.length >= SEARCH_MIN_LENGTH;

      // Agregar parámetro de búsqueda si aplica
      if (hasSearch) {
        params.append('search', searchTerm);
      }

      // Usar endpoint único /drivers/list con parámetros query
      const response = await axiosInstance.get(`/drivers/list?${params.toString()}`);

      if (response.data.success) {
        // Acceder a estructura real: data.data (como en empresas)
        const conductores = response.data.data.data || [];

        // Transform conductores para mantener compatibilidad con tipos existentes
        const conductoresTransformados = conductores.map((conductor: any) => ({
          dni: conductor.identificacion?.dni || '',
          nombreCompleto: conductor.datosPersonales?.nombreCompleto || '',
          telefono: conductor.datosPersonales?.phoneNumber || '',
          direccion: conductor.datosPersonales?.address || '',
          firstName: conductor.datosPersonales?.firstName || '',
          lastName: conductor.datosPersonales?.lastName || '',
          phoneNumber: conductor.datosPersonales?.phoneNumber || '',
          address: conductor.datosPersonales?.address || '',
          photoUrl: conductor.photoUrl || '',
          estado: conductor.estado || '',
          fechas: conductor.fechas || null
        }));

        return {
          conductores: conductoresTransformados,
          summary: response.data.data.summary || null,
          pagination: response.data.data.pagination || null
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en conductoresService.getConductores:', error);
      throw error;
    }
  },

  // Método legado para compatibilidad (deprecado)
  searchConductores: async (query: string, page: number = 1) => {
    // Redirigir al método principal unificado
    return this.getConductores(page, query);
  },

  getConductorDetail: async (dni: string) => {
    try {
      const response = await axiosInstance.get(`/drivers/${dni}`);

      if (response.data.success) {
        return response.data.data;  // Mantener estructura para detalles
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en conductoresService.getConductorDetail:', error);
      throw error;
    }
  },

  addConductor: async (data: any) => {
    try {
      const response = await axiosInstance.post('/drivers/', data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  updateConductor: async (dni: string, data: any) => {
    try {
      const response = await axiosInstance.put(`/drivers/${dni}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  deleteConductor: async (dni: string) => {
    try {
      const response = await axiosInstance.delete(`/drivers/${dni}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  getStats: async () => {
    try {
      const response = await axiosInstance.get('/drivers/stats');
      // Backend devuelve estructura: data.message.{estadísticas}
      return response.data.message;
    } catch (error) {
      console.error('Error en conductoresService.getStats:', error);
      throw error;
    }
  },
};