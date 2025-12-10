import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useDocumentos = (
  searchTerm: string,
  tipoFiltro: string,
  sortBy: string = 'createdAt',
  sortOrder: string = 'DESC'
) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['documentos', page, searchTerm, tipoFiltro, sortBy, sortOrder],
    queryFn: () => documentosService.getDocumentos(page, tipoFiltro, searchTerm, sortBy, sortOrder),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, tipoFiltro, sortBy, sortOrder]);

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

  // Transformar pagination de snake_case a camelCase
  const paginationData = data?.pagination;
  
  return {
    documentos: data?.documents || [],
    pagination: paginationData ? {
      currentPage: paginationData.current_page || 1,
      totalPages: paginationData.total_pages || 1,
      totalItems: paginationData.total_records || 0,
      itemsPerPage: paginationData.records_per_page || 6,
      offset: ((paginationData.current_page || 1) - 1) * (paginationData.records_per_page || 6),
      hasNextPage: Boolean(paginationData.has_next),
      hasPreviousPage: Boolean(paginationData.has_previous),
      nextPage: paginationData.has_next ? (paginationData.current_page || 1) + 1 : null,
    } : {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 6,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
    },
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};