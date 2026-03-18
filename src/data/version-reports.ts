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
    version: '1.8.25',
    date: '2026-03-18',
    title: 'Auditoría de borrados y soft delete unificado',
    summary:
      'Las tablas operativas principales incorporan visualización opcional de registros borrados y el sistema queda unificado sobre un único campo de soft delete.',
    sections: [
      {
        title: 'Tablas auditables',
        items: [
          'Protagonistas, Adultos, Responsables, Pagos, Eventos, Consejos y Comisiones agregan el check Incluir borrados para perfiles de grupo con auditoría.',
          'Cada listado muestra el estado de borrado y evita reabrir flujos de edición o eliminación sobre registros ya dados de baja.',
        ],
      },
      {
        title: 'Consistencia',
        items: [
          'El frontend y el backend pasan a trabajar sobre un único criterio de soft delete.',
          'Los listados siguen ocultando borrados por defecto y sólo los incluyen cuando el usuario habilita explícitamente la opción.',
        ],
      },
    ],
  },
  {
    version: '1.8.24',
    date: '2026-03-18',
    title: 'Consejos restringido a perfiles adultos',
    summary:
      'El módulo operativo de Consejos deja de estar disponible para protagonistas y responsables, quedando reservado a perfiles adultos con acceso de gestión o acompañamiento.',
    sections: [
      {
        title: 'Navegación',
        items: [
          'PROTAGONISTA y RESPONSABLE ya no ven Consejos en la sidebar ni pueden entrar por URL directa.',
          'La lectura futura de actas públicas queda separada del workspace operativo de consejos.',
        ],
      },
    ],
  },
  {
    version: '1.8.23',
    date: '2026-03-18',
    title: 'Responsables acotado para responsables',
    summary:
      'La sección Responsables para este rol pasa a mostrar solo co-responsables de los mismos protagonistas y queda completamente en modo consulta.',
    sections: [
      {
        title: 'Listado y acciones',
        items: [
          'RESPONSABLE solo puede consultar responsables vinculados a protagonistas de los cuales también es responsable.',
          'El módulo oculta Relaciones, Responsabilidades, Crear, Editar y Eliminar para este rol.',
        ],
      },
    ],
  },
  {
    version: '1.8.22',
    date: '2026-03-18',
    title: 'Adultos más acotado para responsables',
    summary:
      'La tabla de Adultos para RESPONSABLE oculta columnas operativas y deja el módulo alineado con un acceso puramente de consulta.',
    sections: [
      {
        title: 'Tabla de adultos',
        items: [
          'RESPONSABLE ya no ve las columnas Roles, Beca y Estado.',
          'La vista mantiene sólo la información de identificación, asignación y navegación necesaria para este rol.',
        ],
      },
    ],
  },
  {
    version: '1.8.21',
    date: '2026-03-18',
    title: 'Redibujo correcto de la firma en perfil',
    summary:
      'El diálogo de firma vuelve a renderizar la imagen persistida después de cada carga, evitando que el canvas quede vacío al reabrirlo.',
    sections: [
      {
        title: 'Perfil',
        items: [
          'La firma ya no se muestra una sola vez por sesión de página.',
          'Al cerrar y volver a abrir el diálogo, el canvas vuelve a dibujar la imagen cargada desde backend.',
        ],
      },
    ],
  },
  {
    version: '1.8.20',
    date: '2026-03-17',
    title: 'Recarga de firma al abrir el perfil',
    summary:
      'La firma del perfil se vuelve a consultar cada vez que se abre el diálogo para evitar inconsistencias visuales después de cancelar o guardar.',
    sections: [
      {
        title: 'Perfil',
        items: [
          'El diálogo de firma ya no reutiliza una versión cacheada entre aperturas.',
          'Después de guardar o cancelar, al volver a abrir se muestra la firma persistida más reciente.',
        ],
      },
    ],
  },
  {
    version: '1.8.19',
    date: '2026-03-17',
    title: 'Firma unificada en el perfil propio',
    summary:
      'La gestión de firma deja de vivir en la sección Adultos y pasa a estar disponible sólo dentro del perfil propio de cada miembro.',
    sections: [
      {
        title: 'Perfil',
        items: [
          'Adultos, protagonistas y responsables pueden administrar su firma desde su propio perfil.',
          'El botón de firma ya no aparece al navegar otros perfiles ni dentro del listado de Adultos.',
        ],
      },
    ],
  },
  {
    version: '1.8.18',
    date: '2026-03-17',
    title: 'Adultos acotado para responsables',
    summary:
      'La sección Adultos para RESPONSABLE queda limitada a consulta y muestra solo jefatura de grupo más los educadores de las ramas donde participan sus protagonistas vinculados.',
    sections: [
      {
        title: 'Acceso y filtros',
        items: [
          'RESPONSABLE ya no ve acciones de crear, editar ni eliminar dentro de Adultos.',
          'El backend restringe el listado y el detalle a jefatura de grupo y a los adultos asignados en las ramas de sus protagonistas a cargo.',
        ],
      },
    ],
  },
  {
    version: '1.8.17',
    date: '2026-03-17',
    title: 'Columnas operativas ocultas para responsables en protagonistas',
    summary:
      'La vista de Protagonistas para RESPONSABLE se simplifica y oculta datos operativos que no forman parte de su alcance de consulta.',
    sections: [
      {
        title: 'Tabla de protagonistas',
        items: [
          'RESPONSABLE deja de ver las columnas Beca y Estado dentro del listado de protagonistas.',
          'La tabla conserva solo la información de identificación y navegación relevante para este rol.',
        ],
      },
    ],
  },
  {
    version: '1.8.16',
    date: '2026-03-17',
    title: 'Protagonistas en modo consulta para responsables',
    summary:
      'La sección Protagonistas oculta las acciones operativas para RESPONSABLE y queda alineada con un acceso de solo consulta sobre sus protagonistas vinculados.',
    sections: [
      {
        title: 'Acciones bloqueadas',
        items: [
          'RESPONSABLE ya no ve los botones de crear, editar, eliminar ni pase dentro de la sección Protagonistas.',
          'La interfaz queda consistente con la restricción de backend que evita escrituras sobre protagonistas desde ese rol.',
        ],
      },
    ],
  },
  {
    version: '1.8.15',
    date: '2026-03-17',
    title: 'Pantalla global para rutas inexistentes',
    summary:
      'Las rutas no encontradas del frontend dejan de caer en la respuesta visual por defecto y pasan a mostrar una pantalla unificada con acciones claras para volver al sistema.',
    sections: [
      {
        title: 'Navegación',
        items: [
          'Next carga automáticamente una pantalla global de página no encontrada para cualquier 404 del App Router.',
          'La experiencia visual queda alineada con la pantalla de acceso denegado ya usada en perfiles y módulos protegidos.',
        ],
      },
    ],
  },
  {
    version: '1.8.14',
    date: '2026-03-17',
    title: 'Acceso inicial de responsables a las secciones base',
    summary:
      'La matriz del dashboard habilita a RESPONSABLE las secciones de consulta principales mientras mantiene bloqueados los módulos fuera de ese alcance inicial.',
    sections: [
      {
        title: 'Secciones visibles',
        items: [
          'RESPONSABLE puede ingresar a Perfil, Adultos, Protagonistas, Responsables, Pagos, Eventos, Formaciones, Comisiones, Consejos y Calendario.',
          'Las rutas no incluidas en esa lista siguen protegidas tanto desde sidebar como por URL directa.',
        ],
      },
    ],
  },
  {
    version: '1.8.13',
    date: '2026-03-17',
    title: 'Filtro en la asignación de comisión de eventos',
    summary:
      'El selector de comisión dentro de Eventos incorpora búsqueda para encontrar más rápido la comisión deseada.',
    sections: [
      {
        title: 'Eventos',
        items: [
          'La subsección Comisión ahora permite filtrar comisiones por nombre desde el selector.',
        ],
      },
    ],
  },
  {
    version: '1.8.12',
    date: '2026-03-17',
    title: 'Comisiones visible para protagonistas en modo consulta',
    summary:
      'La sección Comisiones queda accesible para protagonistas, mientras las acciones de gestión siguen reservadas a perfiles con permisos operativos.',
    sections: [
      {
        title: 'Consulta',
        items: [
          'PROTAGONISTA puede abrir la sección Comisiones desde el dashboard y consultar el listado completo.',
          'Los botones de crear, editar, eliminar y administrar adultos siguen ocultos si el usuario no tiene permisos de gestión.',
        ],
      },
    ],
  },
  {
    version: '1.8.11',
    date: '2026-03-17',
    title: 'Acceso inicial de protagonistas a las secciones base',
    summary:
      'La matriz del dashboard abre para PROTAGONISTA las secciones base de consulta y permite navegar a perfiles por URL sin exigir permisos de gestión.',
    sections: [
      {
        title: 'Secciones visibles',
        items: [
          'PROTAGONISTA puede ver Perfil, Pagos, Eventos, Formaciones, Consejos y Calendario desde la sidebar y por URL directa cuando corresponde.',
          'Pagos y Eventos se suman a las secciones ya abiertas globalmente para este primer tramo de revisión del rol.',
        ],
      },
      {
        title: 'Perfiles',
        items: [
          'Las rutas /dashboard/perfil/[id] dejan de usar la misma barrera de acceso de los módulos de gestión.',
        ],
      },
    ],
  },
  {
    version: '1.8.10',
    date: '2026-03-17',
    title: 'Nuevo rol AYUDANTE con alcance de grupo',
    summary:
      'Se incorpora el rol AYUDANTE como adulto comodin de grupo y se lo alinea con el acceso total visible de jefatura cuando su scope es GRUPO.',
    sections: [
      {
        title: 'Acceso de grupo',
        items: [
          'AYUDANTE pasa a compartir el acceso total visible del dashboard junto con JEFATURA cuando su asignacion usa scope GRUPO.',
          'Los checks visuales de permisos lo tratan como perfil adulto con acceso operativo completo.',
        ],
      },
      {
        title: 'Asignacion automatica',
        items: [
          'Los adultos creados en el area Jefatura quedan como JEFATURA o AYUDANTE segun su posicion, siempre con scope GRUPO.',
        ],
      },
    ],
  },
  {
    version: '1.8.9',
    date: '2026-03-17',
    title: 'Acceso total del frontend atado a rol y scope de grupo',
    summary:
      'La visibilidad de secciones y los bypass visuales de permisos dejan de depender solo del rol y pasan a exigir un scope de grupo coherente para los perfiles de acceso total.',
    sections: [
      {
        title: 'Acceso total',
        items: [
          'ADM, DEV, JEFATURA, INTENDENCIA y SECRETARIA_TESORERIA obtienen acceso total visible solo cuando su asignación usa scope GRUPO.',
          'La sidebar, las rutas protegidas y los checks de permisos del frontend dejan de tratar a JEFATURA como bypass automático por rol.',
        ],
      },
      {
        title: 'Eventos',
        items: [
          'La afectación automática al crear eventos solo toma a JEFATURA como jefatura de grupo cuando el scope corresponde a GRUPO o GLOBAL.',
        ],
      },
    ],
  },
  {
    version: '1.8.8',
    date: '2026-03-17',
    title: 'Filtro de cumpleaños por tipo de miembro en calendario',
    summary:
      'La sidebar de filtros del calendario suma una selección específica para cumpleaños, permitiendo alternar entre protagonistas, responsables y adultos.',
    sections: [
      {
        title: 'Cumpleaños',
        items: [
          'Los cumpleaños pueden filtrarse por protagonistas, responsables o adultos.',
          'La clasificación de responsables queda normalizada desde backend para que el filtro funcione de forma exacta.',
        ],
      },
    ],
  },
  {
    version: '1.8.7',
    date: '2026-03-17',
    title: 'Calendario abierto para todos y filtros laterales simplificados',
    summary:
      'El calendario queda disponible para cualquier miembro autenticado y la interfaz unifica sus filtros en una sola sidebar desplegable.',
    sections: [
      {
        title: 'Acceso general',
        items: [
          'Adultos, responsables y protagonistas pueden ingresar al calendario desde la sidebar o por URL directa.',
          'El calendario sigue mostrando eventos y cumpleaños sin depender de posición, rama o área del usuario.',
        ],
      },
      {
        title: 'Filtros',
        items: [
          'Se elimina la duplicación entre sidebar fija y sidebar desplegable.',
          'Los filtros quedan concentrados en un único panel lateral desplegable para todos los tamaños de pantalla.',
        ],
      },
    ],
  },
  {
    version: '1.8.6',
    date: '2026-03-17',
    title: 'Filtro para asistencias actuales en consejos',
    summary:
      'El diálogo de asistencia de consejos incorpora una búsqueda local adicional para encontrar más rápido miembros ya cargados en la asistencia actual.',
    sections: [
      {
        title: 'Asistencia de consejos',
        items: [
          'Las asistencias actuales pueden filtrarse por nombre, apellido, DNI o descripción.',
          'El filtro usa el mismo patrón visual de búsqueda con lupa integrada que el resto de las tablas del dashboard.',
        ],
      },
    ],
  },
  {
    version: '1.8.5',
    date: '2026-03-17',
    title: 'Permisos afinados dentro del consejo iniciado',
    summary:
      'El workspace de consejos abiertos separa mejor las acciones de adultos, moderador y secretaría para reflejar el funcionamiento operativo esperado.',
    sections: [
      {
        title: 'Gestion general del consejo',
        items: [
          'Los perfiles adultos pueden administrar asistencia, moderador, secretaría y la estructura de temas dentro del consejo.',
          'La lista de oradores sigue visible para todos los participantes con acceso al consejo.',
        ],
      },
      {
        title: 'Moderacion y acta',
        items: [
          'Solo el moderador asignado puede incorporar oradores desde manos levantadas o desde la asistencia.',
          'Solo secretario y prosecretario pueden modificar debate, acuerdo y estado del tema, y esa regla queda validada también en backend.',
        ],
      },
    ],
  },
  {
    version: '1.8.4',
    date: '2026-03-17',
    title: 'Consejos visible para todos con acciones diferenciadas para adultos',
    summary:
      'La sección Consejos queda disponible para cualquier miembro autenticado, mientras que la edición del consejo y del temario se separa para dejarla solo en manos de perfiles adultos.',
    sections: [
      {
        title: 'Acceso general',
        items: [
          'Todos los miembros pueden ver el listado completo de consejos y abrir cualquier consejo existente.',
          'La acción Iniciar consejo queda disponible para cualquier miembro autenticado, aunque no forme parte de la asistencia.',
        ],
      },
      {
        title: 'Acciones de adultos',
        items: [
          'Crear, editar y eliminar consejos queda visible solo para perfiles adultos con permisos operativos sobre el recurso.',
          'El temario puede consultarse por cualquier usuario, pero agregar, editar y eliminar temas queda restringido a adultos.',
        ],
      },
    ],
  },
  {
    version: '1.8.3',
    date: '2026-03-17',
    title: 'Confirmacion unificada de eliminacion y apertura de Consejos para roles de rama',
    summary:
      'Las tablas principales del dashboard reemplazan los confirm nativos por un diálogo consistente, y la sección Consejos queda habilitada también para jefatura y ayudantía de rama.',
    sections: [
      {
        title: 'Eliminaciones',
        items: [
          'Las acciones de borrado ahora muestran un diálogo reutilizable con mensaje de impacto antes de confirmar.',
          'La experiencia de eliminación queda alineada entre Consejos, Eventos, Pagos, Comisiones, Responsables y catálogos asociados.',
        ],
      },
      {
        title: 'Consejos',
        items: [
          'JEFATURA_RAMA y AYUDANTE_RAMA pueden abrir la sección desde la sidebar y también por acceso directo por URL.',
          'La pantalla principal y el workspace de consejos aprovechan los permisos CRUD ya resueltos por backend para esos roles.',
        ],
      },
    ],
  },
  {
    version: '1.8.2',
    date: '2026-03-17',
    title: 'Iconos de busqueda integrados correctamente en los inputs',
    summary:
      'Los filtros globales del dashboard migran a los componentes nativos de PrimeReact para garantizar que la lupa quede embebida dentro del input.',
    sections: [
      {
        title: 'Busquedas globales',
        items: [
          'Se reemplaza el wrapper manual por IconField e InputIcon en las tablas principales.',
          'La lupa ahora queda correctamente dentro del campo de búsqueda y alineada al borde derecho.',
        ],
      },
    ],
  },
  {
    version: '1.8.1',
    date: '2026-03-17',
    title: 'Buscadores de tablas con icono alineado a la derecha',
    summary:
      'Los filtros globales del dashboard ajustan la posición de la lupa para mostrarla dentro del input y alineada al borde derecho.',
    sections: [
      {
        title: 'Busquedas globales',
        items: [
          'Se corrige la posición del icono de búsqueda en las tablas principales del dashboard.',
          'La lupa ahora queda dentro del recuadro del input y alineada a la derecha en lugar de a la izquierda.',
        ],
      },
    ],
  },
  {
    version: '1.8.0',
    date: '2026-03-17',
    title: 'Comisiones con participantes adultos y filtros server-side en tablas',
    summary:
      'Las secciones Eventos y Comisiones ahora filtran contra backend, y Comisiones suma la gestión de adultos participantes junto con la asociación opcional a un evento.',
    sections: [
      {
        title: 'Eventos',
        items: [
          'La grilla incorpora búsqueda global por nombre, descripción y lugar.',
          'Se puede filtrar por tipo y por rango de fechas sin descargar toda la colección al cliente.',
        ],
      },
      {
        title: 'Comisiones',
        items: [
          'Cada comisión puede vincularse a un evento y administrar adultos participantes.',
          'La tabla suma búsqueda global y filtro por evento, ambos ejecutados del lado del servidor.',
        ],
      },
    ],
  },
  {
    version: '1.7.10',
    date: '2026-03-17',
    title: 'Comisiones habilitado para roles de rama',
    summary:
      'La sección Comisiones queda accesible para jefatura y ayudantía de rama, y su UI respeta los permisos CRUD reales del usuario autenticado.',
    sections: [
      {
        title: 'Comisiones',
        items: [
          'JEFATURA_RAMA y AYUDANTE_RAMA pueden abrir la sección desde sidebar y por URL manual.',
          'Los botones de crear, editar y eliminar se muestran sólo si el usuario tiene los permisos funcionales correspondientes.',
        ],
      },
    ],
  },
  {
    version: '1.7.9',
    date: '2026-03-17',
    title: 'APFs habilitados mas compacto en Formaciones',
    summary:
      'La gestión de APFs dentro de Formaciones pasa a mostrarse en un bloque desplegable y simplifica la acción de cierre con un botón sólo de icono.',
    sections: [
      {
        title: 'UX de APFs',
        items: [
          'El bloque APFs habilitados ahora puede expandirse o colapsarse para ocupar menos espacio en la pantalla.',
          'La acción de cierre de una asignación APF usa únicamente el icono X para mantener una interfaz más compacta.',
        ],
      },
    ],
  },
  {
    version: '1.7.8',
    date: '2026-03-17',
    title: 'Modo edicion modular en Formaciones',
    summary:
      'La sección Formaciones deja de depender de un modo edición global y pasa a manejar toggles independientes para APFs y para cada template.',
    sections: [
      {
        title: 'Edicion segmentada',
        items: [
          'APFs habilitados ahora tiene un modo de edición propio, separado del resto de la pantalla.',
          'Cada template puede activarse en edición de forma individual sin afectar los demás templates.',
          'La vista general de formación mantiene lectura estable mientras sólo se habilita edición donde el usuario la necesita.',
        ],
      },
    ],
  },
  {
    version: '1.7.7',
    date: '2026-03-17',
    title: 'Formaciones abierto a lectura general con gestión adulta y APFs restringidos',
    summary:
      'La sección Formaciones pasa a estar disponible para toda cuenta autenticada, mientras la edición e inscripción quedan reservadas a adultos y la habilitación de APFs sólo a jefatura o APFs activos.',
    sections: [
      {
        title: 'Permisos en formacion',
        items: [
          'Cualquier miembro autenticado puede entrar a la sección y consultar templates de formación.',
          'Solo las personas adultas ven el botón Modo edición, el botón Usar para inscribirme y la sección de inscripción al plan.',
          'La gestión de APFs habilitados queda disponible únicamente para JEFATURA y para adultos con una asignación APF activa.',
        ],
      },
    ],
  },
  {
    version: '1.7.6',
    date: '2026-03-17',
    title: 'Eventos alineado con roles de rama y afectaciones automáticas',
    summary:
      'La sección Eventos queda habilitada para jefatura y ayudantía de rama, y la creación de eventos fija automáticamente las afectaciones válidas según el rol autenticado.',
    sections: [
      {
        title: 'Eventos por rama',
        items: [
          'JEFATURA_RAMA y AYUDANTE_RAMA pueden abrir Eventos y Tipos de Evento desde la interfaz o ingresando por URL.',
          'La API ahora limita listados y operaciones a eventos que involucren la rama afectada del usuario cuando se trata de roles scoped por rama.',
          'Las altas y actualizaciones de afectaciones para roles de rama quedan normalizadas para impedir asignaciones fuera de scope.',
        ],
      },
    ],
  },
  {
    version: '1.7.5',
    date: '2026-03-17',
    title: 'Subsecciones de pagos habilitadas para roles de rama',
    summary:
      'Las subsecciones Conceptos y Métodos de pagos ahora pueden abrirse también con jefatura y ayudantía de rama, tanto desde la UI como por acceso directo.',
    sections: [
      {
        title: 'Pagos y catálogos',
        items: [
          'JEFATURA_RAMA y AYUDANTE_RAMA pueden ingresar a Conceptos de Pago y Métodos de Pago.',
          'Las rutas protegidas manuales quedan alineadas con el acceso funcional esperado desde la pantalla de pagos.',
        ],
      },
    ],
  },
  {
    version: '1.7.4',
    date: '2026-03-17',
    title: 'Pagos habilitado para roles de rama con fecha de alta visible',
    summary:
      'La sección Pagos queda disponible para jefatura y ayudantía de rama, y la tabla muestra también cuándo se creó cada registro.',
    sections: [
      {
        title: 'Pagos por rama',
        items: [
          'JEFATURA_RAMA y AYUDANTE_RAMA pueden entrar a Pagos desde el menú y por URL.',
          'La grilla ahora muestra la fecha de creación de cada pago además de la fecha de pago.',
        ],
      },
    ],
  },
  {
    version: '1.7.3',
    date: '2026-03-17',
    title: 'Responsables habilitado para roles de rama',
    summary:
      'La sección Responsables del frontend ahora puede probarse con jefatura y ayudantía de rama, en línea con el filtrado backend por protagonistas dentro de la rama.',
    sections: [
      {
        title: 'Acceso a responsables',
        items: [
          'JEFATURA_RAMA y AYUDANTE_RAMA pueden ver el item de Responsables e ingresar por URL a la sección.',
          'La API mantiene el recorte por responsables vinculados a protagonistas de la rama permitida.',
        ],
      },
    ],
  },
  {
    version: '1.7.2',
    date: '2026-03-17',
    title: 'Adultos habilitado para ayudantía y jefatura de rama',
    summary:
      'La sección Adultos del frontend queda accesible para los roles de rama definidos, mientras el backend mantiene el recorte de resultados según el scope asociado.',
    sections: [
      {
        title: 'Adultos por rama',
        items: [
          'AYUDANTE_RAMA con scope RAMA ahora puede ver el item de Adultos y entrar a la ruta protegida.',
          'JEFATURA_RAMA y AYUDANTE_RAMA dependen del backend para recibir solo adultos de la rama permitida por su scope.',
        ],
      },
    ],
  },
  {
    version: '1.7.1',
    date: '2026-03-17',
    title: 'Jefatura de rama habilitada en todo el dashboard',
    summary:
      'La matriz de acceso visual del frontend ahora permite que Jefatura de Rama navegue todas las secciones, mientras la API sigue filtrando los registros por rama donde corresponde.',
    sections: [
      {
        title: 'Acceso por rol y scope',
        items: [
          'JEFATURA_RAMA con scope RAMA ahora visualiza todos los items del dashboard y puede ingresar por URL a las secciones protegidas.',
          'La seccion Protagonistas conserva el filtrado de datos en backend para devolver solo registros de las ramas habilitadas al usuario.',
        ],
      },
    ],
  },
  {
    version: '1.7.0',
    date: '2026-03-17',
    title: 'Acceso centralizado por rol y scope en el dashboard',
    summary:
      'El frontend suma una capa comun de autorizacion por rol y scope para gobernar la sidebar, el acceso por URL y las acciones principales del dashboard.',
    sections: [
      {
        title: 'Acceso al dashboard',
        items: [
          'Se centraliza una matriz de acceso por ruta para mantener consistente la visibilidad de la sidebar y el ingreso manual por URL.',
          'Las rutas no habilitadas ahora muestran una pantalla de acceso denegado en lugar de dejar visible la seccion.',
          'La jefatura con scope de grupo obtiene acceso completo sobre las secciones y acciones CRUD protegidas en esta primera etapa.',
        ],
      },
    ],
  },
  {
    version: '1.6.2',
    date: '2026-03-16',
    title: 'Adjuntos de formacion con límite local ampliado',
    summary:
      'La carga de adjuntos en Formaciones ahora acompaña el límite ampliado del backend y evita rechazos prematuros desde la interfaz.',
    sections: [
      {
        title: 'Adjuntos de formacion',
        items: [
          'El control local del frontend pasa de 8 MB a 50 MB para alinearse con la configuración productiva.',
          'El mensaje preventivo de tamaño máximo se actualiza para reflejar correctamente el nuevo límite.',
        ],
      },
    ],
  },
  {
    version: '1.6.1',
    date: '2026-03-16',
    title: 'Carga de adjuntos de formacion mas tolerante y clara',
    summary:
      'Se mejora el manejo de archivos adjuntos en Formaciones para aceptar cargas mas grandes en la API y mostrar errores mas claros cuando el tamaño supera los limites.',
    sections: [
      {
        title: 'Adjuntos de formacion',
        items: [
          'La API amplía el límite de body para soportar mejor adjuntos enviados en base64.',
          'La interfaz muestra un mensaje específico cuando el servidor rechaza la carga por tamaño.',
          'La subida deja de generar errores de promesa no capturada en el navegador cuando falla el upload.',
        ],
      },
    ],
  },
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
