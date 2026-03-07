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
      // Normalizar payload para soportar multiples formas de respuesta del backend
      const extractCompaniesArray = (payload: any): any[] => {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];

        const candidates = [
          payload.companies,
          payload.data,
          payload.items,
          payload.results,
          payload.rows,
          payload.data?.companies,
          payload.data?.items,
          payload.data?.results,
        ];

        for (const candidate of candidates) {
          if (Array.isArray(candidate)) return candidate;
        }

        return [];
      };

      const companiesArray = extractCompaniesArray(data);

      const empresasRaw = companiesArray
        .filter((c: any) => c && typeof c.name === 'string' && c.name.trim().length > 0)
        .map((c: any) => ({
          ruc: String(c.ruc || c.id || c.name).trim(),
          name: String(c.name).trim(),
        }));

      const empresasUnicas = Array.from(
        new Map(empresasRaw.map((c: any) => [c.ruc || c.name, c])).values()
      );
      setEmpresas(empresasUnicas as { ruc: string; name: string }[]);
    } else if (error) {
      if ((error as any)?.response?.status === 403) {
      }
      setEmpresas([]);
    }
  }, [data, error]);

  useEffect(() => {
    setLoadingEmpresas(isLoading);
  }, [isLoading]);

  return { empresas, loadingEmpresas, fetchEmpresas };
};