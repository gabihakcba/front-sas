import api from '@/lib/axios';
import {
  ConsejoAsistenciaItem,
  ConsejoAsistenciaOption,
  Consejo,
  ConsejoTemarioItem,
  CreateConsejoTemarioPayload,
  CreateConsejoPayload,
  PaginatedConsejosResponse,
  UpdateConsejoTemarioPayload,
  UpdateConsejoPayload,
} from '@/types/consejos';

interface GetConsejosParams {
  page?: number;
  limit?: number;
}

export const getConsejosRequest = async ({
  page = 1,
  limit = 10,
}: GetConsejosParams = {}): Promise<PaginatedConsejosResponse> => {
  const response = await api.get<PaginatedConsejosResponse>('/consejos', {
    params: { page, limit },
  });

  return response.data;
};

export const getConsejoRequest = async (id: number): Promise<Consejo> => {
  const response = await api.get<Consejo>(`/consejos/${id}`);
  return response.data;
};

export const createConsejoRequest = async (
  payload: CreateConsejoPayload,
): Promise<Consejo> => {
  const response = await api.post<Consejo>('/consejos', payload);
  return response.data;
};

export const updateConsejoRequest = async (
  id: number,
  payload: UpdateConsejoPayload,
): Promise<Consejo> => {
  const response = await api.patch<Consejo>(`/consejos/${id}`, payload);
  return response.data;
};

export const deleteConsejoRequest = async (id: number): Promise<void> => {
  await api.delete(`/consejos/${id}`);
};

export const getConsejoTemarioRequest = async (
  id: number,
): Promise<ConsejoTemarioItem[]> => {
  const response = await api.get<ConsejoTemarioItem[]>(`/consejos/${id}/temario`);
  return response.data;
};

export const createConsejoTemarioRequest = async (
  id: number,
  payload: CreateConsejoTemarioPayload,
): Promise<ConsejoTemarioItem> => {
  const response = await api.post<ConsejoTemarioItem>(
    `/consejos/${id}/temario`,
    payload,
  );
  return response.data;
};

export const updateConsejoTemarioRequest = async (
  id: number,
  temarioId: number,
  payload: UpdateConsejoTemarioPayload,
): Promise<ConsejoTemarioItem> => {
  const response = await api.patch<ConsejoTemarioItem>(
    `/consejos/${id}/temario/${temarioId}`,
    payload,
  );
  return response.data;
};

export const deleteConsejoTemarioRequest = async (
  id: number,
  temarioId: number,
): Promise<void> => {
  await api.delete(`/consejos/${id}/temario/${temarioId}`);
};

export const getConsejoAsistenciasRequest = async (
  id: number,
): Promise<ConsejoAsistenciaItem[]> => {
  const response = await api.get<ConsejoAsistenciaItem[]>(
    `/consejos/${id}/asistencias`,
  );
  return response.data;
};

export const getConsejoAsistenciaOptionsRequest = async (
  id: number,
  q = '',
): Promise<ConsejoAsistenciaOption[]> => {
  const response = await api.get<ConsejoAsistenciaOption[]>(
    `/consejos/${id}/asistencias/options`,
    {
      params: q ? { q } : {},
    },
  );
  return response.data;
};

export const createConsejoAsistenciaRequest = async (
  id: number,
  idMiembro: number,
): Promise<ConsejoAsistenciaItem> => {
  const response = await api.post<ConsejoAsistenciaItem>(
    `/consejos/${id}/asistencias`,
    { idMiembro },
  );
  return response.data;
};

export const exportConsejoPdfRequest = async (
  id: number,
  includePrivateTopics: boolean,
): Promise<Blob> => {
  const response = await api.get(
    includePrivateTopics
      ? `/consejos/${id}/export/pdf`
      : `/consejos/${id}/export/pdf-publico`,
    {
      responseType: 'blob',
    },
  );

  return response.data as Blob;
};
