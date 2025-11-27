import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import {
  getConceptosPagoFn,
  getConceptoPagoFn,
  createConceptoPagoFn,
  updateConceptoPagoFn,
  deleteConceptoPagoFn,
} from '@/queries/conceptos-pago';
import {
  CreateConceptoPagoDto,
  UpdateConceptoPagoDto,
} from '@/common/types/concepto-pago';

export const CONCEPTOS_PAGO_QUERY_KEY = ['conceptos-pago'];

export const useConceptosPagoQuery = () => {
  return useQuery({
    queryKey: CONCEPTOS_PAGO_QUERY_KEY,
    queryFn: getConceptosPagoFn,
    staleTime: 5 * 60 * 1000,
  });
};

export const useConceptoPagoQuery = (id: number) => {
  return useQuery({
    queryKey: [...CONCEPTOS_PAGO_QUERY_KEY, id],
    queryFn: () => getConceptoPagoFn(id),
    enabled: !!id,
  });
};

export const useCreateConceptoPagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateConceptoPagoDto) => createConceptoPagoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONCEPTOS_PAGO_QUERY_KEY });
      showSuccessToast('Éxito', 'Concepto de pago creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear el concepto de pago'
      );
    },
  });
};

export const useUpdateConceptoPagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateConceptoPagoDto }) =>
      updateConceptoPagoFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONCEPTOS_PAGO_QUERY_KEY });
      showSuccessToast('Éxito', 'Concepto de pago actualizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo actualizar el concepto de pago'
      );
    },
  });
};

export const useDeleteConceptoPagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteConceptoPagoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONCEPTOS_PAGO_QUERY_KEY });
      showSuccessToast('Éxito', 'Concepto de pago eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo eliminar el concepto de pago'
      );
    },
  });
};
