import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useDocumentos = (searchTerm: string, tipoFiltro: string) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['documentos', page, searchTerm, tipoFiltro],
    queryFn: () => documentosService.getDocumentos(page, tipoFiltro, searchTerm),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, tipoFiltro]);

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
    documentos: data?.documents || [],
    pagination: data?.pagination || { current_page: 1, total_pages: 1, total_records: 0, records_per_page: 6, has_next: false, has_previous: false },
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};