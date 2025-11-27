import api from '@/lib/axios';
import { LoginCredentials, LoginResponse } from '@/common/types/auth';
export type { LoginCredentials, LoginResponse };

export const loginFn = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
};

export const logoutFn = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMeFn = async (): Promise<any> => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const getMyPermissionsFn = async (): Promise<string[]> => {
  const response = await api.get<any>('/auth/permissions');

  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};
