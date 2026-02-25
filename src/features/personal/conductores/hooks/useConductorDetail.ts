import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { conductoresService } from '../services/conductoresService';

export const useConductorDetail = () => {
  const [selectedDni, setSelectedDni] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['conductorDetail', selectedDni],
    queryFn: () => conductoresService.getConductorDetail(selectedDni!),
    enabled: !!selectedDni,
  });

  const fetchConductorDetail = (dni: string | null) => {
    if (!dni) {
      setSelectedDni(null);
      return;
    }

    if (dni === selectedDni) {
      refetch();
      return;
    }

    setSelectedDni(dni);
  };

  const refreshConductorDetail = () => {
    if (selectedDni) {
      refetch();
    }
  };

  return {
    conductorDetail: data?.conductor || null,
    licencias: data?.licencias || [],
    licenciasSummary: data?.summary || null,
    loadingDetail: isLoading,
    errorDetail: error?.message || null,
    fetchConductorDetail,
    refreshConductorDetail,
  };
};