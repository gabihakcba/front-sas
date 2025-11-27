export interface InscripcionRow {
  id: number;
  id_evento: number;
  id_miembro: number;
  fecha_inscripcion: string;
  asistio: boolean;
  pagado: boolean;
  nombre: string;
  apellidos: string;
  dni: string;
  rama: string;
  area?: string; // Optional for adults
}

export interface InscripcionesAgrupadas {
  educadores: InscripcionRow[];
  protagonistas: InscripcionRow[];
  adultos: InscripcionRow[];
  responsables: InscripcionRow[];
}

// Keep Inscripcion alias for backward compatibility if needed, or replace usages
export type Inscripcion = InscripcionRow;

export interface CreateInscripcionDto {
  id_evento: number;
  id_miembro: number;
}
