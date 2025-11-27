import api from '@/lib/axios';

interface ApiResponse<T> {
  data: T | { data: T };
}

export interface MiembroOption {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export const getMiembrosFn = async (): Promise<MiembroOption[]> => {
  // Assuming there is an endpoint to get all members or we can reuse existing ones.
  // For now, let's try to hit a generic /miembros endpoint.
  // If it doesn't exist, we might need to fetch adults and protagonists separately and merge.
  try {
    const response = await api.get<ApiResponse<MiembroOption[]>>('/miembros');
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data))
      return response.data.data;
    return [];
  } catch (error) {
    console.error('Error fetching miembros', error);
    return [];
  }
};
