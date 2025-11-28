export interface InscripcionRow {
  id: number;
  id_miembro: number;
  nombre: string;
  apellidos: string;
  dni: string;
  asistio: boolean;
  pagado: boolean;
  rama?: string;
  area?: string;
}

export interface InscripcionesResponse {
  educadores: InscripcionRow[];
  protagonistas: InscripcionRow[];
  adultos: InscripcionRow[];
  responsables: InscripcionRow[];
}

export interface CreateInscripcionDto {
  id_evento: number;
  id_miembro: number;
}
