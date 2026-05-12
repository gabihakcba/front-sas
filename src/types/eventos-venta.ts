import { PaginatedResponseMeta } from '@/types/pagination';

export interface EventoVentaSummary {
  cantidadVendida: number;
  cantidadRetirada: number;
  montoTotal: number;
  montoPagado: number;
  montoPendiente: number;
}

export interface EventoVentaItemOffer {
  id?: number;
  cantidad: number;
  precio_total: string;
  descripcion: string | null;
}

export interface EventoVentaItem {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_unitario: string;
  activo: boolean;
  orden: number;
  Ofertas: EventoVentaItemOffer[];
}

export interface EventoVentaCostoItem {
  id?: number;
  nombre: string;
  descripcion: string | null;
  unidad_medida: string | null;
  costo_unitario_x10000: number;
  cantidad_x10000: number;
  orden: number;
}

export interface EventoVentaCostoItemPayload {
  nombre: string;
  descripcion?: string;
  unidadMedida?: string;
  costoUnitarioX10000: number;
  cantidadX10000: number;
}

export interface EventoVentaSector {
  id: number;
  nombre: string;
  tipo_sector: 'RAMA' | 'AREA' | 'EXTRAS' | 'OTRO';
  nombre_hoja: string | null;
  id_rama?: number | null;
  resumen_total_vendido: number | null;
  resumen_total_retirado: number | null;
  monto_rendido_efectivo: string | null;
  monto_rendido_transferencia: string | null;
  monto_deuda_informado: string | null;
  Rama: { id: number; nombre: string } | null;
  Area: { id: number; nombre: string } | null;
  Reservas: Array<{ id: number }>;
}

export interface EventoVentaPago {
  id: number;
  tipo_pago: 'EFECTIVO' | 'TRANSFERENCIA' | 'OTRO';
  monto: string;
  cuenta_destino: string | null;
  observaciones: string | null;
}

export interface EventoVentaReservaItem {
  id: number;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  Item: {
    id: number;
    nombre: string;
  };
}

export interface EventoVentaReserva {
  id: number;
  comprador_nombre: string;
  vendedor_nombre: string | null;
  cantidad_total: number;
  cantidad_retirada: number;
  monto_total: string;
  monto_pagado: string;
  saldo_pendiente: string;
  cuenta_destino: string | null;
  observaciones: string | null;
  fila_origen: number | null;
  Vendedor: {
    id: number;
    nombre: string;
    apellidos: string;
  } | null;
  Sector: {
    id: number;
    nombre: string;
  } | null;
  Items: EventoVentaReservaItem[];
  Pagos: EventoVentaPago[];
}

export interface EventoVentaSheet {
  id: number;
  nombre_hoja: string;
  nombre_visible: string;
  tipo_hoja: 'BALANCE' | 'GENERAL' | 'SECTOR' | 'OTRA';
  contenido: Array<Array<string | number | boolean | null>>;
}

export interface EventoVentaRankingSeller {
  nombre: string;
  cantidad: number;
  monto: number;
  reservas: number;
}

export interface EventoVentaMiembroOption {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  ramaActualId: number | null;
  ramaActualNombre: string | null;
}

export interface EventoVentaEncargadoJuvenilItem {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  ramaActualNombre: string | null;
  alreadyAssigned: boolean;
}

export interface EventoVenta {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_evento: string;
  notas: string | null;
  resumen: EventoVentaSummary;
  Items: EventoVentaItem[];
  Costos: EventoVentaCostoItem[];
  Sectores: EventoVentaSector[];
  Reservas: EventoVentaReserva[];
  HojasImportes: EventoVentaSheet[];
  rankingVendedores: EventoVentaRankingSeller[];
  miembrosDisponibles: EventoVentaMiembroOption[];
}

export interface EventoVentaListItem {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_evento: string;
  borrado: boolean;
  resumen: EventoVentaSummary;
  _count: {
    Items: number;
    Sectores: number;
    Reservas: number;
  };
}

export interface PaginatedEventosVentaResponse {
  data: EventoVentaListItem[];
  meta: PaginatedResponseMeta;
}

export interface EventoVentaFilters {
  q: string;
  includeDeleted: boolean;
}

export interface EventoVentaFormValues {
  nombre: string;
  descripcion: string;
  fechaEvento: Date | null;
  notas: string;
}

export interface EventoVentaItemOfferFormValues {
  cantidad: string;
  precioTotal: string;
  descripcion: string;
}

export interface EventoVentaItemFormValues {
  nombre: string;
  descripcion: string;
  precioUnitario: string;
  ofertas: EventoVentaItemOfferFormValues[];
}

export interface CreateEventoVentaPayload {
  nombre: string;
  descripcion?: string;
  fechaEvento: string;
  notas?: string;
}

export interface CreateEventoVentaItemPayload {
  nombre: string;
  descripcion?: string;
  precioUnitario: number;
  ofertas?: Array<{
    cantidad: number;
    precioTotal: number;
    descripcion?: string;
  }>;
}

export interface CreateEventoVentaReservaPayload {
  comprador: string;
  idVendedorMiembro?: number | null;
  idItem: number;
  idSector?: number | null;
  cantidad: number;
  efectivo?: number;
  transferencia?: number;
  cuenta?: string;
  debe?: number;
  retiro?: number;
}

export interface UpdateEventoVentaReservaPayload {
  comprador?: string;
  idVendedorMiembro?: number | null;
  idSector?: number | null;
  cantidad?: number;
  efectivo?: number;
  transferencia?: number;
  cuenta?: string | null;
  debe?: number;
  retiro?: number;
  observacion?: string | null;
}
