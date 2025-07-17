import { useQuery } from '@tanstack/react-query';
import { fetchFiscalizadores } from '../services/fiscalizadoresService';

export const useFiscalizadoresQuery = (page: number = 1) => {
  return useQuery({
    queryKey: ['fiscalizadores', page],
    queryFn: async () => {
      const response = await fetchFiscalizadores(page);
      
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response?.message || 'Error al cargar fiscalizadores');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2, // Reintentar hasta 2 veces
  });
};