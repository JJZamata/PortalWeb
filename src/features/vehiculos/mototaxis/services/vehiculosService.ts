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

export const vehiculosService = {
  // Método principal unificado que maneja búsqueda y paginación
  getVehiculos: async (page: number, searchTerm: string = '') => {
    try {
      // Validaciones según backend FISCAMOTO para vehicles
      const SEARCH_MIN_LENGTH = 3;

      // Construir parámetros query según documentación
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '6'); // Límite fijo según backend

      const hasSearch = searchTerm && searchTerm.length >= SEARCH_MIN_LENGTH;

      // Agregar parámetro de búsqueda si aplica
      if (hasSearch) {
        params.append('search', searchTerm);
      }

      // Usar endpoint único /vehicles con parámetros query
      const response = await axiosInstance.get(`/vehicles?${params.toString()}`);

      if (response.data.success) {
        // Acceder a estructura real: data.data (como en empresas y conductores)
        const vehicles = response.data.data.data || [];

        // Transform vehicles para mantener compatibilidad con tipos existentes
        const vehiclesTransformados = vehicles.map((vehicle: any) => ({
          placa: {
            plateNumber: vehicle.placa?.plateNumber || '',
            companyRuc: vehicle.placa?.companyRuc || ''
          },
          propietario: {
            nombreCompleto: vehicle.propietario?.nombreCompleto || '',
            dni: vehicle.propietario?.dni || '',
            telefono: vehicle.propietario?.telefono || '',
            email: vehicle.propietario?.email || ''
          },
          empresa: {
            nombre: vehicle.empresa?.nombre || '',
            ruc: vehicle.empresa?.ruc || '',
            estado: vehicle.empresa?.estado || '',
            direccion: vehicle.empresa?.direccion || ''
          },
          tipo: {
            categoria: vehicle.tipo?.categoria || '',
            descripcion: vehicle.tipo?.descripcion || '',
            marca: vehicle.tipo?.marca || '',
            modelo: vehicle.tipo?.modelo || '',
            año: vehicle.tipo?.año || null,
            vehicleInfo: vehicle.tipo?.vehicleInfo || ''
          },
          estado: vehicle.estado || '',
          placa_v: vehicle.placa?.plateNumber || ''
        }));

        return {
          vehicles: vehiclesTransformados,
          pagination: response.data.data.pagination || null,
          summary: response.data.data.summary || null
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en vehiculosService.getVehiculos:', error);
      throw error;
    }
  },

  // Método para obtener estadísticas usando endpoint específico del backend
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/vehicles/stats');
      // Backend devuelve estructura: data.data.general o data.message (verificar según backend)
      return response.data.data.data || response.data.data.general || response.data.data.message;
    } catch (error) {
      console.error('Error en vehiculosService.getStats:', error);
      throw error;
    }
  },
  getVehiculoDetail: async (plate: string) => {
    const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();
    const response = await axiosInstance.get(`/vehicles/${cleanPlate}`);
    return response.data.data;
  },
  
  addVehiculo: async (data: any) => {
    try {
      const response = await axiosInstance.post('/vehicles/', data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
  
  updateVehiculo: async (plate: string, data: any) => {
    try {
      const response = await axiosInstance.put(`/vehicles/${plate}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  deleteVehiculo: async (plate: string) => {
    try {
      const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();
      const response = await axiosInstance.delete(`/vehicles/${cleanPlate}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};