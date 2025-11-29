export interface Consejo {
  id: number;
  nombre: string;
  fecha: string | Date;
  es_ordinario: boolean;
  descripcion?: string;
  hora_fin?: string | Date | null;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface CreateConsejoDto {
  nombre: string;
  fecha: string | Date;
  es_ordinario: boolean;
  descripcion?: string;
}

export interface UpdateConsejoDto extends Partial<CreateConsejoDto> {}
