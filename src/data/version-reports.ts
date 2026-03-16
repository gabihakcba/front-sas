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
    version: '1.3.2',
    date: '2026-03-15',
    title: 'Compatibilidad mejorada del websocket en produccion',
    summary:
      'La conexion realtime de consejos ahora permite fallback de transporte para adaptarse mejor a proxies y despliegues productivos donde el upgrade directo a websocket puede fallar.',
    sections: [
      {
        title: 'Consejos en tiempo real',
        items: [
          'El cliente Socket.IO ya no fuerza solo websocket y permite iniciar por polling cuando el proxy de produccion lo requiere.',
          'Se mantiene el flujo realtime del consejo con una estrategia de conexion mas tolerante para entornos productivos.',
        ],
      },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-03-15',
    title: 'Correccion de arrastre del panel de oradores',
    summary:
      'Se corrige el comportamiento del panel de oradores para que pueda moverse correctamente en navegadores de escritorio, incluso sin depender del ancho de la ventana.',
    sections: [
      {
        title: 'Consejos en tiempo real',
        items: [
          'El arrastre del panel ahora se activa con deteccion de puntero de escritorio y no por ancho minimo de pantalla.',
          'Se mejora la interaccion del encabezado para evitar que la seleccion de texto interfiera con el movimiento.',
        ],
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-03-15',
    title: 'Panel de oradores movible y reordenable',
    summary:
      'El panel de oradores de consejos ahora puede moverse y redimensionarse en desktop, y el moderador puede reordenar la lista con drag-and-drop en tiempo real.',
    sections: [
      {
        title: 'Interaccion del panel',
        items: [
          'El panel flotante puede arrastrarse desde su encabezado en desktop.',
          'El panel puede redimensionarse para adaptar mejor la visualizacion.',
          'La experiencia mobile mantiene un comportamiento mas estable sin forzar esas interacciones.',
        ],
      },
      {
        title: 'Lista de oradores',
        items: [
          'El moderador puede reordenar oradores con drag-and-drop.',
          'El nuevo orden se sincroniza en tiempo real para todos los usuarios conectados al consejo.',
        ],
      },
    ],
  },
  {
    version: '1.2.1',
    date: '2026-03-15',
    title: 'Correccion de numeracion en lista de oradores',
    summary:
      'La lista de oradores mantiene la numeracion segun el orden historico de alta, aunque visualmente los ultimos agregados sigan apareciendo arriba.',
    sections: [
      {
        title: 'Consejos en tiempo real',
        items: [
          'El primer orador anotado conserva el numero 1 aunque entren nuevos oradores despues.',
          'La numeracion ahora refleja antiguedad de ingreso a la lista y no la posicion visual del panel.',
        ],
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-15',
    title: 'Carga manual de oradores desde asistencia',
    summary:
      'El moderador del consejo ahora puede incorporar oradores directamente desde la asistencia actual, ademas de trabajar con manos levantadas.',
    sections: [
      {
        title: 'Moderacion de consejos',
        items: [
          'El panel de oradores permite seleccionar asistentes y sumarlos manualmente a la lista.',
          'La lista disponible excluye automaticamente a quienes ya estan cargados como oradores.',
          'La gestion manual convive con el flujo de manos levantadas sin duplicar participantes.',
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-15',
    title: 'Moderacion y oradores en tiempo real para consejos',
    summary:
      'Se suma una primera capa de trabajo colaborativo en vivo dentro de consejos, con moderador asignable, manos levantadas y lista de oradores sincronizada.',
    sections: [
      {
        title: 'Consejos en tiempo real',
        items: [
          'Cada consejo puede tener un moderador asignado desde su espacio de trabajo.',
          'La conexion realtime se activa solo mientras el usuario esta dentro del consejo abierto.',
          'La lista de oradores se comparte en vivo entre los participantes conectados al mismo consejo.',
        ],
      },
      {
        title: 'Moderacion y participacion',
        items: [
          'Solo el moderador puede agregar o quitar oradores de la lista activa.',
          'Solo miembros presentes en asistencia pueden levantar la mano.',
          'Las manos levantadas quedan visibles para el moderador para decidir el orden de palabra.',
        ],
      },
    ],
  },
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
