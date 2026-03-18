import { PaginatedResponseMeta } from '@/types/pagination';

export type EstadoCiclo =
  | 'DIAGNOSTICO'
  | 'PLANIFICACION'
  | 'DESARROLLO'
  | 'EVALUACION'
  | 'FINALIZADO';

export interface CicloProgramaRamaOption {
  id: number;
  nombre: string;
}

export interface CicloProgramaResumen {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoCiclo;
  diagnostico: string | null;
  planificacion: string | null;
  desarrollo: string | null;
  evaluacion: string | null;
  borrado: boolean;
  Rama: CicloProgramaRamaOption;
  _count: {
    Evento: number;
  };
}

export interface CicloProgramaDetalle extends CicloProgramaResumen {
  Evento: Array<{
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    terminado: boolean;
    TipoEvento: {
      id: number;
      nombre: string;
    };
  }>;
}

export interface PaginatedCiclosProgramaResponse {
  data: CicloProgramaResumen[];
  meta: PaginatedResponseMeta;
}

export interface CiclosProgramaOptionsResponse {
  ramas: CicloProgramaRamaOption[];
  estados: EstadoCiclo[];
}

export interface CicloProgramaFilters {
  q: string;
  fechaDesde: string;
  fechaHasta: string;
}

export interface CicloProgramaFormValues {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  idRama: number | null;
}

export interface CreateCicloProgramaPayload {
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  idRama: number;
}

export type UpdateCicloProgramaPayload = Partial<CreateCicloProgramaPayload> & {
  estado?: EstadoCiclo;
  diagnostico?: string;
  planificacion?: string;
  desarrollo?: string;
  evaluacion?: string;
};
