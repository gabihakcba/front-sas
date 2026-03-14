import api from '@/lib/axios';
import {
  Adulto,
  AdultoFilters,
  AdultoOptionsResponse,
  CreateAdultoPayload,
  PaginatedAdultosResponse,
  UpdateAdultoPayload,
} from '@/types/adultos';

interface GetAdultosParams {
  page?: number;
  limit?: number;
  filters?: AdultoFilters;
}

export const getAdultosRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetAdultosParams = {}): Promise<PaginatedAdultosResponse> => {
  const response = await api.get<PaginatedAdultosResponse>('/adultos', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
      ...(filters?.idArea ? { idArea: filters.idArea } : {}),
      ...(filters?.idPosicion ? { idPosicion: filters.idPosicion } : {}),
      ...(filters?.idRama ? { idRama: filters.idRama } : {}),
      ...(filters?.esBecado !== null && filters?.esBecado !== undefined
        ? { esBecado: filters.esBecado }
        : {}),
      ...(filters?.activo !== null && filters?.activo !== undefined
        ? { activo: filters.activo }
        : {}),
    },
  });

  return response.data;
};

export const getAdultoRequest = async (id: number): Promise<Adulto> => {
  const response = await api.get<Adulto>(`/adultos/${id}`);
  return response.data;
};

export const getAdultosOptionsRequest =
  async (): Promise<AdultoOptionsResponse> => {
    const response = await api.get<AdultoOptionsResponse>('/adultos/options');
    return response.data;
  };

export const createAdultoRequest = async (
  payload: CreateAdultoPayload,
): Promise<Adulto> => {
  const response = await api.post<Adulto>('/adultos', payload);
  return response.data;
};

export const updateAdultoRequest = async (
  id: number,
  payload: UpdateAdultoPayload,
): Promise<Adulto> => {
  const response = await api.patch<Adulto>(`/adultos/${id}`, payload);
  return response.data;
};

export const deleteAdultoRequest = async (id: number): Promise<void> => {
  await api.delete(`/adultos/${id}`);
};
