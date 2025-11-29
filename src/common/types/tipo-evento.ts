export interface TipoEvento {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CreateTipoEventoDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTipoEventoDto extends Partial<CreateTipoEventoDto> {}
