import api from '@/lib/axios';
import {
  CalendarBirthday,
  CalendarConsejo,
  CalendarEvento,
  CreateEventoPayload,
  Evento,
  EventoFilters,
  EventoInscripcion,
  EventosOptionsResponse,
  PaginatedEventosResponse,
  UpdateEventoPayload,
} from '@/types/eventos';

interface GetEventosParams {
  page?: number;
  limit?: number;
  filters?: EventoFilters;
}

interface GetCalendarEventosParams {
  from: string;
  to: string;
  idTipo?: number | null;
  idArea?: number | null;
  idRama?: number | null;
}

export const getEventosRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetEventosParams = {}): Promise<PaginatedEventosResponse> => {
  const response = await api.get<PaginatedEventosResponse>('/eventos', {
    params: {
      page,
      limit,
      ...(filters?.q ? { q: filters.q } : {}),
      ...(filters?.idTipo ? { idTipo: filters.idTipo } : {}),
      ...(filters?.fechaDesde ? { fechaDesde: filters.fechaDesde } : {}),
      ...(filters?.fechaHasta ? { fechaHasta: filters.fechaHasta } : {}),
      ...(filters?.includeDeleted ? { includeDeleted: true } : {}),
    },
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

export const getCalendarEventosRequest = async ({
  from,
  to,
  idTipo,
  idArea,
  idRama,
}: GetCalendarEventosParams): Promise<CalendarEvento[]> => {
  const response = await api.get<CalendarEvento[]>('/eventos/calendar', {
    params: {
      from,
      to,
      ...(idTipo !== null && idTipo !== undefined ? { idTipo } : {}),
      ...(idArea !== null && idArea !== undefined ? { idArea } : {}),
      ...(idRama !== null && idRama !== undefined ? { idRama } : {}),
    },
  });
  return response.data;
};

export const getCalendarCumpleaniosRequest = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<CalendarBirthday[]> => {
  const response = await api.get<CalendarBirthday[]>('/calendario/cumpleanios', {
    params: { from, to },
  });
  return response.data;
};

export const getCalendarConsejosRequest = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<CalendarConsejo[]> => {
  const response = await api.get<CalendarConsejo[]>('/calendario/consejos', {
    params: { from, to },
  });
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
