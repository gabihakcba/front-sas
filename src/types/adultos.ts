import { PaginatedResponseMeta } from '@/types/pagination';

export interface AdultoCuentaRole {
  id: number;
  tipo_scope: string;
  id_scope: number | null;
  Role: {
    id: number;
    nombre: string;
  };
}

export interface AdultoCuenta {
  id: number;
  user: string;
  CuentaRole: AdultoCuentaRole[];
}

export interface AdultoMiembro {
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
  Cuenta: AdultoCuenta;
}

export interface AdultoEquipoArea {
  id: number;
  fecha_inicio: string;
  id_area?: number;
  id_posicion?: number;
  id_rama?: number | null;
  Area: {
    id: number;
    nombre: string;
  };
  Posicion: {
    id: number;
    nombre: string;
  };
  Rama: {
    id: number;
    nombre: string;
    id_area: number;
  } | null;
}

export interface Adulto {
  id: number;
  borrado?: boolean;
  es_becado: boolean;
  activo: boolean;
  Miembro: AdultoMiembro;
  EquipoArea: AdultoEquipoArea[];
}

export interface AdultoFirmaResponse {
  firmaBase64: string | null;
}

export interface PaginatedAdultosResponse {
  data: Adulto[];
  meta: PaginatedResponseMeta;
}

export interface AdultoFilters {
  q: string;
  idArea: number | null;
  idPosicion: number | null;
  idRama: number | null;
  esBecado: boolean | null;
  activo: boolean | null;
  includeDeleted: boolean;
}

export interface AreaOption {
  id: number;
  nombre: string;
}

export interface PosicionOption {
  id: number;
  nombre: string;
}

export interface RamaOption {
  id: number;
  nombre: string;
  id_area: number;
}

export interface RoleOption {
  id: number;
  nombre: string;
}

export interface AdultoOptionsResponse {
  areas: AreaOption[];
  posiciones: PosicionOption[];
  ramas: RamaOption[];
  roles: RoleOption[];
  scopes: string[];
}

export interface AdultoFormValues {
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
  idArea: number | null;
  idPosicion: number | null;
  idRama: number | null;
  fechaInicioEquipo: string;
  esBecado: boolean;
  activo: boolean;
  idRole: number | null;
  tipoScope: string;
  idScope: number | null;
}

export interface CreateAdultoPayload {
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
  idArea: number;
  idPosicion: number;
  idRama?: number;
  fechaInicioEquipo?: string;
  esBecado?: boolean;
  activo?: boolean;
  idRole?: number;
  tipoScope?: string;
  idScope?: number;
}

export interface UpdateAdultoPayload {
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
  idArea?: number;
  idPosicion?: number;
  idRama?: number;
  fechaInicioEquipo?: string;
  esBecado?: boolean;
  activo?: boolean;
  idRole?: number;
  tipoScope?: string;
  idScope?: number;
}
