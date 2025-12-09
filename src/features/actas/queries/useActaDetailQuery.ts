import { useQuery } from '@tanstack/react-query';
import { actasService } from '../services/actasService';

export const useActaDetailQuery = (id: number | null, type: 'conforme' | 'noconforme' = 'conforme') => {
  return useQuery({
    queryKey: ['actaDetail', id, type],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return actasService.getActaDetail(id, type);
    },
    enabled: !!id, // Habilitar la query solo cuando hay un ID válido
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });
};