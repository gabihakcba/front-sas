import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTiposEventoFn,
  createTipoEventoFn,
  updateTipoEventoFn,
  deleteTipoEventoFn,
} from '@/queries/tipo-evento';
import {
  CreateTipoEventoDto,
  UpdateTipoEventoDto,
} from '@/common/types/tipo-evento';

export const useTiposEventoQuery = () => {
  return useQuery({
    queryKey: ['tipos-evento'],
    queryFn: getTiposEventoFn,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateTipoEventoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTipoEventoDto) => createTipoEventoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-evento'] });
    },
  });
};

export const useUpdateTipoEventoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTipoEventoDto }) =>
      updateTipoEventoFn({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-evento'] });
    },
  });
};

export const useDeleteTipoEventoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTipoEventoFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-evento'] });
    },
  });
};
