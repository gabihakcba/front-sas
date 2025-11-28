import api from '@/lib/axios';
import {
  InscripcionRow,
  CreateInscripcionDto,
  InscripcionesResponse,
} from '@/common/types/inscripcion';

interface ApiResponse<T> {
  data: T | { data: T };
}

export const getInscripcionesPorEventoFn = async (
  idEvento: number
): Promise<InscripcionesResponse> => {
  const response = await api.get<ApiResponse<InscripcionesResponse>>(
    `/inscripciones/evento/${idEvento}`
  );

  // Handle direct data or nested data structure
  const data = (response.data as any).data || response.data;

  // Ensure we return the expected structure even if empty
  return {
    educadores: data.educadores || [],
    protagonistas: data.protagonistas || [],
    adultos: data.adultos || [],
    responsables: data.responsables || [],
  };
};

export const inscribirMiembroFn = async (
  data: CreateInscripcionDto
): Promise<InscripcionRow> => {
  const response = await api.post<InscripcionRow>('/inscripciones', data);
  return response.data;
};

export const cancelarInscripcionFn = async (id: number): Promise<void> => {
  await api.delete(`/inscripciones/${id}`);
};
