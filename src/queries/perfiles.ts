import api from '@/lib/axios';
import {
  PerfilActividad,
  PerfilAsignacion,
  PerfilFirma,
  PerfilResumen,
  PerfilVinculos,
  UpdatePerfilPersonalPayload,
} from '@/types/perfiles';

export const getMyProfileRequest = async () => {
  const response = await api.get<PerfilResumen>('/perfiles/me');
  return response.data;
};

export const updateMyProfileRequest = async (
  payload: UpdatePerfilPersonalPayload,
) => {
  const response = await api.patch<PerfilResumen>('/perfiles/me', payload);
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

export const getMyProfileFirmaRequest = async () => {
  const response = await api.get<PerfilFirma>('/perfiles/me/firma');
  return response.data;
};

export const getProfileFirmaRequest = async (id: number) => {
  const response = await api.get<PerfilFirma>(`/perfiles/${id}/firma`);
  return response.data;
};

export const updateMyProfileFirmaRequest = async (firmaBase64: string | null) => {
  const response = await api.patch<PerfilFirma>('/perfiles/me/firma', {
    firmaBase64,
  });
  return response.data;
};

export const updateProfileFirmaRequest = async (
  id: number,
  firmaBase64: string | null,
) => {
  const response = await api.patch<PerfilFirma>(`/perfiles/${id}/firma`, {
    firmaBase64,
  });
  return response.data;
};
