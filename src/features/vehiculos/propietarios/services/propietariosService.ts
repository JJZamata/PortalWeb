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

const normalizeOwner = (owner: any) => {
  const dni = String(owner?.dni ?? owner?.identificacion?.dni ?? owner?.ownerDni ?? '').trim();

  const firstName = String(owner?.firstName ?? owner?.datosPersonales?.firstName ?? owner?.nombres ?? '').trim();
  const lastName = String(owner?.lastName ?? owner?.datosPersonales?.lastName ?? owner?.apellidos ?? '').trim();
  const fullName = String(
    owner?.fullName
      ?? owner?.nombreCompleto
      ?? owner?.datosPersonales?.nombreCompleto
      ?? `${firstName} ${lastName}`.trim()
      ?? ''
  ).trim();

  const phone = String(owner?.phone ?? owner?.datosPersonales?.phone ?? owner?.phoneNumber ?? owner?.telefono ?? '').trim();
  const email = String(owner?.email ?? owner?.datosPersonales?.email ?? '').trim();

  const vehiclesList = Array.isArray(owner?.vehiculos?.lista)
    ? owner.vehiculos.lista
    : Array.isArray(owner?.vehicles)
      ? owner.vehicles
      : [];

  const vehicleCount = Number(
    owner?.vehicleCount
      ?? owner?.vehicle_count
      ?? owner?.vehiclesCount
      ?? owner?.totalVehicles
      ?? owner?.vehiculos?.total
      ?? owner?.vehiculos?.estadisticas?.totalVehiculos
      ?? vehiclesList.length
      ?? 0
  );

  const vehicles = vehiclesList
    .map((vehicle: any) => ({
      plateNumber: String(vehicle?.plateNumber ?? vehicle?.placa ?? vehicle?.placa_v ?? '').trim().toUpperCase(),
      status: String(vehicle?.status ?? vehicle?.estado ?? '').trim(),
      brand: String(vehicle?.brand ?? vehicle?.marca ?? '').trim(),
      model: String(vehicle?.model ?? vehicle?.modelo ?? '').trim(),
      year: Number(vehicle?.year ?? vehicle?.año ?? 0) || null,
    }))
    .filter((vehicle: any) => vehicle.plateNumber.length > 0);

  return {
    dni,
    firstName,
    lastName,
    fullName: fullName || 'Sin nombre',
    nombreCompleto: fullName || 'Sin nombre',
    phone,
    phoneNumber: phone,
    email,
    vehicleCount,
    vehicles,
    raw: owner,
  };
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
        const list = Array.isArray(response.data?.data?.data) ? response.data.data.data : [];
        return {
          propietarios: list.map((owner: any) => normalizeOwner(owner)),
          pagination: response.data.data.pagination || null,
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      throw error;
    }
  },

  getPropietarioDetail: async (dni: string) => {
    try {
      const response = await axiosInstance.get(`/owners/${dni}`);
      if (response.data.success) return normalizeOwner(response.data.data);
      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
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

      const response = await axiosInstance.post('/owners/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.data;
    } catch (error: any) {
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
