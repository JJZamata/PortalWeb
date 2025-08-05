import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useUsuarios = (searchTerm: string) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios', page, searchTerm],
    queryFn: () => usuariosService.getUsuarios(page),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    const now = Date.now();
    
    if (now - lastPageChangeRef.current < 500) {
      return;
    }
    
    lastPageChangeRef.current = now;
    preparePageChange();
    setPage(newPage);
  };

  return {
    usuarios: data?.data?.usuarios || [],
    pagination: data?.data?.pagination || null,
    estadisticas: data?.data?.estadisticas || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
    refetch
  };
};
