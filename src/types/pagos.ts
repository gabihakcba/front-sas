import { PaginatedResponseMeta } from '@/types/pagination';

export interface PagoRelationOption {
  id: number;
  nombre: string;
}

export interface PagoCuentaOption extends PagoRelationOption {
  monto_actual: string;
  id_miembro: number | null;
  Area: PagoRelationOption | null;
  Rama: PagoRelationOption | null;
  Miembro: {
    id: number;
    nombre: string;
    apellidos: string;
  } | null;
}

export interface PagoMiembroOption {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface Pago {
  id: number;
  monto: string;
  detalles: string | null;
  fecha_pago: string;
  codigo_validacion: string;
  Miembro: PagoMiembroOption;
  MetodoPago: PagoRelationOption;
  ConceptoPago: PagoRelationOption;
  CuentaDinero: PagoRelationOption;
  CuentaOrigen: PagoRelationOption | null;
  Evento: PagoRelationOption | null;
}

export interface PaginatedPagosResponse {
  data: Pago[];
  meta: PaginatedResponseMeta;
}

export interface PagosOptionsResponse {
  cuentas: PagoCuentaOption[];
  conceptos: PagoRelationOption[];
  metodos: PagoRelationOption[];
  miembros: PagoMiembroOption[];
}

export interface PagoFormValues {
  monto: string;
  detalles: string;
  fechaPago: string;
  idCuentaDinero: number | null;
  idCuentaOrigen: number | null;
  idMetodoPago: number | null;
  idConceptoPago: number | null;
  idMiembro: number | null;
}

export interface CreatePagoPayload {
  monto: number;
  detalles?: string;
  fechaPago?: string;
  idCuentaDinero: number;
  idCuentaOrigen?: number;
  idMetodoPago: number;
  idConceptoPago: number;
  idMiembro: number;
}

export interface UpdatePagoPayload {
  monto?: number;
  detalles?: string;
  fechaPago?: string;
  idCuentaDinero?: number;
  idCuentaOrigen?: number;
  idMetodoPago?: number;
  idConceptoPago?: number;
  idMiembro?: number;
}
