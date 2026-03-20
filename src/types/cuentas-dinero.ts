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

export interface CuentaDineroMetodo {
  id: number;
  nombre: string;
}

export interface MovimientoCuentaAdjunto {
  id: number;
  nombre: string;
  mime: string;
  createdAt: string;
}

export interface MovimientoCuenta {
  id: number;
  monto: string;
  tipo: 'INGRESO' | 'EGRESO';
  detalles: string | null;
  fecha_movimiento: string;
  saldo_anterior: string;
  saldo_posterior: string;
  codigo_referencia: string;
  borrado: boolean;
  createdAt: string;
  updatedAt: string;
  Responsable: CuentaDineroMiembro;
  MetodoPago: CuentaDineroMetodo;
  CuentaDinero: {
    id: number;
    nombre: string;
  };
  Adjuntos: MovimientoCuentaAdjunto[];
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
    MovimientoCuenta: number;
  };
  createdAt?: string;
  updatedAt?: string;
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
  metodos?: CuentaDineroMetodo[];
}

export interface MovimientosCuentaOptionsResponse {
  responsableActual: CuentaDineroMiembro | null;
  metodos: CuentaDineroMetodo[];
  tipos: Array<'INGRESO' | 'EGRESO'>;
}

export interface MovimientoCuentaFilters {
  q: string;
  idMetodoPago: number | null;
  tipo: 'INGRESO' | 'EGRESO' | null;
  includeDeleted: boolean;
}

export interface PaginatedMovimientosCuentaResponse {
  data: MovimientoCuenta[];
  meta: PaginatedResponseMeta;
}

export interface MovimientoCuentaAdjuntoPayload {
  archivoBase64: string;
  mimeType: string;
  nombre: string;
}

export interface MovimientoCuentaAdjuntosFormValues {
  adjuntos: MovimientoCuentaAdjuntoPayload[];
}

export interface MovimientoCuentaFormValues {
  monto: number | null;
  detalles: string;
  fechaMovimiento: string;
  idMetodoPago: number | null;
  adjuntos: MovimientoCuentaAdjuntoPayload[];
}

export interface CreateMovimientoCuentaPayload {
  monto: number;
  detalles?: string;
  fechaMovimiento?: string;
  idMetodoPago: number;
  adjuntos?: MovimientoCuentaAdjuntoPayload[];
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
