import api from '@/lib/axios';
import { TipoEvento } from '@/common/types/tipo-evento';

export const getTiposEventoFn = async (): Promise<TipoEvento[]> => {
  const response = await api.get<any>('/tipo-evento');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};
