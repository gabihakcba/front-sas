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
    version: '1.14.0',
    date: '2026-03-20',
    title: 'Importación masiva desde planillas',
    summary:
      'Los módulos de protagonistas, adultos y responsables ahora permiten cargar altas masivas desde archivos .xlsx, .csv o .tsv con un resumen final de filas creadas y errores detectados.',
    sections: [
      {
        title: 'Carga operativa',
        items: [
          'Cada listado suma una acción Importar con diálogo propio para adjuntar la planilla.',
          'La interfaz muestra cuántas filas se crearon y cuáles fallaron, indicando el motivo por fila.',
          'Los listados se refrescan automáticamente al finalizar una importación exitosa.',
        ],
      },
      {
        title: 'Backend',
        items: [
          'La API incorpora endpoints de importación para protagonistas, adultos y responsables.',
          'La lectura soporta .xlsx, .csv y .tsv usando la primera hoja disponible del archivo.',
          'La resolución de rama, área, posición, rol y scope respeta el alcance del usuario autenticado.',
        ],
      },
    ],
  },
  {
    version: '1.13.9',
    date: '2026-03-20',
    title: 'Fechas y horas unificadas con timezone Argentina',
    summary:
      'Las pantallas vinculadas a consejos, sabatinos, pagos y calendario dejan de depender del huso horario del navegador y pasan a mostrar fechas y horas con criterio fijo de Argentina en formato 24 hs.',
    sections: [
      {
        title: 'Documentos y vistas previas',
        items: [
          'Consejos y sabatinos alinean sus horarios visibles con los PDFs exportados.',
          'Pagos muestra fecha y hora tanto del pago como del alta usando el mismo criterio que el comprobante.',
          'El calendario usa el mismo formato para consejos, reuniones y sabatinos al abrir el detalle de cada evento.',
        ],
      },
      {
        title: 'Infraestructura',
        items: [
          'Se agrega una utilidad compartida de formateo con timezone America/Argentina/Buenos_Aires.',
          'Las vistas dejan de depender del timezone local del dispositivo del usuario para estos datos operativos.',
        ],
      },
    ],
  },
  {
    version: '1.13.8',
    date: '2026-03-20',
    title: 'Toolbar fijo en campos enriquecidos',
    summary:
      'Los editores enriquecidos de consejos y ciclos de programa mueven el scroll al área de contenido para que la barra de herramientas permanezca siempre visible.',
    sections: [
      {
        title: 'Editor enriquecido',
        items: [
          'El componente RichTextEditor suma soporte nativo para altura máxima del área editable.',
          'Consejos y ciclos dejan de envolver el editor en contenedores externos que hacían scrollear también el toolbar.',
        ],
      },
    ],
  },
  {
    version: '1.13.7',
    date: '2026-03-20',
    title: 'Opciones del consejo ajustadas al modo móvil real',
    summary:
      'La cabecera del consejo iniciado deja de depender exclusivamente de clases responsive para mostrar el botón Opciones y usa el mismo estado de breakpoint que gobierna el sidebar de temas.',
    sections: [
      {
        title: 'Consejos',
        items: [
          'El botón Opciones solo se renderiza cuando la pantalla no está en modo desktop.',
          'Las acciones extendidas de escritorio usan el mismo estado isDesktopTemas para evitar inconsistencias visuales.',
        ],
      },
    ],
  },
  {
    version: '1.13.6',
    date: '2026-03-20',
    title: 'Toggle de enlaces en el editor',
    summary:
      'El editor enriquecido mejora el manejo de enlaces permitiendo quitar el formato link desde el mismo botón o con Ctrl/Cmd + K cuando la selección ya está enlazada.',
    sections: [
      {
        title: 'Editor enriquecido',
        items: [
          'El botón de enlace ahora alterna entre crear y quitar links según el contexto de la selección.',
          'Ctrl/Cmd + K replica el mismo comportamiento toggle del botón.',
          'Al quitar un link se conserva el texto y solo se elimina la marca de enlace.',
        ],
      },
    ],
  },
  {
    version: '1.13.5',
    date: '2026-03-20',
    title: 'Links del editor con URL única y selección precargada',
    summary:
      'La creación de enlaces en el editor deja de separar texto y URL, y pasa a trabajar con un único campo URL que aprovecha la selección actual como valor inicial.',
    sections: [
      {
        title: 'Editor enriquecido',
        items: [
          'El modal de enlaces ahora muestra solo el campo URL.',
          'Al crear un link con texto seleccionado, la selección se precarga directamente como URL.',
          'Si falta protocolo, el enlace se normaliza automáticamente con https:// antes de aplicarse.',
        ],
      },
    ],
  },
  {
    version: '1.13.4',
    date: '2026-03-20',
    title: 'Acta de consejo con drafts por tema y tiempo real estable',
    summary:
      'El consejo iniciado corrige la edición del acta separando el draft por temario y reactivando la sincronización en tiempo real sin volver a mezclar Debate y Acuerdo entre temas.',
    sections: [
      {
        title: 'Consejos',
        items: [
          'Cada tema del temario conserva su propio draft de Debate, Acuerdo y Estado.',
          'La edición en tiempo real vuelve a sincronizarse con debounce sobre el tema activo.',
          'La restricción de edición sigue reservada a secretario y prosecretario.',
        ],
      },
    ],
  },
  {
    version: '1.13.3',
    date: '2026-03-20',
    title: 'Correcciones de consejo iniciado y enlaces del editor',
    summary:
      'Se corrige el breakpoint del botón Opciones en consejos iniciados y se endurece la creación de enlaces del editor para evitar URLs inválidas y preservar mejor Debate y Acuerdo.',
    sections: [
      {
        title: 'Consejos',
        items: [
          'El botón Opciones vuelve a renderizarse solo en resoluciones chicas y deja de aparecer en desktop.',
          'Debate y Acuerdo mantienen una inserción de enlaces segura usando contenido tipado de TipTap en lugar de HTML crudo.',
          'La creación de enlaces ahora valida y normaliza la URL antes de aplicarla.',
        ],
      },
    ],
  },
  {
    version: '1.13.2',
    date: '2026-03-20',
    title: 'Texto precargado en el modal de enlaces',
    summary:
      'El dialog del editor para crear enlaces ahora toma el texto seleccionado como valor inicial y permite confirmar o ajustar el texto visible antes de aplicar el link.',
    sections: [
      {
        title: 'Editor enriquecido',
        items: [
          'El modal de enlace suma un campo Texto separado del URL.',
          'Si el usuario abre el dialog con texto seleccionado, ese contenido se precarga automaticamente en el formulario.',
          'El enlace resultante usa el texto visible elegido en el modal en lugar de depender solo de la seleccion original.',
        ],
      },
    ],
  },
  {
    version: '1.13.1',
    date: '2026-03-20',
    title: 'Creacion de enlaces con dialog propio del editor',
    summary:
      'El editor enriquecido reemplaza el prompt nativo del navegador por un dialog integrado y aplica enlaces sobre la seleccion activa sin salir de la experiencia de la app.',
    sections: [
      {
        title: 'Editor enriquecido',
        items: [
          'Crear enlaces desde el boton o con Ctrl/Cmd + K ahora abre un dialog propio de PrimeReact en lugar del prompt del navegador.',
          'Cuando hay texto seleccionado, el enlace se aplica directamente sobre esa seleccion sin perder el contexto de edicion.',
          'El foco vuelve al editor al cerrar el dialog para mantener continuidad en la escritura.',
        ],
      },
    ],
  },
  {
    version: '1.13.0',
    date: '2026-03-20',
    title: 'Detalle de cuentas de dinero con ingresos y egresos trazables',
    summary:
      'Las cuentas de dinero suman una vista de detalle operativa con movimientos paginados, registro de ingresos y egresos, responsables, metodos y adjuntos.',
    sections: [
      {
        title: 'Cuentas de dinero',
        items: [
          'Cada cuenta ahora expone una pantalla de detalle con saldo actual, asignacion contextual y metricas basicas de pagos y movimientos.',
          'Desde el listado principal se puede abrir la vista detallada por accion dedicada o doble click sobre la fila.',
          'La tabla principal agrega el conteo de movimientos asociados a cada cuenta.',
        ],
      },
      {
        title: 'Movimientos financieros',
        items: [
          'Los movimientos admiten montos positivos y negativos, con tipo inferido automaticamente como INGRESO o EGRESO.',
          'Cada alta registra responsable, metodo de pago, fecha operativa, detalle libre y multiples adjuntos de respaldo.',
          'La tabla de detalle permite filtrar movimientos y previsualizar comprobantes cargados sobre cada registro.',
        ],
      },
    ],
  },
  {
    version: '1.12.0',
    date: '2026-03-19',
    title: 'Nueva seccion Reuniones con invitaciones por miembro',
    summary:
      'Se incorpora Reuniones al dashboard con filtros server-side, CRUD para adultos e invitaciones gestionadas por accion separada, manteniendo el patron responsive de tablas.',
    sections: [
      {
        title: 'Reuniones',
        items: [
          'Nuevo listado de reuniones con paginacion backend (rows=10) y filtros por texto, modalidad e intervalo de fechas.',
          'El header de acciones usa la misma agrupacion responsive del dashboard: filtros, acciones especiales y CRUD en desktop/mobile.',
          'El formulario de reunion soporta modalidades presencial, virtual e hibrida, con lugar fisico y URL virtual opcionales.',
          'Las areas y ramas afectadas se seleccionan como multivalor desde el formulario de reunion.',
        ],
      },
      {
        title: 'Invitaciones y permisos',
        items: [
          'La gestion de invitados se realiza despues de crear/seleccionar una reunion, mediante una accion especial dedicada.',
          'El backend filtra reuniones por invitacion personal del miembro autenticado.',
          'Crear, editar y eliminar reuniones queda restringido a perfiles adultos con permisos CRUD sobre REUNION.',
          'Al crear una reunion, el miembro creador queda invitado automaticamente.',
        ],
      },
    ],
  },

  {
    version: '1.11.3',
    date: '2026-03-18',
    title: 'Correcciones en el Calendario',
    summary: 'Se corrigen tres bugs en el calendario: parseo de horas, filtro de área y campos vacíos en el modal del día.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'Parseo de horaInicio/horaFin corregido usando dayjs("1970-01-01T" + hora) en lugar de dayjs(horaISO).',
          'Al deseleccionar la rama en los filtros, el área ahora se limpia automáticamente.',
          'El modal de agenda del día ya no muestra líneas vacías ("Campo: -") para campos sin valor.',
        ],
      },
    ],
  },

  {
    version: '1.11.2',
    date: '2026-03-18',
    title: 'ColorPicker para color de texto y resaltado',
    summary:
      'Los selectores de color en el editor enriquecido reemplazan el Dropdown por un ColorPicker de PrimeReact con swatches predefinidos y un picker libre en OverlayPanel.',
    sections: [
      {
        title: 'Editor (Consejos y Ciclos de Programa)',
        items: [
          'El color de texto y el resaltado ahora se eligen desde un OverlayPanel con paleta rápida de colores predefinidos.',
          'El ColorPicker inline de PrimeReact permite seleccionar cualquier color libremente además de los presets.',
          'El botón del toolbar muestra un pequeño indicador del color actualmente aplicado.',
        ],
      },
    ],
  },

  {
    version: '1.11.1',
    date: '2026-03-18',
    title: 'Refactor del editor de texto enriquecido',
    summary:
      'El editor TipTap se reescribe desde cero siguiendo buenas prácticas: toolbar usando la API nativa de PrimeReact (severity) para estados activos, contenido estilizado con @tailwindcss/typography y código limpio sin className ad-hoc.',
    sections: [
      {
        title: 'Editor (Consejos y Ciclos de Programa)',
        items: [
          'El toolbar elimina toda manipulación de className para estados activos y usa la prop severity de PrimeReact Button.',
          'Los iconos de formato reemplazan las etiquetas de texto B, I, U por iconos PrimeIcons estándar.',
          'El área de contenido mantiene prose de @tailwindcss/typography como herramienta correcta para renderizar HTML de usuario.',
          'Se eliminan las reglas .ProseMirror ad-hoc de globals.css que colisionaban con prose.',
          'Los separadores entre grupos de botones usan el componente Divider de PrimeReact.',
        ],
      },
    ],
  },

  {
    version: '1.10.9',
    date: '2026-03-18',
    title: 'Fidelidad de editor enriquecido en Consejo y Ciclos',
    summary:
      'Se mejora la edición y persistencia de texto enriquecido para mantener el HTML de origen y reflejarlo mejor en exportaciones PDF.',
    sections: [
      {
        title: 'Edición',
        items: [
          'Los editores suman herramientas de sangría, color de texto, resaltado y limpieza de formato.',
          'Se elimina el recorte automático de contenido en debate/acuerdo y en bitácoras de ciclo para no alterar el HTML guardado.',
        ],
      },
      {
        title: 'Exportación',
        items: [
          'El PDF de ciclo interpreta mejor títulos, subtítulos, listas y estilos básicos desde el HTML enriquecido almacenado.',
        ],
      },
    ],
  },
  {
    version: '1.10.8',
    date: '2026-03-18',
    title: 'Preview integrado para exportar ciclos',
    summary:
      'La exportación de ciclo sigue usando el mismo endpoint, pero ahora se muestra en el `FilePreviewDialog` y desde ahí se puede descargar.',
    sections: [
      {
        title: 'Ciclo de programa',
        items: [
          'El botón “Exportar PDF” abre el preview institucional con el archivo generado en lugar de forzar una nueva pestaña.',
          'Desde el mismo diálogo se puede descargar el PDF sin abrir nuevas ventanas, manteniendo la experiencia ya usada para adjuntos y comprobantes.',
        ],
      },
    ],
  },
  {
    version: '1.10.7',
    date: '2026-03-18',
    title: 'Exportación en PDF de Ciclos de Programa',
    summary:
      'Se agrega la capacidad de descargar un PDF oficial con el detalle del ciclo, su bitácora y los eventos asociados directamente desde la vista operativa.',
    sections: [
      {
        title: 'Nuevo flujo',
        items: [
          'El detalle del ciclo expone un botón “Exportar PDF” que dispara la descarga vía nuevo endpoint protegido.',
          'El PDF resume la información de la rama, fechas, estado, bitácoras y eventos del ciclo con branding institucional.',
        ],
      },
    ],
  },
  {
    version: '1.10.6',
    date: '2026-03-18',
    title: 'Correcciones de navegación, consejos y bitácora',
    summary:
      'Se estabiliza el render al cambiar de sección, se corrigen overlays de dialogs en consejos y la lectura de listas enriquecidas en ciclos de programa.',
    sections: [
      {
        title: 'Dashboard y consejos',
        items: [
          'La navegación lateral vuelve a refrescar la vista al cambiar de sección sin depender de recarga manual.',
          'Los dropdowns de Asignar moderador y Asignar secretaria ya se superponen correctamente dentro del consejo iniciado.',
        ],
      },
      {
        title: 'Ciclos de programa',
        items: [
          'La bitácora del ciclo ahora muestra listas, numeraciones y sangrías correctamente en modo vista.',
        ],
      },
    ],
  },
  {
    version: '1.10.5',
    date: '2026-03-18',
    title: 'Defaults institucionales desde backend',
    summary:
      'La identidad institucional por defecto pasa a depender del backend, usando GRUPO_NOMBRE y assets públicos estándar en api-sas/public.',
    sections: [
      {
        title: 'Defaults',
        items: [
          'El nombre inicial del grupo ya no depende del frontend y se toma desde GRUPO_NOMBRE en el backend.',
          'Logo y favicon por defecto pasan a salir de /logo.png y /favicon.ico servidos por la API.',
        ],
      },
    ],
  },
  {
    version: '1.10.4',
    date: '2026-03-18',
    title: 'Temas separados para web y mobile',
    summary:
      'La configuración institucional separa los temas de PrimeReact y React Native Paper para preparar mejor la futura app mobile.',
    sections: [
      {
        title: 'Configuración',
        items: [
          'El campo original de theme pasa a dividirse en Tema Web y Tema Mobile.',
          'Tema Web ofrece el catálogo completo de themes de PrimeReact disponibles en esta instalación.',
          'Tema Mobile queda preparado con variantes base MD3 para la futura integración con React Native Paper.',
        ],
      },
    ],
  },
  {
    version: '1.10.3',
    date: '2026-03-18',
    title: 'Configuración y assets públicos',
    summary:
      'La administración de branding se integra mejor al dashboard bajo Configuración y el backend estabiliza el servido de assets públicos.',
    sections: [
      {
        title: 'Dashboard',
        items: [
          'La sección antes llamada Marca Blanca pasa a mostrarse como Configuración en la navegación y en la card principal.',
        ],
      },
      {
        title: 'Backend',
        items: [
          'El arranque del servidor deja de fallar al montar la carpeta pública usada para logo y favicon del grupo.',
        ],
      },
    ],
  },
  {
    version: '1.10.2',
    date: '2026-03-18',
    title: 'Uploads para marca blanca',
    summary:
      'La configuración de marca blanca deja de depender de URLs manuales y pasa a manejar uploads reales de logo y favicon.',
    sections: [
      {
        title: 'Archivos',
        items: [
          'La pantalla Marca Blanca permite seleccionar archivos locales para logo y favicon en lugar de pegar URLs.',
          'El branding resuelve correctamente los paths públicos servidos por la API para login, sidebar y favicon del documento.',
        ],
      },
      {
        title: 'Operación',
        items: [
          'La base conserva sólo la ruta del asset, mientras los archivos quedan almacenados localmente en el backend.',
        ],
      },
    ],
  },
  {
    version: '1.10.1',
    date: '2026-03-18',
    title: 'Administración de marca blanca',
    summary:
      'La marca blanca deja de ser sólo bootstrap público y suma una pantalla protegida para administrar branding desde el dashboard.',
    sections: [
      {
        title: 'Configuración',
        items: [
          'JEFATURA, ADM y DEV de grupo ven la nueva sección Marca Blanca al final del sidebar del dashboard.',
          'La pantalla permite editar nombre del grupo, logo, favicon y theme con aplicación inmediata sobre el branding cargado.',
        ],
      },
      {
        title: 'Layout',
        items: [
          'El sidebar también pasa a usar el branding remoto actual para mostrar nombre y logo coherentes con la configuración guardada.',
        ],
      },
    ],
  },
  {
    version: '1.10.0',
    date: '2026-03-18',
    title: 'Marca blanca inicial',
    summary:
      'La aplicación incorpora una configuración pública del grupo para personalizar branding, favicon y tema sin tocar código por instalación.',
    sections: [
      {
        title: 'Login y bootstrap',
        items: [
          'El login ahora carga el nombre y logo del grupo desde un endpoint público antes de autenticar.',
          'La configuración pública se cachea localmente para acelerar el arranque y soportar recargas rápidas.',
        ],
      },
      {
        title: 'Tema y branding',
        items: [
          'El layout aplica dinámicamente el tema de PrimeReact, el título del documento y el favicon según la configuración remota.',
          'La solución queda alineada con un esquema single-tenant por despliegue, útil para el futuro flujo mobile por URL.',
        ],
      },
    ],
  },
  {
    version: '1.9.1',
    date: '2026-03-18',
    title: 'Edición del perfil propio',
    summary:
      'Cada miembro puede editar sus propios datos personales desde Perfil sin tocar roles, scopes ni asignaciones estructurales.',
    sections: [
      {
        title: 'Perfil',
        items: [
          'La card principal del perfil suma un modo edición exclusivo para el propio miembro autenticado.',
          'Solo se habilitan datos personales: nombre, apellidos, DNI, fecha de nacimiento, dirección, email, teléfonos, totem y cualidad.',
          'Usuario, rol, scope, entidad del scope, área, posición y rama permanecen fuera del modo edición.',
        ],
      },
    ],
  },
  {
    version: '1.9.0',
    date: '2026-03-18',
    title: 'Ciclos de Programa',
    summary:
      'El dashboard suma el módulo Ciclos de Programa con listado operativo, filtros por fechas y una vista de detalle con bitácora editable por etapas.',
    sections: [
      {
        title: 'Listado',
        items: [
          'La nueva sección Ciclos de Programa aparece en sidebar solo para perfiles habilitados y muestra nombre, fechas y estado.',
          'El header agrega búsqueda global, filtro único de rango de fechas y acciones responsivas de crear, editar, eliminar y ver detalle.',
        ],
      },
      {
        title: 'Detalle',
        items: [
          'Cada ciclo tiene una página protegida propia con resumen, eventos vinculados y bitácora organizada por tabs de etapa.',
          'Diagnóstico, Planificación, Desarrollo y Evaluación usan editor enriquecido con el mismo patrón operativo de consejos.',
          'Solo JEFATURA, ADM y DEV con scope de grupo pueden ver y editar la rama del ciclo desde la interfaz.',
        ],
      },
    ],
  },
  {
    version: '1.8.47',
    date: '2026-03-18',
    title: 'Consejos visibles en calendario',
    summary:
      'El calendario incorpora los consejos como una tercera fuente visible para todos los usuarios autenticados, con detalle propio dentro del modal diario.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'Los consejos aparecen en el calendario como una fuente independiente junto a eventos y cumpleaños.',
          'El detalle diario ahora distingue consejos con modalidad, fecha y horario dentro del mismo modal de agenda.',
        ],
      },
    ],
  },
  {
    version: '1.8.46',
    date: '2026-03-18',
    title: 'Formaciones plegable en mobile',
    summary:
      'La sección principal de Formaciones adopta un AccordionTab en mobile para compactar mejor la interfaz, manteniendo la card tradicional en escritorio.',
    sections: [
      {
        title: 'Formaciones',
        items: [
          'En mobile el bloque principal de Formaciones se pliega y despliega como accordion.',
          'En escritorio sigue presentándose como card para sostener la estructura actual.',
        ],
      },
    ],
  },
  {
    version: '1.8.45',
    date: '2026-03-18',
    title: 'Adjuntos de formaciones con descarga directa',
    summary:
      'La gestión de adjuntos en Formaciones desacopla preview y descarga para permitir bajar archivos apenas están disponibles y mostrar carga en el botón correspondiente.',
    sections: [
      {
        title: 'Formaciones',
        items: [
          'Cada adjunto ahora ofrece acciones separadas de Preview y Descargar.',
          'La descarga ya no espera a que exista preview y ambos botones informan carga mientras la solicitud está pendiente.',
        ],
      },
    ],
  },
  {
    version: '1.8.44',
    date: '2026-03-18',
    title: 'Detalle diario en calendario',
    summary:
      'El calendario suma un modal por día para leer con claridad todos los eventos y cumpleaños listados en una fecha.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'Hacer click sobre una fecha o sobre un evento abre un modal con el listado completo del día.',
          'El detalle diario evita depender de la legibilidad del contenido comprimido dentro de cada celda.',
        ],
      },
    ],
  },
  {
    version: '1.8.43',
    date: '2026-03-18',
    title: 'Navegación por swipe en mobile',
    summary:
      'El calendario ajusta la navegación para que mobile dependa del desplazamiento horizontal, mientras desktop conserva sólo iconos mínimos.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'Anterior y Siguiente desaparecen en mobile como controles visibles.',
          'En desktop esos controles quedan reducidos a iconos, sin texto adicional.',
        ],
      },
    ],
  },
  {
    version: '1.8.42',
    date: '2026-03-18',
    title: 'SelectButton en calendario',
    summary:
      'El calendario reemplaza agrupaciones manuales por SelectButton de PrimeReact para la navegación y el cambio de vista.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'Anterior y Siguiente pasan a un SelectButton con adaptación de texto en desktop e iconos en mobile.',
          'Mes, Semestre y Año quedan unificados con SelectButton como selector de vista activo.',
        ],
      },
    ],
  },
  {
    version: '1.8.41',
    date: '2026-03-18',
    title: 'Barra compacta en calendario',
    summary:
      'La navegación del calendario se compacta con ButtonGroup, elimina el acceso a Hoy y suma desplazamiento horizontal para avanzar o retroceder.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'Anterior y Siguiente pasan a un ButtonGroup; en mobile se muestran sólo con iconos.',
          'Mes, Semestre y Año también se agrupan visualmente en un ButtonGroup.',
          'Deslizar a izquierda o derecha sobre el calendario navega al rango siguiente o anterior.',
        ],
      },
    ],
  },
  {
    version: '1.8.40',
    date: '2026-03-18',
    title: 'Navegación directa en calendario',
    summary:
      'El calendario suma un título clickeable que abre un selector de fecha para navegar directamente por año, mes y día.',
    sections: [
      {
        title: 'Calendario',
        items: [
          'La navegación de prev, siguiente, hoy y cambio de vista pasa a una barra propia más controlable.',
          'El título actual abre un selector de fecha basado en PrimeReact Calendar para saltar directamente a la fecha deseada.',
        ],
      },
    ],
  },
  {
    version: '1.8.39',
    date: '2026-03-18',
    title: 'Sidebar fija para temas de consejo',
    summary:
      'La sección Temas del consejo iniciado deja de vivir en una columna y pasa a una sidebar derecha, con apertura fija en desktop y acceso persistente mediante botón flotante.',
    sections: [
      {
        title: 'Consejo',
        items: [
          'En desktop la sidebar de temas se abre por defecto y el contenido principal reserva espacio para que no quede tapado.',
          'En mobile la sidebar inicia cerrada y se abre desde un botón fijo que no se ve afectado por el scroll.',
        ],
      },
    ],
  },
  {
    version: '1.8.38',
    date: '2026-03-18',
    title: 'Opciones compactas en consejo mobile',
    summary:
      'El consejo iniciado mueve sus acciones secundarias a un modal de opciones en mobile para liberar espacio en el encabezado.',
    sections: [
      {
        title: 'Consejo',
        items: [
          'Asistencia, Asignar secretaria, Asignar moderador, PDF completo y PDF quedan agrupados detrás del botón Opciones en pantallas chicas.',
          'En escritorio se mantiene la botonera visible para preservar productividad y acceso directo.',
        ],
      },
    ],
  },
  {
    version: '1.8.37',
    date: '2026-03-18',
    title: 'Accordion real en temas de consejo',
    summary:
      'La sección Temas del consejo iniciado deja de usar una simulación manual y pasa a renderizarse con el componente Accordion de PrimeReact en mobile.',
    sections: [
      {
        title: 'Consejo',
        items: [
          'En mobile, Temas se despliega con Accordion y mantiene dentro del mismo panel las acciones y el listado.',
          'Se conserva el comportamiento expandido de escritorio sin introducir cambios en esa experiencia.',
        ],
      },
    ],
  },
  {
    version: '1.8.36',
    date: '2026-03-18',
    title: 'Acordeón de temas en consejo mobile',
    summary:
      'La sección lateral de temas dentro del consejo iniciado pasa a comportarse como acordeón completo en mobile, incluyendo acciones y listado.',
    sections: [
      {
        title: 'Consejo',
        items: [
          'La cabecera de Temas en mobile ahora despliega y contrae toda la sección, no solo el listado.',
          'Agregar tema, Editar y la lista de temas quedan dentro del mismo bloque plegable para ahorrar espacio vertical.',
        ],
      },
    ],
  },
  {
    version: '1.8.35',
    date: '2026-03-18',
    title: 'Temas desplegables en consejo mobile',
    summary:
      'El consejo iniciado mejora su uso en pantallas chicas haciendo que el listado de temas lateral se comporte como un bloque desplegable.',
    sections: [
      {
        title: 'Consejo',
        items: [
          'En mobile y resoluciones chicas el listado de temas deja de quedar siempre visible y pasa a abrirse manualmente.',
          'Al elegir un tema, el panel se contrae otra vez para dejar más espacio al contenido principal del acta.',
        ],
      },
    ],
  },
  {
    version: '1.8.34',
    date: '2026-03-18',
    title: 'Dialogs responsive consistentes',
    summary:
      'Se completa la unificación responsive de dialogs y se termina el ajuste visual de Relaciones para mobile y resoluciones chicas.',
    sections: [
      {
        title: 'Dialogs',
        items: [
          'Los formularios y dialogs pendientes ahora limitan su ancho al viewport, agregan padding interno y permiten scroll vertical cuando el contenido excede la altura disponible.',
          'Los overlays de dropdowns y multiselects dentro de dialogs se adaptan mejor al espacio disponible en pantallas chicas.',
        ],
      },
      {
        title: 'Tablas',
        items: [
          'Relaciones oculta el selector visual de fila y deja la columna ID visible solo para cuentas DEV.',
          'La selección sigue indicándose por color de fila sin exponer radiobuttons innecesarios.',
        ],
      },
    ],
  },
  {
    version: '1.8.33',
    date: '2026-03-18',
    title: 'Filtros móviles en sidebar',
    summary:
      'Las tablas que ya usan acciones agrupadas en mobile corrigen la duplicación de botones visibles y suman un acceso lateral específico para filtros.',
    sections: [
      {
        title: 'Mobile',
        items: [
          'Eventos deja de mostrar acciones duplicadas fuera del modal en resoluciones chicas.',
          'Los filtros pasan a abrirse desde un botón propio con sidebar lateral en lugar de quedar siempre expuestos en el header móvil.',
        ],
      },
      {
        title: 'Cobertura',
        items: [
          'El patrón de filtros móviles se aplica a Protagonistas, Adultos, Responsables, Pagos, Eventos, Comisiones, Consejos y Cuentas.',
          'En escritorio se conserva la visualización directa de filtros sin sidebar adicional.',
        ],
      },
    ],
  },
  {
    version: '1.8.32',
    date: '2026-03-18',
    title: 'Headers de tablas agrupados en mobile',
    summary:
      'Las botoneras de header del dashboard pasan a un formato agrupado para mobile, reduciendo saturación visual y manteniendo separadas las acciones CRUD, especiales y relacionadas.',
    sections: [
      {
        title: 'Responsive',
        items: [
          'En pantallas chicas los headers de tablas ya no muestran largas filas de botones, sino accesos agrupados que abren modal.',
          'El patrón mantiene la separación conceptual entre CRUD, ediciones especiales y acciones o tablas relacionadas.',
        ],
      },
      {
        title: 'Cobertura',
        items: [
          'El cambio alcanza a Protagonistas, Adultos, Responsables, Pagos, Eventos, Comisiones, Consejos, Cuentas, Conceptos, Métodos y Tipos de Evento.',
          'En escritorio se conserva la botonera visible, pero ya ordenada con el mismo criterio de agrupación.',
        ],
      },
    ],
  },
  {
    version: '1.8.31',
    date: '2026-03-18',
    title: 'Buscadores de tablas alineados',
    summary:
      'Los filtros globales de tablas vuelven a usar una estructura consistente para que la lupa quede dentro del input en todo el dashboard.',
    sections: [
      {
        title: 'Inputs',
        items: [
          'Los buscadores de Protagonistas, Adultos, Responsables, Pagos, Comisiones, Cuentas y Logs quedan alineados con el patrón visual correcto.',
          'Cada input recupera ancho completo disponible dentro de su contenedor sin empujar el icono hacia afuera.',
        ],
      },
    ],
  },
  {
    version: '1.8.30',
    date: '2026-03-18',
    title: 'Branding movido al header lateral',
    summary:
      'El dashboard reubica el logo y nombre institucional dentro del encabezado nativo de la sidebar para ordenar mejor la navegación lateral.',
    sections: [
      {
        title: 'Sidebar',
        items: [
          'En mobile, el logo y nombre pasan al header propio de la sidebar en lugar de ocupar espacio dentro del cuerpo navegable.',
          'En escritorio se mantiene el mismo branding en la parte superior del panel lateral para conservar consistencia visual.',
        ],
      },
    ],
  },
  {
    version: '1.8.29',
    date: '2026-03-18',
    title: 'Tablas con selección visual unificada',
    summary:
      'Las tablas principales del dashboard dejan de mostrar la columna explícita de selección y reservan la columna ID únicamente para perfiles técnicos de desarrollo.',
    sections: [
      {
        title: 'Visibilidad',
        items: [
          'El ID queda visible sólo para DEV, evitando inconsistencias entre tablas operativas del dashboard.',
          'Responsables mantiene el mismo criterio y ahora también muestra ID sólo cuando corresponde por rol.',
        ],
      },
      {
        title: 'Interacción',
        items: [
          'La selección sigue funcionando por fila, pero sin radio visible, apoyándose sólo en el cambio de color.',
          'El ajuste se aplica a Protagonistas, Adultos, Responsables, Pagos, Conceptos, Métodos, Cuentas, Eventos, Tipos de Evento, Comisiones y Consejos.',
        ],
      },
    ],
  },
  {
    version: '1.8.28',
    date: '2026-03-18',
    title: 'Visor inicial de logs',
    summary:
      'La sección Logs deja de ser un placeholder y pasa a mostrar el primer listado paginado de auditoría para revisar requests mutantes y sus acciones asociadas.',
    sections: [
      {
        title: 'Listado',
        items: [
          'La tabla muestra fecha, endpoint, cuenta, miembro, IP, user-agent y cantidad de acciones registradas por cada log.',
          'Cada fila resume además las tablas afectadas por la request para acelerar la lectura operativa de auditoría.',
        ],
      },
      {
        title: 'Búsqueda',
        items: [
          'El módulo permite buscar logs por endpoint, IP o user-agent sin salir del dashboard.',
          'La navegación mantiene paginación backend fija en 10 registros por página.',
        ],
      },
    ],
  },
  {
    version: '1.8.27',
    date: '2026-03-18',
    title: 'Entrada protegida para logs',
    summary:
      'El dashboard incorpora la sección Logs con acceso reservado a perfiles de grupo con responsabilidad de auditoría técnica u organizativa.',
    sections: [
      {
        title: 'Acceso',
        items: [
          'La sidebar muestra Logs sólo para JEFATURA, DEV y ADM con scope GRUPO.',
          'La ruta queda protegida con la misma matriz para evitar acceso manual por URL desde otros perfiles.',
        ],
      },
    ],
  },
  {
    version: '1.8.26',
    date: '2026-03-18',
    title: 'Pagos sin edición y base de auditoría',
    summary:
      'La gestión de pagos pasa a trabajar sin edición directa y el sistema incorpora la primera base de auditoría para registrar operaciones mutantes.',
    sections: [
      {
        title: 'Pagos',
        items: [
          'El frontend elimina la acción de editar pagos y deja el módulo alineado con una política de alta nueva más baja lógica ante errores.',
          'La API deja de exponer edición de pagos para evitar cambios silenciosos sobre movimientos financieros ya registrados.',
        ],
      },
      {
        title: 'Auditoría',
        items: [
          'Se incorpora un interceptor global para crear logs de requests mutantes autenticadas.',
          'Pago queda instrumentado como primer recurso auditado, registrando snapshots previos y posteriores en Action.',
        ],
      },
    ],
  },
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
