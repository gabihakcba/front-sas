/**
 * Custom Hooks de React Query para Adultos
 * Capa de integración con TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import {
  getAdultosFn,
  updateAdultoFn,
  createAdultoFn,
  deleteAdultoFn,
  paseAdultoFn,
} from '@/queries/adultos';
import type {
  UpdateAdultoDto,
  CreateAdultoDto,
  PaseAdultoDto,
} from '@/common/types/adulto';

/**
 * Query Key para cache de adultos
 */
export const ADULTOS_QUERY_KEY = ['adultos'];

/**
 * Hook para obtener la lista de adultos
 */
export const useAdultosQuery = () => {
  return useQuery({
    queryKey: ADULTOS_QUERY_KEY,
    queryFn: getAdultosFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar un adulto
 */
export const useUpdateAdultoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdultoDto }) =>
      updateAdultoFn(id, data),
    onSuccess: () => {
      // Invalidar query para refrescar datos
      queryClient.invalidateQueries({ queryKey: ADULTOS_QUERY_KEY });

      // Mostrar toast de éxito
      showSuccessToast('Éxito', 'Adulto actualizado correctamente');
    },
    onError: (error: any) => {
      // Mostrar toast de error
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo actualizar el adulto'
      );
    },
  });
};

/**
 * Hook para crear un nuevo adulto
 */
export const useCreateAdultoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAdultoDto) => createAdultoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADULTOS_QUERY_KEY });
      showSuccessToast('Éxito', 'Adulto creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear el adulto'
      );
    },
  });
};

/**
 * Hook para eliminar un adulto
 */
export const useDeleteAdultoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteAdultoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADULTOS_QUERY_KEY });
      showSuccessToast('Éxito', 'Adulto eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo eliminar el adulto'
      );
    },
  });
};

/**
 * Hook para realizar un Pase de Adulto (Cambio de Cargo/Área)
 */
export const usePaseAdultoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PaseAdultoDto }) =>
      paseAdultoFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADULTOS_QUERY_KEY });
      showSuccessToast('Éxito', 'Pase realizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo realizar el pase'
      );
    },
  });
};
