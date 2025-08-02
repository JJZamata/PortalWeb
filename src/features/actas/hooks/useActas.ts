import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
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

const fetchRecords = async (
  currentPage: number,
  limit: number,
  searchTerm: string,
  recordType: string,
  sortBy: string,
  sortOrder: string
) => {
  const params = new URLSearchParams({
    page: currentPage.toString(),
    limit: limit.toString(),
    search: searchTerm,
    type: recordType,
    sortBy: sortBy,
    sortOrder: sortOrder
  });

  const response = await axiosInstance.get(`/records?${params.toString()}`);

  if (response.data.success) {
    return {
      records: response.data.data,
      pagination: {
        currentPage: response.data.currentPage,
        totalPages: response.data.pages,
        totalItems: response.data.total,
        itemsPerPage: limit,
        hasNextPage: response.data.currentPage < response.data.pages,
        hasPrevPage: response.data.currentPage > 1,
        nextPage: response.data.currentPage < response.data.pages ? response.data.currentPage + 1 : null,
        prevPage: response.data.currentPage > 1 ? response.data.currentPage - 1 : null
      },
      summary: response.data.summary
    };
  }
  
  throw new Error('Failed to fetch records');
};

export const useActas = (
  currentPage: number,
  limit: number,
  searchTerm: string,
  recordType: string,
  sortBy: string,
  sortOrder: string
) => {
  const lastPageChangeRef = useRef<number>(0);
  
  // Hook para preservar scroll position
  const { preparePageChange } = useScrollPreservation({ 
    isLoading: false 
  });

  // Usar React Query para cache y optimización
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actas', currentPage, limit, searchTerm, recordType, sortBy, sortOrder],
    queryFn: () => fetchRecords(currentPage, limit, searchTerm, recordType, sortBy, sortOrder),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const handlePageChange = (newPage: number) => {
    const now = Date.now();
    
    // Prevenir múltiples clicks rápidos (menos de 500ms)
    if (now - lastPageChangeRef.current < 500) {
      return;
    }
    
    lastPageChangeRef.current = now;
    preparePageChange(); // Guardar posición antes del cambio
  };

  const refreshRecords = () => {
    refetch();
  };

  return {
    records: data?.records || [],
    loading: isLoading,
    error: error ? (axios.isAxiosError(error)
      ? error.response?.data?.message || 'Error al cargar las actas'
      : 'Error al cargar las actas') : null,
    pagination: data?.pagination || null,
    summary: data?.summary || null,
    refreshRecords,
    handlePageChange
  };
};