import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<{ ruc: string; name: string }[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  const { data, refetch: fetchEmpresas, isLoading, error } = useQuery({
    queryKey: ['empresas-documentos'],
    queryFn: () => documentosService.getEmpresas(),
    enabled: false, // Se ejecuta manualmente
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      // No reintentar si es 403 (Forbidden)
      if (error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    }
  });

  useEffect(() => {
    if (data) {
      const companiesArray = data.companies || data || []; // Intentar diferentes estructuras
      
      const empresasRaw = companiesArray.filter((c: any) => {
        return c && (c.ruc || c.id) && c.name && typeof c.name === 'string';
      });
      
      const empresasUnicas = Array.from(
        new Map(empresasRaw.map((c: any) => [c.ruc || c.id, c])).values()
      );
      setEmpresas(empresasUnicas as { ruc: string; name: string }[]);
    } else if (error) {
      if ((error as any)?.response?.status === 403) {
        console.warn('Sin permisos para acceder a empresas. El formulario funcionará sin el listado de empresas.');
      }
      setEmpresas([]);
    }
  }, [data, error]);

  useEffect(() => {
    setLoadingEmpresas(isLoading);
  }, [isLoading]);

  return { empresas, loadingEmpresas, fetchEmpresas };
};