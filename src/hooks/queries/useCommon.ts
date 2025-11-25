import { useQuery } from '@tanstack/react-query';
import {
  getAreasFn,
  getPosicionesFn,
  getRolesFn,
  Area,
  Posicion,
  Role,
} from '@/queries/common';

export const useAreasQuery = () => {
  return useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: getAreasFn,
    staleTime: Infinity,
  });
};

export const usePosicionesQuery = () => {
  return useQuery<Posicion[]>({
    queryKey: ['posiciones'],
    queryFn: getPosicionesFn,
    staleTime: Infinity,
  });
};

export const useRolesQuery = () => {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: getRolesFn,
    staleTime: Infinity,
  });
};
