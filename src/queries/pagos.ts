import api from '@/lib/axios';
import {
  CreatePagoPayload,
  Pago,
  PagoFilters,
  PagoWhatsappShareData,
  PaginatedPagosResponse,
  PagosOptionsResponse,
  UpdatePagoPayload,
} from '@/types/pagos';

interface GetPagosParams {
  page?: number;
  limit?: number;
  filters?: PagoFilters;
}

export const getPagosRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetPagosParams = {}): Promise<PaginatedPagosResponse> => {
  const response = await api.get<PaginatedPagosResponse>('/pagos', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
      ...(filters?.idConceptoPago ? { idConceptoPago: filters.idConceptoPago } : {}),
      ...(filters?.idMetodoPago ? { idMetodoPago: filters.idMetodoPago } : {}),
      ...(filters?.idCuentaDinero ? { idCuentaDinero: filters.idCuentaDinero } : {}),
      ...(filters?.idCuentaOrigen ? { idCuentaOrigen: filters.idCuentaOrigen } : {}),
    },
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

export const exportPagoReceiptRequest = async (id: number): Promise<Blob> => {
  const response = await api.get(`/pagos/${id}/comprobante`, {
    responseType: 'blob',
  });

  return response.data as Blob;
};

export const getPagoAttachmentRequest = async (id: number): Promise<Blob> => {
  const response = await api.get(`/pagos/${id}/comprobante-pago`, {
    responseType: 'blob',
  });

  return response.data as Blob;
};

export const getPagoWhatsappShareRequest = async (
  id: number,
): Promise<PagoWhatsappShareData> => {
  const response = await api.get<PagoWhatsappShareData>(`/pagos/${id}/whatsapp`);
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
