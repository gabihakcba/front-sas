import { PaginatedResponseMeta } from '@/types/pagination';

export interface CuentaDineroArea {
  id: number;
  nombre: string;
}

export interface CuentaDineroRama {
  id: number;
  nombre: string;
  id_area: number;
}

export interface CuentaDineroMiembro {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface CuentaDinero {
  id: number;
  nombre: string;
  descripcion: string | null;
  monto_actual: string;
  id_area: number | null;
  id_rama: number | null;
  id_miembro: number | null;
  Area: CuentaDineroArea | null;
  Rama: CuentaDineroRama | null;
  Miembro: CuentaDineroMiembro | null;
  _count: {
    Pago: number;
  };
}

export interface PaginatedCuentasDineroResponse {
  data: CuentaDinero[];
  meta: PaginatedResponseMeta;
}

export interface CuentaDineroFilters {
  q: string;
  idArea: number | null;
  idRama: number | null;
  idMiembro: number | null;
}

export interface CuentaDineroOptionsResponse {
  areas: CuentaDineroArea[];
  ramas: CuentaDineroRama[];
  miembros: CuentaDineroMiembro[];
}

export interface CuentaDineroFormValues {
  nombre: string;
  descripcion: string;
  montoActual: string;
  tipoAsignacion: 'AREA' | 'RAMA' | 'MIEMBRO';
  idArea: number | null;
  idRama: number | null;
  idMiembro: number | null;
}

export interface CreateCuentaDineroPayload {
  nombre: string;
  descripcion?: string;
  montoActual: number;
  idArea?: number;
  idRama?: number;
  idMiembro?: number;
}

export interface UpdateCuentaDineroPayload {
  nombre?: string;
  descripcion?: string;
  montoActual?: number;
  idArea?: number;
  idRama?: number;
  idMiembro?: number;
}
