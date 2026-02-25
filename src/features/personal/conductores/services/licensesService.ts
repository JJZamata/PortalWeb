import axiosInstance from '@/lib/axios';

const verifyLicenseExistsForDriver = async (driverDni: string, licenseNumber: string) => {
  const verifyResponse = await axiosInstance.get(`/drivers/${driverDni}`);
  const detailData = verifyResponse?.data?.data || {};
  const licencias = Array.isArray(detailData?.licencias) ? detailData.licencias : [];
  const normalizedLicenseNumber = licenseNumber.toUpperCase().trim();

  return licencias.some((lic: any) => {
    const number = String(lic?.licenseNumber ?? lic?.nro_licencia ?? '').toUpperCase().trim();
    return number === normalizedLicenseNumber;
  });
};

export const licensesService = {
  addLicense: async (data: any) => {
    const normalizedDriverDni = String(data.driverDni ?? '').trim();
    if (!/^\d{8}$/.test(normalizedDriverDni)) {
      throw new Error('DNI de conductor inválido para registrar licencia');
    }

    const payload = {
      driverDni: normalizedDriverDni,
      licenseNumber: String(data.licenseNumber ?? '').toUpperCase().trim(),
      category: String(data.category ?? '').trim(),
      issueDate: data.issueDate,
      expirationDate: data.expirationDate,
      issuingEntity: String(data.issuingEntity ?? '').trim(),
      restrictions: String(data.restrictions ?? 'SIN RESTRICCIONES').toUpperCase().trim() || 'SIN RESTRICCIONES'
    };

    // Prevalidación para evitar que el backend reviente con 500 ante duplicados
    try {
      const alreadyExists = await verifyLicenseExistsForDriver(normalizedDriverDni, payload.licenseNumber);
      if (alreadyExists) {
        throw new Error(`La licencia ${payload.licenseNumber} ya está registrada para este conductor.`);
      }
    } catch (precheckError: any) {
      if (precheckError?.message?.includes('ya está registrada')) {
        throw precheckError;
      }
    }

    try {
      const response = await axiosInstance.post('/licenses', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const code = error?.response?.data?.code;

      if (status === 500 && code === 'INTERNAL_ERROR') {
        try {
          const found = await verifyLicenseExistsForDriver(normalizedDriverDni, payload.licenseNumber);

          if (found) {
            return {
              success: true,
              recovered: true,
              message: `La licencia ${payload.licenseNumber} fue registrada (confirmada tras reintento de verificación).`
            };
          }
        } catch {
        }

        // Reintento con variante de categoría por compatibilidad con validaciones backend inestables
        const fallbackPayload = {
          ...payload,
          category: payload.category.toUpperCase()
        };

        if (fallbackPayload.category !== payload.category) {
          try {
            const retryResponse = await axiosInstance.post('/licenses', fallbackPayload, {
              headers: { 'Content-Type': 'application/json' }
            });
            return retryResponse.data;
          } catch {
            try {
              const foundAfterRetry = await verifyLicenseExistsForDriver(normalizedDriverDni, payload.licenseNumber);
              if (foundAfterRetry) {
                return {
                  success: true,
                  recovered: true,
                  message: `La licencia ${payload.licenseNumber} fue registrada (confirmada tras verificación posterior).`
                };
              }
            } catch {
            }
          }
        }

        const enhancedError = new Error('El servidor devolvió un error interno al registrar la licencia. Verifica si el número de licencia ya existe; si no existe, el fallo está en backend.');
        (enhancedError as any).response = error?.response;
        throw enhancedError;
      }

      throw error;
    }
  },

  // Actualizar licencia
  updateLicense: async (licenseNumber: string, data: any) => {
    const normalizedLicenseNumber = String(licenseNumber ?? '').trim();
    if (!normalizedLicenseNumber) {
      throw new Error('El número de licencia es requerido para actualizar');
    }

    const payload: any = {};

    // Solo incluir campos que se pueden actualizar según la API
    if (data.category !== undefined && data.category !== null) {
      payload.category = String(data.category).trim();
    }
    if (data.expirationDate !== undefined && data.expirationDate !== null) {
      payload.expirationDate = data.expirationDate;
    }
    if (data.restrictions !== undefined && data.restrictions !== null) {
      payload.restrictions = String(data.restrictions).trim() || 'SIN RESTRICCIONES';
    }

    if (Object.keys(payload).length === 0) {
      throw new Error('Debes cambiar al menos un campo para actualizar la licencia');
    }

    try {
      const response = await axiosInstance.put(`/licenses/${normalizedLicenseNumber}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar licencia
  deleteLicense: async (licenseNumber: string) => {
    const normalizedLicenseNumber = String(licenseNumber ?? '').trim();
    if (!normalizedLicenseNumber) {
      throw new Error('El número de licencia es requerido para eliminar');
    }

    try {
      const response = await axiosInstance.delete(`/licenses/${normalizedLicenseNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};