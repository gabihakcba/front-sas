import { useQuery } from '@tanstack/react-query';
import { getAreasFn } from '@/queries/areas';

export const AREAS_QUERY_KEY = ['areas'];

export const useAreasQuery = () => {
  return useQuery({
    queryKey: AREAS_QUERY_KEY,
    queryFn: getAreasFn,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
