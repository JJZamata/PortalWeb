import axiosInstance from '@/lib/axios';

export const licensesService = {
  addLicense: async (data: any) => {
    const response = await axiosInstance.post('/licenses', data);
    return response.data;
  },
};