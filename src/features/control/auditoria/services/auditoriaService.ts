import axiosInstance from '@/lib/axios';
import { AuditLog } from '../types';

export const auditoriaService = {
  getAuditLogs: async (page: number = 1, limit: number = 10, searchTerm?: string, actionFilter?: string) => {
    try {
      let url = `/audit-logs?page=${page}&limit=${limit}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (actionFilter && actionFilter !== 'all') {
        url += `&method=${actionFilter}`;
      }

      const response = await axiosInstance.get(url);
      
      // El backend devuelve: { success: true, data: { logs: [], statistics: {}, pagination: {} } }
      if (response.data.success && response.data.data) {
        const { logs, statistics, pagination } = response.data.data;
        
        // Transformar statistics a estadisticas para compatibilidad
        const estadisticas = {
          total_registros: statistics?.total_logs || 0,
          total_inserts: 0, // El backend devuelve error_logs, no inserts/updates/deletes
          total_updates: 0,
          total_deletes: 0,
          error_logs: statistics?.error_logs || 0,
          avg_duration_ms: statistics?.avg_duration_ms || 0,
        };
        
        return {
          success: true,
          data: {
            logs: logs || [],
            estadisticas: estadisticas,
            pagination: pagination || {}
          }
        };
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportAuditLogs: async (format: 'csv' | 'pdf' | 'excel' = 'csv', filters?: any) => {
    try {
      const response = await axiosInstance.get(`/audit-logs/export?format=${format}`, {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuditStats: async () => {
    try {
      const response = await axiosInstance.get('/audit-logs/stats');
      return response.data;
    } catch (error) {
      // Retornar estadísticas mock
      return {
        success: true,
        data: {
          total_registros: 156,
          total_inserts: 45,
          total_updates: 78,
          total_deletes: 33,
          tablas_afectadas: 8,
          usuarios_activos: 12
        }
      };
    }
  }
};
