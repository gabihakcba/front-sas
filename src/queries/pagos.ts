import api from '@/lib/axios';
import { Pago, CreatePagoDto, UpdatePagoDto } from '@/common/types/pago';

export const getPagosFn = async (): Promise<Pago[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<any>('/pagos');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};

export const createPagoFn = async (data: CreatePagoDto): Promise<Pago> => {
  const { data: response } = await api.post<Pago>('/pagos', data);
  return response;
};

export const updatePagoFn = async ({
  id,
  data,
}: {
  id: number;
  data: UpdatePagoDto;
}): Promise<Pago> => {
  const { data: response } = await api.patch<Pago>(`/pagos/${id}`, data);
  return response;
};

export const deletePagoFn = async (id: number): Promise<void> => {
  await api.delete(`/pagos/${id}`);
};
