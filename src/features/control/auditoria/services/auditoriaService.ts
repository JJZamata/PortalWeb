import axiosInstance from '@/lib/axios';
import { AuditLog } from '../types';

const MAX_BACKEND_PAGES_TO_SCAN = 8;
const BACKEND_PAGE_SIZE = 50;

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

const isSessionRenewalLog = (log: AuditLog): boolean => {
  const normalizedUrl = String(log.url || '').toLowerCase().split('?')[0];
  const normalizedOperation = String(log.operation || '').toUpperCase();

  return (
    normalizedUrl.includes('/auth/refresh') ||
    normalizedOperation.includes('REFRESH')
  );
};

const isLoginLog = (log: AuditLog): boolean => {
  const normalizedUrl = String(log.url || '').toLowerCase().split('?')[0];
  const normalizedOperation = String(log.operation || '').toUpperCase();

  return (
    normalizedUrl.includes('/auth/login') ||
    normalizedUrl.endsWith('/login') ||
    normalizedUrl.includes('/auth/signin') ||
    normalizedUrl.includes('/auth/sign-in') ||
    normalizedOperation.includes('LOGIN') ||
    normalizedOperation.includes('SIGNIN')
  );
};

const normalizeMethodFilter = (actionFilter?: string): string => {
  const value = String(actionFilter || '').toUpperCase();
  return value && value !== 'ALL' ? value : 'all';
};

const shouldIncludeLog = (log: AuditLog, methodFilter: string): boolean => {
  if (isSessionRenewalLog(log) || isLoginLog(log)) {
    return false;
  }

  const method = String(log.method || '').toUpperCase();
  if (methodFilter === 'all') {
    return method !== 'GET';
  }

  return method === methodFilter;
};

export const auditoriaService = {
  getAuditLogs: async (page: number = 1, limit: number = 10, searchTerm?: string, actionFilter?: string) => {
    try {
      const requestedPage = Math.max(1, Number(page || 1));
      const requestedLimit = Math.max(1, Number(limit || 10));
      const normalizedMethodFilter = normalizeMethodFilter(actionFilter);

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

      const buildUiResponse = (logs: AuditLog[], statistics: AuditStatistics | undefined, pagination: AuditPagination) => {
        const globalTotalLogs = Number(statistics?.total_logs || 0);

        const estadisticas = {
          total_registros: globalTotalLogs > 0 ? globalTotalLogs : (pagination.total_records ?? logs.length),
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
            pagination,
          },
        };
      };

      const fetchPageData = async (targetPage: number, targetLimit: number, method?: string): Promise<AuditPageData | null> => {
        const response = await axiosInstance.get(buildUrl(targetPage, targetLimit, method));

        if (!response.data.success || !response.data.data) {
          return null;
        }

        return response.data.data;
      };

      const backendMethod = normalizedMethodFilter === 'all' ? undefined : normalizedMethodFilter;
      // Collect exactly what we need for current page plus one extra item to know if next page exists.
      const visibleLogsNeeded = requestedPage * requestedLimit + 1;
      const collectedVisibleLogs: AuditLog[] = [];

      let backendPage = 1;
      let hasMoreBackendPages = true;
      let scannedPages = 0;
      let lastStatistics: AuditStatistics | undefined;

      while (
        hasMoreBackendPages &&
        scannedPages < MAX_BACKEND_PAGES_TO_SCAN &&
        collectedVisibleLogs.length < visibleLogsNeeded
      ) {
        const pageData = await fetchPageData(backendPage, BACKEND_PAGE_SIZE, backendMethod);
        if (!pageData) {
          break;
        }

        lastStatistics = pageData.statistics;
        const logs = pageData.logs || [];
        if (logs.length === 0) {
          break;
        }

        const visibleLogs = logs.filter((log) => shouldIncludeLog(log, normalizedMethodFilter));
        collectedVisibleLogs.push(...visibleLogs);

        hasMoreBackendPages = Boolean(pageData.pagination?.has_next);
        backendPage += 1;
        scannedPages += 1;
      }

      const startIndex = (requestedPage - 1) * requestedLimit;
      const endIndex = startIndex + requestedLimit;
      const pageLogs = collectedVisibleLogs.slice(startIndex, endIndex);
      const hasNextVisible = collectedVisibleLogs.length > endIndex || hasMoreBackendPages;
      const estimatedTotalRecords = hasMoreBackendPages
        ? Math.max(endIndex + (hasNextVisible ? 1 : 0), startIndex + pageLogs.length)
        : collectedVisibleLogs.length;

      const pagination: AuditPagination = {
        current_page: requestedPage,
        total_pages: Math.max(1, Math.ceil(estimatedTotalRecords / requestedLimit)),
        total_records: Math.max(1, estimatedTotalRecords),
        records_per_page: requestedLimit,
        has_previous: requestedPage > 1,
        has_next: hasNextVisible,
      };

      return buildUiResponse(pageLogs, lastStatistics, pagination);
    } catch (error) {
      throw error;
    }
  },
};
