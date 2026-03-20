import api from '@/lib/axios';
import {
  CreateCuentaDineroPayload,
  CreateMovimientoCuentaPayload,
  CuentaDinero,
  CuentaDineroFilters,
  MovimientoCuentaFilters,
  CuentaDineroOptionsResponse,
  MovimientosCuentaOptionsResponse,
  PaginatedMovimientosCuentaResponse,
  PaginatedCuentasDineroResponse,
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

export const getCuentaMovimientosRequest = async (
  id: number,
  {
    page = 1,
    limit = 10,
    filters,
  }: {
    page?: number;
    limit?: number;
    filters?: MovimientoCuentaFilters;
  } = {},
): Promise<PaginatedMovimientosCuentaResponse> => {
  const response = await api.get<PaginatedMovimientosCuentaResponse>(
    `/cuentas-dinero/${id}/movimientos`,
    {
      params: {
        page,
        limit,
        ...(filters?.q.trim() ? { q: filters.q.trim() } : {}),
        ...(filters?.idMetodoPago ? { idMetodoPago: filters.idMetodoPago } : {}),
        ...(filters?.tipo ? { tipo: filters.tipo } : {}),
        ...(filters?.includeDeleted ? { includeDeleted: true } : {}),
      },
    },
  );

  return response.data;
};

export const getCuentaMovimientosOptionsRequest = async (
  id: number,
): Promise<MovimientosCuentaOptionsResponse> => {
  const response = await api.get<MovimientosCuentaOptionsResponse>(
    `/cuentas-dinero/${id}/movimientos/options`,
  );
  return response.data;
};

export const createMovimientoCuentaRequest = async (
  id: number,
  payload: CreateMovimientoCuentaPayload,
) => {
  const response = await api.post(`/cuentas-dinero/${id}/movimientos`, payload);
  return response.data;
};

export const addMovimientoCuentaAdjuntosRequest = async (
  idCuenta: number,
  idMovimiento: number,
  adjuntos: CreateMovimientoCuentaPayload['adjuntos'],
) => {
  const response = await api.post(
    `/cuentas-dinero/${idCuenta}/movimientos/${idMovimiento}/adjuntos`,
    {
      adjuntos,
    },
  );
  return response.data;
};

export const deleteMovimientoCuentaRequest = async (
  idCuenta: number,
  idMovimiento: number,
) => {
  await api.delete(`/cuentas-dinero/${idCuenta}/movimientos/${idMovimiento}`);
};

export const getMovimientoCuentaAdjuntoRequest = async (
  idCuenta: number,
  idMovimiento: number,
  idAdjunto: number,
): Promise<Blob> => {
  const response = await api.get(
    `/cuentas-dinero/${idCuenta}/movimientos/${idMovimiento}/adjuntos/${idAdjunto}`,
    {
      responseType: 'blob',
    },
  );
  return response.data as Blob;
};

export const deleteMovimientoCuentaAdjuntoRequest = async (
  idCuenta: number,
  idMovimiento: number,
  idAdjunto: number,
) => {
  await api.delete(
    `/cuentas-dinero/${idCuenta}/movimientos/${idMovimiento}/adjuntos/${idAdjunto}`,
  );
};
