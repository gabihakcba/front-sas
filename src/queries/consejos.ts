import api from '@/lib/axios';
import {
  Consejo,
  CreateConsejoDto,
  UpdateConsejoDto,
} from '@/common/types/consejo';

export const getConsejosFn = async (): Promise<Consejo[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<any>('/consejos');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};

export const createConsejoFn = async (
  data: CreateConsejoDto
): Promise<Consejo> => {
  const { data: response } = await api.post<Consejo>('/consejos', data);
  return response;
};

export const updateConsejoFn = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateConsejoDto;
}): Promise<Consejo> => {
  const { data: response } = await api.patch<Consejo>(`/consejos/${id}`, data);
  return response;
};

export const deleteConsejoFn = async (id: number): Promise<void> => {
  await api.delete(`/consejos/${id}`);
};
