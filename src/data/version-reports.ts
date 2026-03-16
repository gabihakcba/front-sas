export interface VersionReportSection {
  title: string;
  items: string[];
}

export interface VersionReport {
  version: string;
  date: string;
  title: string;
  summary: string;
  sections: VersionReportSection[];
}

export const versionReports: VersionReport[] = [
  {
    version: '1.0.0',
    date: '2026-03-15',
    title: 'Primera version operativa del sistema',
    summary:
      'Version inicial funcional del frontend con gestion administrativa, calendario y mejoras de experiencia para el grupo scout.',
    sections: [
      {
        title: 'Acceso y experiencia base',
        items: [
          'Login institucional con logo, nombre del grupo y acceso por usuario, email o DNI.',
          'Sidebar principal con identidad visual del grupo y navegacion por modulos.',
          'Version de la aplicacion visible y accesible desde la interfaz.',
        ],
      },
      {
        title: 'Gestion de personas',
        items: [
          'Administracion de protagonistas, adultos y responsables.',
          'Gestion de relaciones y vinculos familiares.',
          'Vista de perfil con informacion personal, asignaciones y actividad.',
        ],
      },
      {
        title: 'Finanzas y pagos',
        items: [
          'Gestion de pagos, conceptos de pago, metodos de pago y cuentas de dinero.',
          'Visualizacion de comprobantes y soporte para compartir por WhatsApp.',
        ],
      },
      {
        title: 'Eventos y organizacion',
        items: [
          'Gestion de eventos, afectaciones, inscripciones y comisiones.',
          'Gestion de consejos y sus elementos asociados.',
        ],
      },
      {
        title: 'Calendario',
        items: [
          'Calendario con vistas mensual, semestral y anual.',
          'Visualizacion de eventos y cumpleaños con filtros laterales.',
          'Codificacion visual por ramas, areas y tipos de miembro.',
        ],
      },
    ],
  },
];

export const currentVersionReport = versionReports[0];
