import api from '@/lib/axios';
import {
  CreateAdjuntoFormacionPayload,
  CreateAsignacionApfPayload,
  CreatePlanDesempenoPayload,
  CreateTemplatePayload,
  DownloadAdjuntoFormacionResponse,
  FormacionAdminWorkspace,
  PlanDesempenoPerfilResponse,
  PlanFormacionOptionsResponse,
  UpdateTemplatePayload,
  UpdatePlanDesempenoCompetenciaPayload,
} from '@/types/formacion';

export const getMyPlanDesempenoRequest = async () => {
  const response =
    await api.get<PlanDesempenoPerfilResponse>('/plan-formacion/desempeno/me');
  return response.data;
};

export const getPlanDesempenoByMemberRequest = async (memberId: number) => {
  const response = await api.get<PlanDesempenoPerfilResponse>(
    `/plan-formacion/desempeno/miembro/${memberId}`,
  );
  return response.data;
};

export const getPlanFormacionOptionsRequest = async () => {
  const response =
    await api.get<PlanFormacionOptionsResponse>('/plan-formacion/options');
  return response.data;
};

export const getFormacionAdminWorkspaceRequest = async () => {
  const response = await api.get<FormacionAdminWorkspace>('/plan-formacion/admin');
  return response.data;
};

export const createPlanDesempenoRequest = async (
  payload: CreatePlanDesempenoPayload,
) => {
  const response = await api.post<PlanDesempenoPerfilResponse>(
    '/plan-formacion/desempeno',
    payload,
  );
  return response.data;
};

export const updatePlanDesempenoCompetenciaRequest = async (
  planId: number,
  competenciaTemplateId: number,
  payload: UpdatePlanDesempenoCompetenciaPayload,
) => {
  const response = await api.patch<PlanDesempenoPerfilResponse>(
    `/plan-formacion/desempeno/${planId}/competencias/${competenciaTemplateId}`,
    payload,
  );
  return response.data;
};

export const createTemplateRequest = async (payload: CreateTemplatePayload) => {
  const response = await api.post('/plan-formacion/templates', payload);
  return response.data;
};

export const createDefaultTemplateRequest = async (nombre: string) => {
  const response = await api.post('/plan-formacion/templates/default', { nombre });
  return response.data;
};

export const updateTemplateRequest = async (
  id: number,
  payload: UpdateTemplatePayload,
) => {
  const response = await api.patch(`/plan-formacion/templates/${id}`, payload);
  return response.data;
};

export const uploadAdjuntoFormacionRequest = async (
  templateId: number,
  payload: CreateAdjuntoFormacionPayload,
) => {
  const response = await api.post(
    `/plan-formacion/templates/${templateId}/adjuntos`,
    payload,
  );
  return response.data;
};

export const downloadAdjuntoFormacionRequest = async (id: number) => {
  const response = await api.get<DownloadAdjuntoFormacionResponse>(
    `/plan-formacion/adjuntos/${id}`,
  );
  return response.data;
};

export const deleteAdjuntoFormacionRequest = async (id: number) => {
  const response = await api.delete(`/plan-formacion/adjuntos/${id}`);
  return response.data;
};

export const createAsignacionApfRequest = async (
  payload: CreateAsignacionApfPayload,
) => {
  const response = await api.post('/plan-formacion/apf', payload);
  return response.data;
};

export const deleteAsignacionApfRequest = async (id: number) => {
  const response = await api.delete(`/plan-formacion/apf/${id}`);
  return response.data;
};
