import { useQuery } from '@tanstack/react-query';
import { infraccionesService } from '../services/infraccionesService';
import type { ViolationDetailResponse } from '../types';

/**
 * Hook para obtener detalle de una infracción por código
 */
export const useInfraccionDetailQuery = (code: string, enabled: boolean = false) => {
  return useQuery<ViolationDetailResponse, Error>({
    queryKey: ['violationDetail', code],
    queryFn: () => infraccionesService.getInfraccionDetail(code),
    enabled: enabled && !!code,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

/**
 * Hook para obtener estadísticas de infracciones
 */
export const useInfraccionesStatsQuery = () => {
  return useQuery({
    queryKey: ['violations', 'stats'],
    queryFn: () => infraccionesService.getStats(),
    staleTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};