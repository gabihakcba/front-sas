import { FormSection } from '@/common/types/form';

export const getEventoFormSections = (
  tiposEvento: { label: string; value: number }[],
  ramas: { label: string; value: number }[],
  areas: { label: string; value: number }[]
): FormSection[] => [
  {
    title: 'Información General',
    fields: [
      {
        name: 'nombre',
        label: 'Nombre del Evento',
        type: 'text',
        rules: { required: 'El nombre es obligatorio' },
        placeholder: 'Ej: Campamento de Verano',
        icon: 'pi pi-tag',
      },
      {
        name: 'id_tipo',
        label: 'Tipo de Evento',
        type: 'dropdown',
        options: tiposEvento,
        rules: { required: 'El tipo de evento es obligatorio' },
        placeholder: 'Selecciona un tipo',
        icon: 'pi pi-list',
      },
      {
        name: 'lugar',
        label: 'Lugar',
        type: 'text',
        rules: { required: 'El lugar es obligatorio' },
        placeholder: 'Ej: Camping El Pinar',
        icon: 'pi pi-map-marker',
      },
      {
        name: 'fecha_inicio',
        label: 'Fecha Inicio',
        type: 'date',
        rules: { required: 'La fecha de inicio es obligatoria' },
        icon: 'pi pi-calendar',
      },
      {
        name: 'fecha_fin',
        label: 'Fecha Fin',
        type: 'date',
        rules: { required: 'La fecha de fin es obligatoria' },
        icon: 'pi pi-calendar',
      },
    ],
  },
  {
    title: 'Costos',
    fields: [
      {
        name: 'costo_mp',
        label: 'Costo Miembro Beneficiario',
        type: 'number',
        rules: { required: 'El costo es obligatorio', min: 0 },
        placeholder: '0.00',
        icon: 'pi pi-dollar',
      },
      {
        name: 'costo_ma',
        label: 'Costo Miembro Activo',
        type: 'number',
        rules: { required: 'El costo es obligatorio', min: 0 },
        placeholder: '0.00',
        icon: 'pi pi-dollar',
      },
      {
        name: 'costo_ayudante',
        label: 'Costo Ayudante',
        type: 'number',
        rules: { required: 'El costo es obligatorio', min: 0 },
        placeholder: '0.00',
        icon: 'pi pi-dollar',
      },
    ],
  },
  {
    title: 'Participantes',
    fields: [
      {
        name: 'ids_ramas',
        label: 'Ramas Participantes',
        type: 'multiselect',
        options: ramas,
        placeholder: 'Selecciona las ramas',
        icon: 'pi pi-users',
        inputProps: {
          appendTo: typeof document !== 'undefined' ? document.body : null,
        },
      },
      {
        name: 'ids_areas',
        label: 'Áreas Afectadas',
        type: 'multiselect',
        options: areas,
        placeholder: 'Selecciona las áreas',
        icon: 'pi pi-briefcase',
        inputProps: {
          appendTo: typeof document !== 'undefined' ? document.body : null,
        },
      },
    ],
  },
];
