import { Rama } from '@/common/types/rama';

export interface Area {
  id: number;
  nombre: string;
}

export interface Miembro {
  id: number;
  nombre: string;
  apellidos: string;
}

export interface CuentaDineroRow {
  id: number;
  nombre: string;
  descripcion: string | null;
  id_area?: number;
  Area?: Area;
  id_rama?: number;
  Rama?: Rama;
  id_miembro?: number;
  Miembro?: Miembro;
  monto_actual: number;
  borrado: boolean;
}

export interface CreateCuentaDineroDto {
  nombre: string;
  descripcion?: string;
  id_area?: number;
  id_rama?: number;
  id_miembro?: number;
}

export interface UpdateCuentaDineroDto extends Partial<CreateCuentaDineroDto> {}
