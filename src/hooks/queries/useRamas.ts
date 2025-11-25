import { useQuery } from '@tanstack/react-query';
import { getRamasFn } from '@/queries/ramas';
import { Rama } from '@/common/types/rama';

export const useRamasQuery = () => {
  return useQuery<Rama[]>({
    queryKey: ['ramas'],
    queryFn: getRamasFn,
    staleTime: Infinity, // Ramas rarely change, so we cache them indefinitely
  });
};
