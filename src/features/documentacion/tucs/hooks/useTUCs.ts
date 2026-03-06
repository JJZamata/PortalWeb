import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import tucService from '../services/tucService';
import { TUCFilters, TUCData } from '../types';

const parseDateSafe = (dateValue?: string) => {
  const raw = String(dateValue || '').trim();
  if (!raw) return null;

  const dateOnlyFromIso = raw.includes('T') ? raw.split('T')[0] : raw;
  const yyyymmdd = dateOnlyFromIso.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (yyyymmdd) {
    const [, yyyy, mm, dd] = yyyymmdd;
    const localDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(localDate.getTime()) ? null : localDate;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeEstado = (tuc: TUCData): TUCData => {
  const currentEstado = tuc.estado;

  if (currentEstado?.descripcion && currentEstado?.color) {
    return tuc;
  }

  const rawStatus = String((tuc as any)?.status || (currentEstado as any)?.codigo || (currentEstado as any)?.descripcion || '').toLowerCase().trim();
  const rawDias = tuc.fechas?.diasRestantes ?? tuc.diasRestantes;
  const diasRestantes = typeof rawDias === 'number' ? rawDias : Number(rawDias);

  let codigo: 'vigente' | 'por_vencer' | 'vencido' = 'vigente';
  let descripcion = 'Vigente';
  let color = 'green';

  if (rawStatus.includes('vencido') || rawStatus.includes('expired')) {
    codigo = 'vencido';
    descripcion = 'Vencido';
    color = 'red';
  } else if (rawStatus.includes('por_vencer') || rawStatus.includes('por vencer') || rawStatus.includes('expiring')) {
    codigo = 'por_vencer';
    descripcion = 'Por vencer';
    color = 'yellow';
  } else if (rawStatus.includes('vigente') || rawStatus.includes('active') || rawStatus.includes('activo')) {
    codigo = 'vigente';
    descripcion = 'Vigente';
    color = 'green';
  } else if (Number.isFinite(diasRestantes)) {
    if (diasRestantes <= 0) {
      codigo = 'vencido';
      descripcion = 'Vencido';
      color = 'red';
    } else if (diasRestantes <= 30) {
      codigo = 'por_vencer';
      descripcion = 'Por vencer';
      color = 'yellow';
    }
  } else {
    const validityDate = parseDateSafe(tuc.fechas?.vigencia ?? tuc.validityDate);
    if (validityDate) {
      const endOfDay = new Date(validityDate);
      endOfDay.setHours(23, 59, 59, 999);
      const diffDays = Math.ceil((endOfDay.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        codigo = 'vencido';
        descripcion = 'Vencido';
        color = 'red';
      } else if (diffDays <= 30) {
        codigo = 'por_vencer';
        descripcion = 'Por vencer';
        color = 'yellow';
      }
    }
  }

  return {
    ...tuc,
    estado: {
      codigo,
      descripcion,
      color,
      icon: currentEstado?.icon,
    },
  };
};

export const useTUCs = (filters: TUCFilters = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tucs', filters],
    queryFn: async () => {
      const response = await tucService.getTUCs({
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const tucsData = data?.data?.data || [];
  const normalizedTucs = tucsData
    .filter((t) => t !== undefined && t !== null)
    .map((t) => normalizeEstado(t));
  
  return {
    tucs: normalizedTucs,
    pagination: data?.data?.pagination || {
      currentPage: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    loading: isLoading,
    error,
    refetch,
  };
};

export const useTUCDetail = () => {
  const [queryParams, setQueryParams] = useState<{ tucNumber: string } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['tucDetail', queryParams?.tucNumber],
    queryFn: async () => {
      if (!queryParams) return null;
      return tucService.getTUCByNumber(queryParams.tucNumber);
    },
    enabled: !!queryParams,
    staleTime: 0,
  });

  return {
    tuc: data?.data,
    loading: isLoading,
    error,
    fetchTUCDetail: (tucNumber: string) => setQueryParams({ tucNumber }),
    clearTUCDetail: () => setQueryParams(null),
  };
};
