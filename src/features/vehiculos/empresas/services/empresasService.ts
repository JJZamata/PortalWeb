import axiosInstance from '@/lib/axios';

export const empresasService = {
  getEmpresas: async (page: number, searchTerm: string, statusFilter: string) => {
    // Use the same pattern as mototaxis service
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '10');
    
    let url = '/companies/';
    
    // Handle search and filter parameters
    if (searchTerm && searchTerm.length >= 2) {
      params.append('search', searchTerm);
    }
    if (statusFilter && statusFilter !== 'ALL') {
      params.append('status', statusFilter);
    }

    const response = await axiosInstance.get(`${url}?${params.toString()}`);
    
    // Return the real API structure 
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
      pagination: data.pagination || null,
      stats: data.stats || null
    };
  },
  getEmpresaDetail: async (ruc: string) => {
    const response = await axiosInstance.get(`/companies/${ruc}`);
    return response.data.data;
  },
  addEmpresa: async (data: any) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post('/companies', data, {
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return response.data;
  },
  updateEmpresa: async (ruc: string, data: any) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.put(`/companies/${ruc}`, data, {
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return response.data;
  },
  deleteEmpresa: async (ruc: string) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.delete(`/companies/${ruc}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return response.data;
  },
  getStats: async () => {
    const response = await axiosInstance.get('/companies/admin/stats');
    return response.data.data;
  },
};