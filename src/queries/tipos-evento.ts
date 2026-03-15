import api from '@/lib/axios';
import {
  CreateTipoEventoPayload,
  PaginatedTiposEventoResponse,
  TipoEvento,
  UpdateTipoEventoPayload,
} from '@/types/tipos-evento';

interface GetTiposEventoParams {
  page?: number;
  limit?: number;
}

export const getTiposEventoRequest = async ({
  page = 1,
  limit = 10,
}: GetTiposEventoParams = {}): Promise<PaginatedTiposEventoResponse> => {
  const response = await api.get<PaginatedTiposEventoResponse>('/tipos-evento', {
    params: { page, limit },
  });
  return response.data;
};

export const getTipoEventoRequest = async (id: number): Promise<TipoEvento> => {
  const response = await api.get<TipoEvento>(`/tipos-evento/${id}`);
  return response.data;
};

export const createTipoEventoRequest = async (
  payload: CreateTipoEventoPayload,
): Promise<TipoEvento> => {
  const response = await api.post<TipoEvento>('/tipos-evento', payload);
  return response.data;
};

export const updateTipoEventoRequest = async (
  id: number,
  payload: UpdateTipoEventoPayload,
): Promise<TipoEvento> => {
  const response = await api.patch<TipoEvento>(`/tipos-evento/${id}`, payload);
  return response.data;
};

export const deleteTipoEventoRequest = async (id: number): Promise<void> => {
  await api.delete(`/tipos-evento/${id}`);
};
