import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentosService } from '../services/documentosService';
import { TechnicalReviewDetail } from '../types';

interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    message: string;
    value?: string;
    location?: string;
  }>;
}

export const useTechnicalReviewDetail = () => {
  const [technicalReviewDetail, setTechnicalReviewDetail] = useState<TechnicalReviewDetail | null>(null);
  const [queryParams, setQueryParams] = useState<{ reviewCode: string } | null>(null);

  const { isLoading, error } = useQuery({
    queryKey: ['technicalReviewDetail', queryParams?.reviewCode],
    queryFn: async () => {
      if (!queryParams) return null;
      const response = await documentosService.getTechnicalReviewByCode(queryParams.reviewCode);
      setTechnicalReviewDetail(response);
      return response;
    },
    enabled: !!queryParams,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });

  const fetchTechnicalReviewDetail = async (reviewCode: string) => {
    setQueryParams({ reviewCode });
  };

  const clearTechnicalReviewDetail = () => {
    setTechnicalReviewDetail(null);
    setQueryParams(null);
  };

  // Función para extraer el mensaje de error correctamente
  const getErrorMessage = (): string | null => {
    if (!error) return null;

    // Si es un error de la API con la estructura esperada
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = (error as any).response?.data as ApiError;

      if (apiError?.errors && apiError.errors.length > 0) {
        // Retornar el primer mensaje de error detallado
        return apiError.errors[0].message;
      }

      if (apiError?.message) {
        return apiError.message;
      }
    }

    // Si es un Error estándar de JavaScript
    if (error instanceof Error) {
      return error.message;
    }

    // Fallback: convertir a string
    return String(error);
  };

  return {
    technicalReviewDetail,
    loadingDetail: isLoading,
    errorDetail: getErrorMessage(),
    fetchTechnicalReviewDetail,
    clearTechnicalReviewDetail,
  };
};