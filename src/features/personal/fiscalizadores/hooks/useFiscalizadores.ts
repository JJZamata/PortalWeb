// src/features/gestion/fiscalizadores/hooks/useFiscalizadores.ts
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFiscalizadores } from '../services/fiscalizadoresService';
import { Fiscalizador } from '../types';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useFiscalizadores = (searchTerm: string, currentPage: number) => {
  const [page, setPage] = useState(currentPage);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['fiscalizadores', page, searchTerm],
    queryFn: () => fetchFiscalizadores(page),
    staleTime: 5 * 60 * 1000, // 5 minutos de caché
    enabled: !!page, // Solo ejecuta si page es válido
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

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

  const filteredFiscalizadores = data?.data?.fiscalizadores?.filter(fiscalizador => {
    const searchLower = searchTerm.toLowerCase();
    return (
      fiscalizador.usuario.toLowerCase().includes(searchLower) ||
      fiscalizador.email.toLowerCase().includes(searchLower) ||
      fiscalizador.idUsuario.toString().includes(searchTerm) ||
      (fiscalizador.nombreCompleto && fiscalizador.nombreCompleto.toLowerCase().includes(searchLower)) ||
      (fiscalizador.dni && fiscalizador.dni.includes(searchTerm))
    );
  }) || [];

  return {
    fiscalizadores: filteredFiscalizadores,
    pagination: data?.data?.pagination || null,
    summary: data?.data?.summary || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
  };
};