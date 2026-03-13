import api from '@/lib/axios';
import {
  ConceptoPago,
  CreateConceptoPagoPayload,
  PaginatedConceptosPagoResponse,
  UpdateConceptoPagoPayload,
} from '@/types/conceptos-pago';

interface GetConceptosPagoParams {
  page?: number;
  limit?: number;
}

export const getConceptosPagoRequest = async ({
  page = 1,
  limit = 10,
}: GetConceptosPagoParams = {}): Promise<PaginatedConceptosPagoResponse> => {
  const response = await api.get<PaginatedConceptosPagoResponse>(
    '/conceptos-pago',
    {
      params: { page, limit },
    },
  );

  return response.data;
};

export const getConceptoPagoRequest = async (
  id: number,
): Promise<ConceptoPago> => {
  const response = await api.get<ConceptoPago>(`/conceptos-pago/${id}`);
  return response.data;
};

export const createConceptoPagoRequest = async (
  payload: CreateConceptoPagoPayload,
): Promise<ConceptoPago> => {
  const response = await api.post<ConceptoPago>('/conceptos-pago', payload);
  return response.data;
};

export const updateConceptoPagoRequest = async (
  id: number,
  payload: UpdateConceptoPagoPayload,
): Promise<ConceptoPago> => {
  const response = await api.patch<ConceptoPago>(
    `/conceptos-pago/${id}`,
    payload,
  );
  return response.data;
};

export const deleteConceptoPagoRequest = async (id: number): Promise<void> => {
  await api.delete(`/conceptos-pago/${id}`);
};
