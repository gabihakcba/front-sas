import api from '@/lib/axios';
import type { Relacion } from '@/common/types/relacion';

export const getRelacionesFn = async (): Promise<Relacion[]> => {
  const response = await api.get<any>('/relaciones');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

export const crearRelacionFn = async (data: {
  id_responsable: number;
  id_protagonista: number;
  id_relacion: number;
}): Promise<any> => {
  return await api.post('/responsabilidades', data);
};
