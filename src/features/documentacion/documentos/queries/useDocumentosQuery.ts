import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';

export const useDocumentosQuery = (page: number, tipoFiltro: string, searchTerm: string) => {
  return useQuery({
    queryKey: ['documentos', page, searchTerm, tipoFiltro],
    queryFn: () => documentosService.getDocumentos(page, tipoFiltro, searchTerm),
    staleTime: 5 * 60 * 1000,
  });
};