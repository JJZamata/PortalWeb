import axiosInstance from '@/lib/axios';

export const actasService = {
  getActas: async (currentPage: number, limit: number, searchTerm: string, recordType: string, sortBy: string, sortOrder: string) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
      search: searchTerm,
      type: recordType,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    const response = await axiosInstance.get(`/records?${params.toString()}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return response.data;
  },
  getActaDetail: async (id: number, type: 'conforme' | 'noconforme') => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`/records/${id}/detail?type=${type}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return response.data;
  },
};