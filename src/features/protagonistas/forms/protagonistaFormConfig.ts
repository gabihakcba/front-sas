import { FormSection } from '@/common/types/form';
import { Rama } from '@/common/types/rama';

export const getProtagonistaFormSections = (ramas: Rama[]): FormSection[] => {
  return [
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
      title: 'Datos Scout',
      layout: { cols: 2 },
      fields: [
        {
          name: 'id_rama',
          label: 'Rama',
          type: 'dropdown',
          options: ramas.map((r) => ({ label: r.nombre, value: r.id })),
          rules: { required: 'La rama es obligatoria' },
          placeholder: 'Seleccione una rama',
        },
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
      ],
    },
    {
      title: 'Contacto y Estado',
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
        {
          name: 'activo',
          label: 'Activo',
          type: 'checkbox',
        },
      ],
    },
  ];
};

export const getVinculoResponsableFormConfig = (
  responsables: any[],
  relaciones: any[]
): FormSection[] => {
  return [
    {
      title: '',
      layout: { cols: 1 },
      fields: [
        {
          name: 'id_responsable',
          label: 'Responsable',
          type: 'dropdown',
          options: responsables,
          optionLabel: (r) => `${r.nombre} ${r.apellidos}`,
          optionValue: 'id',
          filterBy: 'nombre,apellidos,dni',
          filter: true,
          rules: { required: 'El responsable es obligatorio' },
          placeholder: 'Seleccione un responsable',
          inputProps: {
            appendTo:
              typeof document !== 'undefined' ? document.body : undefined,
          },
        },
        {
          name: 'id_relacion',
          label: 'Tipo de Relación',
          type: 'dropdown',
          options: relaciones,
          optionLabel: 'tipo',
          optionValue: 'id',
          filterBy: 'tipo',
          filter: true,
          rules: { required: 'El tipo de relación es obligatorio' },
          placeholder: 'Seleccione el tipo de relación',
          inputProps: {
            appendTo:
              typeof document !== 'undefined' ? document.body : undefined,
          },
        },
      ],
    },
  ];
};
