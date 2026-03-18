import { PaginatedResponseMeta } from '@/types/pagination';

export interface ResponsableCuenta {
  id: number;
  user: string;
}

export interface ResponsableMiembro {
  id: number;
  borrado?: boolean;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento?: string;
  direccion?: string;
  email: string | null;
  telefono: string | null;
  telefono_emergencia?: string;
  totem?: string | null;
  cualidad?: string | null;
  Cuenta: ResponsableCuenta;
}

export interface ResponsableProtagonista {
  id: number;
  Miembro: {
    nombre: string;
    apellidos: string;
    dni?: string;
    MiembroRama?: Array<{
      Rama: {
        id: number;
        nombre: string;
      };
    }>;
  };
}

export interface ResponsableAsignacion {
  id: number;
  Protagonista: ResponsableProtagonista;
}

export interface Responsable {
  id: number;
  borrado?: boolean;
  Miembro: ResponsableMiembro;
  Responsabilidad: ResponsableAsignacion[];
}

export interface PaginatedResponsablesResponse {
  data: Responsable[];
  meta: PaginatedResponseMeta;
}

export interface ResponsableFilters {
  q: string;
  includeDeleted: boolean;
}

export interface ResponsableOptionProtagonista {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  rama: {
    id: number;
    nombre: string;
  } | null;
}

export interface ResponsableOptionsResponse {
  protagonistas: ResponsableOptionProtagonista[];
}

export interface ResponsableFormValues {
  user: string;
  password: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  telefonoEmergencia: string;
  totem: string;
  cualidad: string;
}

export interface CreateResponsablePayload {
  user: string;
  password: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  email?: string;
  telefono?: string;
  telefonoEmergencia: string;
  totem?: string;
  cualidad?: string;
}

export interface UpdateResponsablePayload {
  user?: string;
  password?: string;
  nombre?: string;
  apellidos?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  telefonoEmergencia?: string;
  totem?: string;
  cualidad?: string;
}
