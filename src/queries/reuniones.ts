import api from '@/lib/axios';
import {
  CreateReunionPayload,
  PaginatedReunionesResponse,
  Reunion,
  ReunionFilters,
  ReunionInvitado,
  ReunionesOptionsResponse,
  UpdateReunionPayload,
} from '@/types/reuniones';

interface GetReunionesParams {
  page?: number;
  limit?: number;
  filters?: ReunionFilters;
}

export const getReunionesRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetReunionesParams = {}): Promise<PaginatedReunionesResponse> => {
  const response = await api.get<PaginatedReunionesResponse>('/reuniones', {
    params: {
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.modalidad ? { modalidad: filters.modalidad } : {}),
      ...(filters?.fechaDesde ? { fechaDesde: filters.fechaDesde } : {}),
      ...(filters?.fechaHasta ? { fechaHasta: filters.fechaHasta } : {}),
      ...(filters?.includeDeleted ? { includeDeleted: true } : {}),
    },
  });

  return response.data;
};

export const getReunionRequest = async (id: number): Promise<Reunion> => {
  const response = await api.get<Reunion>(`/reuniones/${id}`);
  return response.data;
};

export const getReunionesOptionsRequest = async (): Promise<ReunionesOptionsResponse> => {
  const response = await api.get<ReunionesOptionsResponse>('/reuniones/options');
  return response.data;
};

export const createReunionRequest = async (
  payload: CreateReunionPayload,
): Promise<Reunion> => {
  const response = await api.post<Reunion>('/reuniones', payload);
  return response.data;
};

export const updateReunionRequest = async (
  id: number,
  payload: UpdateReunionPayload,
): Promise<Reunion> => {
  const response = await api.patch<Reunion>(`/reuniones/${id}`, payload);
  return response.data;
};

export const deleteReunionRequest = async (id: number): Promise<void> => {
  await api.delete(`/reuniones/${id}`);
};

export const getCalendarReunionesRequest = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<Reunion[]> => {
  const response = await api.get<Reunion[]>('/calendario/reuniones', {
    params: { from, to },
  });
  return response.data;
};

export const getReunionInvitadosRequest = async (
  id: number,
): Promise<ReunionInvitado[]> => {
  const response = await api.get<ReunionInvitado[]>(`/reuniones/${id}/invitados`);
  return response.data;
};

export const updateReunionInvitadosRequest = async (
  id: number,
  miembroIds: number[],
): Promise<ReunionInvitado[]> => {
  const response = await api.patch<ReunionInvitado[]>(`/reuniones/${id}/invitados`, {
    miembroIds,
  });
  return response.data;
};
