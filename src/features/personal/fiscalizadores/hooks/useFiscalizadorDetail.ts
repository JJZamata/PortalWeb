// src/features/gestion/fiscalizadores/hooks/useFiscalizadorDetail.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchFiscalizadorDetail } from '../services/fiscalizadoresService';
import { FiscalizadorDetallado } from '../types';

export const useFiscalizadorDetail = (id: number | null) => {
  const [fiscalizadorDetallado, setFiscalizadorDetallado] = useState<FiscalizadorDetallado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await fetchFiscalizadorDetail(id);
      if (response.success) {
        setFiscalizadorDetallado(response.data);
      }
    } catch (error) {
      // Manejo genérico del error sin depender de axios.isAxiosError
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener los detalles';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  return { fiscalizadorDetallado, loading, error, fetchDetail };
};