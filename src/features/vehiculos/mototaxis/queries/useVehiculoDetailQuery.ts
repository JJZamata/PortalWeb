import { useQuery } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';

export const useVehiculoDetailQuery = (plate: string | null) => {
  return useQuery({
    queryKey: ['vehiculoDetail', plate],
    queryFn: () => vehiculosService.getVehiculoDetail(plate!),
    enabled: !!plate,
  });
};