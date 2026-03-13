import api from '@/lib/axios';
import { LoginDto } from '@/types/auth';

export const loginRequest = async (credentials: LoginDto) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
