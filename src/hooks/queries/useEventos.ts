import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEventosFn,
  getEventoFn,
  createEventoFn,
  updateEventoFn,
  deleteEventoFn,
} from '@/queries/eventos';
import { CreateEventoDto, UpdateEventoDto } from '@/common/types/evento';
import { useToast } from '@/providers/ToastProvider';

export const EVENTOS_QUERY_KEY = ['eventos'];

export const useEventosQuery = () => {
  return useQuery({
    queryKey: EVENTOS_QUERY_KEY,
    queryFn: getEventosFn,
  });
};

export const useEventoQuery = (id: number) => {
  return useQuery({
    queryKey: [...EVENTOS_QUERY_KEY, id],
    queryFn: () => getEventoFn(id),
    enabled: !!id,
  });
};

export const useCreateEventoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEventoDto) => createEventoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_QUERY_KEY });
      showSuccessToast('Evento creado', 'El evento se ha creado correctamente');
    },
    onError: (error: any) => {
      console.log(error);
      showErrorToast(
        'Error al crear evento',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};

export const useUpdateEventoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventoDto }) =>
      updateEventoFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_QUERY_KEY });
      showSuccessToast(
        'Evento actualizado',
        'El evento se ha actualizado correctamente'
      );
    },
    onError: (error: any) => {
      showErrorToast(
        'Error al actualizar evento',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};

export const useDeleteEventoMutation = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteEventoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_QUERY_KEY });
      showSuccessToast(
        'Evento eliminado',
        'El evento se ha eliminado correctamente'
      );
    },
    onError: (error: any) => {
      showErrorToast(
        'Error al eliminar evento',
        error.response?.data?.message || 'Ocurrió un error inesperado'
      );
    },
  });
};
