import { FormSection } from '@/common/types/form';
import { Comision } from '@/common/types/comision';
import { Miembro } from '@/common/types/miembro';

export const getComisionFormConfig = (): FormSection[] => [
  {
    title: 'Datos de la Comisión',
    fields: [
      {
        name: 'nombre',
        label: 'Nombre de la Comisión',
        type: 'text',
        rules: { required: 'El nombre es obligatorio' },
        placeholder: 'Ej: Logística, Cocina, Programa',
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Detalles sobre las responsabilidades...',
      },
    ],
  },
];

export const getAsignarMiembroFormConfig = (
  comisiones: Comision[],
  miembros: Miembro[]
): FormSection[] => {
  const comisionOptions = comisiones.map((c) => ({
    label: c.nombre,
    value: c.id,
  }));

  const miembroOptions = miembros.map((m) => ({
    label: `${m.nombre} ${m.apellidos} (DNI: ${m.dni})`,
    value: m.id,
  }));

  return [
    {
      title: 'Asignar Miembro',
      fields: [
        {
          name: 'id_comision',
          label: 'Comisión',
          type: 'dropdown',
          rules: { required: 'La comisión es obligatoria' },
          options: comisionOptions,
          placeholder: 'Seleccione una comisión',
        },
        {
          name: 'id_miembro',
          label: 'Miembro',
          type: 'dropdown',
          rules: { required: 'El miembro es obligatorio' },
          options: miembroOptions,
          placeholder: 'Buscar miembro...',
          filter: true,
        },
      ],
    },
  ];
};
