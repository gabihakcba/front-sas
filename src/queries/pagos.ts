import api from '@/lib/axios';
import {
  CreatePagoPayload,
  Pago,
  PaginatedPagosResponse,
  PagosOptionsResponse,
  UpdatePagoPayload,
} from '@/types/pagos';

interface GetPagosParams {
  page?: number;
  limit?: number;
}

export const getPagosRequest = async ({
  page = 1,
  limit = 10,
}: GetPagosParams = {}): Promise<PaginatedPagosResponse> => {
  const response = await api.get<PaginatedPagosResponse>('/pagos', {
    params: { page, limit },
  });

  return response.data;
};

export const getPagoRequest = async (id: number): Promise<Pago> => {
  const response = await api.get<Pago>(`/pagos/${id}`);
  return response.data;
};

export const getPagosOptionsRequest = async (): Promise<PagosOptionsResponse> => {
  const response = await api.get<PagosOptionsResponse>('/pagos/options');
  return response.data;
};

export const createPagoRequest = async (
  payload: CreatePagoPayload,
): Promise<Pago> => {
  const response = await api.post<Pago>('/pagos', payload);
  return response.data;
};

export const updatePagoRequest = async (
  id: number,
  payload: UpdatePagoPayload,
): Promise<Pago> => {
  const response = await api.patch<Pago>(`/pagos/${id}`, payload);
  return response.data;
};

export const deletePagoRequest = async (id: number): Promise<void> => {
  await api.delete(`/pagos/${id}`);
};
