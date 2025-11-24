import { useQuery } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';

export const useVehicleStats = (dateFrom?: string, dateTo?: string, groupBy: string = 'all') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicleStats', dateFrom, dateTo, groupBy],
    queryFn: () => vehiculosService.getStats(dateFrom, dateTo, groupBy),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    stats: data || null,
    loading: isLoading,
    error: error?.message || null,
    validationErrors: (error as any)?.validationErrors || null,
  };
};
