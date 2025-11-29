import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConsejosFn,
  createConsejoFn,
  updateConsejoFn,
  deleteConsejoFn,
} from '@/queries/consejos';
import { CreateConsejoDto, UpdateConsejoDto } from '@/common/types/consejo';
import { useToast } from '@/providers/ToastProvider';

export const useConsejosQuery = () => {
  return useQuery({
    queryKey: ['consejos'],
    queryFn: getConsejosFn,
  });
};

export const useCreateConsejoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateConsejoDto) => createConsejoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consejos'] });
      showSuccessToast('Éxito', 'Consejo creado correctamente');
    },
    onError: (error: any) => {
      showErrorToast('Error', error.message || 'Error al crear el consejo');
    },
  });
};

export const useUpdateConsejoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateConsejoDto }) =>
      updateConsejoFn({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consejos'] });
      showSuccessToast('Éxito', 'Consejo actualizado correctamente');
    },
    onError: (error: any) => {
      showErrorToast(
        'Error',
        error.message || 'Error al actualizar el consejo'
      );
    },
  });
};

export const useDeleteConsejoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteConsejoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consejos'] });
      showSuccessToast('Éxito', 'Consejo eliminado correctamente');
    },
    onError: (error: any) => {
      showErrorToast('Error', error.message || 'Error al eliminar el consejo');
    },
  });
};
