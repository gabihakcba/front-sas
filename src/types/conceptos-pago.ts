import { PaginatedResponseMeta } from '@/types/pagination';

export interface ConceptoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  _count: {
    Pago: number;
  };
}

export interface PaginatedConceptosPagoResponse {
  data: ConceptoPago[];
  meta: PaginatedResponseMeta;
}

export interface ConceptoPagoFormValues {
  nombre: string;
  descripcion: string;
}

export interface CreateConceptoPagoPayload {
  nombre: string;
  descripcion?: string;
}

export interface UpdateConceptoPagoPayload {
  nombre?: string;
  descripcion?: string;
}
