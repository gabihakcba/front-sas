import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import {
  getResponsablesFn,
  getResponsableFn,
  createResponsableFn,
  updateResponsableFn,
  deleteResponsableFn,
  createResponsableFromAdultoFn,
} from '@/queries/responsables';
import type {
  CreateResponsableDto,
  UpdateResponsableDto,
} from '@/common/types/responsable';

export const RESPONSABLES_QUERY_KEY = ['responsables'];

export const useResponsablesQuery = () => {
  return useQuery({
    queryKey: RESPONSABLES_QUERY_KEY,
    queryFn: getResponsablesFn,
    staleTime: 5 * 60 * 1000,
  });
};

export const useResponsableQuery = (id: number) => {
  return useQuery({
    queryKey: [...RESPONSABLES_QUERY_KEY, id],
    queryFn: () => getResponsableFn(id),
    enabled: !!id,
  });
};

export const useCreateResponsableMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateResponsableDto) => createResponsableFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESPONSABLES_QUERY_KEY });
      showSuccessToast('Éxito', 'Responsable creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear el responsable'
      );
    },
  });
};

export const useUpdateResponsableMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateResponsableDto }) =>
      updateResponsableFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESPONSABLES_QUERY_KEY });
      showSuccessToast('Éxito', 'Responsable actualizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo actualizar el responsable'
      );
    },
  });
};

export const useDeleteResponsableMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteResponsableFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESPONSABLES_QUERY_KEY });
      showSuccessToast('Éxito', 'Responsable eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo eliminar el responsable'
      );
    },
  });
};

export const useCreateResponsableFromAdultoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: { id_adulto: number }) =>
      createResponsableFromAdultoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESPONSABLES_QUERY_KEY });
      showSuccessToast('Éxito', 'Responsable importado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo importar el responsable'
      );
    },
  });
};
