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
    version: '1.6.0',
    date: '2026-03-16',
    title: 'Gestión centralizada de formaciones y habilitación de APFs',
    summary:
      'Se agrega una sección específica para administrar templates de formación, adjuntos e inscripciones, junto con la habilitación formal de APFs vinculada a consejos.',
    sections: [
      {
        title: 'Sección Formaciones',
        items: [
          'La sidebar ahora incluye una sección Formaciones con acceso centralizado al dominio de formación.',
          'Desde esa pantalla se pueden consultar todos los templates y usar cualquiera de ellos para iniciar una inscripción propia.',
        ],
      },
      {
        title: 'Templates y adjuntos',
        items: [
          'Los templates pueden editarse desde el frontend, incluyendo niveles, competencias y textos asociados.',
          'Se agrega gestión de adjuntos con carga manual, descarga y eliminación.',
        ],
      },
      {
        title: 'APFs',
        items: [
          'La habilitación de APF deja de ser implícita y pasa a estar modelada en base de datos con historial.',
          'Cada asignación APF queda vinculada al consejo que la decidió.',
          'Solo los APFs activos aparecen como opciones válidas al inscribirse a un plan de desempeño.',
        ],
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-03-16',
    title: 'Planes de formación y desempeño en perfiles adultos',
    summary:
      'El sistema incorpora una primera versión operativa para formación adulta, con lectura del plan desde el perfil, alta del plan de desempeño y validación de competencias por APF.',
    sections: [
      {
        title: 'Perfil y formación',
        items: [
          'El perfil de cada adulto ahora muestra su información de formación y su plan de desempeño activo.',
          'Se visualizan niveles, competencias, comportamientos deseados, propuestas de aprendizaje y resultados esperados de la plantilla asociada.',
        ],
      },
      {
        title: 'Plan de desempeño',
        items: [
          'Cada persona adulta puede iniciar su propio plan de desempeño seleccionando una plantilla y un APF.',
          'El APF asignado puede validar competencias y dejar observaciones dentro del plan.',
          'La lectura del plan queda disponible desde el perfil, mientras que la edición de validaciones se restringe al APF.',
        ],
      },
      {
        title: 'Backend y permisos',
        items: [
          'Se agregan endpoints específicos para templates de formación y planes de desempeño.',
          'El backend incorpora los nuevos recursos de permisos `PLAN_DESEMPENO` y `ADJUNTO_FORMACION` para sostener el nuevo dominio.',
        ],
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-03-15',
    title: 'Secretaria de consejo y acta colaborativa en vivo',
    summary:
      'Cada consejo ahora puede asignar secretario y prosecretario, y el trabajo del acta se sincroniza en tiempo real con guardado debounceado mientras editan.',
    sections: [
      {
        title: 'Roles de consejo',
        items: [
          'Se pueden asignar secretario y prosecretario para cada consejo.',
          'Cualquier adulto puede modificar esos cargos desde el workspace del consejo.',
          'Solo secretario y prosecretario pueden editar el temario y el acta del consejo.',
        ],
      },
      {
        title: 'Edicion colaborativa',
        items: [
          'Los cambios de debate, acuerdo y estado se sincronizan en vivo entre usuarios conectados al mismo consejo.',
          'La persistencia se hace con debounce de 500 ms para evitar sobrecarga mientras escriben.',
        ],
      },
    ],
  },
  {
    version: '1.3.3',
    date: '2026-03-15',
    title: 'Panel de oradores minimizable',
    summary:
      'El panel de oradores ahora puede colapsarse a una vista minima para ocupar menos espacio sin perder acceso rapido a las acciones principales.',
    sections: [
      {
        title: 'Consejos en tiempo real',
        items: [
          'El panel puede minimizarse y expandirse desde su encabezado.',
          'En vista minimizada se conserva el titulo del panel y el acceso rapido a levantar o bajar la mano para participantes.',
        ],
      },
    ],
  },
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
