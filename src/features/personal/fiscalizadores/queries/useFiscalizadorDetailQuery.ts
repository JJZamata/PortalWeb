import { useQuery } from '@tanstack/react-query';
import { fetchFiscalizadorDetail } from '../services/fiscalizadoresService';

export const useFiscalizadorDetailQuery = (id: number | undefined) => {
  return useQuery({
    queryKey: ['fiscalizadorDetail', id],
    queryFn: async () => {
      if (!id) return { success: false, data: null };
      const response = await fetchFiscalizadorDetail(id);
      
      // Si la respuesta tiene éxito, devolver solo los datos
      if (response && response.success) {
        return response.data;
      }
      
      // Si no hay éxito, devolver null
      return null;
    },
    enabled: !!id, // Solo ejecutar si hay un ID válido
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};