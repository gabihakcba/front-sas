import { FormSection } from '@/common/types/form';

export const tipoEventoFormSections: FormSection[] = [
  {
    title: 'Datos del Tipo de Evento',
    fields: [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        rules: { required: 'El nombre es obligatorio' },
        placeholder: 'Ej: Campamento, Reunión, Servicio',
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Descripción opcional del tipo de evento...',
      },
    ],
  },
];
