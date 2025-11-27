import api from '@/lib/axios';
import {
  MetodoPago,
  CreateMetodoPagoDto,
  UpdateMetodoPagoDto,
} from '@/common/types/metodo-pago';

export const getMetodosPagoFn = async (): Promise<MetodoPago[]> => {
  const response = await api.get<any>('/metodo-pago');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

export const getMetodoPagoFn = async (id: number): Promise<MetodoPago> => {
  const response = await api.get<MetodoPago>(`/metodo-pago/${id}`);
  return response.data;
};

export const createMetodoPagoFn = async (
  data: CreateMetodoPagoDto
): Promise<MetodoPago> => {
  const response = await api.post<MetodoPago>('/metodo-pago', data);
  return response.data;
};

export const updateMetodoPagoFn = async (
  id: number,
  data: UpdateMetodoPagoDto
): Promise<MetodoPago> => {
  const response = await api.patch<MetodoPago>(`/metodo-pago/${id}`, data);
  return response.data;
};

export const deleteMetodoPagoFn = async (id: number): Promise<void> => {
  await api.delete(`/metodo-pago/${id}`);
};
