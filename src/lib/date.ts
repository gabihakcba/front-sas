import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';

// Configuración de dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale('es');

/**
 * Formatea una fecha a DD/MM/YYYY ignorando la zona horaria local.
 * Asume que la fecha de entrada es UTC y muestra ese mismo día.
 * @param date Fecha a formatear (string ISO o Date)
 * @returns String formateado o "-" si es null
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  // Parseamos como UTC y formateamos directamente, ignorando el offset local
  return dayjs.utc(date).format('DD/MM/YYYY');
};

/**
 * Formatea una fecha a DD/MM/YYYY HH:mm
 * @param date Fecha a formatear
 * @returns String formateado o "-" si es null
 */
export const formatDateTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return '-';
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Convierte un string ISO (del backend UTC) a un objeto Date LOCAL que representa el mismo día.
 * "Neutraliza" la zona horaria para que el Calendar muestre el día correcto.
 * @param isoString String ISO de fecha (ej: 1997-09-27T00:00:00Z)
 * @returns Objeto Date local (ej: Sat Sep 27 1997 00:00:00 GMT-0300)
 */
export const toCalendarDate = (
  isoString: string | null | undefined
): Date | null => {
  if (!isoString) return null;

  // 1. Parseamos la fecha original como UTC
  const utcDate = dayjs.utc(isoString);

  // 2. Obtenemos los componentes de la fecha (YYYY, MM, DD)
  // 3. Creamos una fecha LOCAL con esos mismos componentes
  // Esto hace que si era 27 en UTC, sea 27 en Local (aunque sean instantes diferentes en el tiempo)
  return dayjs(utcDate.format('YYYY-MM-DD')).toDate();
};

/**
 * Convierte un objeto Date (del Calendar local) a string ISO UTC puro.
 * Mantiene el día seleccionado pero lo fuerza a UTC T00:00:00Z.
 * @param date Objeto Date local
 * @returns String ISO UTC (ej: 1997-09-27T00:00:00.000Z)
 */
export const toApiDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;

  // 1. Tomamos la fecha local y la formateamos a string YYYY-MM-DD
  const dateString = dayjs(date).format('YYYY-MM-DD');

  // 2. Creamos una fecha UTC a partir de ese string (forzando las 00:00 UTC)
  return dayjs.utc(dateString).format();
};
