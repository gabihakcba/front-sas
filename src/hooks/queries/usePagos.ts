import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPagosFn,
  createPagoFn,
  updatePagoFn,
  deletePagoFn,
} from '@/queries/pagos';
import { CreatePagoDto, UpdatePagoDto } from '@/common/types/pago';

import { useToast } from '@/providers/ToastProvider';

export const usePagosQuery = () => {
  return useQuery({
    queryKey: ['pagos'],
    queryFn: getPagosFn,
  });
};

export const useCreatePagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePagoDto) => createPagoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
      showSuccessToast('Éxito', 'Pago registrado correctamente');
    },
    onError: (error: any) => {
      showErrorToast('Error', error.message || 'Error al registrar el pago');
    },
  });
};

export const useUpdatePagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePagoDto }) =>
      updatePagoFn({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
      showSuccessToast('Éxito', 'Pago actualizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast('Error', error.message || 'Error al actualizar el pago');
    },
  });
};

export const useDeletePagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deletePagoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
      showSuccessToast('Éxito', 'Pago eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast('Error', error.message || 'Error al eliminar el pago');
    },
  });
};
