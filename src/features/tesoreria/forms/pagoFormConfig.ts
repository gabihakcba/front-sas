import { FormSection } from '@/common/types/form';
import { CuentaDineroRow } from '@/common/types/cuenta-dinero';
import { ConceptoPago } from '@/common/types/concepto-pago';
import { MetodoPago } from '@/common/types/metodo-pago';
import { Miembro } from '@/common/types/miembro';
import { Evento } from '@/common/types/evento';

export const getPagoFormSections = (
  conceptos: ConceptoPago[],
  metodos: MetodoPago[],
  cuentasDestino: CuentaDineroRow[],
  miembros: Miembro[],
  cuentasPersonales: CuentaDineroRow[] = [],
  eventos: Evento[] = [],
  isEditing: boolean = false
): FormSection[] => {
  const conceptoOptions = conceptos.map((c) => ({
    label: c.nombre,
    value: c.id,
  }));

  const metodoOptions = metodos.map((m) => ({
    label: m.nombre,
    value: m.id,
  }));

  const cuentaDestinoOptions = cuentasDestino.map((c) => ({
    label: c.nombre,
    value: c.id,
  }));

  const miembroOptions = miembros.map((m) => ({
    label: `${m.nombre} ${m.apellidos} (DNI: ${m.dni})`,
    value: m.id,
  }));

  const cuentaPersonalOptions = cuentasPersonales.map((c) => ({
    label: `${c.nombre} (Saldo: $${c.monto_actual})`,
    value: c.id,
  }));

  const eventoOptions = eventos.map((e) => ({
    label: e.nombre,
    value: e.id,
  }));

  return [
    {
      title: 'Detalles del Pago',
      fields: [
        {
          name: 'fecha_pago',
          label: 'Fecha',
          type: 'date',
          rules: { required: 'La fecha es obligatoria' },
          defaultValue: new Date(),
        },
        {
          name: 'id_miembro',
          label: 'Miembro',
          type: 'dropdown',
          rules: { required: 'El miembro es obligatorio' },
          options: miembroOptions,
          placeholder: 'Seleccione un miembro',
          filter: true,
          disabled: isEditing,
        },
        {
          name: 'id_concepto_pago',
          label: 'Concepto',
          type: 'dropdown',
          rules: { required: 'El concepto es obligatorio' },
          options: conceptoOptions,
          placeholder: 'Seleccione un concepto',
        },
        {
          name: 'monto',
          label: 'Monto',
          type: 'number',
          rules: {
            required: 'El monto es obligatorio',
            min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
          },
          placeholder: '0.00',
        },
        {
          name: 'detalles',
          label: 'Detalles (Opcional)',
          type: 'textarea',
          placeholder: 'Detalles adicionales...',
        },
      ],
    },
    {
      title: 'Forma de Pago',
      fields: [
        {
          name: 'usar_cuenta_personal',
          label: 'Pagar con mi saldo (Cuenta Personal)',
          type: 'checkbox',
          disabled: isEditing,
        },
        {
          name: 'id_cuenta_origen',
          label: 'Cuenta de Origen (Personal)',
          type: 'dropdown',
          rules: {
            required: 'Debe seleccionar una cuenta de origen',
          },
          options: cuentaPersonalOptions,
          placeholder: 'Seleccione su cuenta',
          showIf: (values) => values.usar_cuenta_personal,
          disabled: isEditing,
        },
        {
          name: 'id_metodo_pago',
          label: 'Método de Pago',
          type: 'dropdown',
          rules: { required: 'El método de pago es obligatorio' },
          options: metodoOptions,
          placeholder: 'Seleccione un método',
          showIf: (values) => !values.usar_cuenta_personal,
        },
        {
          name: 'id_cuenta_dinero',
          label: 'Cuenta Destino (Caja)',
          type: 'dropdown',
          rules: { required: 'La cuenta destino es obligatoria' },
          options: cuentaDestinoOptions,
          placeholder: 'Seleccione la caja destino',
          disabled: isEditing,
        },
      ],
    },
    {
      title: 'Evento (Opcional)',
      fields: [
        {
          name: 'id_evento',
          label: 'Evento Relacionado',
          type: 'dropdown',
          options: eventoOptions,
          placeholder: 'Seleccione un evento (opcional)',
          filter: true,
          showClear: true,
          disabled: isEditing,
        },
      ],
    },
  ];
};
