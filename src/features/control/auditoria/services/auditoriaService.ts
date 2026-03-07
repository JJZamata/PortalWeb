import axiosInstance from '@/lib/axios';
import { AuditLog } from '../types';

const MAX_FALLBACK_PAGES = 5;

interface AuditPagination {
  current_page: number;
  total_pages: number;
  total_records: number;
  records_per_page?: number;
  has_next: boolean;
  has_previous: boolean;
}

interface AuditStatistics {
  total_logs?: number;
  error_logs?: number;
  avg_duration_ms?: number;
}

interface AuditPageData {
  logs?: AuditLog[];
  statistics?: AuditStatistics;
  pagination?: Partial<AuditPagination>;
}

export const auditoriaService = {
  getAuditLogs: async (page: number = 1, limit: number = 10, searchTerm?: string, actionFilter?: string) => {
    try {
      const buildUrl = (targetPage: number, targetLimit: number, method?: string) => {
        let url = `/audit-logs?page=${targetPage}&limit=${targetLimit}`;

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        if (method && method !== 'all') {
          url += `&method=${method}`;
        }

        return url;
      };

      const buildUiResponse = (
        logs: AuditLog[],
        statistics?: AuditStatistics,
        pagination: Partial<AuditPagination> = {}
      ) => {
        const estadisticas = {
          total_registros: pagination?.total_records ?? statistics?.total_logs ?? logs.length,
          total_inserts: 0,
          total_updates: 0,
          total_deletes: 0,
          error_logs: statistics?.error_logs || 0,
          avg_duration_ms: statistics?.avg_duration_ms || 0,
        };

        return {
          success: true,
          data: {
            logs,
            estadisticas,
            pagination: pagination || {},
          },
        };
      };

      const fetchPageData = async (targetPage: number, method?: string): Promise<AuditPageData | null> => {
        const response = await axiosInstance.get(buildUrl(targetPage, limit, method));

        if (!response.data.success || !response.data.data) {
          return null;
        }

        return response.data.data;
      };

      // Métodos específicos se delegan al backend para mantener paginación nativa.
      if (actionFilter && actionFilter !== 'all') {
        const pageData = await fetchPageData(page, actionFilter);

        if (pageData) {
          return buildUiResponse(pageData.logs || [], pageData.statistics, pageData.pagination);
        }

        return { success: false, message: 'No se pudo obtener registros de auditoría' };
      }

      // Para "all": excluye GET y evita escanear decenas de páginas para prevenir 429.
      let currentPage = Math.max(1, page);
      let attempts = 0;
      let lastPageData = await fetchPageData(currentPage);
      const collectedLogs: AuditLog[] = [];

      while (lastPageData) {
        const relevantLogs = (lastPageData.logs || []).filter(
          (log: AuditLog) => (log.method || '').toUpperCase() !== 'GET'
        );
        collectedLogs.push(...relevantLogs);

        const hasEnoughLogs = collectedLogs.length >= limit;
        const canContinue = Boolean(lastPageData.pagination?.has_next) && attempts < MAX_FALLBACK_PAGES;

        if (hasEnoughLogs || !canContinue) {
          const normalizedPagination = {
            ...(lastPageData.pagination || {}),
            current_page: page,
          };

          return buildUiResponse(collectedLogs.slice(0, limit), lastPageData.statistics, normalizedPagination);
        }

        currentPage += 1;
        attempts += 1;
        lastPageData = await fetchPageData(currentPage);
      }

      return { success: false, message: 'No se pudo obtener registros de auditoria' };
    } catch (error) {
      throw error;
    }
  },
};
