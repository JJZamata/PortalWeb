import axiosInstance from '@/lib/axios';

export const documentosService = {
  getDocumentos: async (page: number, tipoFiltro: string, searchTerm: string) => {
    const token = localStorage.getItem('token');
    let url = `/documents?page=${page}`;
    if (tipoFiltro && tipoFiltro !== 'ALL') {
      url = `/documents/type/${tipoFiltro.toLowerCase()}?page=${page}`;
    }
    const response = await axiosInstance.get(url, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    let documentsData = response.data?.data?.documents || [];
    if (searchTerm && searchTerm.trim().length >= 2) {
      documentsData = documentsData.filter((doc: any) =>
        (doc.placa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.numero || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return {
      documents: documentsData,
      pagination: response.data?.data?.pagination || {},
    };
  },
  getPlacas: async () => {
    const response = await axiosInstance.get('/vehicles');
    return response.data.data;
  },
  searchPlacas: async (texto: string) => {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('limit', '10');
    if (texto) params.append('search', texto);
    const response = await axiosInstance.get(`/vehicles?${params.toString()}`);
    return response.data.data;
  },
  getEmpresas: async () => {
    const response = await axiosInstance.get('/companies?page=1');
    return response.data.data;
  },
  addDocumento: async (data: any) => {
    const token = localStorage.getItem('token');
    if (data.tipo === 'REVISION') {
      const payload = {
        review_id: data.numero,
        vehicle_plate: data.placa,
        issue_date: data.fecha_emision,
        expiration_date: data.fecha_vencimiento,
        inspection_result: data.inspection_result,
        certifying_company: data.certifying_company,
      };
      await axiosInstance.post('/documents/technical-review', payload, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
    } else {
      const formData = new FormData();
      formData.append('tipo', data.tipo);
      formData.append('numero', data.numero);
      formData.append('placa', data.placa);
      formData.append('entidad_empresa', data.entidad_empresa);
      formData.append('fecha_emision', data.fecha_emision);
      formData.append('fecha_vencimiento', data.fecha_vencimiento);
      formData.append('observaciones', data.observaciones || '');
      if (data.cobertura) formData.append('cobertura', data.cobertura);
      if (data.numero_poliza) formData.append('numero_poliza', data.numero_poliza);
      if (data.archivo) formData.append('archivo', data.archivo);
      await axiosInstance.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }
  },
};