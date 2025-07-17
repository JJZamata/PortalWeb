import axiosInstance from '@/lib/axios';

export const conductoresService = {
  getConductores: async (page: number) => {
    const response = await axiosInstance.get(`/drivers/list?page=${page}`);
    return response.data.data;
  },
  searchConductores: async (query: string, page: number) => {
    const response = await axiosInstance.get(`/drivers/search?q=${encodeURIComponent(query)}&page=${page}`);
    return response.data.data;
  },
  getConductorDetail: async (dni: string) => {
    const response = await axiosInstance.get(`/drivers/${dni}`);
    return response.data.data;
  },
  addConductor: async (data: any) => {
    const response = await axiosInstance.post('/drivers/', data);
    return response.data;
  },
  updateConductor: async (dni: string, data: any) => {
    const response = await axiosInstance.put(`/drivers/${dni}`, data);
    return response.data;
  },
  deleteConductor: async (dni: string) => {
    const response = await axiosInstance.delete(`/drivers/${dni}`);
    return response.data;
  },
};