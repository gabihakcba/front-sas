import api from '@/lib/axios';
import {
  CicloProgramaDetalle,
  CicloProgramaFilters,
  CiclosProgramaOptionsResponse,
  CreateCicloProgramaPayload,
  PaginatedCiclosProgramaResponse,
  UpdateCicloProgramaPayload,
} from '@/types/ciclos-programa';

interface GetCiclosProgramaParams {
  page?: number;
  limit?: number;
  filters?: CicloProgramaFilters;
}

export const getCiclosProgramaRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetCiclosProgramaParams = {}): Promise<PaginatedCiclosProgramaResponse> => {
  const response = await api.get<PaginatedCiclosProgramaResponse>('/ciclos-programa', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
      ...(filters?.fechaDesde ? { fechaDesde: filters.fechaDesde } : {}),
      ...(filters?.fechaHasta ? { fechaHasta: filters.fechaHasta } : {}),
    },
  });

  return response.data;
};

export const getCiclosProgramaOptionsRequest =
  async (): Promise<CiclosProgramaOptionsResponse> => {
    const response =
      await api.get<CiclosProgramaOptionsResponse>('/ciclos-programa/options');
    return response.data;
  };

export const getCicloProgramaRequest = async (
  id: number,
): Promise<CicloProgramaDetalle> => {
  const response = await api.get<CicloProgramaDetalle>(`/ciclos-programa/${id}`);
  return response.data;
};

export const createCicloProgramaRequest = async (
  payload: CreateCicloProgramaPayload,
): Promise<CicloProgramaDetalle> => {
  const response = await api.post<CicloProgramaDetalle>('/ciclos-programa', payload);
  return response.data;
};

export const updateCicloProgramaRequest = async (
  id: number,
  payload: UpdateCicloProgramaPayload,
): Promise<CicloProgramaDetalle> => {
  const response = await api.patch<CicloProgramaDetalle>(
    `/ciclos-programa/${id}`,
    payload,
  );
  return response.data;
};

export const deleteCicloProgramaRequest = async (id: number): Promise<void> => {
  await api.delete(`/ciclos-programa/${id}`);
};
