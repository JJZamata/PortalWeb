import { useQuery } from '@tanstack/react-query';
import { vehiculosService } from '../services/vehiculosService';

export const useVehiculosQuery = (page: number, searchTerm: string) => {
  return useQuery({
    queryKey: ['vehiculos', page, searchTerm],
    queryFn: () => vehiculosService.getVehiculos(page, searchTerm),
    staleTime: 5 * 60 * 1000,
  });
};