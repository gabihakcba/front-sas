import { PaginatedResponseMeta } from '@/types/pagination';

export interface EventoOption {
  id: number;
  nombre: string;
}

export interface EventoMiembroOption {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface EventoRamaOption extends EventoOption {
  id_area: number;
}

export interface EventoComisionOption extends EventoOption {
  id_evento: number | null;
}

export interface Evento {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  lugar: string | null;
  terminado: boolean;
  costo_mp: string;
  costo_ma: string;
  costo_ayudante: string;
  TipoEvento: EventoOption;
  Comision: EventoOption[];
  AreaAfectada: Array<{
    Area: EventoOption;
  }>;
  RamaAfectada: Array<{
    Rama: EventoOption;
  }>;
  _count: {
    InscripcionEvento: number;
  };
  InscripcionEvento?: Array<{
    id: number;
    Miembro: EventoMiembroOption;
  }>;
}

export interface EventoInscripcion {
  id: number;
  descripcion: string | null;
  asistio: boolean;
  pagado: boolean;
  monto_total: string;
  saldo_pendiente: string;
  Miembro: EventoMiembroOption;
}

export interface PaginatedEventosResponse {
  data: Evento[];
  meta: PaginatedResponseMeta;
}

export interface EventosOptionsResponse {
  tipos: EventoOption[];
  areas: EventoOption[];
  ramas: EventoRamaOption[];
  miembros: EventoMiembroOption[];
  comisiones: EventoComisionOption[];
}

export interface EventoFormValues {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  terminado: boolean;
  costoMp: string;
  costoMa: string;
  costoAyudante: string;
  idTipo: number | null;
}

export interface CreateEventoPayload {
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  lugar?: string;
  terminado?: boolean;
  costoMp: number;
  costoMa: number;
  costoAyudante: number;
  idTipo: number;
}

export interface UpdateEventoPayload {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  lugar?: string;
  terminado?: boolean;
  costoMp?: number;
  costoMa?: number;
  costoAyudante?: number;
  idTipo?: number;
}
