import { FormSection } from '@/common/types/form';

export const metodoPagoFormSections: FormSection[] = [
  {
    fields: [
      {
        name: 'nombre',
        label: 'Nombre del Método',
        type: 'text',
        rules: { required: 'El nombre es obligatorio' },
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        rules: { required: false },
      },
    ],
  },
];
