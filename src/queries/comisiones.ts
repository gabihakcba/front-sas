import api from '@/lib/axios';
import {
  Comision,
  CreateComisionDto,
  AddParticipanteDto,
} from '@/common/types/comision';

export const getComisionesByEventoFn = async (
  idEvento: number
): Promise<Comision[]> => {
  const response = await api.get<any>(`/comision/evento/${idEvento}`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && response.data.data) {
    if (Array.isArray(response.data.data)) return response.data.data;
    return [response.data.data];
  }
  return [];
};

export const createComisionFn = async (
  data: CreateComisionDto
): Promise<Comision> => {
  const { data: response } = await api.post<Comision>('/comision', data);
  return response;
};

export const deleteComisionFn = async (id: number): Promise<void> => {
  await api.delete(`/comision/${id}`);
};

export const addParticipanteFn = async (
  data: AddParticipanteDto
): Promise<void> => {
  await api.post('/participantes-comision', data);
};

export const removeParticipanteFn = async (id: number): Promise<void> => {
  await api.delete(`/participantes-comision/${id}`);
};
