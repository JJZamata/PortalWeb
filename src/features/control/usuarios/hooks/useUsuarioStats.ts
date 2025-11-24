import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';
import { UsuarioStatsParams } from '../types';

export const useUsuarioStats = (groupBy: UsuarioStatsParams['groupBy'] = 'all') => {
  const [currentGroupBy, setCurrentGroupBy] = useState<UsuarioStatsParams['groupBy']>(groupBy);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarioStats', currentGroupBy],
    queryFn: () => usuariosService.getUsuariosStats({ groupBy: currentGroupBy }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateGroupBy = (newGroupBy: UsuarioStatsParams['groupBy']) => {
    setCurrentGroupBy(newGroupBy);
  };

  const refreshStats = () => {
    refetch();
  };

  return {
    stats: data?.data || null,
    loading: isLoading,
    error: error?.message || null,
    groupBy: currentGroupBy,
    updateGroupBy,
    refreshStats,
  };
};