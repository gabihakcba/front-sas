import { PaginatedResponseMeta } from '@/types/pagination';

export interface TipoEvento {
  id: number;
  nombre: string;
  descripcion: string | null;
  _count: {
    Evento: number;
  };
}

export interface PaginatedTiposEventoResponse {
  data: TipoEvento[];
  meta: PaginatedResponseMeta;
}

export interface TipoEventoFormValues {
  nombre: string;
  descripcion: string;
}

export interface CreateTipoEventoPayload {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTipoEventoPayload {
  nombre?: string;
  descripcion?: string;
}
