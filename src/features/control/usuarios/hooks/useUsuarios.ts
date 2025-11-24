import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';
import { UsuariosQueryParams } from '../types';

export const useUsuarios = (
  searchTerm: string,
  additionalFilters: Partial<UsuariosQueryParams> = {}
) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Partial<UsuariosQueryParams>>(additionalFilters);
  const lastPageChangeRef = useRef<number>(0);

  const queryFilters: UsuariosQueryParams = {
    page,
    search: searchTerm,
    ...filters
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios', queryFilters],
    queryFn: () => usuariosService.getUsuarios(queryFilters),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setFilters(additionalFilters);
  }, [additionalFilters]);

  const handlePageChange = (newPage: number) => {
    const now = Date.now();

    if (now - lastPageChangeRef.current < 500) {
      return;
    }

    lastPageChangeRef.current = now;
    preparePageChange();
    setPage(newPage);
  };

  const updateFilters = (newFilters: Partial<UsuariosQueryParams>) => {
    setFilters(newFilters);
    setPage(1);
  };

  return {
    usuarios: data?.data?.data || [],
    pagination: data?.data?.pagination || null,
    meta: data?.data?.meta || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    filters,
    handlePageChange,
    updateFilters,
    refetch
  };
};
