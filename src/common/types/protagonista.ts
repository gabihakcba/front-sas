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
  id_rama: number; // Ahora es obligatorio
  activo: boolean;
  es_becado: boolean;
}

export interface CreateProtagonistaDto {
  es_becado: boolean;
  activo: boolean;
  id_rama: number;
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
