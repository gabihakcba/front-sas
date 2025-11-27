import { useQuery } from '@tanstack/react-query';
import { getMyPermissionsFn } from '@/queries/auth';
import { useAuth } from '@/context/AuthContext';

export const PERMISSIONS_QUERY_KEY = ['my-permissions'];

export const useMyPermissionsQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: getMyPermissionsFn,
    staleTime: Infinity, // Permissions don't change during session
    enabled: !!user,
  });
};
