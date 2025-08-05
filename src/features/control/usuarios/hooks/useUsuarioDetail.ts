import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';

export const useUsuarioDetail = () => {
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarioDetail', selectedUsuarioId],
    queryFn: () => selectedUsuarioId ? usuariosService.getUsuarioDetail(selectedUsuarioId) : null,
    enabled: !!selectedUsuarioId,
    staleTime: 5 * 60 * 1000,
  });

  const fetchUsuarioDetail = (id: number | null) => {
    setSelectedUsuarioId(id);
  };

  return {
    usuarioDetail: data?.data || null,
    loadingDetail: isLoading,
    errorDetail: error?.message || null,
    fetchUsuarioDetail,
    refetchDetail: refetch
  };
};
