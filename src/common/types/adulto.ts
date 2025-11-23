/**
 * Tipos para el módulo de Gestión de Adultos
 * Basado en el schema de Prisma y DTOs del backend
 */

/**
 * Interface principal para un Adulto (Respuesta del GET /adultos)
 * Estructura aplanada para facilitar el binding en DataTable
 */
export interface AdultoRow {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string;
  direccion: string;
  email: string | null;
  telefono: string | null;
  telefono_emergencia: string | null;
  totem: string | null;
  cualidad: string | null;
  rama: string | null;
  es_becado: boolean;
  activo: boolean;
}

/**
 * DTO para actualizar un Adulto
 */
export interface UpdateAdultoDto extends Partial<CreateAdultoDto> {}

/**
 * DTO para crear un Adulto (Estructura anidada requerida por Backend)
 */
export interface CreateAdultoDto {
  es_becado: boolean;
  activo: boolean;
  miembro: {
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_nacimiento: string | Date;
    direccion: string;
    email?: string;
    telefono?: string;
    telefono_emergencia: string;
    totem?: string;
    cualidad?: string;
  };
}

/**
 * Tipo helper para el estado activo/inactivo
 */
export type AdultoStatus = 'activo' | 'inactivo';
