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
  // Relación con EquipoArea (Backend)
  equipoActual?: {
    id: number;
    activo: boolean;
    fecha_inicio: string;
    Area: { id: number; nombre: string };
    PosicionArea: { id: number; nombre: string };
    Rama?: { id: number; nombre: string };
  };
  roles: Array<{ id: number; nombre: string }>;
  // Legacy or flattened fields (optional)
  equipo?: any;
}

/**
 * Interface para el formulario de Adultos (Campos planos)
 */
export interface AdultoFormData {
  id?: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string | Date | null;
  direccion: string;
  email: string | null;
  telefono: string | null;
  telefono_emergencia: string | null;
  totem: string | null;
  cualidad: string | null;
  es_becado: boolean;
  activo: boolean;

  // Campos planos para los dropdowns
  id_area?: number;
  id_posicion?: number;
  id_rama?: number;
  roles?: number[];
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
  equipo?: {
    id_area: number;
    id_posicion: number;
    id_rama?: number;
  };
  roles: number[];
}

/**
 * DTO para realizar un Pase de Adulto (Cambio de Cargo/Área)
 */
export interface PaseAdultoDto {
  equipo: {
    id_area: number;
    id_posicion: number;
    id_rama?: number;
    id_roles: number[];
  };
  fecha_pase?: string | Date;
}

/**
 * Tipo helper para el estado activo/inactivo
 */
export type AdultoStatus = 'activo' | 'inactivo';
