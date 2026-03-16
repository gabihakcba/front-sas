import { PaginatedResponseMeta } from '@/types/pagination';

export interface ConsejoTemarioItem {
  id: number;
  titulo: string;
  descripcion: string | null;
  debate: string | null;
  acuerdo: string | null;
  sin_mp: boolean;
  estado: string;
}

export interface ConsejoAsistenciaMember {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  Adulto: { id: number } | null;
  Protagonista: {
    id: number;
    Miembro: {
      MiembroRama: Array<{
        Rama: {
          id: number;
          nombre: string;
        };
      }>;
    };
  } | null;
  Responsable: { id: number } | null;
}

export interface ConsejoAsistenciaItem {
  id: number;
  descripcion: string;
  Miembro: ConsejoAsistenciaMember;
}

export interface ConsejoAsistenciaOption extends ConsejoAsistenciaMember {
  displayLabel: string;
  categoryLabel: string;
  sortOrder: number;
}

export interface ConsejoTemarioFormValues {
  titulo: string;
  descripcion: string;
  debate: string;
  acuerdo: string;
  sinMp: boolean;
  estado: string;
}

export interface ConsejoModeradorMember {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface ConsejoSecretariaMember {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface Consejo {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha: string;
  es_ordinario: boolean;
  hora_inicio: string | null;
  hora_fin: string | null;
  Moderador: ConsejoModeradorMember | null;
  Secretario: ConsejoSecretariaMember | null;
  Prosecretario: ConsejoSecretariaMember | null;
  TemarioConsejo: ConsejoTemarioItem[];
  _count: {
    AsistenciaConsejo: number;
    TemarioConsejo: number;
  };
}

export interface UpdateConsejoModeradorPayload {
  idModerador: number | null;
}

export interface UpdateConsejoSecretariaPayload {
  idSecretario: number | null;
  idProsecretario: number | null;
}

export interface ConsejoRealtimeSpeaker {
  memberId: number;
  fullName: string;
  description: string;
}

export interface ConsejoRealtimeHand {
  memberId: number;
  fullName: string;
  description: string;
}

export interface ConsejoRealtimeState {
  speakers: ConsejoRealtimeSpeaker[];
  raisedHands: ConsejoRealtimeHand[];
  moderatorMemberId: number | null;
}

export type ConsejoRealtimeTemarioUpdate = ConsejoTemarioItem;

export interface PaginatedConsejosResponse {
  data: Consejo[];
  meta: PaginatedResponseMeta;
}

export interface ConsejoFormValues {
  nombre: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  esOrdinario: boolean;
}

export interface CreateConsejoPayload {
  nombre: string;
  descripcion?: string;
  fecha: string;
  horaInicio?: string;
  horaFin?: string;
  esOrdinario: boolean;
}

export interface UpdateConsejoPayload {
  nombre?: string;
  descripcion?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  esOrdinario?: boolean;
}

export interface CreateConsejoTemarioPayload {
  titulo: string;
  descripcion?: string;
  debate?: string;
  acuerdo?: string;
  sinMp?: boolean;
  estado?: string;
}

export interface UpdateConsejoTemarioPayload {
  titulo?: string;
  descripcion?: string;
  debate?: string;
  acuerdo?: string;
  sinMp?: boolean;
  estado?: string;
}
