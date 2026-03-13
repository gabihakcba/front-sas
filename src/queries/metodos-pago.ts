import api from '@/lib/axios';
import {
  CreateMetodoPagoPayload,
  MetodoPago,
  PaginatedMetodosPagoResponse,
  UpdateMetodoPagoPayload,
} from '@/types/metodos-pago';

interface GetMetodosPagoParams {
  page?: number;
  limit?: number;
}

export const getMetodosPagoRequest = async ({
  page = 1,
  limit = 10,
}: GetMetodosPagoParams = {}): Promise<PaginatedMetodosPagoResponse> => {
  const response = await api.get<PaginatedMetodosPagoResponse>('/metodos-pago', {
    params: { page, limit },
  });

  return response.data;
};

export const getMetodoPagoRequest = async (id: number): Promise<MetodoPago> => {
  const response = await api.get<MetodoPago>(`/metodos-pago/${id}`);
  return response.data;
};

export const createMetodoPagoRequest = async (
  payload: CreateMetodoPagoPayload,
): Promise<MetodoPago> => {
  const response = await api.post<MetodoPago>('/metodos-pago', payload);
  return response.data;
};

export const updateMetodoPagoRequest = async (
  id: number,
  payload: UpdateMetodoPagoPayload,
): Promise<MetodoPago> => {
  const response = await api.patch<MetodoPago>(`/metodos-pago/${id}`, payload);
  return response.data;
};

export const deleteMetodoPagoRequest = async (id: number): Promise<void> => {
  await api.delete(`/metodos-pago/${id}`);
};
