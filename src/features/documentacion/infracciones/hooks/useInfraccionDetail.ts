import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { infraccionesService } from '../services/infraccionesService';

export const useInfraccionDetail = () => {
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [violationId, setViolationId] = useState<number | null>(null);

  const { isLoading, error } = useQuery({
    queryKey: ['infraccionDetail', violationId],
    queryFn: async () => {
      if (!violationId) return null;
      const response = await infraccionesService.getInfraccionDetail(violationId);
      setSelectedViolation(response.data);
      return response.data;
    },
    enabled: !!violationId,
  });

  const fetchViolationDetail = async (id: number) => {
    setViolationId(id);
  };

  return {
    selectedViolation,
    loadingDetail: isLoading,
    errorDetail: error?.message || null,
    fetchViolationDetail,
    setSelectedViolation,
  };
};