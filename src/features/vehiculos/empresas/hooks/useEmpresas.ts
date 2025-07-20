import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';

export const useEmpresas = (searchTerm: string, statusFilter: string) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['empresas', page, searchTerm, statusFilter],
    queryFn: () => empresasService.getEmpresas(page, searchTerm, statusFilter),
    staleTime: 5 * 60 * 1000,
  });

  // Separate query for stats
  const { data: statsData } = useQuery({
    queryKey: ['empresas-stats'],
    queryFn: () => empresasService.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    empresas: data?.empresas || [],
    pagination: data?.pagination || null,
    stats: statsData || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};