import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';

export const usePlacas = () => {
  const [placas, setPlacas] = useState<{ plateNumber: string }[]>([]);
  const [loadingPlacas, setLoadingPlacas] = useState(false);
  const [busquedaPlaca, setBusquedaPlaca] = useState('');

  const { data, refetch: fetchPlacas, isLoading, error } = useQuery({
    queryKey: ['placas-documentos'],
    queryFn: () => documentosService.getPlacas(),
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      const placasRaw = (data.vehicles || []).filter((v: any) => 
        v.placa && v.placa.plateNumber && typeof v.placa.plateNumber === 'string'
      );
      const placasUnicas = Array.from(
        new Map(placasRaw.map((v: any) => [v.placa.plateNumber, v.placa])).values()
      );
      setPlacas(placasUnicas as { plateNumber: string }[]);
    } else if (error) {
      setPlacas([]);
    }
  }, [data, error]);

  useEffect(() => {
    setLoadingPlacas(isLoading);
  }, [isLoading]);

  const buscarPlacas = async (texto: string) => {
    setLoadingPlacas(true);
    try {
      const data = await documentosService.searchPlacas(texto);
      const placasRaw = (data.vehicles || []).filter((v: any) => v.placa && v.placa.plateNumber && typeof v.placa.plateNumber === 'string');
      const placasUnicas = Array.from(new Map(placasRaw.map((v: any) => [v.placa.plateNumber, v.placa])).values());
      setPlacas(placasUnicas as { plateNumber: string }[]);
    } catch (e) {
      setPlacas([]);
    } finally {
      setLoadingPlacas(false);
    }
  };

  const debouncedBuscarPlacas = debounce((texto: string) => {
    buscarPlacas(texto);
  }, 400);

  useEffect(() => {
    if (busquedaPlaca.length >= 3) {
      debouncedBuscarPlacas(busquedaPlaca);
    } else if (busquedaPlaca.length === 0) {
      fetchPlacas();
    } else {
      setPlacas([]);
    }
    return debouncedBuscarPlacas.cancel;
  }, [busquedaPlaca, fetchPlacas]);

  return { placas, loadingPlacas, fetchPlacas };
};