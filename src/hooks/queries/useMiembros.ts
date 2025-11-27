import { useQuery } from '@tanstack/react-query';
import { getMiembrosFn } from '@/queries/miembros';

export const useMiembrosQuery = () => {
  return useQuery({
    queryKey: ['miembros'],
    queryFn: getMiembrosFn,
  });
};
