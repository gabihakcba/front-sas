import api from '@/lib/axios';
import { PaginatedResponseMeta } from '@/types/pagination';
import {
  Actividad,
  CreateActividadPayload,
  CreateSabatinoPayload,
  PaginatedSabatinosResponse,
  Sabatino,
  SabatinoFilters,
  TipoActividad,
  UpdateActividadPayload,
  UpdateSabatinoPayload,
} from '@/types/sabatinos';

export const getSabatinosRequest = async (filters: SabatinoFilters) => {
  const response = await api.get<PaginatedSabatinosResponse>('/sabatinos', {
    params: filters,
  });
  return response.data;
};

export const getSabatinoRequest = async (id: number) => {
  const response = await api.get<Sabatino>(`/sabatinos/${id}`);
  return response.data;
};

export const getSabatinosOptionsRequest = async () => {
  const response = await api.get<{
    areas: Array<{ id: number; nombre: string }>;
    ramas: Array<{ id: number; nombre: string }>;
    adultos: Array<{
      id: number;
      miembroId: number;
      nombre: string;
      apellidos: string;
      dni: string;
    }>;
  }>('/sabatinos/options');
  return response.data;
};

export const createSabatinoRequest = async (payload: CreateSabatinoPayload) => {
  const response = await api.post<Sabatino>('/sabatinos', payload);
  return response.data;
};

export const updateSabatinoRequest = async (
  id: number,
  payload: UpdateSabatinoPayload,
) => {
  const response = await api.patch<Sabatino>(`/sabatinos/${id}`, payload);
  return response.data;
};

export const deleteSabatinoRequest = async (id: number) => {
  await api.delete(`/sabatinos/${id}`);
};

export const getCalendarSabatinosRequest = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<Sabatino[]> => {
  const response = await api.get<Sabatino[]>('/calendario/sabatinos', {
    params: { from, to },
  });
  return response.data;
};

export const updateSabatinoActividadesRequest = async (
  id: number,
  actividades: Array<{ actividadId: number; numero?: number; fecha?: string }>,
) => {
  await api.patch(`/sabatinos/${id}/actividades`, { actividades });
};

export const exportSabatinoPdfRequest = async (id: number) => {
  const response = await api.get(`/sabatinos/${id}/export`, {
    responseType: 'blob',
  });
  return response.data;
};

// Actividades
export const getActividadesRequest = async (filters?: {
  page?: number;
  limit?: number;
  q?: string;
}) => {
  const response = await api.get<{
    data: Actividad[];
    meta: PaginatedResponseMeta;
  }>('/actividades', { params: filters });
  return response.data;
};

export const getTipoActividadesRequest = async () => {
  const response = await api.get<TipoActividad[]>('/actividades/tipos');
  return response.data;
};

export const createActividadRequest = async (payload: CreateActividadPayload) => {
  const response = await api.post<Actividad>('/actividades', payload);
  return response.data;
};

export const updateActividadRequest = async (
  id: number,
  payload: UpdateActividadPayload,
) => {
  const response = await api.patch<Actividad>(`/actividades/${id}`, payload);
  return response.data;
};

export const deleteActividadRequest = async (id: number) => {
  await api.delete(`/actividades/${id}`);
};
