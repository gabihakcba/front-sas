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
}

export interface PaginatedComisionesResponse {
  data: Comision[];
  meta: PaginatedResponseMeta;
}

export interface ComisionFormValues {
  nombre: string;
  descripcion: string;
}

export interface CreateComisionPayload {
  nombre: string;
  descripcion?: string;
}

export interface UpdateComisionPayload {
  nombre?: string;
  descripcion?: string;
}
