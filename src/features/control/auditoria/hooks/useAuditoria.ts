import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditoriaService } from '../services/auditoriaService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

const AUTO_REFRESH_MS = 30000;

export const useAuditoria = (searchTerm: string, actionFilter: string) => {
  const [page, setPage] = useState(1);
  const lastPageChangeRef = useRef<number>(0);
  const limit = 6;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['auditoria', page, searchTerm, actionFilter],
    queryFn: () => auditoriaService.getAuditLogs(page, limit, searchTerm, actionFilter),
    staleTime: 15000,
    refetchInterval: AUTO_REFRESH_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, actionFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) {
      return;
    }

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
    handlePageChange,
    refetch
  };
};
