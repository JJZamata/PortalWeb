import axiosInstance from '@/lib/axios';

export const vehiculosService = {
  getVehiculos: async (page: number, searchTerm: string) => {
    // Usar la misma estructura que funcionaba en tu código
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '6'); // Cambiar a 6 elementos por página
    if (searchTerm) params.append('search', searchTerm);
    
    const response = await axiosInstance.get(`/vehicles/?${params.toString()}`);
    
    // Devolver la estructura real de la API
    const data = response.data.data;
    return {
      vehicles: data.vehicles || [],
      pagination: data.pagination || null,
      summary: { total: data.pagination?.totalItems || 0 } // Crear summary del pagination.totalItems
    };
  },
  getVehiculoDetail: async (plate: string) => {
    const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();
    const response = await axiosInstance.get(`/vehicles/${cleanPlate}`);
    return response.data.data;
  },
  
  addVehiculo: async (data: any) => {
    // Adaptar a la estructura que funcionaba en tu código anterior
    const vehiculoData = {
      plateNumber: data.plateNumber,
      companyRuc: data.companyRuc,
      ownerDni: data.ownerDni,
      typeId: Number(data.typeId),
      vehicleStatus: data.vehicleStatus,
      brand: data.brand,
      model: data.model,
      manufacturingYear: Number(data.manufacturingYear)
    };
    
    try {
      // Usar la misma estructura que en tu código que funcionaba
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post("/vehicles", vehiculoData, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  updateVehiculo: async (plate: string, data: any) => {
    const response = await axiosInstance.put(`/vehicles/${plate}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  
  deleteVehiculo: async (plate: string) => {
    const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();
    const response = await axiosInstance.delete(`/vehicles/${cleanPlate}`);
    return response.data;
  },
};