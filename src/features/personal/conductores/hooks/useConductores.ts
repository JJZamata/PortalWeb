import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useConductores = (searchTerm: string) => {
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['conductores', page, searchTerm],
    queryFn: () => (searchTerm.length >= 2 ? conductoresService.searchConductores(searchTerm, page) : conductoresService.getConductores(page)),
    enabled: searchTerm.length < 2 || searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        setPage(1);
      } else if (searchTerm.length === 0 && isSearching) {
        setIsSearching(false);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, isSearching]);

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
    conductores: data?.conductores || [],
    pagination: data?.pagination || null,
    summary: data?.summary || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};