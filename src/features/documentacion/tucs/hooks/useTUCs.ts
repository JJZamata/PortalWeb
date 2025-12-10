import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import tucService from '../services/tucService';
import { TUCFilters } from '../types';

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
  
  return {
    tucs: tucsData.filter(t => t !== undefined && t !== null),
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
