/**
 * Capa de API para Protagonistas
 * Funciones puras de Axios para peticiones HTTP
 */

import api from '@/lib/axios';
import type {
  ProtagonistaRow,
  UpdateProtagonistaDto,
  CreateProtagonistaDto,
} from '@/common/types/protagonista';

/**
 * Obtiene la lista completa de protagonistas
 * @returns Promise con array de ProtagonistaRow
 */
export const getProtagonistasFn = async (): Promise<ProtagonistaRow[]> => {
  const response = await api.get<any>('/protagonistas');

  // Manejo robusto de respuesta
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  console.warn(
    'Formato de respuesta inesperado en getProtagonistasFn:',
    response.data
  );
  return [];
};

/**
 * Actualiza un protagonista por ID
 * @param id - ID del protagonista a actualizar
 * @param data - Datos a actualizar
 * @returns Promise con el protagonista actualizado
 */
export const updateProtagonistaFn = async (
  id: number,
  data: UpdateProtagonistaDto
): Promise<ProtagonistaRow> => {
  const response = await api.patch<ProtagonistaRow>(
    `/protagonistas/${id}`,
    data
  );
  return response.data;
};

/**
 * Crea un nuevo protagonista
 * @param data - Datos del protagonista a crear
 * @returns Promise con el protagonista creado
 */
export const createProtagonistaFn = async (
  data: CreateProtagonistaDto
): Promise<ProtagonistaRow> => {
  const response = await api.post<ProtagonistaRow>('/protagonistas', data);
  return response.data;
};

/**
 * Elimina un protagonista por ID
 * @param id - ID del protagonista a eliminar
 * @returns Promise vacía
 */
export const deleteProtagonistaFn = async (id: number): Promise<void> => {
  await api.delete(`/protagonistas/${id}`);
};

/**
 * Realiza el pase de rama de un protagonista
 * @param id - ID del protagonista
 * @param id_rama - ID de la nueva rama
 * @returns Promise con el protagonista actualizado
 */
export const paseRamaFn = async (
  id: number,
  id_nueva_rama: number,
  fecha_pase?: string
): Promise<ProtagonistaRow> => {
  const response = await api.post<ProtagonistaRow>(
    `/protagonistas/${id}/pase`,
    {
      id_nueva_rama,
      fecha_pase,
    }
  );
  return response.data;
};
