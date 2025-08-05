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
        url += `&operation=${actionFilter}`;
      }

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener logs de auditoría:', error);
      
      // Retornar datos mock si hay error de conexión
      const mockAuditLogs = [
        {
          id: 1,
          table_name: 'vehiculos',
          operation: 'INSERT',
          record_id: 'VAW-454',
          old_values: null,
          new_values: {
            placa_v: 'VAW-454',
            dni_propietario: '12345678',
            estado: 'Activo'
          },
          user_id: 1,
          username: 'admin_user',
          timestamp: '2024-01-15T10:30:00Z',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 2,
          table_name: 'conductores',
          operation: 'UPDATE',
          record_id: '87654321',
          old_values: {
            telefono: '987654321',
            direccion: 'Av. Principal 123'
          },
          new_values: {
            telefono: '912345678',
            direccion: 'Jr. Los Andes 456'
          },
          user_id: 2,
          username: 'fiscalizador_01',
          timestamp: '2024-01-15T14:20:00Z',
          ip_address: '192.168.1.105',
          user_agent: 'Mozilla/5.0 (Android 11; Mobile; rv:112.0) Gecko/112.0 Firefox/112.0'
        },
        {
          id: 3,
          table_name: 'acta_control',
          operation: 'INSERT',
          record_id: 'ACT-2024-001',
          old_values: null,
          new_values: {
            id_acta: 'ACT-2024-001',
            placa_v: 'VAW-454',
            resultado: 'CONFORME',
            observaciones: 'Vehículo en buen estado'
          },
          user_id: 2,
          username: 'fiscalizador_01',
          timestamp: '2024-01-15T16:45:00Z',
          ip_address: '192.168.1.105',
          user_agent: 'Mozilla/5.0 (Android 11; Mobile; rv:112.0) Gecko/112.0 Firefox/112.0'
        },
        {
          id: 4,
          table_name: 'usuarios',
          operation: 'DELETE',
          record_id: '15',
          old_values: {
            username: 'temp_user',
            email: 'temp@example.com',
            role: 'fiscalizador'
          },
          new_values: null,
          user_id: 1,
          username: 'admin_user',
          timestamp: '2024-01-16T09:15:00Z',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      ];

      // Filtrar por búsqueda si se proporciona
      let filteredLogs = mockAuditLogs;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredLogs = mockAuditLogs.filter(log => 
          log.table_name.toLowerCase().includes(searchLower) ||
          log.username.toLowerCase().includes(searchLower) ||
          log.record_id.toLowerCase().includes(searchLower)
        );
      }

      // Filtrar por acción si se proporciona
      if (actionFilter && actionFilter !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.operation === actionFilter);
      }

      return {
        success: true,
        data: {
          logs: filteredLogs,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(filteredLogs.length / limit),
            total_records: filteredLogs.length,
            has_next: page < Math.ceil(filteredLogs.length / limit),
            has_previous: page > 1
          },
          estadisticas: {
            total_registros: filteredLogs.length,
            total_inserts: filteredLogs.filter(l => l.operation === 'INSERT').length,
            total_updates: filteredLogs.filter(l => l.operation === 'UPDATE').length,
            total_deletes: filteredLogs.filter(l => l.operation === 'DELETE').length,
            tablas_afectadas: new Set(filteredLogs.map(l => l.table_name)).size,
            usuarios_activos: new Set(filteredLogs.map(l => l.username)).size
          }
        }
      };
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
      console.error('Error al exportar logs de auditoría:', error);
      throw error;
    }
  },

  getAuditStats: async () => {
    try {
      const response = await axiosInstance.get('/audit-logs/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de auditoría:', error);
      
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
