import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { actasService } from '../services/actasService';
import { RecordDetailed } from '../types';

export const useActaDetail = () => {
  const [recordDetailed, setRecordDetailed] = useState<RecordDetailed | null>(null);
  const [queryParams, setQueryParams] = useState<{ id: number; type: 'conforme' | 'noconforme' } | null>(null);

  const { isLoading, error } = useQuery({
    queryKey: ['actaDetail', queryParams?.id, queryParams?.type],
    queryFn: async () => {
      if (!queryParams) return null;
      const response = await actasService.getActaDetail(queryParams.id, queryParams.type);
      setRecordDetailed(response.data);
      return response.data;
    },
    enabled: !!queryParams,
  });

  const fetchRecordDetail = async (id: number, type: 'conforme' | 'noconforme') => {
    setQueryParams({ id, type });
  };

  return {
    recordDetailed,
    loadingDetail: isLoading,
    errorDetail: error?.message || null,
    fetchRecordDetail,
  };
};
