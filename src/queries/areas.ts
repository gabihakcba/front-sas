import api from '@/lib/axios';
import { Area } from '@/common/types/cuenta-dinero';

export const getAreasFn = async (): Promise<Area[]> => {
  const response = await api.get<any>('/areas');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};
