import api from '@/lib/axios';
import {
  CuentaDineroRow,
  CreateCuentaDineroDto,
  UpdateCuentaDineroDto,
} from '@/common/types/cuenta-dinero';

export const getCuentasDineroFn = async (): Promise<CuentaDineroRow[]> => {
  const response = await api.get<any>('/cuenta-dinero');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

export const getCuentaDineroFn = async (
  id: number
): Promise<CuentaDineroRow> => {
  const response = await api.get<CuentaDineroRow>(`/cuenta-dinero/${id}`);
  return response.data;
};

export const createCuentaDineroFn = async (
  data: CreateCuentaDineroDto
): Promise<CuentaDineroRow> => {
  const response = await api.post<CuentaDineroRow>('/cuenta-dinero', data);
  return response.data;
};

export const updateCuentaDineroFn = async (
  id: number,
  data: UpdateCuentaDineroDto
): Promise<CuentaDineroRow> => {
  const response = await api.patch<CuentaDineroRow>(
    `/cuenta-dinero/${id}`,
    data
  );
  return response.data;
};

export const deleteCuentaDineroFn = async (id: number): Promise<void> => {
  await api.delete(`/cuenta-dinero/${id}`);
};

export const getCuentasPorMiembroFn = async (
  idMiembro: number
): Promise<CuentaDineroRow[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<any>(`/cuenta-dinero/miembro/${idMiembro}`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};
