import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { infraccionesService } from '../services/infraccionesService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useInfracciones = (currentPage: number, limit: number, severityFilter: string, searchTerm: string) => {
  const [page, setPage] = useState(currentPage);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['infracciones', page, limit, severityFilter, searchTerm],
    queryFn: () => infraccionesService.getInfracciones(page, limit, severityFilter, searchTerm),
    staleTime: 5 * 60 * 1000,
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['infracciones-stats'],
    queryFn: () => infraccionesService.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const refreshViolations = () => {
    refetch();
  };

  return {
    violations: data?.violations || [],
    loading: isLoading,
    error: error?.message || null,
    paginationData: data?.pagination || null,
    stats: statsData || {
      totalViolations: 0,
      verySerious: 0,
      serious: 0,
      minor: 0,
      driverTargeted: 0,
      companyTargeted: 0,
    },
    loadingStats: isLoadingStats,
    refreshViolations,
  };
};