import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getComisionesByEventoFn,
  createComisionFn,
  deleteComisionFn,
  addParticipanteFn,
  removeParticipanteFn,
} from '@/queries/comisiones';
import { CreateComisionDto, AddParticipanteDto } from '@/common/types/comision';
import { useToast } from '@/providers/ToastProvider';

export const COMISIONES_QUERY_KEY = ['comisiones'];

export const useComisionesEventoQuery = (idEvento: number) => {
  return useQuery({
    queryKey: [...COMISIONES_QUERY_KEY, 'evento', idEvento],
    queryFn: () => getComisionesByEventoFn(idEvento),
    enabled: !!idEvento,
  });
};

export const useCreateComisionMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateComisionDto) => createComisionFn(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...COMISIONES_QUERY_KEY, 'evento', variables.id_evento],
      });
      showSuccessToast(
        'Comisión creada',
        'La comisión se ha creado correctamente'
      );
    },
    onError: (error: any) => {
      showErrorToast(
        'Error al crear comisión',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};

export const useDeleteComisionMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteComisionFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMISIONES_QUERY_KEY });
      showSuccessToast(
        'Comisión eliminada',
        'La comisión se ha eliminado correctamente'
      );
    },
    onError: (error: any) => {
      showErrorToast(
        'Error al eliminar comisión',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};

export const useAddParticipanteMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: AddParticipanteDto) => addParticipanteFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMISIONES_QUERY_KEY });
      showSuccessToast(
        'Participante agregado',
        'El miembro se ha asignado correctamente a la comisión'
      );
    },
    onError: (error: any) => {
      showErrorToast(
        'Error al asignar miembro',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};

export const useRemoveParticipanteMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => removeParticipanteFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMISIONES_QUERY_KEY });
      showSuccessToast(
        'Participante removido',
        'El miembro se ha quitado de la comisión correctamente'
      );
    },
    onError: (error: any) => {
      showErrorToast(
        'Error al remover participante',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};
