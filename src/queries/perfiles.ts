import api from '@/lib/axios';
import {
  PerfilActividad,
  PerfilAsignacion,
  PerfilResumen,
  PerfilVinculos,
} from '@/types/perfiles';

export const getMyProfileRequest = async () => {
  const response = await api.get<PerfilResumen>('/perfiles/me');
  return response.data;
};

export const getProfileRequest = async (id: number) => {
  const response = await api.get<PerfilResumen>(`/perfiles/${id}`);
  return response.data;
};

export const getMyProfileAsignacionRequest = async () => {
  const response = await api.get<PerfilAsignacion>('/perfiles/me/asignacion');
  return response.data;
};

export const getProfileAsignacionRequest = async (id: number) => {
  const response = await api.get<PerfilAsignacion>(`/perfiles/${id}/asignacion`);
  return response.data;
};

export const getMyProfileActividadRequest = async () => {
  const response = await api.get<PerfilActividad>('/perfiles/me/actividad');
  return response.data;
};

export const getProfileActividadRequest = async (id: number) => {
  const response = await api.get<PerfilActividad>(`/perfiles/${id}/actividad`);
  return response.data;
};

export const getMyProfileVinculosRequest = async () => {
  const response = await api.get<PerfilVinculos>('/perfiles/me/vinculos');
  return response.data;
};

export const getProfileVinculosRequest = async (id: number) => {
  const response = await api.get<PerfilVinculos>(`/perfiles/${id}/vinculos`);
  return response.data;
};
