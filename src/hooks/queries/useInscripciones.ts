import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInscripcionesPorEventoFn,
  inscribirMiembroFn,
  cancelarInscripcionFn,
} from '@/queries/inscripciones';
import { CreateInscripcionDto } from '@/common/types/inscripcion';

export const useInscripcionesEventoQuery = (idEvento: number) => {
  return useQuery({
    queryKey: ['inscripciones', idEvento],
    queryFn: () => getInscripcionesPorEventoFn(idEvento),
    enabled: !!idEvento,
  });
};

export const useInscribirMiembroMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInscripcionDto) => inscribirMiembroFn(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['inscripciones', variables.id_evento],
      });
    },
  });
};

export const useCancelarInscripcionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelarInscripcionFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
    },
  });
};
