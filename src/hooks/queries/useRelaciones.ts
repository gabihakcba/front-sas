import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/providers/ToastProvider';
import { getRelacionesFn, crearRelacionFn } from '@/queries/relaciones';

export const RELACIONES_QUERY_KEY = ['relaciones'];

export const useRelacionesQuery = () => {
  return useQuery({
    queryKey: RELACIONES_QUERY_KEY,
    queryFn: getRelacionesFn,
    staleTime: 60 * 60 * 1000, // 1 hora (catalog data)
  });
};

export const useCrearRelacionMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: crearRelacionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsables'] });
      queryClient.invalidateQueries({ queryKey: ['protagonistas'] });
      showSuccessToast('Éxito', 'Vínculo creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'No se pudo crear el vínculo'
      );
    },
  });
};
