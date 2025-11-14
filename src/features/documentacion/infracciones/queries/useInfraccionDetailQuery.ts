import { useQuery } from '@tanstack/react-query';
import { infraccionesService } from '../services/infraccionesService';

export const useInfraccionDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['violationDetail', id],
    queryFn: () => infraccionesService.getInfraccionDetail(id),
    enabled: false,
  });
};