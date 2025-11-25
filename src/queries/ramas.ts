import api from '@/lib/axios';
import { Rama } from '@/common/types/rama';

export const getRamasFn = async (): Promise<Rama[]> => {
  const response = await api.get<any>('/ramas');

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  console.warn('Unexpected response format in getRamasFn:', response.data);
  return [];
};
