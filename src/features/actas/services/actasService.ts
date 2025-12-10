import axiosInstance from '@/lib/axios';

// Función reutilizable para manejo de errores específicos
const handleApiError = (error: any) => {
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

export const actasService = {
  // Método principal unificado que maneja búsqueda, filtrado y paginación
  getActas: async (page: number, searchTerm: string = '', recordType: string = 'all', sortBy: string = 'inspectionDateTime', sortOrder: string = 'DESC') => {
    try {
      // Validaciones según backend FISCAMOTO para records
      const VALID_TYPES = ['conforme', 'noconforme', 'all'];
      const SEARCH_MIN_LENGTH = 2;
      const SORT_FIELDS = ['inspectionDateTime', 'createdAt', 'updatedAt', 'id'];

      // Construir parámetros query según documentación
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '6'); // Límite fijo según backend

      const hasSearch = searchTerm && searchTerm.length >= SEARCH_MIN_LENGTH;
      const hasValidType = recordType && VALID_TYPES.includes(recordType);
      const hasValidSort = sortBy && SORT_FIELDS.includes(sortBy);

      // Agregar parámetros si aplican
      if (hasSearch) params.append('search', searchTerm);
      if (hasValidType && recordType !== 'all') params.append('type', recordType);
      if (hasValidSort) {
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
      }

      // Usar endpoint /records con parámetros query
      const response = await axiosInstance.get(`/records?${params.toString()}`);

      if (response.data.success) {
        // Acceder a estructura real: data.data (como en otros módulos)
        const records = response.data.data.data || [];

        // Transform records para mantener compatibilidad con tipos existentes
        const recordsTransformados = records.map((record: any) => ({
          id: record.id || 0,
          recordType: record.type?.toLowerCase() || record.recordType?.toLowerCase() || 'conforme',
          type: record.type || record.recordType?.toUpperCase() || 'CONFORME', // Campo principal para separación
          vehiclePlate: record.vehiclePlate || '',
          location: record.location || '',
          observations: record.observations || '',
          inspectionDateTime: record.inspectionDateTime || '',
          createdAt: record.createdAt || '',
          updatedAt: record.updatedAt || '',
          inspector: record.inspector || null,
          driver: record.driver || null,
          // Campos adicionales que pueden venir en la respuesta completa
          vehicle: record.vehicle || null,
          company: record.company || null,
          checklist: record.checklist || null,
          photosCount: record.photosCount || 0,
          violations: record.violations || [],
          violationsCount: record.violationsCount || 0
        }));

        return {
          records: recordsTransformados,
          pagination: response.data.data.pagination || null,
          summary: response.data.data.summary || null
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      throw error;
    }
  },

  getActaDetail: async (id: number, type: 'conforme' | 'noconforme' = 'conforme') => {
    try {
      // Determinar el endpoint según el tipo de acta (Backend V2 API)
      const endpoint = type === 'conforme'
        ? `/compliant-records/${id}`
        : `/non-compliant-records/${id}`;

      const response = await axiosInstance.get(endpoint);

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      throw error;
    }
  },

  // Método para obtener estadísticas
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/records/stats');
      // Backend devuelve estructura: data.data.statusStats
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actas solo son de lectura - no se pueden crear, editar ni eliminar
  // Métodos disponibles: getActas (list), getActaDetail (detail), getStats (statistics)
};