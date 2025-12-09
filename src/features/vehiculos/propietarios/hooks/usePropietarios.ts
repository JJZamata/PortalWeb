import { useQuery } from '@tanstack/react-query';
import { propietariosService } from '../services/propietariosService';

export const usePropietarios = (page: number = 1, searchTerm: string = '') => {
  return useQuery({
    queryKey: ['propietarios', page, searchTerm],
    queryFn: () => propietariosService.getPropietarios(page, searchTerm),
    staleTime: 30000,
  });
};
