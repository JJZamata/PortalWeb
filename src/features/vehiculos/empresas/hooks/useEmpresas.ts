import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useEmpresas = (searchTerm: string, statusFilter: string) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['empresas', page, searchTerm, statusFilter],
    queryFn: () => empresasService.getEmpresas(page, searchTerm, statusFilter),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

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
    const now = Date.now();
    
    // Prevenir múltiples clicks rápidos (menos de 500ms)
    if (now - lastPageChangeRef.current < 500) {
      return;
    }
    
    lastPageChangeRef.current = now;
    preparePageChange(); // Guardar posición antes del cambio
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