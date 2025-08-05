import { useQuery } from '@tanstack/react-query';
import { infraccionesService } from '../services/infraccionesService';

export const useInfraccionesQuery = (currentPage: number, limit: number, severityFilter: string, searchTerm: string) => {
  return useQuery({
    queryKey: ['violations', currentPage, severityFilter, searchTerm],
    queryFn: () => infraccionesService.getViolations(currentPage, limit, severityFilter, searchTerm),
    staleTime: 5 * 60 * 1000,
  });
};