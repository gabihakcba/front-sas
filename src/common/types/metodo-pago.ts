export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  borrado: boolean;
}

export interface CreateMetodoPagoDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateMetodoPagoDto extends Partial<CreateMetodoPagoDto> {}
