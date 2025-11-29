import api from '@/lib/axios';
import {
  TipoEvento,
  CreateTipoEventoDto,
  UpdateTipoEventoDto,
} from '@/common/types/tipo-evento';

export const getTiposEventoFn = async (): Promise<TipoEvento[]> => {
  const response = await api.get<any>('/tipo-evento');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};

export const createTipoEventoFn = async (
  data: CreateTipoEventoDto
): Promise<TipoEvento> => {
  const { data: response } = await api.post<TipoEvento>('/tipo-evento', data);
  return response;
};

export const updateTipoEventoFn = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateTipoEventoDto;
}): Promise<TipoEvento> => {
  const { data: response } = await api.patch<TipoEvento>(
    `/tipo-evento/${id}`,
    data
  );
  return response;
};

export const deleteTipoEventoFn = async (id: number): Promise<void> => {
  await api.delete(`/tipo-evento/${id}`);
};
