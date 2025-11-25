/**
 * Capa de API para Adultos
 * Funciones puras de Axios para peticiones HTTP
 */

import api from '@/lib/axios';
import type {
  AdultoRow,
  UpdateAdultoDto,
  CreateAdultoDto,
  PaseAdultoDto,
} from '@/common/types/adulto';

/**
 * Obtiene la lista completa de adultos
 * @returns Promise con array de AdultoRow
 */
export const getAdultosFn = async (): Promise<AdultoRow[]> => {
  const response = await api.get<any>('/adultos');

  // Manejo robusto de respuesta:
  // 1. Si es un array directo
  if (Array.isArray(response.data)) {
    return response.data;
  }

  // 2. Si viene envuelto en un objeto { data: [...] } (NestJS standard)
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  // 3. Fallback
  console.warn(
    'Formato de respuesta inesperado en getAdultosFn:',
    response.data
  );
  return [];
};

/**
 * Actualiza un adulto por ID
 * @param id - ID del adulto a actualizar
 * @param data - Datos a actualizar
 * @returns Promise con el adulto actualizado
 */
export const updateAdultoFn = async (
  id: number,
  data: UpdateAdultoDto
): Promise<AdultoRow> => {
  const response = await api.patch<AdultoRow>(`/adultos/${id}`, data);
  return response.data;
};

/**
 * Crea un nuevo adulto
 * @param data - Datos del adulto a crear
 * @returns Promise con el adulto creado
 */
export const createAdultoFn = async (
  data: CreateAdultoDto
): Promise<AdultoRow> => {
  const response = await api.post<AdultoRow>('/adultos', data);
  return response.data;
};

/**
 * Elimina un adulto por ID
 * @param id - ID del adulto a eliminar
 * @returns Promise vacía
 */
export const deleteAdultoFn = async (id: number): Promise<void> => {
  await api.delete(`/adultos/${id}`);
};

/**
 * Realiza un Pase de Adulto (Cambio de Cargo/Área con historial)
 * @param id - ID del adulto
 * @param data - Datos del nuevo cargo/área
 * @returns Promise con el adulto actualizado
 */
export const paseAdultoFn = async (
  id: number,
  data: PaseAdultoDto
): Promise<AdultoRow> => {
  const response = await api.post<AdultoRow>(`/adultos/${id}/pase`, data);
  return response.data;
};
