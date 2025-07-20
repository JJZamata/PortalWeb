import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';

export const useEmpresaDetail = () => {
  const [selectedRuc, setSelectedRuc] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['empresaDetail', selectedRuc],
    queryFn: () => empresasService.getEmpresaDetail(selectedRuc!),
    enabled: !!selectedRuc,
  });

  const fetchEmpresaDetail = (ruc: string | null) => {
    setSelectedRuc(ruc);
  };

  return {
    empresaDetail: data || null,
    loadingDetail: isLoading,
    errorDetail: error?.message || null,
    fetchEmpresaDetail,
  };
};