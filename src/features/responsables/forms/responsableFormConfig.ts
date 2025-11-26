import { FormSection } from '@/common/types/form';
import { ProtagonistaRow } from '@/common/types/protagonista';
import { Relacion } from '@/common/types/relacion';

export const getResponsableFormSections = (): FormSection[] => {
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
          rules: { required: 'El apellido es obligatorio' },
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
        {
          name: 'telefono',
          label: 'Teléfono',
          type: 'text',
          rules: { required: 'El teléfono es obligatorio' },
        },
        {
          name: 'telefono_emergencia',
          label: 'Teléfono de Emergencia',
          type: 'text',
          rules: { required: 'El teléfono de emergencia es obligatorio' },
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          rules: { required: 'El email es obligatorio' },
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
  ];
};

export const getVinculoFormConfig = (
  protagonistas: ProtagonistaRow[],
  relaciones: Relacion[]
): FormSection[] => {
  return [
    {
      title: 'Asignar Protagonista',
      layout: { cols: 1 },
      fields: [
        {
          name: 'id_protagonista',
          label: 'Protagonista',
          type: 'dropdown',
          options: protagonistas.map((p) => ({
            label: `${p.nombre} ${p.apellidos}`,
            value: p.id,
          })),
          rules: { required: 'Debe seleccionar un protagonista' },
          placeholder: 'Seleccione un protagonista',
        },
        {
          name: 'id_relacion',
          label: 'Tipo de Relación',
          type: 'dropdown',
          options: (Array.isArray(relaciones) ? relaciones : []).map((r) => ({
            label: r.tipo,
            value: r.id,
          })),
          rules: { required: 'Debe seleccionar el tipo de relación' },
          placeholder: 'Seleccione el tipo de relación',
        },
      ],
    },
  ];
};
