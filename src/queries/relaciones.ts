import api from '@/lib/axios';
import {
  CreateRelacionPayload,
  PaginatedRelacionesResponse,
  Relacion,
  UpdateRelacionPayload,
} from '@/types/relaciones';

interface GetRelacionesParams {
  page?: number;
  limit?: number;
}

export const getRelacionesRequest = async ({
  page = 1,
  limit = 10,
}: GetRelacionesParams = {}): Promise<PaginatedRelacionesResponse> => {
  const response = await api.get<PaginatedRelacionesResponse>('/relaciones', {
    params: { page, limit },
  });
  return response.data;
};

export const getRelacionRequest = async (id: number): Promise<Relacion> => {
  const response = await api.get<Relacion>(`/relaciones/${id}`);
  return response.data;
};

export const createRelacionRequest = async (
  payload: CreateRelacionPayload,
): Promise<Relacion> => {
  const response = await api.post<Relacion>('/relaciones', payload);
  return response.data;
};

export const updateRelacionRequest = async (
  id: number,
  payload: UpdateRelacionPayload,
): Promise<Relacion> => {
  const response = await api.patch<Relacion>(`/relaciones/${id}`, payload);
  return response.data;
};

export const deleteRelacionRequest = async (id: number): Promise<void> => {
  await api.delete(`/relaciones/${id}`);
};
