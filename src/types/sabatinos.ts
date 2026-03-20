import { PaginatedResponseMeta } from './pagination';

export interface TipoActividad {
  id: number;
  nombre: string;
  color: string | null;
}

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string | null;
  objetivos: string | null;
  materiales: string | null;
  id_tipo: number;
  Tipo: TipoActividad;
}

export interface Sabatino {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
  borrado: boolean;
  Educadores: Array<{
    Adulto: {
      id: number;
      Miembro: {
        id: number;
        nombre: string;
        apellidos: string;
        dni?: string;
      };
    };
  }>;
  RamasAfectadas: Array<{
    Rama: {
      id: number;
      nombre: string;
    };
  }>;
  AreasAfectadas: Array<{
    Area: {
      id: number;
      nombre: string;
    };
  }>;
  Actividades?: Array<{
    Actividad: Actividad;
    numero: number | null;
    fecha: string;
    Responsables: Array<{
      Adulto: {
        id: number;
        Miembro: {
          id: number;
          nombre: string;
          apellidos: string;
          dni?: string;
        };
      };
    }>;
  }>;
  _count?: {
    Actividades: number;
  };
}

export interface PaginatedSabatinosResponse {
  data: Sabatino[];
  meta: PaginatedResponseMeta;
}

export interface SabatinoFilters {
  q: string;
  page: number;
  limit: number;
  includeDeleted: boolean;
  fechaDesde: string;
  fechaHasta: string;
}

export interface CreateSabatinoPayload {
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  educadorIds: number[];
  ramaIds: number[];
  areaIds: number[];
  actividadIds?: Array<{
    actividadId: number;
    numero?: number;
    fecha?: string;
    responsableIds?: number[];
  }>;
}

export interface UpdateSabatinoPayload extends Partial<CreateSabatinoPayload> {}

export interface CreateActividadPayload {
  nombre: string;
  descripcion?: string;
  objetivos?: string;
  materiales?: string;
  id_tipo: number;
  responsableIds: number[];
  id_sabatino?: number;
  // Relationship data when creating within a context
  fecha?: string;
  numero?: number;
}

export interface UpdateActividadPayload extends Partial<CreateActividadPayload> {}
