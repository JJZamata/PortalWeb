import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';

export const useVehiculoDetail = () => {
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehiculoDetail', selectedPlate],
    queryFn: () => vehiculosService.getVehiculoDetail(selectedPlate!),
    enabled: !!selectedPlate,
  });

  const fetchVehiculoDetail = (plate: string | null) => {
    setSelectedPlate(plate);
  };

  return {
    vehiculoDetail: data || null,
    loadingDetail: isLoading,
    errorDetail: error?.message || null,
    fetchVehiculoDetail,
  };
};