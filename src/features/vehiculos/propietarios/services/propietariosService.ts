import axiosInstance from '@/lib/axios';

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

export const propietariosService = {
  getPropietarios: async (page: number = 1, searchTerm: string = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      if (searchTerm && searchTerm.length >= 2) {
        params.append('search', searchTerm);
      }

      const response = await axiosInstance.get(`/owners?${params.toString()}`);
      
      if (response.data.success) {
        return {
          propietarios: response.data.data.data || [],
          pagination: response.data.data.pagination || null,
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en propietariosService.getPropietarios:', error);
      throw error;
    }
  },

  getPropietarioDetail: async (dni: string) => {
    try {
      const response = await axiosInstance.get(`/owners/${dni}`);
      if (response.data.success) return response.data.data;
      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en propietariosService.getPropietarioDetail:', error);
      throw error;
    }
  },

  addPropietario: async (data: any) => {
    try {
      const payload: any = {
        dni: String(data.dni ?? '').trim(),
        firstName: String(data.firstName ?? '').trim(),
        lastName: String(data.lastName ?? '').trim(),
        phone: String(data.phoneNumber ?? '').trim(), // El backend espera 'phone'
      };

      // Solo incluir email si tiene valor
      if (data.email && String(data.email).trim().length > 0) {
        payload.email = String(data.email).trim();
      }

      // Solo incluir photoUrl si tiene valor
      if (data.photoUrl && String(data.photoUrl).trim().length > 0) {
        payload.photoUrl = String(data.photoUrl).trim();
      }

      console.log('📤 Payload enviado al backend:', payload);

      const response = await axiosInstance.post('/owners/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        console.error('Error backend addPropietario:', error.response.data);
      }
      handleApiError(error);
    }
  },

  updatePropietario: async (dni: string, data: any) => {
    try {
      const payload: any = {};

      if (data.firstName) payload.firstName = String(data.firstName).trim();
      if (data.lastName) payload.lastName = String(data.lastName).trim();
      if (data.phoneNumber) payload.phone = String(data.phoneNumber).trim(); // Cambio a 'phone'
      if (data.email) payload.email = String(data.email).trim();
      if (data.photoUrl) payload.photoUrl = String(data.photoUrl).trim();

      if (Object.keys(payload).length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      const response = await axiosInstance.put(`/owners/${dni}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  deletePropietario: async (dni: string) => {
    try {
      const response = await axiosInstance.delete(`/owners/${dni}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
