import api from '@/lib/axios';
import {
  CreateProtagonistaPayload,
  PaginatedProtagonistasResponse,
  ProtagonistaFilters,
  ProtagonistaPasePayload,
  Protagonista,
  RamaOption,
  UpdateProtagonistaPayload,
} from '@/types/protagonistas';

interface GetProtagonistasParams {
  page?: number;
  limit?: number;
  filters?: ProtagonistaFilters;
}

export const getProtagonistasRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetProtagonistasParams = {}): Promise<PaginatedProtagonistasResponse> => {
  const response = await api.get<PaginatedProtagonistasResponse>('/protagonistas', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
      ...(filters?.idRama ? { idRama: filters.idRama } : {}),
      ...(filters?.esBecado !== null && filters?.esBecado !== undefined
        ? { esBecado: filters.esBecado }
        : {}),
      ...(filters?.activo !== null && filters?.activo !== undefined
        ? { activo: filters.activo }
        : {}),
      ...(filters?.includeDeleted ? { includeDeleted: true } : {}),
    },
  });
  return response.data;
};

export const getProtagonistaRequest = async (
  id: number,
): Promise<Protagonista> => {
  const response = await api.get<Protagonista>(`/protagonistas/${id}`);
  return response.data;
};

export const createProtagonistaRequest = async (
  payload: CreateProtagonistaPayload,
): Promise<Protagonista> => {
  const response = await api.post<Protagonista>('/protagonistas', payload);
  return response.data;
};

export const updateProtagonistaRequest = async (
  id: number,
  payload: UpdateProtagonistaPayload,
): Promise<Protagonista> => {
  const response = await api.patch<Protagonista>(`/protagonistas/${id}`, payload);
  return response.data;
};

export const deleteProtagonistaRequest = async (id: number): Promise<void> => {
  await api.delete(`/protagonistas/${id}`);
};

export const registerPaseProtagonistaRequest = async (
  id: number,
  payload: ProtagonistaPasePayload,
): Promise<Protagonista> => {
  const response = await api.post<Protagonista>(`/protagonistas/${id}/pase`, payload);
  return response.data;
};

export const getRamasRequest = async (): Promise<RamaOption[]> => {
  const response = await api.get<RamaOption[]>('/ramas');
  return response.data;
};
