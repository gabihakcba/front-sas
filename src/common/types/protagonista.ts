export interface ProtagonistaRow {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string;
  direccion: string;
  email?: string;
  telefono?: string;
  telefono_emergencia: string;
  totem?: string;
  cualidad?: string;
  rama: string;
  activo: boolean;
  es_becado: boolean;
  id_rama?: number;
}

export interface CreateProtagonistaDto {
  id_rama: number;
  es_becado: boolean;
  activo: boolean;
  miembro: {
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_nacimiento: string;
    direccion: string;
    email?: string;
    telefono?: string;
    telefono_emergencia: string;
    totem?: string;
    cualidad?: string;
  };
}

export type UpdateProtagonistaDto = Partial<CreateProtagonistaDto>;
