import api from '@/lib/axios';
import {
  Comision,
  ComisionFilters,
  ComisionParticipante,
  ComisionesOptionsResponse,
  CreateComisionPayload,
  PaginatedComisionesResponse,
  UpdateComisionPayload,
} from '@/types/comisiones';

interface GetComisionesParams {
  page?: number;
  limit?: number;
  filters?: ComisionFilters;
}

export const getComisionesRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetComisionesParams = {}): Promise<PaginatedComisionesResponse> => {
  const response = await api.get<PaginatedComisionesResponse>('/comisiones', {
    params: {
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.idEvento ? { idEvento: filters.idEvento } : {}),
      ...(filters?.includeDeleted ? { includeDeleted: true } : {}),
    },
  });
  return response.data;
};

export const getComisionRequest = async (id: number): Promise<Comision> => {
  const response = await api.get<Comision>(`/comisiones/${id}`);
  return response.data;
};

export const getComisionesOptionsRequest = async (): Promise<ComisionesOptionsResponse> => {
  const response = await api.get<ComisionesOptionsResponse>('/comisiones/options');
  return response.data;
};

export const getComisionParticipantesRequest = async (
  id: number,
): Promise<ComisionParticipante[]> => {
  const response = await api.get<ComisionParticipante[]>(
    `/comisiones/${id}/participantes`,
  );
  return response.data;
};

export const updateComisionParticipantesRequest = async (
  id: number,
  miembroIds: number[],
): Promise<ComisionParticipante[]> => {
  const response = await api.patch<ComisionParticipante[]>(
    `/comisiones/${id}/participantes`,
    { miembroIds },
  );
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
