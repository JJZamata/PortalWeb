import axiosInstance from '@/lib/axios';

export const infraccionesService = {
  getInfracciones: async (page: number, limit: number, severity: string, searchTerm: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (severity !== 'ALL') {
        params.append('severity', severity);
      }

      if (searchTerm.length >= 2) {
        params.append('query', searchTerm);
      }

      let url = '/violations/';
      if (searchTerm.length >= 2) {
        url = '/violations/search';
      } else if (severity !== 'ALL') {
        url = '/violations/filter/severity';
      }

      const response = await axiosInstance.get(`${url}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error en infraccionesService.getInfracciones:', error);
      throw error;
    }
  },

  getInfraccionDetail: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/violations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en infraccionesService.getInfraccionDetail:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await axiosInstance.get('/violations/admin/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error en infraccionesService.getStats:', error);
      // Retornar datos por defecto si falla
      return {
        totalViolations: 0,
        verySerious: 0,
        serious: 0,
        minor: 0,
        driverTargeted: 0,
        companyTargeted: 0,
      };
    }
  },
};