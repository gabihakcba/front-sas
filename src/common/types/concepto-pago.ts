export interface ConceptoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  borrado: boolean;
}

export interface CreateConceptoPagoDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateConceptoPagoDto extends Partial<CreateConceptoPagoDto> {}
