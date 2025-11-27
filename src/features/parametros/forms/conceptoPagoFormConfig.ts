import { FormSection } from '@/common/types/form';

export const conceptoPagoFormSections: FormSection[] = [
  {
    fields: [
      {
        name: 'nombre',
        label: 'Nombre del Concepto',
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
