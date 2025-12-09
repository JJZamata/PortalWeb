import { useQuery } from '@tanstack/react-query';
import { infraccionesService, infraccionesServiceLegacy } from '../services/infraccionesService';
import type { ViolationsListParams, ViolationsListResponse } from '../types';

/**
 * Hook para obtener listado de infracciones con paginación y filtros
 */
export const useInfraccionesQuery = (params: ViolationsListParams = {}) => {
  return useQuery<ViolationsListResponse, Error>({
    queryKey: ['violations', 'list', params],
    queryFn: () => infraccionesService.getInfracciones(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook para obtener listado de infracciones con formato legacy (para compatibilidad)
 */
export const useInfraccionesLegacyQuery = (currentPage: number, limit: number, severityFilter: string, searchTerm: string, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
  const params: ViolationsListParams = {
    page: currentPage,
    limit,
    search: searchTerm.length >= 2 ? searchTerm : undefined,
    severity: severityFilter !== 'ALL' ? severityFilter as any : undefined,
    sortBy: sortBy as any || 'code',
    sortOrder: sortOrder?.toUpperCase() as any || 'ASC'
  };

  return useQuery({
    queryKey: ['violations', 'legacy', currentPage, severityFilter, searchTerm, sortBy, sortOrder],
    queryFn: () => infraccionesServiceLegacy.getInfracciones(currentPage, limit, severityFilter, searchTerm, sortBy, sortOrder),
    staleTime: 30 * 1000, // 30 segundos en lugar de 5 minutos
    refetchOnWindowFocus: false,
    retry: 2
  });
};