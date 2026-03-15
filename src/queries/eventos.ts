import api from '@/lib/axios';
import {
  CreateEventoPayload,
  Evento,
  EventoInscripcion,
  EventosOptionsResponse,
  PaginatedEventosResponse,
  UpdateEventoPayload,
} from '@/types/eventos';

interface GetEventosParams {
  page?: number;
  limit?: number;
}

export const getEventosRequest = async ({
  page = 1,
  limit = 10,
}: GetEventosParams = {}): Promise<PaginatedEventosResponse> => {
  const response = await api.get<PaginatedEventosResponse>('/eventos', {
    params: { page, limit },
  });
  return response.data;
};

export const getEventoRequest = async (id: number): Promise<Evento> => {
  const response = await api.get<Evento>(`/eventos/${id}`);
  return response.data;
};

export const getEventosOptionsRequest = async (): Promise<EventosOptionsResponse> => {
  const response = await api.get<EventosOptionsResponse>('/eventos/options');
  return response.data;
};

export const createEventoRequest = async (
  payload: CreateEventoPayload,
): Promise<Evento> => {
  const response = await api.post<Evento>('/eventos', payload);
  return response.data;
};

export const updateEventoRequest = async (
  id: number,
  payload: UpdateEventoPayload,
): Promise<Evento> => {
  const response = await api.patch<Evento>(`/eventos/${id}`, payload);
  return response.data;
};

export const deleteEventoRequest = async (id: number): Promise<void> => {
  await api.delete(`/eventos/${id}`);
};

export const getEventoInscripcionesRequest = async (
  id: number,
): Promise<EventoInscripcion[]> => {
  const response = await api.get<EventoInscripcion[]>(`/eventos/${id}/inscripciones`);
  return response.data;
};

export const updateEventoInscripcionesRequest = async (
  id: number,
  miembroIds: number[],
): Promise<EventoInscripcion[]> => {
  const response = await api.patch<EventoInscripcion[]>(
    `/eventos/${id}/inscripciones`,
    { miembroIds },
  );
  return response.data;
};

export const updateEventoAfectacionesRequest = async (
  id: number,
  areaIds: number[],
  ramaIds: number[],
): Promise<Evento> => {
  const response = await api.patch<Evento>(`/eventos/${id}/afectaciones`, {
    areaIds,
    ramaIds,
  });
  return response.data;
};

export const assignEventoComisionRequest = async (
  id: number,
  idComision: number | null,
): Promise<Evento> => {
  const response = await api.patch<Evento>(`/eventos/${id}/comision`, {
    idComision,
  });
  return response.data;
};
