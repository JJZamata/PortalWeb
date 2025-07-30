import { useQuery } from '@tanstack/react-query';
import { actasService } from '../services/actasService';

export const useActaDetailQuery = (id: number, type: 'conforme' | 'noconforme') => {
  return useQuery({
    queryKey: ['actaDetail', id, type],
    queryFn: () => actasService.getActaDetail(id, type),
    enabled: false,
  });
};