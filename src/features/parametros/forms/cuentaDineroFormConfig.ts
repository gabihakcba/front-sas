import { FormSection } from '@/common/types/form';
import { Area } from '@/common/types/cuenta-dinero';
import { Rama } from '@/common/types/rama';

interface MiembroOption {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export const getCuentaDineroFormSections = (
  areas: Area[],
  ramas: Rama[],
  miembros: MiembroOption[]
): FormSection[] => [
  {
    fields: [
      {
        name: 'nombre',
        label: 'Nombre de la Cuenta',
        type: 'text',
        rules: { required: 'El nombre es obligatorio' },
      },
      {
        name: 'tipo_propietario',
        label: 'Tipo de Propietario',
        type: 'dropdown',
        options: [
          { label: 'Área', value: 'AREA' },
          { label: 'Rama', value: 'RAMA' },
          { label: 'Miembro', value: 'MIEMBRO' },
        ],
        rules: { required: 'Seleccione un tipo' },
        defaultValue: 'AREA',
      },
      {
        name: 'id_area',
        label: 'Área',
        type: 'dropdown',
        options: areas,
        optionLabel: 'nombre',
        optionValue: 'id',
        filter: true,
        rules: { required: 'El área es obligatoria' },
        showIf: (values) => values.tipo_propietario === 'AREA',
      },
      {
        name: 'id_rama',
        label: 'Rama',
        type: 'dropdown',
        options: ramas,
        optionLabel: 'nombre',
        optionValue: 'id',
        filter: true,
        rules: { required: 'La rama es obligatoria' },
        showIf: (values) => values.tipo_propietario === 'RAMA',
      },
      {
        name: 'id_miembro',
        label: 'Miembro',
        type: 'dropdown',
        options: miembros,
        optionLabel: (item: MiembroOption) =>
          `${item.nombre} ${item.apellidos} (${item.dni})`,
        optionValue: 'id',
        filter: true,
        filterBy: 'nombre,apellidos,dni',
        rules: { required: 'El miembro es obligatorio' },
        showIf: (values) => values.tipo_propietario === 'MIEMBRO',
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
