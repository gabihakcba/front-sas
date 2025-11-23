import { FormSection } from '@/common/types/form';

export const adultoFormSections: FormSection[] = [
  {
    title: 'Datos Personales',
    layout: { cols: 2 },
    fields: [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        rules: { required: 'El nombre es obligatorio' },
      },
      {
        name: 'apellidos',
        label: 'Apellidos',
        type: 'text',
        rules: { required: 'Los apellidos son obligatorios' },
      },
      {
        name: 'dni',
        label: 'DNI',
        type: 'text',
        rules: { required: 'El DNI es obligatorio' },
      },
      {
        name: 'fecha_nacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        rules: { required: 'La fecha de nacimiento es obligatoria' },
      },
    ],
  },
  {
    title: 'Contacto y Dirección',
    layout: { cols: 2 },
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: 'text',
      },
      {
        name: 'telefono_emergencia',
        label: 'Tel. Emergencia',
        type: 'text',
        rules: { required: 'El teléfono de emergencia es obligatorio' },
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'text',
        colSpan: 2,
        rules: { required: 'La dirección es obligatoria' },
      },
    ],
  },
  {
    title: 'Datos Scout',
    layout: { cols: 2 },
    fields: [
      {
        name: 'totem',
        label: 'Totem',
        type: 'text',
      },
      {
        name: 'cualidad',
        label: 'Cualidad',
        type: 'text',
      },
      {
        name: 'es_becado',
        label: 'Es Becado',
        type: 'checkbox',
      },
      {
        name: 'activo',
        label: 'Activo',
        type: 'checkbox',
      },
    ],
  },
];
