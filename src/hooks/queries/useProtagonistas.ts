/**
 * Custom Hooks de React Query para Protagonistas
 * Capa de integración con TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import {
  getProtagonistasFn,
  updateProtagonistaFn,
  createProtagonistaFn,
  deleteProtagonistaFn,
  paseRamaFn,
} from '@/queries/protagonistas';
import type {
  UpdateProtagonistaDto,
  CreateProtagonistaDto,
} from '@/common/types/protagonista';

/**
 * Query Key para cache de protagonistas
 */
export const PROTAGONISTAS_QUERY_KEY = ['protagonistas'];

/**
 * Hook para obtener la lista de protagonistas
 */
export const useProtagonistasQuery = () => {
  return useQuery({
    queryKey: PROTAGONISTAS_QUERY_KEY,
    queryFn: getProtagonistasFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar un protagonista
 */
export const useUpdateProtagonistaMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProtagonistaDto }) =>
      updateProtagonistaFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROTAGONISTAS_QUERY_KEY });
      showSuccessToast('Éxito', 'Protagonista actualizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo actualizar el protagonista'
      );
    },
  });
};

/**
 * Hook para crear un nuevo protagonista
 */
export const useCreateProtagonistaMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProtagonistaDto) => createProtagonistaFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROTAGONISTAS_QUERY_KEY });
      showSuccessToast('Éxito', 'Protagonista creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear el protagonista'
      );
    },
  });
};

/**
 * Hook para eliminar un protagonista
 */
export const useDeleteProtagonistaMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteProtagonistaFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROTAGONISTAS_QUERY_KEY });
      showSuccessToast('Éxito', 'Protagonista eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo eliminar el protagonista'
      );
    },
  });
};

/**
 * Hook para realizar pase de rama
 */
export const usePaseRamaMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      id_nueva_rama,
    }: {
      id: number;
      id_nueva_rama: number;
    }) => paseRamaFn(id, id_nueva_rama),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROTAGONISTAS_QUERY_KEY });
      showSuccessToast('Éxito', 'Pase de rama realizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo realizar el pase de rama'
      );
    },
  });
};
