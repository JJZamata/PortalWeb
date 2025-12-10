import axiosInstance from '@/lib/axios';

// Función reutilizable para manejo de errores específicos
const handleApiError = (error: any) => {
  const apiData = error.response?.data;

  // Caso con lista de errores detallados
  if (apiData?.errors && Array.isArray(apiData.errors)) {
    const firstError = apiData.errors[0];
    const enhancedError = new Error(firstError.message || apiData.message || 'Error de validación');
    (enhancedError as any).field = firstError.field;
    (enhancedError as any).value = firstError.value;
    (enhancedError as any).details = apiData.errors;
    throw enhancedError;
  }

  // Caso con mensaje simple del backend
  if (apiData?.message) {
    const enhancedError = new Error(apiData.message);
    (enhancedError as any).details = apiData;
    throw enhancedError;
  }

  throw error;
};

export const conductoresService = {
  // Listado con búsqueda y paginación
  getConductores: async (page: number, searchTerm: string = '') => {
    try {
      const SEARCH_MIN_LENGTH = 2;
      const params = new URLSearchParams();
      params.append('page', page.toString());

      if (searchTerm && searchTerm.length >= SEARCH_MIN_LENGTH) {
        params.append('search', searchTerm);
      }

      const response = await axiosInstance.get(`/drivers/list?${params.toString()}`);

      if (response.data.success) {
        const conductores = response.data.data.data || [];

        const conductoresTransformados = conductores.map((c: any) => ({
          dni: c.identificacion?.dni ?? '',
          nombreCompleto: c.datosPersonales?.nombreCompleto ?? '',
          telefono: c.datosPersonales?.phoneNumber ?? '',
          direccion: c.datosPersonales?.address ?? '',
          // Campos normalizados para la tabla
          phoneNumber: c.datosPersonales?.phoneNumber ?? '',
          address: c.datosPersonales?.address ?? '',
          firstName: c.datosPersonales?.firstName ?? '',
          lastName: c.datosPersonales?.lastName ?? '',
          photoUrl: c.photoUrl ?? '',
          estado: c.estado ?? '',
          fechas: c.fechas ?? null
        }));

        return {
          conductores: conductoresTransformados,
          summary: response.data.data.summary ?? null,
          pagination: response.data.data.pagination ?? null
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      throw error;
    }
  },

  // Compatibilidad legacy
  searchConductores: async (query: string, page: number = 1) => {
    return conductoresService.getConductores(page, query);
  },


  // Detalle de un conductor
  getConductorDetail: async (dni: string) => {
    try {
      const response = await axiosInstance.get(`/drivers/${dni}`);
      if (response.data.success) return response.data.data;
      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      throw error;
    }
  },

  // Crear conductor
  addConductor: async (data: any) => {
    try {
      // El backend valida campos planos; evitamos anidar para que no rechace los campos
      const payload: any = {
        dni: data.dni ?? '',
        tipoDocumento: 'DNI',
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        nombreCompleto: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
        phoneNumber: data.phoneNumber ?? data.telefono ?? '',
        address: data.address ?? data.direccion ?? '',
        estado: data.estado ?? 'ACTIVO'
      };

      // Solo incluir photoUrl si viene, para no disparar la validación de URL con vacío
      if (data.photoUrl) {
        payload.photoUrl = data.photoUrl;
      }

      const response = await axiosInstance.post('/drivers/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  // Actualizar conductor
  updateConductor: async (dni: string, data: any) => {
    try {
      const payload: any = {};

      // Solo incluir campos presentes para permitir actualizaciones parciales
      if (data.firstName) payload.firstName = data.firstName;
      if (data.lastName) payload.lastName = data.lastName;
      if (data.firstName || data.lastName) {
        payload.nombreCompleto = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();
      }
      if (data.phoneNumber ?? data.telefono) payload.phoneNumber = data.phoneNumber ?? data.telefono;
      if (data.address ?? data.direccion) payload.address = data.address ?? data.direccion;
      if (data.photoUrl) payload.photoUrl = data.photoUrl;
      if (data.estado) payload.estado = data.estado;

      if (Object.keys(payload).length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      const response = await axiosInstance.put(`/drivers/${dni}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  // Eliminar conductor
  deleteConductor: async (dni: string) => {
    try {
      const response = await axiosInstance.delete(`/drivers/${dni}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  // Estadísticas de conductores
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/drivers/stats');
      return response.data.message;
    } catch (error) {
      throw error;
    }
  }
};
