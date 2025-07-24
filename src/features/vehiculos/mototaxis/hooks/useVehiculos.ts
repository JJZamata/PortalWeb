import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useVehiculos = (searchTerm: string) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehiculos', page, searchTerm],
    queryFn: () => vehiculosService.getVehiculos(page, searchTerm),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Resetear a página 1 cuando cambia el término de búsqueda
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
    vehiculos: data?.vehicles || [],
    pagination: data?.pagination || null,
    summary: data?.summary || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};