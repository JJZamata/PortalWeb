import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<{ ruc: string; name: string }[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  const { data, refetch: fetchEmpresas, isLoading, error } = useQuery({
    queryKey: ['empresas-documentos'],
    queryFn: () => documentosService.getEmpresas(),
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      const empresasRaw = (data.companies || []).filter((c: any) => 
        c.ruc && typeof c.ruc === 'string' && c.name && typeof c.name === 'string'
      );
      const empresasUnicas = Array.from(
        new Map(empresasRaw.map((c: any) => [c.ruc, c])).values()
      );
      setEmpresas(empresasUnicas as { ruc: string; name: string }[]);
    } else if (error) {
      setEmpresas([]);
    }
  }, [data, error]);

  useEffect(() => {
    setLoadingEmpresas(isLoading);
  }, [isLoading]);

  return { empresas, loadingEmpresas, fetchEmpresas };
};