import api from '@/lib/axios';
import {
  ConceptoPago,
  CreateConceptoPagoDto,
  UpdateConceptoPagoDto,
} from '@/common/types/concepto-pago';

export const getConceptosPagoFn = async (): Promise<ConceptoPago[]> => {
  const response = await api.get<any>('/concepto-pago');
  console.log('Conceptos Pago Response:', response.data);
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

export const getConceptoPagoFn = async (id: number): Promise<ConceptoPago> => {
  const response = await api.get<ConceptoPago>(`/concepto-pago/${id}`);
  return response.data;
};

export const createConceptoPagoFn = async (
  data: CreateConceptoPagoDto
): Promise<ConceptoPago> => {
  const response = await api.post<ConceptoPago>('/concepto-pago', data);
  return response.data;
};

export const updateConceptoPagoFn = async (
  id: number,
  data: UpdateConceptoPagoDto
): Promise<ConceptoPago> => {
  const response = await api.patch<ConceptoPago>(`/concepto-pago/${id}`, data);
  return response.data;
};

export const deleteConceptoPagoFn = async (id: number): Promise<void> => {
  await api.delete(`/concepto-pago/${id}`);
};
