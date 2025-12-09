import axiosInstance from '@/lib/axios';

export const licensesService = {
  addLicense: async (data: any) => {
    const payload = {
      driverDni: String(data.driverDni ?? '').trim(),
      licenseNumber: String(data.licenseNumber ?? '').toUpperCase().trim(),
      category: String(data.category ?? '').toUpperCase().trim(),
      issueDate: data.issueDate,
      expirationDate: data.expirationDate,
      issuingEntity: String(data.issuingEntity ?? '').trim(),
      restrictions: String(data.restrictions ?? 'NINGUNA').toUpperCase().trim() || 'NINGUNA'
    };

    const response = await axiosInstance.post('/licenses', payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
};