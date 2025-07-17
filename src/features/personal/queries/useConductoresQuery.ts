import { useQuery } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';

export const useConductoresQuery = (page: number, searchTerm: string) => {
  return useQuery({
    queryKey: ['conductores', page, searchTerm],
    queryFn: () => (searchTerm.length >= 2 ? conductoresService.searchConductores(searchTerm, page) : conductoresService.getConductores(page)),
    enabled: searchTerm.length < 2 || searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};