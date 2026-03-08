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
      const UI_PAGE_SIZE = 6;
      const MAX_BACKEND_PAGES_TO_SCAN = 30;

      const safePage = Math.max(1, Number(page || 1));

      const hasSearch = searchTerm && searchTerm.length >= SEARCH_MIN_LENGTH;
      const hasValidType = recordType && VALID_TYPES.includes(recordType);
      const hasValidSort = sortBy && SORT_FIELDS.includes(sortBy);

      const transformRecord = (record: any) => ({
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
      });

      const fetchBackendPage = async (backendPage: number) => {
        const params = new URLSearchParams();
        params.append('page', String(backendPage));
        params.append('limit', String(UI_PAGE_SIZE));

        if (hasSearch) params.append('search', searchTerm);
        if (hasValidType && recordType !== 'all') params.append('type', recordType);
        if (hasValidSort) {
          params.append('sortBy', sortBy);
          params.append('sortOrder', sortOrder);
        }

        const response = await axiosInstance.get(`/records?${params.toString()}`);
        if (!response.data.success) {
          throw new Error('Error en la respuesta del servidor');
        }

        const payload = response.data.data || {};
        return {
          rows: Array.isArray(payload.data) ? payload.data.map(transformRecord) : [],
          pagination: payload.pagination || {},
          summary: payload.summary || null,
        };
      };

      const visibleRecordsNeeded = safePage * UI_PAGE_SIZE;
      const collectedRecords: any[] = [];
      let backendPage = 1;
      let scannedPages = 0;
      let hasNextBackendPage = true;
      let lastPagination: any = {};
      let lastSummary: any = null;

      while (
        hasNextBackendPage &&
        scannedPages < MAX_BACKEND_PAGES_TO_SCAN &&
        collectedRecords.length < visibleRecordsNeeded
      ) {
        const backendResult = await fetchBackendPage(backendPage);
        collectedRecords.push(...backendResult.rows);
        lastPagination = backendResult.pagination;
        lastSummary = backendResult.summary;

        hasNextBackendPage = Boolean(
          backendResult.pagination?.hasNextPage ?? backendResult.pagination?.has_next ?? false
        );
        backendPage += 1;
        scannedPages += 1;
      }

      const startIndex = (safePage - 1) * UI_PAGE_SIZE;
      const endIndex = startIndex + UI_PAGE_SIZE;
      const pageRecords = collectedRecords.slice(startIndex, endIndex);
      const hasNextVisiblePage = collectedRecords.length > endIndex || hasNextBackendPage;
      const backendTotalItems = Number(lastPagination?.totalItems || lastPagination?.total_items || 0);
      const estimatedTotalItems = hasNextBackendPage
        ? Math.max(backendTotalItems, endIndex + 1)
        : Math.max(backendTotalItems, collectedRecords.length);

      return {
        records: pageRecords,
        pagination: {
          currentPage: safePage,
          totalPages: Math.max(1, Math.ceil(estimatedTotalItems / UI_PAGE_SIZE)),
          totalItems: Math.max(estimatedTotalItems, pageRecords.length),
          itemsPerPage: UI_PAGE_SIZE,
          hasNextPage: hasNextVisiblePage,
          hasPreviousPage: safePage > 1,
          nextPage: hasNextVisiblePage ? safePage + 1 : null,
          prevPage: safePage > 1 ? safePage - 1 : null,
        },
        summary: lastSummary,
      };
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