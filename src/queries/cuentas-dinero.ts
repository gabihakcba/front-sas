import api from '@/lib/axios';
import {
  CreateCuentaDineroPayload,
  CuentaDinero,
  CuentaDineroFilters,
  CuentaDineroOptionsResponse,
  PaginatedCuentasDineroResponse,
  UpdateCuentaDineroPayload,
} from '@/types/cuentas-dinero';

interface GetCuentasDineroParams {
  page?: number;
  limit?: number;
  filters?: CuentaDineroFilters;
}

export const getCuentasDineroRequest = async ({
  page = 1,
  limit = 10,
  filters,
}: GetCuentasDineroParams = {}): Promise<PaginatedCuentasDineroResponse> => {
  const response = await api.get<PaginatedCuentasDineroResponse>('/cuentas-dinero', {
    params: {
      page,
      limit,
      ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
      ...(filters?.idArea ? { idArea: filters.idArea } : {}),
      ...(filters?.idRama ? { idRama: filters.idRama } : {}),
      ...(filters?.idMiembro ? { idMiembro: filters.idMiembro } : {}),
    },
  });

  return response.data;
};

export const getCuentaDineroRequest = async (
  id: number,
): Promise<CuentaDinero> => {
  const response = await api.get<CuentaDinero>(`/cuentas-dinero/${id}`);
  return response.data;
};

export const getCuentasDineroOptionsRequest =
  async (): Promise<CuentaDineroOptionsResponse> => {
    const response = await api.get<CuentaDineroOptionsResponse>('/cuentas-dinero/options');
    return response.data;
  };

export const createCuentaDineroRequest = async (
  payload: CreateCuentaDineroPayload,
): Promise<CuentaDinero> => {
  const response = await api.post<CuentaDinero>('/cuentas-dinero', payload);
  return response.data;
};

export const updateCuentaDineroRequest = async (
  id: number,
  payload: UpdateCuentaDineroPayload,
): Promise<CuentaDinero> => {
  const response = await api.patch<CuentaDinero>(`/cuentas-dinero/${id}`, payload);
  return response.data;
};

export const deleteCuentaDineroRequest = async (id: number): Promise<void> => {
  await api.delete(`/cuentas-dinero/${id}`);
};
