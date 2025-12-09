import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useConductores = (searchTerm: string) => {
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const lastPageChangeRef = useRef<number>(0);

  // Validaciones según backend FISCAMOTO para drivers
  const SEARCH_MIN_LENGTH = 2;  // Diferente a empresas (que usa 3)

  const { data, isLoading, error } = useQuery({
    queryKey: ['conductores', page, searchTerm],
    // Usar método unificado que maneja búsqueda y paginación
    queryFn: () => conductoresService.getConductores(page, searchTerm),
    staleTime: 5 * 60 * 1000,
  });

  // Separate query for stats (similar a empresas)
  const { data: statsData } = useQuery({
    queryKey: ['conductores-stats'],
    queryFn: () => conductoresService.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= SEARCH_MIN_LENGTH) {
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
    summary: data?.summary || null,  // Summary del listado (si existe)
    stats: statsData || null,       // Estadísticas del endpoint /api/drivers/stats
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};