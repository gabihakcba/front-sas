import { FormSection } from '@/common/types/form';

export const getConsejoFormSections = (): FormSection[] => {
  return [
    {
      title: 'Información del Consejo',
      fields: [
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          rules: { required: 'El nombre es obligatorio' },
          placeholder: 'Ej: Consejo de Ciclo 1',
        },
        {
          name: 'fecha',
          label: 'Fecha',
          type: 'date',
          rules: { required: 'La fecha es obligatoria' },
        },
        {
          name: 'es_ordinario',
          label: 'Es Ordinario',
          type: 'checkbox',
        },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'textarea',
          placeholder: 'Descripción del consejo...',
        },
      ],
    },
  ];
};
