import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';

export const useEmpresasQuery = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: () => documentosService.getEmpresas(),
    enabled: false,
  });
};