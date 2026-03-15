import api from '@/lib/axios';
import {
  Comision,
  CreateComisionPayload,
  PaginatedComisionesResponse,
  UpdateComisionPayload,
} from '@/types/comisiones';

interface GetComisionesParams {
  page?: number;
  limit?: number;
}

export const getComisionesRequest = async ({
  page = 1,
  limit = 10,
}: GetComisionesParams = {}): Promise<PaginatedComisionesResponse> => {
  const response = await api.get<PaginatedComisionesResponse>('/comisiones', {
    params: { page, limit },
  });
  return response.data;
};

export const getComisionRequest = async (id: number): Promise<Comision> => {
  const response = await api.get<Comision>(`/comisiones/${id}`);
  return response.data;
};

export const createComisionRequest = async (
  payload: CreateComisionPayload,
): Promise<Comision> => {
  const response = await api.post<Comision>('/comisiones', payload);
  return response.data;
};

export const updateComisionRequest = async (
  id: number,
  payload: UpdateComisionPayload,
): Promise<Comision> => {
  const response = await api.patch<Comision>(`/comisiones/${id}`, payload);
  return response.data;
};

export const deleteComisionRequest = async (id: number): Promise<void> => {
  await api.delete(`/comisiones/${id}`);
};
