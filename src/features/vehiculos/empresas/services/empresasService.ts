import axiosInstance from '@/lib/axios';

export const empresasService = {
  // Método principal que maneja búsqueda, filtrado y paginación
  getEmpresas: async (page: number, searchTerm: string = '', statusFilter: string = 'ALL') => {
    try {
      let response;
      
      // Determinar qué endpoint usar basado en los parámetros
      const hasSearch = searchTerm && searchTerm.length >= 2;
      const hasStatusFilter = statusFilter && statusFilter !== 'ALL';

      if (hasSearch && hasStatusFilter) {
        // Búsqueda + filtro: usar endpoint de búsqueda y filtrar en frontend
        response = await axiosInstance.get(`/companies/search?query=${encodeURIComponent(searchTerm)}&page=${page}`);
        
        if (response.data.success) {
          const companies = response.data.data.companies || [];
          const pagination = response.data.data.pagination || {};
          
          // Filtrar por estado en frontend
          const filteredCompanies = companies.filter((company: any) => 
            company.rucStatus === statusFilter
          );

          const empresasTransformadas = filteredCompanies.map((company: any) => ({
            ruc: company.ruc || '',
            nombre: company.name || '',
            direccion: company.address || 'Dirección no disponible',
            nro_resolucion: "RES-2024-001",
            fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
            fecha_vencimiento: company.expirationDate || '',
            entidad_emisora: "Municipalidad Distrital La Joya",
            estado: company.rucStatus || 'Sin Estado',
            vehiculos_asociados: company.vehicleCount || 0
          }));

          return {
            empresas: empresasTransformadas,
            pagination: {
              ...pagination,
              totalCompanies: filteredCompanies.length,
              totalPages: Math.ceil(filteredCompanies.length / (pagination.limit || 10))
            }
          };
        }
      } else if (hasSearch) {
        // Solo búsqueda
        response = await axiosInstance.get(`/companies/search?query=${encodeURIComponent(searchTerm)}&page=${page}`);
      } else if (hasStatusFilter) {
        // Solo filtro por estado
        response = await axiosInstance.get(`/companies/filter?status=${statusFilter}&page=${page}`);
      } else {
        // Sin filtros
        response = await axiosInstance.get(`/companies?page=${page}`);
      }

      if (response.data.success) {
        const data = response.data.data;
        const companies = data.companies || [];
        
        // Transform companies to match expected structure
        const empresasTransformadas = companies.map((company: any) => ({
          ruc: company.ruc || '',
          nombre: company.name || '',
          direccion: company.address || 'Dirección no disponible',
          nro_resolucion: "RES-2024-001",
          fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
          fecha_vencimiento: company.expirationDate || '',
          entidad_emisora: "Municipalidad Distrital La Joya",
          estado: company.rucStatus || 'Sin Estado',
          vehiculos_asociados: company.vehicleCount || 0
        }));

        return {
          empresas: empresasTransformadas,
          pagination: data.pagination || null
        };
      }
      
      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en empresasService.getEmpresas:', error);
      throw error;
    }
  },

  // Método específico para búsqueda
  searchEmpresas: async (query: string, page: number = 1) => {
    const response = await axiosInstance.get(`/companies/search?query=${encodeURIComponent(query)}&page=${page}`);
    
    if (response.data.success) {
      const data = response.data.data;
      const companies = data.companies || [];
      
      const empresasTransformadas = companies.map((company: any) => ({
        ruc: company.ruc || '',
        nombre: company.name || '',
        direccion: company.address || 'Dirección no disponible',
        nro_resolucion: "RES-2024-001",
        fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
        fecha_vencimiento: company.expirationDate || '',
        entidad_emisora: "Municipalidad Distrital La Joya",
        estado: company.rucStatus || 'Sin Estado',
        vehiculos_asociados: company.vehicleCount || 0
      }));

      return {
        empresas: empresasTransformadas,
        pagination: data.pagination || null
      };
    }
    
    throw new Error('Error en la búsqueda');
  },

  // Método específico para filtrado por estado
  filterByStatus: async (status: string, page: number = 1) => {
    const response = await axiosInstance.get(`/companies/filter?status=${status}&page=${page}`);
    
    if (response.data.success) {
      const data = response.data.data;
      const companies = data.companies || [];
      
      const empresasTransformadas = companies.map((company: any) => ({
        ruc: company.ruc || '',
        nombre: company.name || '',
        direccion: company.address || 'Dirección no disponible',
        nro_resolucion: "RES-2024-001",
        fecha_emision: company.expirationDate ? new Date(company.expirationDate).toISOString().split('T')[0] : '',
        fecha_vencimiento: company.expirationDate || '',
        entidad_emisora: "Municipalidad Distrital La Joya",
        estado: company.rucStatus || 'Sin Estado',
        vehiculos_asociados: company.vehicleCount || 0
      }));

      return {
        empresas: empresasTransformadas,
        pagination: data.pagination || null
      };
    }
    
    throw new Error('Error en el filtrado');
  },

  getEmpresaDetail: async (ruc: string) => {
    const response = await axiosInstance.get(`/companies/${ruc}`);
    return response.data.data;
  },
  addEmpresa: async (data: any) => {
    const response = await axiosInstance.post('/companies', data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateEmpresa: async (ruc: string, data: any) => {
    const response = await axiosInstance.put(`/companies/${ruc}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteEmpresa: async (ruc: string) => {    
    // Intentar varios endpoints comunes para eliminación
    const endpoints = [
      `/companies/${ruc}`,           // Endpoint original
      `/companies/delete/${ruc}`,    // Con prefijo delete
      `/companies/${ruc}/delete`,    // Con sufijo delete
    ];
    
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axiosInstance.delete(endpoint);
        return response.data;
      } catch (error: any) {
        lastError = error;
        
        // Si es un error de autorización o servidor, no intentar más endpoints
        if (error.response?.status === 401 || error.response?.status === 500) {
          break;
        }
      }
    }
    
    // Si todos los endpoints fallaron, lanzar el último error
    throw lastError;
  },
  getStats: async () => {
    const response = await axiosInstance.get('/companies/admin/stats');
    return response.data.data;
  },
};