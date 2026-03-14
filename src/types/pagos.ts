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
  comprobante_pago_mime: string | null;
  comprobante_pago_nombre: string | null;
  fecha_pago: string;
  codigo_validacion: string;
  Miembro: PagoMiembroOption;
  Responsable: PagoMiembroOption | null;
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

export interface PagoFilters {
  q: string;
  idConceptoPago: number | null;
  idMetodoPago: number | null;
  idCuentaDinero: number | null;
  idCuentaOrigen: number | null;
}

export interface PagosOptionsResponse {
  cuentas: PagoCuentaOption[];
  conceptos: PagoRelationOption[];
  metodos: PagoRelationOption[];
  miembros: PagoMiembroOption[];
}

export interface PagoWhatsappShareData {
  phone: string;
  responsableNombre: string;
  message: string;
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
  comprobantePagoBase64: string | null | undefined;
  comprobantePagoMimeType: string | null | undefined;
  comprobantePagoNombre: string | null | undefined;
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
  comprobantePagoBase64?: string;
  comprobantePagoMimeType?: string;
  comprobantePagoNombre?: string;
}

export interface UpdatePagoPayload {
  monto?: number;
  detalles?: string;
  fechaPago?: string;
  idCuentaDinero?: number;
  idCuentaOrigen?: number | null;
  idMetodoPago?: number;
  idConceptoPago?: number;
  idMiembro?: number;
  comprobantePagoBase64?: string | null;
  comprobantePagoMimeType?: string | null;
  comprobantePagoNombre?: string | null;
}
