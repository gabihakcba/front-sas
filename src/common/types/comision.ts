import { Miembro } from '@/common/types/miembro';

export interface ParticipantesComision {
  id: number;
  id_comision: number;
  id_miembro: number;
  Miembro: Miembro;
}

export interface Comision {
  id: number;
  id_evento: number;
  nombre: string;
  descripcion?: string;
  ParticipantesComision: ParticipantesComision[];
}

export interface CreateComisionDto {
  id_evento: number;
  nombre: string;
  descripcion?: string;
}

export interface UpdateComisionDto extends Partial<CreateComisionDto> {}

export interface AddParticipanteDto {
  id_comision: number;
  id_miembro: number;
}
