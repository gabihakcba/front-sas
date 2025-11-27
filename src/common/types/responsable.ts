export interface ResponsableRow {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: Date | string;
  telefono: string;
  telefono_emergencia: string;
  direccion: string;
  email: string;
  hijos?: { id: number; nombre: string; apellido: string }[]; // Simplified for list display
  activo: boolean;
  Miembro?: {
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_nacimiento: string;
    telefono: string;
    telefono_emergencia: string;
    direccion: string;
    email: string;
  };
}

export interface CreateResponsableDto {
  activo: boolean;
  miembro: {
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_nacimiento: string; // ISO
    telefono: string;
    telefono_emergencia: string;
    direccion: string;
    email: string;
  };
}

export interface UpdateResponsableDto extends Partial<CreateResponsableDto> {}

export interface VincularResponsableDto {
  id_protagonista: number;
  id_relacion: number;
}
