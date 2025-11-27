import api from '@/lib/axios';
import type {
  ResponsableRow,
  CreateResponsableDto,
  UpdateResponsableDto,
  VincularResponsableDto,
} from '@/common/types/responsable';

export const getResponsablesFn = async (): Promise<ResponsableRow[]> => {
  const response = await api.get<any>('/responsables');
  if (Array.isArray(response.data)) {
    return response.data.map((r: any) => ({
      ...r,
      apellidos: r.apellidos || r.apellido,
    }));
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data.map((r: any) => ({
      ...r,
      apellidos: r.apellidos || r.apellido,
    }));
  }
  return [];
};

export const getResponsableFn = async (id: number): Promise<ResponsableRow> => {
  const response = await api.get<any>(`/responsables/${id}`);
  return {
    ...response.data,
    apellidos: response.data.apellidos || response.data.apellido,
  };
};

export const createResponsableFn = async (
  data: CreateResponsableDto
): Promise<ResponsableRow> => {
  const response = await api.post<ResponsableRow>('/responsables', data);
  return response.data;
};

export const updateResponsableFn = async (
  id: number,
  data: UpdateResponsableDto
): Promise<ResponsableRow> => {
  const response = await api.patch<ResponsableRow>(`/responsables/${id}`, data);
  return response.data;
};

export const deleteResponsableFn = async (id: number): Promise<void> => {
  await api.delete(`/responsables/${id}`);
};

export const createResponsableFromAdultoFn = async (data: {
  id_adulto: number;
}): Promise<ResponsableRow> => {
  const response = await api.post<ResponsableRow>(
    '/responsables/from-adulto',
    data
  );
  return response.data;
};
