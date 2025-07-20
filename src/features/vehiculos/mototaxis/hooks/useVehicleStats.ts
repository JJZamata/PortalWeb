import { useQuery } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';

export const useVehicleStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicleStats'],
    queryFn: () => vehiculosService.getVehicleStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    stats: data || null,
    loading: isLoading,
    error: error?.message || null,
  };
};
