import { useQuery } from '@tanstack/react-query';
import { empresasService } from '../services/empresasService';

export const useEmpresaDetailQuery = (ruc: string | null) => {
  return useQuery({
    queryKey: ['empresaDetail', ruc],
    queryFn: () => empresasService.getEmpresaDetail(ruc!),
    enabled: !!ruc,
  });
};