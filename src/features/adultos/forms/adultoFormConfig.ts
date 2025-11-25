import { FormSection } from '@/common/types/form';
import { Area, Posicion, Role } from '@/queries/common';
import { Rama } from '@/common/types/rama';

/**
 * Genera la sección de formulario para Equipo (Área, Posición, Rama, Rol)
 * Función reutilizable para create/update y pase
 */
export const getEquipoFormSection = (
  areas: Area[],
  posiciones: Posicion[],
  ramas: Rama[],
  roles: Role[]
): FormSection => {
  return {
    title: 'Asignación de Cargo y Permisos',
    layout: { cols: 2 },
    fields: [
      {
        name: 'id_area',
        label: 'Área',
        type: 'dropdown',
        options: areas.map((a) => ({ label: a.nombre, value: a.id })),
        rules: { required: 'El área es obligatoria' },
        placeholder: 'Seleccione un área',
      },
      {
        name: 'id_rama',
        label: 'Rama',
        type: 'dropdown',
        options: ramas.map((r) => ({ label: r.nombre, value: r.id })),
        placeholder: 'Seleccione una rama',
        // Lógica data-driven: muestra el campo solo si el área seleccionada tiene ramas asociadas
        showIf: (values) => {
          const selectedArea = areas.find((a) => a.id === values.id_area);
          return !!(selectedArea?.Rama && selectedArea.Rama.length > 0);
        },
        rules: {
          validate: (value, formValues) => {
            const selectedArea = areas.find((a) => a.id === formValues.id_area);
            // Valida solo si el área tiene ramas asociadas
            if (selectedArea?.Rama && selectedArea.Rama.length > 0 && !value) {
              return 'La rama es obligatoria para esta área';
            }
            return true;
          },
        },
      },
      {
        name: 'id_posicion',
        label: 'Posición / Cargo',
        type: 'dropdown',
        options: posiciones.map((p) => ({ label: p.nombre, value: p.id })),
        rules: { required: 'La posición es obligatoria' },
        placeholder: 'Seleccione una posición',
      },
      {
        name: 'id_role',
        label: 'Permiso de Sistema',
        type: 'dropdown',
        options: roles.map((r) => ({ label: r.nombre, value: r.id })),
        rules: { required: 'El rol es obligatorio' },
        placeholder: 'Seleccione un rol',
      },
    ],
  };
};

export const getAdultoFormSections = (
  areas: Area[],
  posiciones: Posicion[],
  ramas: Rama[],
  roles: Role[]
): FormSection[] => {
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
    // Usa la función extraída para la sección de equipo
    getEquipoFormSection(areas, posiciones, ramas, roles),
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
};
