import { PaginatedResponseMeta } from '@/types/pagination';

export interface Comision {
  id: number;
  nombre: string;
  descripcion: string | null;
  Evento: {
    id: number;
    nombre: string;
  } | null;
  _count: {
    ParticipantesComision: number;
  };
  ParticipantesComision?: Array<{
    id: number;
    fecha_inicio: string;
    Miembro: {
      id: number;
      nombre: string;
      apellidos: string;
      dni: string;
    };
  }>;
}

export interface PaginatedComisionesResponse {
  data: Comision[];
  meta: PaginatedResponseMeta;
}

export interface ComisionFormValues {
  nombre: string;
  descripcion: string;
  idEvento: number | null;
}

export interface CreateComisionPayload {
  nombre: string;
  descripcion?: string;
  idEvento?: number | null;
}

export interface UpdateComisionPayload {
  nombre?: string;
  descripcion?: string;
  idEvento?: number | null;
}

export interface ComisionFilters {
  q: string;
  idEvento: number | null;
}

export interface ComisionOption {
  id: number;
  nombre: string;
}

export interface ComisionAdultOption {
  id: number;
  Miembro: {
    id: number;
    nombre: string;
    apellidos: string;
    dni: string;
  };
}

export interface ComisionesOptionsResponse {
  eventos: ComisionOption[];
  adultos: ComisionAdultOption[];
}

export interface ComisionParticipante {
  id: number;
  fecha_inicio: string;
  Miembro: {
    id: number;
    nombre: string;
    apellidos: string;
    dni: string;
  };
}
