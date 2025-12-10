import { useMutation, useQueryClient } from '@tanstack/react-query';
import { infraccionesService } from '../services/infraccionesService';
import type { CreateViolationRequest, ViolationDetailResponse } from '../types';

/**
 * Hook para crear una nueva infracción
 */
export const useCreateInfraccionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ViolationDetailResponse, Error, CreateViolationRequest>({
    mutationFn: (data) => infraccionesService.createInfraccion(data),
    onSuccess: () => {
      // Invalidar queries relevantes para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['violations', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['violations', 'stats'] });
    },
  });
};

/**
 * Hook para actualizar una infracción existente
 */
export const useUpdateInfraccionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ViolationDetailResponse,
    Error,
    { code: string; data: Partial<CreateViolationRequest> }
  >({
    mutationFn: ({ code, data }) => infraccionesService.updateInfraccion(code, data),
    onSuccess: (_, { code }) => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['violations', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['violationDetail', code] });
      queryClient.invalidateQueries({ queryKey: ['violations', 'stats'] });
    },
  });
};

/**
 * Hook para eliminar una infracción
 */
export const useDeleteInfraccionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    string
  >({
    mutationFn: (code) => infraccionesService.deleteInfraccion(code),
    onSuccess: () => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['violations', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['violations', 'stats'] });
    },
  });
};