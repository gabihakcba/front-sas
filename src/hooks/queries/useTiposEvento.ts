import { useQuery } from '@tanstack/react-query';
import { getTiposEventoFn } from '@/queries/tipo-evento';

export const useTiposEventoQuery = () => {
  return useQuery({
    queryKey: ['tipos-evento'],
    queryFn: getTiposEventoFn,
  });
};
