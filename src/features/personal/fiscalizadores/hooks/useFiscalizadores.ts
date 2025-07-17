// src/features/gestion/fiscalizadores/hooks/useFiscalizadores.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFiscalizadores } from '../services/fiscalizadoresService';
import { Fiscalizador } from '../types';

export const useFiscalizadores = (searchTerm: string, currentPage: number) => {
  const [page, setPage] = useState(currentPage);

  const { data, isLoading, error } = useQuery({
    queryKey: ['fiscalizadores', page, searchTerm],
    queryFn: () => fetchFiscalizadores(page),
    staleTime: 5 * 60 * 1000, // 5 minutos de caché
    enabled: !!page, // Solo ejecuta si page es válido
  });

  const handlePageChange = (newPage: number) => {
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