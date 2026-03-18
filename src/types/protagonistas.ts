import { PaginatedResponseMeta } from '@/types/pagination';

export interface ProtagonistaRama {
  id: number;
  nombre: string;
  id_area: number;
}

export interface ProtagonistaMiembroRama {
  id: number;
  fecha_ingreso: string;
  id_rama?: number;
  Rama: ProtagonistaRama;
}

export interface ProtagonistaCuenta {
  id: number;
  user: string;
}

export interface ProtagonistaMiembro {
  id: number;
  borrado?: boolean;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento?: string;
  direccion?: string;
  email: string | null;
  telefono: string | null;
  telefono_emergencia?: string;
  totem?: string | null;
  cualidad?: string | null;
  Cuenta?: ProtagonistaCuenta;
  MiembroRama: ProtagonistaMiembroRama[];
}

export interface Protagonista {
  id: number;
  borrado?: boolean;
  es_becado: boolean;
  activo: boolean;
  Miembro: ProtagonistaMiembro;
}

export interface PaginatedProtagonistasResponse {
  data: Protagonista[];
  meta: PaginatedResponseMeta;
}

export interface ProtagonistaFilters {
  q: string;
  idRama: number | null;
  esBecado: boolean | null;
  activo: boolean | null;
  includeDeleted: boolean;
}

export interface RamaOption {
  id: number;
  nombre: string;
  id_area: number;
}

export interface ProtagonistaFormValues {
  user: string;
  password: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  telefonoEmergencia: string;
  totem: string;
  cualidad: string;
  idRama: number | null;
  fechaIngresoRama: string;
  esBecado: boolean;
  activo: boolean;
}

export interface ProtagonistaPaseValues {
  idRama: number | null;
  fechaIngresoRama: string;
}

export interface CreateProtagonistaPayload {
  user: string;
  password: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  email?: string;
  telefono?: string;
  telefonoEmergencia: string;
  totem?: string;
  cualidad?: string;
  idRama: number;
  fechaIngresoRama?: string;
  esBecado?: boolean;
  activo?: boolean;
}

export interface UpdateProtagonistaPayload {
  user?: string;
  password?: string;
  nombre?: string;
  apellidos?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  telefonoEmergencia?: string;
  totem?: string;
  cualidad?: string;
  idRama?: number;
  fechaIngresoRama?: string;
  esBecado?: boolean;
  activo?: boolean;
}

export interface ProtagonistaPasePayload {
  idRama: number;
  fechaIngresoRama?: string;
}
