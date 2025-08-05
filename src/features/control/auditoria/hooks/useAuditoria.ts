import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditoriaService } from '../services/auditoriaService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

export const useAuditoria = (searchTerm: string, actionFilter: string) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['auditoria', page, searchTerm, actionFilter],
    queryFn: () => auditoriaService.getAuditLogs(page, limit, searchTerm, actionFilter),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, actionFilter]);

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
    auditLogs: data?.data?.logs || [],
    pagination: data?.data?.pagination || null,
    estadisticas: data?.data?.estadisticas || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
    refetch
  };
};
