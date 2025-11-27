import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import {
  getMetodosPagoFn,
  getMetodoPagoFn,
  createMetodoPagoFn,
  updateMetodoPagoFn,
  deleteMetodoPagoFn,
} from '@/queries/metodos-pago';
import {
  CreateMetodoPagoDto,
  UpdateMetodoPagoDto,
} from '@/common/types/metodo-pago';

export const METODOS_PAGO_QUERY_KEY = ['metodos-pago'];

export const useMetodosPagoQuery = () => {
  return useQuery({
    queryKey: METODOS_PAGO_QUERY_KEY,
    queryFn: getMetodosPagoFn,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMetodoPagoQuery = (id: number) => {
  return useQuery({
    queryKey: [...METODOS_PAGO_QUERY_KEY, id],
    queryFn: () => getMetodoPagoFn(id),
    enabled: !!id,
  });
};

export const useCreateMetodoPagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateMetodoPagoDto) => createMetodoPagoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: METODOS_PAGO_QUERY_KEY });
      showSuccessToast('Éxito', 'Método de pago creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear el método de pago'
      );
    },
  });
};

export const useUpdateMetodoPagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMetodoPagoDto }) =>
      updateMetodoPagoFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: METODOS_PAGO_QUERY_KEY });
      showSuccessToast('Éxito', 'Método de pago actualizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo actualizar el método de pago'
      );
    },
  });
};

export const useDeleteMetodoPagoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteMetodoPagoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: METODOS_PAGO_QUERY_KEY });
      showSuccessToast('Éxito', 'Método de pago eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo eliminar el método de pago'
      );
    },
  });
};
