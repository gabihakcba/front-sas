import api from '@/lib/axios';
import {
  Inscripcion,
  CreateInscripcionDto,
  InscripcionesAgrupadas,
} from '@/common/types/inscripcion';

interface ApiResponse<T> {
  data: T | { data: T };
}

export const getInscripcionesPorEventoFn = async (
  idEvento: number
): Promise<InscripcionesAgrupadas> => {
  const response = await api.get<ApiResponse<InscripcionesAgrupadas>>(
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
): Promise<Inscripcion> => {
  const response = await api.post<Inscripcion>('/inscripciones', data);
  return response.data;
};

export const cancelarInscripcionFn = async (id: number): Promise<void> => {
  await api.delete(`/inscripciones/${id}`);
};
