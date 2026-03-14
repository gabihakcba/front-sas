import api from '@/lib/axios';
import {
  CreateResponsablePayload,
  PaginatedResponsablesResponse,
  Responsable,
  ResponsableFilters,
  ResponsableOptionsResponse,
  UpdateResponsablePayload,
} from '@/types/responsables';

interface GetResponsablesParams {
  page?: number;
  limit?: number;
  filters?: ResponsableFilters;
}

export const getResponsablesRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetResponsablesParams = {}): Promise<PaginatedResponsablesResponse> => {
  const response = await api.get<PaginatedResponsablesResponse>('/responsables', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
    },
  });

  return response.data;
};

export const getResponsableRequest = async (id: number): Promise<Responsable> => {
  const response = await api.get<Responsable>(`/responsables/${id}`);
  return response.data;
};

export const getResponsablesOptionsRequest =
  async (): Promise<ResponsableOptionsResponse> => {
    const response = await api.get<ResponsableOptionsResponse>('/responsables/options');
    return response.data;
  };

export const createResponsableRequest = async (
  payload: CreateResponsablePayload,
): Promise<Responsable> => {
  const response = await api.post<Responsable>('/responsables', payload);
  return response.data;
};

export const updateResponsableRequest = async (
  id: number,
  payload: UpdateResponsablePayload,
): Promise<Responsable> => {
  const response = await api.patch<Responsable>(`/responsables/${id}`, payload);
  return response.data;
};

export const updateResponsabilidadesRequest = async (
  id: number,
  protagonistaIds: number[],
): Promise<Responsable> => {
  const response = await api.patch<Responsable>(
    `/responsables/${id}/responsabilidades`,
    { protagonistaIds },
  );
  return response.data;
};

export const deleteResponsableRequest = async (id: number): Promise<void> => {
  await api.delete(`/responsables/${id}`);
};
