import { PaginatedResponseMeta } from '@/types/pagination';

export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  _count: {
    Pago: number;
  };
}

export interface PaginatedMetodosPagoResponse {
  data: MetodoPago[];
  meta: PaginatedResponseMeta;
}

export interface MetodoPagoFormValues {
  nombre: string;
  descripcion: string;
}

export interface CreateMetodoPagoPayload {
  nombre: string;
  descripcion?: string;
}

export interface UpdateMetodoPagoPayload {
  nombre?: string;
  descripcion?: string;
}
