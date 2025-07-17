import { useQuery } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';

export const useConductorDetailQuery = (dni: string | null) => {
  return useQuery({
    queryKey: ['conductorDetail', dni],
    queryFn: () => conductoresService.getConductorDetail(dni!),
    enabled: !!dni,
  });
};