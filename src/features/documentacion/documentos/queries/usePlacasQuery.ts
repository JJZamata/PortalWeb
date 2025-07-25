import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';

export const usePlacasQuery = () => {
  return useQuery({
    queryKey: ['placas'],
    queryFn: () => documentosService.getPlacas(),
    enabled: false,
  });
};