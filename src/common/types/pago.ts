export interface Pago {
  id: number;
  fecha_pago: string;
  monto: number;
  detalles?: string;
  id_miembro: number;
  Miembro?: {
    nombre: string;
    apellidos: string;
    dni: string;
  };
  id_concepto_pago: number;
  ConceptoPago?: {
    nombre: string;
  };
  id_metodo_pago: number;
  MetodoPago?: {
    nombre: string;
  };
  id_cuenta_dinero: number;
  CuentaDinero?: {
    nombre: string;
  };
  id_cuenta_origen?: number;
  CuentaOrigen?: {
    nombre: string;
  };
  id_evento?: number;
  Evento?: {
    nombre: string;
  };
}

export interface CreatePagoDto {
  fecha_pago: string;
  monto: number;
  detalles?: string;
  id_miembro: number;
  id_concepto_pago: number;
  id_metodo_pago: number;
  id_cuenta_dinero: number;
  id_cuenta_origen?: number;
  id_evento?: number;
  usar_cuenta_personal?: boolean;
}

export interface UpdatePagoDto extends Partial<CreatePagoDto> {}
