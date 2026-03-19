import { PaginatedResponseMeta } from '@/types/pagination';

export type ReunionModalidad = 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';

export interface ReunionOption {
  id: number;
  nombre: string;
}

export interface ReunionRamaOption extends ReunionOption {
  id_area: number;
}

export interface ReunionMiembroOption {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface ReunionInvitado {
  id: number;
  asistio: boolean;
  confirmo: boolean | null;
  Miembro: ReunionMiembroOption;
}

export interface Reunion {
  id: number;
  borrado?: boolean;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  modalidad: ReunionModalidad;
  lugar_fisico: string | null;
  url_virtual: string | null;
  Invitados: ReunionInvitado[];
  AreasAfectadas: Array<{
    Area: ReunionOption;
  }>;
  RamasAfectadas: Array<{
    Rama: ReunionRamaOption;
  }>;
  _count: {
    Invitados: number;
  };
}

export interface PaginatedReunionesResponse {
  data: Reunion[];
  meta: PaginatedResponseMeta;
}

export interface ReunionesOptionsResponse {
  areas: ReunionOption[];
  ramas: ReunionRamaOption[];
  miembros: ReunionMiembroOption[];
}

export interface ReunionFilters {
  q: string;
  modalidad: ReunionModalidad | null;
  fechaDesde: string;
  fechaHasta: string;
  includeDeleted: boolean;
}

export interface ReunionFormValues {
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  modalidad: ReunionModalidad;
  lugarFisico: string;
  urlVirtual: string;
  areaIds: number[];
  ramaIds: number[];
}

export interface CreateReunionPayload {
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  modalidad?: ReunionModalidad;
  lugarFisico?: string;
  urlVirtual?: string;
  areaIds?: number[];
  ramaIds?: number[];
}

export interface UpdateReunionPayload {
  titulo?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  modalidad?: ReunionModalidad;
  lugarFisico?: string;
  urlVirtual?: string;
  areaIds?: number[];
  ramaIds?: number[];
}
