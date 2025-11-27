import api from '@/lib/axios';
import {
  Evento,
  CreateEventoDto,
  UpdateEventoDto,
} from '@/common/types/evento';

export const getEventosFn = async (): Promise<Evento[]> => {
  const response = await api.get<any>('/eventos');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};

export const getEventoFn = async (id: number): Promise<Evento> => {
  const { data } = await api.get<Evento>(`/eventos/${id}`);
  return data;
};

export const createEventoFn = async (
  data: CreateEventoDto
): Promise<Evento> => {
  const response = await api.post<Evento>('/eventos', data);
  return response.data;
};

export const updateEventoFn = async (
  id: number,
  data: UpdateEventoDto
): Promise<Evento> => {
  const { data: response } = await api.patch<Evento>(`/eventos/${id}`, data);
  return response;
};

export const deleteEventoFn = async (id: number): Promise<void> => {
  await api.delete(`/eventos/${id}`);
};
