import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import {
  getCuentasDineroFn,
  getCuentaDineroFn,
  createCuentaDineroFn,
  updateCuentaDineroFn,
  deleteCuentaDineroFn,
} from '@/queries/cuentas-dinero';
import {
  CreateCuentaDineroDto,
  UpdateCuentaDineroDto,
} from '@/common/types/cuenta-dinero';

export const CUENTAS_DINERO_QUERY_KEY = ['cuentas-dinero'];

export const useCuentasDineroQuery = () => {
  return useQuery({
    queryKey: CUENTAS_DINERO_QUERY_KEY,
    queryFn: getCuentasDineroFn,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCuentaDineroQuery = (id: number) => {
  return useQuery({
    queryKey: [...CUENTAS_DINERO_QUERY_KEY, id],
    queryFn: () => getCuentaDineroFn(id),
    enabled: !!id,
  });
};

export const useCreateCuentaDineroMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCuentaDineroDto) => createCuentaDineroFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUENTAS_DINERO_QUERY_KEY });
      showSuccessToast('Éxito', 'Cuenta de dinero creada correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear la cuenta de dinero'
      );
    },
  });
};

export const useUpdateCuentaDineroMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCuentaDineroDto }) =>
      updateCuentaDineroFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUENTAS_DINERO_QUERY_KEY });
      showSuccessToast('Éxito', 'Cuenta de dinero actualizada correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo actualizar la cuenta de dinero'
      );
    },
  });
};

export const useDeleteCuentaDineroMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteCuentaDineroFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUENTAS_DINERO_QUERY_KEY });
      showSuccessToast('Éxito', 'Cuenta de dinero eliminada correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message ||
          'No se pudo eliminar la cuenta de dinero'
      );
    },
  });
};
