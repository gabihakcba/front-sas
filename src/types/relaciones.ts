import { PaginatedResponseMeta } from '@/types/pagination';

export interface Relacion {
  id: number;
  tipo: string;
  descripcion: string | null;
  _count: {
    Responsabilidad: number;
  };
}

export interface PaginatedRelacionesResponse {
  data: Relacion[];
  meta: PaginatedResponseMeta;
}

export interface RelacionFormValues {
  tipo: string;
  descripcion: string;
}

export interface CreateRelacionPayload {
  tipo: string;
  descripcion?: string;
}

export interface UpdateRelacionPayload {
  tipo?: string;
  descripcion?: string;
}
