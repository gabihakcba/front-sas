import api from '@/lib/axios';
import {
  CreateEventoVentaItemPayload,
  EventoVentaCostoItemPayload,
  CreateEventoVentaReservaPayload,
  CreateEventoVentaPayload,
  EventoVenta,
  EventoVentaFilters,
  PaginatedEventosVentaResponse,
  UpdateEventoVentaReservaPayload,
} from '@/types/eventos-venta';

export const getEventosVentaRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: {
  page?: number;
  limit?: number;
  filters?: EventoVentaFilters;
} = {}): Promise<PaginatedEventosVentaResponse> => {
  const response = await api.get<PaginatedEventosVentaResponse>('/eventos-venta', {
    params: {
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.includeDeleted ? { includeDeleted: true } : {}),
    },
  });
  return response.data;
};

export const getEventoVentaRequest = async (id: number): Promise<EventoVenta> => {
  const response = await api.get<EventoVenta>(`/eventos-venta/${id}`);
  return response.data;
};

export const createEventoVentaRequest = async (
  payload: CreateEventoVentaPayload,
): Promise<EventoVenta> => {
  const response = await api.post<EventoVenta>('/eventos-venta', payload);
  return response.data;
};

export const updateEventoVentaRequest = async (
  id: number,
  payload: CreateEventoVentaPayload,
): Promise<EventoVenta> => {
  const response = await api.patch<EventoVenta>(`/eventos-venta/${id}`, payload);
  return response.data;
};

export const deleteEventoVentaRequest = async (id: number): Promise<void> => {
  await api.delete(`/eventos-venta/${id}`);
};

export const createEventoVentaItemRequest = async (
  eventoVentaId: number,
  payload: CreateEventoVentaItemPayload,
): Promise<void> => {
  await api.post(`/eventos-venta/${eventoVentaId}/items`, payload);
};

export const updateEventoVentaItemRequest = async (
  eventoVentaId: number,
  itemId: number,
  payload: CreateEventoVentaItemPayload,
): Promise<void> => {
  await api.patch(`/eventos-venta/${eventoVentaId}/items/${itemId}`, payload);
};

export const deleteEventoVentaItemRequest = async (
  eventoVentaId: number,
  itemId: number,
): Promise<void> => {
  await api.delete(`/eventos-venta/${eventoVentaId}/items/${itemId}`);
};

export const createEventoVentaCostoItemRequest = async (
  eventoVentaId: number,
  payload: EventoVentaCostoItemPayload,
): Promise<void> => {
  await api.post(`/eventos-venta/${eventoVentaId}/costos`, payload);
};

export const updateEventoVentaCostoItemRequest = async (
  eventoVentaId: number,
  costoItemId: number,
  payload: EventoVentaCostoItemPayload,
): Promise<void> => {
  await api.patch(`/eventos-venta/${eventoVentaId}/costos/${costoItemId}`, payload);
};

export const deleteEventoVentaCostoItemRequest = async (
  eventoVentaId: number,
  costoItemId: number,
): Promise<void> => {
  await api.delete(`/eventos-venta/${eventoVentaId}/costos/${costoItemId}`);
};

export const exportEventoVentaSpreadsheetRequest = async (
  eventoVentaId: number,
): Promise<Blob> => {
  const response = await api.get(`/eventos-venta/${eventoVentaId}/export`, {
    responseType: 'blob',
  });
  return response.data as Blob;
};

export const createEventoVentaReservaRequest = async (
  eventoVentaId: number,
  payload: CreateEventoVentaReservaPayload,
): Promise<void> => {
  await api.post(`/eventos-venta/${eventoVentaId}/reservas`, payload);
};

export const updateEventoVentaReservaRequest = async (
  eventoVentaId: number,
  reservaId: number,
  payload: UpdateEventoVentaReservaPayload,
): Promise<void> => {
  await api.patch(`/eventos-venta/${eventoVentaId}/reservas/${reservaId}`, payload);
};

export const deleteEventoVentaReservaRequest = async (
  eventoVentaId: number,
  reservaId: number,
): Promise<void> => {
  await api.delete(`/eventos-venta/${eventoVentaId}/reservas/${reservaId}`);
};
