import { useQuery } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';

export const useEmpresasQuery = (page: number, searchTerm: string, statusFilter: string) => {
  return useQuery({
    queryKey: ['empresas', page, searchTerm, statusFilter],
    queryFn: () => empresasService.getEmpresas(page, searchTerm, statusFilter),
    staleTime: 5 * 60 * 1000,
  });
};