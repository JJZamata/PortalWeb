import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { actasService } from '../services/actasService';
import { useScrollPreservation } from '@/hooks/useScrollPreservation';

interface Record {
  id: number;
  recordType: 'conforme' | 'noconforme';
  vehiclePlate: string;
  location: string;
  observations: string;
  inspectionDateTime: string;
  createdAt: string;
  updatedAt: string;
  inspector: {
    id: number;
    username: string;
    email: string;
  };
  driver: {
    name: string;
    dni: string;
    phone: string;
    licenseNumber: string;
    category: string;
  } | null;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
  } | null;
  company: {
    ruc: string;
    name: string;
    address: string;
  } | null;
  checklist: {
    seatbelt: boolean;
    cleanliness: boolean;
    tires: boolean;
    firstAidKit: boolean;
    fireExtinguisher: boolean;
    lights: boolean;
  } | null;
  photosCount: number;
  violations: Array<{
    id: number;
    code: string;
    description: string;
    severity: string;
    uitPercentage: number;
  }>;
  violationsCount: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface SummaryData {
  totalCompliant: number;
  totalNonCompliant: number;
  totalRecords: number;
}

// Eliminado - ahora usa actasService.getActas() directamente

export const useActas = (page: number, searchTerm: string = '', recordType: string = 'all', sortBy: string = 'inspectionDateTime', sortOrder: string = 'DESC') => {
  const lastPageChangeRef = useRef<number>(0);

  // Debug: Log parameters being passed to the hook
  console.log('🎯 useActas llamado con parámetros:', {
    page,
    searchTerm: searchTerm.length >= 2 ? searchTerm : `(demasiado corto: ${searchTerm.length} chars)`,
    recordType,
    sortBy,
    sortOrder
  });

  // Validaciones según backend FISCAMOTO para records
  const SEARCH_MIN_LENGTH = 2;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actas', page, searchTerm, recordType, sortBy, sortOrder],
    queryFn: () => actasService.getActas(page, searchTerm, recordType, sortBy, sortOrder),
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log('✅ React Query data received:', {
        recordsCount: data?.records?.length || 0,
        currentPage: data?.pagination?.currentPage,
        totalPages: data?.pagination?.totalPages,
        totalItems: data?.pagination?.totalItems
      });
    }
  });

  // Separate query for stats (similar a otros módulos)
  const { data: statsData } = useQuery({
    queryKey: ['actas-stats'],
    queryFn: () => actasService.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Resetear a página 1 cuando cambia el término de búsqueda
      if (searchTerm.length >= SEARCH_MIN_LENGTH || searchTerm.length === 0) {
        // Esto se manejará en el componente principal que controla la página
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    const now = Date.now();

    // Prevenir múltiples clicks rápidos (menos de 500ms)
    if (now - lastPageChangeRef.current < 500) {
      return;
    }

    lastPageChangeRef.current = now;
    preparePageChange(); // Guardar posición antes del cambio
  };

  return {
    records: data?.records || [],         // Actas listadas
    pagination: data?.pagination || null,
    summary: data?.summary || null,        // Summary del listado (si existe)
    stats: statsData || null,             // Estadísticas del endpoint /api/records/stats
    loading: isLoading,
    error: error?.message || null,
    page,
    handlePageChange,
    refreshRecords: refetch,              // Función para refrescar los datos
  };
};