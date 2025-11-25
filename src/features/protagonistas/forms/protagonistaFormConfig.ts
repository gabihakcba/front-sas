import { FormSection } from '@/common/types/form';

/**
 * Configuración del formulario de Protagonistas
 * Organizado en 4 secciones
 *
 * NOTA: Las opciones del dropdown de 'rama' se inyectan dinámicamente
 * desde el componente usando useRamasQuery para obtener los IDs correctos.
 */
export const protagonistaFormSections: FormSection[] = [
  {
    title: 'Datos Personales',
    layout: { cols: 2 },
    fields: [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        rules: { required: 'El nombre es requerido' },
        placeholder: 'Ingrese el nombre',
      },
      {
        name: 'apellidos',
        label: 'Apellidos',
        type: 'text',
        rules: { required: 'Los apellidos son requeridos' },
        placeholder: 'Ingrese los apellidos',
      },
      {
        name: 'dni',
        label: 'DNI',
        type: 'text',
        rules: {
          required: 'El DNI es requerido',
          pattern: {
            value: /^\d{7,8}$/,
            message: 'DNI inválido (7-8 dígitos)',
          },
        },
        placeholder: '12345678',
      },
      {
        name: 'fecha_nacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        rules: { required: 'La fecha de nacimiento es requerida' },
      },
    ],
  },
  {
    title: 'Ubicación Scout',
    layout: { cols: 1 },
    fields: [
      {
        name: 'rama',
        label: 'Rama',
        type: 'dropdown',
        rules: { required: 'La rama es requerida' },
        options: [], // Las opciones se inyectan dinámicamente desde el componente
        placeholder: 'Seleccione una rama',
      },
      {
        name: 'totem',
        label: 'Totem',
        type: 'text',
        placeholder: 'Ej: Lobo',
      },
      {
        name: 'cualidad',
        label: 'Cualidad',
        type: 'text',
        placeholder: 'Ej: Valiente',
      },
    ],
  },
  {
    title: 'Contacto',
    layout: { cols: 2 },
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'correo@ejemplo.com',
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: 'text',
        placeholder: '1234567890',
      },
      {
        name: 'telefono_emergencia',
        label: 'Teléfono de Emergencia',
        type: 'text',
        rules: { required: 'El teléfono de emergencia es requerido' },
        placeholder: '1234567890',
      },
      {
        name: 'direccion',
        label: 'Dirección',
        type: 'textarea',
        rules: { required: 'La dirección es requerida' },
        placeholder: 'Calle, Número, Ciudad',
        colSpan: 2,
      },
    ],
  },
  {
    title: 'Estado',
    layout: { cols: 2 },
    fields: [
      {
        name: 'es_becado',
        label: '¿Es becado?',
        type: 'checkbox',
      },
      {
        name: 'activo',
        label: '¿Está activo?',
        type: 'checkbox',
      },
    ],
  },
];
