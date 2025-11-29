import { TipoEvento } from './tipo-evento';
import { Rama } from './rama';

export interface Area {
  id: number;
  nombre: string;
}

export interface Evento {
  id: number;
  nombre: string;
  lugar: string;
  fecha_inicio: string;
  fecha_fin: string;
  costo_mp: number;
  costo_ma: number;
  costo_ayudante: number;
  terminado: boolean;
  id_tipo: number;
  TipoEvento: TipoEvento;
  RamaAfectada: {
    id: number;
    id_evento: number;
    id_rama: number;
    Rama: Rama;
  }[];
  AreaAfectada: {
    id: number;
    id_evento: number;
    id_area: number;
    Area: Area;
  }[];
}

export interface CreateEventoDto {
  nombre: string;
  lugar: string;
  fecha_inicio: string;
  fecha_fin: string;
  costo_mp: number;
  costo_ma: number;
  costo_ayudante: number;
  id_tipo: number;
  ids_ramas: number[];
  ids_areas: number[];
}

export interface UpdateEventoDto extends Partial<CreateEventoDto> {
  terminado?: boolean;
}
