import api from '@/lib/axios';

interface ApiResponse<T> {
  data: T | { data: T };
}

export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
  // Relación con Ramas para lógica data-driven
  Rama?: Array<{ id: number; nombre: string }>;
}

export interface Posicion {
  id: number;
  nombre: string;
  descripcion?: string;
  es_lider?: boolean;
}

export const getAreasFn = async (): Promise<Area[]> => {
  const response = await api.get<ApiResponse<Area[]>>('/areas');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};

export const getPosicionesFn = async (): Promise<Posicion[]> => {
  const response = await api.get<ApiResponse<Posicion[]>>('/posiciones');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};

export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
  scope?: string;
  scopeId?: number;
}

export const getRolesFn = async (): Promise<Role[]> => {
  const response = await api.get<ApiResponse<Role[]>>('/roles');
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data))
    return response.data.data;
  return [];
};
