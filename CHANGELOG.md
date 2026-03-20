# Changelog

Todas las versiones deben listarse de mas nueva a mas vieja.

## 1.13.9

Fecha: 2026-03-20

### Correcciones

- vistas de consejos, sabatinos, pagos y calendario pasan a mostrar fechas y horas con timezone de Argentina
- los horarios visibles relacionados con PDFs y comprobantes quedan unificados en formato 24 hs
- se agrega una utilidad compartida para evitar diferencias entre navegador y documentos exportados

## 1.13.8

Fecha: 2026-03-20

### Correcciones

- el scroll de los campos enriquecidos pasa a vivir dentro del área editable del `RichTextEditor`
- el toolbar de formato queda fuera de la zona scrolleable en consejos y ciclos de programa

## 1.13.7

Fecha: 2026-03-20

### Correcciones

- el botón `Opciones` del consejo iniciado deja de depender solo de clases responsive y ahora se renderiza únicamente cuando la pantalla está en modo móvil real

## 1.13.6

Fecha: 2026-03-20

### Correcciones

- el botón de enlace y el atajo `Ctrl/Cmd + K` pasan a funcionar como toggle: si la selección ya tiene link, lo quitan
- al quitar un link se remueve solo la marca de enlace, conservando el texto visible

## 1.13.5

Fecha: 2026-03-20

### Correcciones

- el diálogo de enlaces del editor se simplifica a un único campo `URL`
- si hay texto seleccionado, ese texto pasa a precargar la `URL` y se usa como `href` del enlace al aplicar
- si no hay selección, el enlace inserta como texto visible el valor escrito en `URL` y sanitiza automáticamente el protocolo `https://`

## 1.13.4

Fecha: 2026-03-20

### Correcciones

- `Debate`, `Acuerdo` y `Estado` del consejo iniciado pasan a manejarse con drafts aislados por tema para evitar cruces entre puntos del temario
- la sincronización en tiempo real del acta se restablece con debounce sobre el tema activo, manteniendo los permisos exclusivos de secretario y prosecretario
- se eliminan los logs temporales de diagnóstico agregados durante la investigación del problema

## 1.13.3

Fecha: 2026-03-20

### Correcciones

- el botón `Opciones` del consejo iniciado vuelve a mostrarse solo en resoluciones chicas y desaparece en desktop desde `md`
- el editor valida y normaliza la URL antes de crear enlaces para evitar links inválidos como `https:`
- la inserción de enlaces deja de usar HTML crudo y pasa a insertar contenido TipTap tipado, estabilizando la persistencia de `Debate` y `Acuerdo`

## 1.13.2

Fecha: 2026-03-20

### Correcciones

- el modal de enlaces del editor ahora precarga en el campo `Texto` el contenido seleccionado al abrirse
- al aplicar un enlace se usa el texto visible definido en el modal, evitando perder control sobre la etiqueta mostrada

## 1.13.1

Fecha: 2026-03-20

### Correcciones

- el editor enriquecido deja de usar el prompt nativo del navegador al crear enlaces y pasa a usar un dialog propio de la interfaz
- al aplicar un enlace con texto seleccionado, el editor conserva la selección y convierte directamente ese contenido en link
- el atajo `Ctrl/Cmd + K` queda alineado con el nuevo flujo visual del editor

## 1.13.0

Fecha: 2026-03-20

### Ajustes funcionales relevantes

- la gestion de cuentas de dinero incorpora una vista de detalle dedicada en `/dashboard/cuentas/dinero/[id]` con saldo actual, contexto de asignacion y listado paginado de movimientos
- los ingresos y egresos pasan a registrarse como movimientos de cuenta con tipo inferido por signo, responsable, metodo de pago, snapshots de saldo y adjuntos multiples
- desde el listado principal de cuentas se agrega acceso directo a `Detalles` y conteo visible de movimientos asociados
- los adjuntos de movimientos pueden previsualizarse desde la misma tabla de detalle
- las rutas protegidas del dashboard quedan alineadas para permitir acceso directo a la nueva vista de detalle de cuentas

## 1.12.0

Fecha: 2026-03-19

### Ajustes funcionales relevantes

- se incorpora la nueva sección `Reuniones` en dashboard, accesible para miembros autenticados con listado paginado server-side y filtros por texto, modalidad y rango de fechas
- la gestión CRUD de reuniones queda habilitada solo para perfiles adultos con permisos (`CREATE/UPDATE/DELETE:REUNION`)
- las reuniones soportan modalidad `PRESENCIAL`, `VIRTUAL` e `HIBRIDA`, con áreas y ramas afectadas múltiples y campos opcionales de lugar físico y URL virtual
- las invitaciones se administran en una acción separada (`Invitados`) al seleccionar una reunión, reutilizando el patrón responsive de acciones agrupadas desktop/mobile
- la creación de una reunión genera automáticamente la invitación del miembro creador

## 1.11.3

Fecha: 2026-03-18

### Correcciones

- el parseo de `horaInicio` y `horaFin` en el modal del día del calendario se corrige usando `dayjs("1970-01-01T" + hora)` en lugar de `dayjs(horaISO)` que era incorrecto para strings de tiempo
- los filtros de rama y área ahora se sincronizan correctamente: al deseleccionar la rama, el área se limpia automáticamente
- el modal de agenda del día ya no muestra líneas `"Campo: -"` para campos sin valor; solo muestra los que tienen datos

## 1.11.2

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- los selectores de color de texto y resaltado reemplazan el `Dropdown` por `ColorPicker` de PrimeReact con swatches predefinidos
- cada picker se presenta en un `OverlayPanel` con una paleta de colores rápidos y el `ColorPicker` inline para selección libre
- el botón de activación muestra un pequeño indicador del color actualmente aplicado

## 1.11.1

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- el editor TipTap se reescribe desde cero eliminando todo uso ad-hoc de className para estados activos en el toolbar
- los botones del toolbar ahora usan la prop `severity` nativa de PrimeReact Button para reflejar si el formato está activo o no
- las etiquetas de texto `B`, `I`, `U` pasan a iconos `pi-bold`, `pi-italic`, `pi-underline` de PrimeIcons
- los separadores entre grupos de herramientas usan el componente `Divider` de PrimeReact en lugar de divs con clases Tailwind
- el área de contenido mantiene la clase `prose` de `@tailwindcss/typography` como solución estándar para renderizar HTML de usuario
- se eliminan las reglas `.ProseMirror` ad-hoc de `globals.css` que colisionaban con el estilizado de `prose`
- los cambios aplican a todos los campos ricos: `Debate`, `Acuerdo` (Consejos) y `Diagnóstico`, `Planificación`, `Desarrollo`, `Evaluación` (Ciclos de Programa)

## 1.10.5


Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la configuración institucional toma por defecto el nombre del grupo desde `GRUPO_NOMBRE` del backend
- logo y favicon por defecto pasan a resolverse desde `api-sas/public/logo.png` y `api-sas/public/favicon.ico`
- el frontend deja de depender de `NEXT_PUBLIC_GRUPO_NOMBRE` y usa únicamente la configuración pública servida por la API

## 1.10.4

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la configuración del grupo separa `Tema Web` y `Tema Mobile` para no mezclar PrimeReact con React Native Paper
- el selector de `Tema Web` ahora expone todos los themes de PrimeReact disponibles en la instalación actual
- `Tema Mobile` queda preparado con opciones base MD3 para la futura app React Native

## 1.10.3

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la sección de administración de branding pasa a llamarse `Configuración` en el sidebar y en la pantalla del dashboard
- se corrige el arranque del backend para servir assets públicos de branding sin fallar por el import de `path`

## 1.10.2

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la administración de `Marca Blanca` reemplaza URLs manuales por carga real de archivos para logo y favicon
- el backend publica los assets de branding desde almacenamiento local y conserva en base sólo la ruta resultante
- login, favicon del documento y sidebar resuelven correctamente esos paths servidos por la API

## 1.10.1

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- se agrega la sección `Marca Blanca` al final del sidebar del dashboard sólo para `JEFATURA`, `ADM` y `DEV` de grupo
- la configuración del grupo deja de ser sólo pública y suma un endpoint protegido para editar nombre, logo, favicon y theme
- el branding aplicado por el login y el layout ahora puede actualizarse desde la propia interfaz administrativa sin tocar código

## 1.10.0

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- se incorpora la primera capa de marca blanca single-tenant con configuración pública del grupo
- login y layout dejan de depender de nombre/logo/theme fijos y pasan a consumir la configuración remota antes de autenticar
- el frontend aplica nombre del grupo, favicon y tema PrimeReact en tiempo de ejecución, con cache local para acelerar recargas

## 1.9.1

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- el perfil propio incorpora `Modo edición` para actualizar datos personales sin exponer rol, scope, entidad del scope, área, posición ni rama
- la edición queda restringida al propio perfil y mantiene la firma como acción independiente dentro del mismo bloque de información
- el backend suma `PATCH /perfiles/me` reutilizando la validación central de cuenta/miembro para conservar reglas de unicidad de DNI y email

## 1.9.0

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- se incorpora la nueva sección `Ciclos de Programa` al dashboard con listado, filtros por rango de fechas y acciones responsivas alineadas al resto de las tablas
- el módulo suma una página de detalle protegida por permisos, con modo vista y modo edición para la bitácora del ciclo organizada por etapas
- la edición de rama queda reservada en interfaz a `JEFATURA`, `ADM` y `DEV` con scope de grupo, mientras los perfiles de rama trabajan sobre su propio alcance
- el editor del detalle reutiliza el patrón enriquecido de consejos para `Diagnóstico`, `Planificación`, `Desarrollo` y `Evaluación`

## 1.8.47

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- el calendario suma `Consejos` como una fuente propia visible junto a eventos y cumpleaños
- cualquier usuario autenticado puede ver los consejos del calendario aunque no tenga acceso operativo al módulo `Consejos`

## 1.8.36

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- en el consejo iniciado, la sección `Temas` completa se comporta como acordeón en mobile, incluyendo acciones de `Agregar tema` y `Editar`
- en escritorio la sección sigue expandida en forma permanente sin cambiar el flujo actual

## 1.8.37

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la sección `Temas` del consejo iniciado pasa a usar el componente `Accordion` real de PrimeReact en mobile
- se elimina el comportamiento manual anterior para mantener consistencia con la librería usada en el resto de la interfaz

## 1.8.38

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- en el consejo iniciado, las acciones de asistencia, asignación y exportación pasan a un modal `Opciones` en mobile
- en escritorio las mismas acciones siguen visibles en el header para no alterar el flujo de trabajo amplio

## 1.8.39

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la gestión de temas del consejo iniciado pasa a una `Sidebar` derecha real, abierta por defecto en desktop y cerrada por defecto en mobile
- el acceso a `Temas` queda en un botón fijo independiente del scroll para mantenerlo siempre disponible

## 1.8.40

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- el calendario reemplaza la toolbar nativa por una barra propia donde el título actual es clickeable y abre un selector de fecha
- desde ese selector se puede saltar a año, mes y día usando `Calendar` de PrimeReact en desktop y mobile

## 1.8.41

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la barra del calendario agrupa navegación y vistas en `ButtonGroup`
- se elimina el botón `Hoy`
- en mobile la navegación muestra solo iconos y el calendario acepta swipe horizontal para ir a anterior o siguiente

## 1.8.42

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la navegación y el cambio de vista del calendario pasan a usar `SelectButton` de PrimeReact en lugar de agrupaciones manuales
- se mantiene el swipe horizontal para cambiar de rango y el selector de fecha clickeando el título actual

## 1.8.43

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- en desktop la navegación manual del calendario queda reducida a iconos
- en mobile se eliminan esos controles y el cambio de rango queda exclusivamente por swipe horizontal

## 1.8.44

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- al hacer click en un día o en un evento del calendario se abre un modal con el detalle de todo lo listado para esa fecha
- esto mejora la lectura de días con múltiples elementos o celdas visualmente cargadas

## 1.8.45

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- los adjuntos de Formaciones separan `Preview` y `Descargar` en acciones independientes
- el botón de descarga queda disponible apenas el archivo puede solicitarse, sin depender de abrir primero el preview
- ambos botones muestran estado de carga mientras la petición está en curso

## 1.8.46

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- en mobile la sección principal `Formaciones` deja de renderizarse como card y pasa a un `AccordionTab`
- en escritorio se conserva la card original para no cambiar el layout amplio

## 1.8.35

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- en el consejo iniciado, el listado lateral de temas pasa a ser desplegable en mobile y resoluciones chicas
- al seleccionar un tema desde mobile, el panel de temas se vuelve a contraer para priorizar la lectura del contenido del acta

## 1.8.34

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- se completa el ajuste de Relaciones ocultando el selector visual de fila y mostrando la columna `ID` solo para `DEV`
- los dialogs operativos pendientes pasan a usar un patrón responsive común con ancho limitado al viewport, padding interno y scroll vertical
- dropdowns y multiselects dentro de dialogs se adaptan mejor al viewport al renderizarse dentro del propio modal
- el canvas de firma se ajusta al ancho disponible para no desbordar en mobile

## 1.8.33

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- se corrige la duplicación de acciones visibles en mobile cuando una tabla ya migró a botones agrupados
- las tablas con filtros ahora agregan un acceso `Filtros` que abre una sidebar lateral en pantallas chicas

## 1.8.32

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- en mobile y resoluciones chicas las acciones de header de tablas se concentran en hasta 3 accesos agrupados: `CRUD`, `Especiales` y `Relacionadas`
- el nuevo patrón responsive se aplica a Protagonistas, Adultos, Responsables, Pagos, Eventos, Comisiones, Consejos, Cuentas, Conceptos, Métodos y Tipos de Evento

## 1.8.31

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- los buscadores globales de tablas se unifican para que la lupa vuelva a renderizarse dentro del input y no desalineada por fuera
- el ajuste se aplica a Protagonistas, Adultos, Responsables, Pagos, Comisiones, Cuentas y Logs

## 1.8.30

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- el logo y nombre institucional del dashboard pasan a renderizarse en el header nativo de la sidebar mobile
- el bloque fijo de escritorio conserva el mismo branding arriba, alineado con la nueva estructura del encabezado lateral

## 1.8.29

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- las tablas operativas del dashboard dejan de mostrar la columna visual de selección y mantienen la selección solo mediante cambio de color de fila
- la columna `ID` queda reservada exclusivamente para perfiles `DEV`, unificando la visibilidad entre Protagonistas, Adultos, Responsables, Pagos, Conceptos, Métodos, Cuentas, Eventos, Tipos de Evento, Comisiones y Consejos

## 1.8.28

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la sección `Logs` deja de ser placeholder y pasa a mostrar un listado paginado de auditoría con fecha, endpoint, cuenta, miembro, IP, user-agent y resumen de acciones
- el visor agrega búsqueda por endpoint, IP o user-agent y mantiene paginación backend fija en 10 registros

## 1.8.27

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- se agrega la sección `Logs` en sidebar y por ruta protegida únicamente para `JEFATURA`, `DEV` y `ADM` con scope `GRUPO`
- la pantalla queda creada como placeholder para continuar luego con la implementación del visor de auditoría

## 1.8.26

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- la sección `Pagos` deja de permitir edición; ante un error ahora corresponde eliminar el pago y registrarlo nuevamente
- se prepara la infraestructura base de auditoría para requests mutantes y se instrumenta `Pago` como primer caso de prueba
- el schema de auditoría corrige `post_resgistro` a `post_registro` y agrega `timestamp`, `ip` y `userAgent` en `Log`

## 1.8.25

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- las tablas de `Protagonistas`, `Adultos`, `Responsables`, `Pagos`, `Eventos`, `Consejos` y `Comisiones` agregan la opción `Incluir borrados` para `JEFATURA`, `SECRETARIA_TESORERIA`, `ADM` y `DEV` con scope de grupo
- el frontend muestra el estado de borrado en esas tablas y deja los registros eliminados en modo auditoría, sin permitir reeditarlos o volver a eliminarlos
- el backend unifica el soft delete sobre `borrado` y elimina el uso duplicado de `deleted`

## 1.8.24

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- `PROTAGONISTA` y `RESPONSABLE` dejan de tener acceso al módulo `Consejos` desde sidebar y por URL

## 1.8.23

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- `RESPONSABLE` ve en `Responsables` solo el listado de co-responsables vinculados a sus mismos protagonistas
- la sección queda en modo consulta, sin acceso a `Relaciones`, `Responsabilidades`, `Crear`, `Editar` ni `Eliminar`

## 1.8.22

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- `RESPONSABLE` deja de ver en `Adultos` las columnas `Roles`, `Beca` y `Estado`, manteniendo la sección completamente en modo consulta

## 1.8.21

Fecha: 2026-03-18

### Ajustes funcionales relevantes

- el canvas de `Firma` vuelve a dibujar la imagen al terminar la carga del diálogo, corrigiendo el caso donde se veía una sola vez y luego quedaba en blanco

## 1.8.20

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- el diálogo de `Firma` en `Perfil` vuelve a consultar la firma cada vez que se abre, evitando mostrar un canvas vacío por estado cacheado

## 1.8.19

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la edición de `Firma` se mueve al `Perfil` propio del miembro
- el botón de firma deja de mostrarse en `Adultos` y sólo aparece cuando la cuenta está viendo su propio perfil

## 1.8.18

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `RESPONSABLE` pasa a ver en `Adultos` solo los educadores de las ramas de sus protagonistas vinculados y a `Jefatura`
- la sección `Adultos` queda en modo consulta para `RESPONSABLE`, sin acciones de crear, editar ni eliminar

## 1.8.17

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `RESPONSABLE` deja de ver en `Protagonistas` las columnas operativas `Beca` y `Estado`, manteniendo solo la información necesaria de consulta

## 1.8.16

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `RESPONSABLE` deja de ver en `Protagonistas` las acciones de `Crear`, `Editar`, `Eliminar` y `Pase`, quedando la sección en modo consulta

## 1.8.15

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- se agrega un `not-found` global de Next para que cualquier ruta inexistente muestre una pantalla consistente con el resto de los estados de acceso y error del dashboard

## 1.8.14

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `RESPONSABLE` obtiene acceso grueso a `Perfil`, `Adultos`, `Protagonistas`, `Responsables`, `Pagos`, `Eventos`, `Formaciones`, `Comisiones`, `Consejos` y `Calendario`
- las secciones no incluidas en esa lista permanecen bloqueadas para este rol

## 1.8.13

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la subsección `Comisión` dentro de `Eventos` agrega filtro de búsqueda en el selector de comisión

## 1.8.12

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `PROTAGONISTA` puede ingresar a `Comisiones` para consulta, pero mantiene ocultas las acciones de gestión como crear, editar, eliminar o administrar adultos

## 1.8.11

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `PROTAGONISTA` puede ingresar desde frontend a `Perfil`, `Pagos`, `Eventos`, `Formaciones`, `Consejos` y `Calendario`
- las rutas de perfil por `id` dejan de depender de acceso de gestión para permitir navegación compatible con protagonistas

## 1.8.10

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- se agrega el rol `AYUDANTE` con `scope GRUPO` para adultos comodín de grupo, alineado con los mismos permisos y accesos visibles de `JEFATURA`
- la asignación automática de adultos en el área `Jefatura` ahora usa `scope GRUPO`, diferenciando `Jefe -> JEFATURA` y `Ayudante -> AYUDANTE`

## 1.8.9

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- el acceso total del dashboard y los bypass de permisos visibles del frontend ahora dependen de `rol + scope GRUPO`, evitando que un rol fuerte mal scopiado herede acceso completo
- `ADM`, `DEV`, `JEFATURA`, `INTENDENCIA` y `SECRETARIA_TESORERIA` con `scope GRUPO` pasan a compartir el mismo acceso total visible en el frontend

## 1.8.8

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `Calendario` incorpora un filtro específico para cumpleaños por tipo de miembro: `Protagonistas`, `Responsables` o `Adultos`

## 1.8.7

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `Calendario` pasa a estar visible para todos los miembros autenticados
- el módulo de `Calendario` deja un único sistema de filtros mediante sidebar desplegable y elimina la duplicación del panel lateral fijo

## 1.8.6

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- el diálogo de `Asistencia` dentro del consejo suma un filtro específico para el listado de asistencias actuales

## 1.8.5

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- dentro de un consejo iniciado, la gestión de asistencia, secretaría, moderador y edición estructural del temario queda reservada a perfiles adultos
- la lista de oradores sigue visible para todos, pero solo el moderador asignado puede sumar o quitar oradores
- `debate`, `acuerdo` y `estado` del tema quedan restringidos a secretario y prosecretario tanto en frontend como en backend

## 1.8.4

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `Consejos` pasa a estar visible para todos los miembros autenticados
- dentro del listado de `Consejos`, cualquier miembro puede abrir e iniciar un consejo, pero solo adultos con permisos operativos pueden crear, editar y eliminar consejos
- el `Temario` sigue siendo visible, pero las acciones para agregar, editar o eliminar temas quedan reservadas a adultos

## 1.8.3

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- todos los botones `Eliminar` de las tablas principales del dashboard ahora muestran un diálogo de confirmación unificado con impacto de la acción
- `JEFATURA_RAMA` y `AYUDANTE_RAMA` ahora pueden ingresar a `Consejos` tanto desde sidebar como por URL manual

## 1.8.2

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- los buscadores globales de tablas pasan a usar los componentes nativos `IconField` e `InputIcon` de PrimeReact para asegurar que la lupa quede dentro del input

## 1.8.1

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- los inputs de búsqueda global en las tablas del dashboard ahora muestran la lupa dentro del recuadro y alineada a la derecha

## 1.8.0

Fecha: 2026-03-17

### Funcionalidades principales

- gestión de adultos participantes dentro de cada `Comisión`
- filtros server-side para `Eventos` y `Comisiones`

### Ajustes funcionales relevantes

- `Comisiones` ahora permite asociar evento y administrar participantes adultos desde la misma sección
- `Eventos` incorpora búsqueda global, filtro por tipo y rango de fechas consumidos desde backend
- `Comisiones` incorpora búsqueda global y filtro por evento, también resueltos desde backend

## 1.7.10

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `JEFATURA_RAMA` y `AYUDANTE_RAMA` ahora pueden ingresar a la sección `Comisiones`
- la vista de `Comisiones` alinea sus botones de crear, editar y eliminar con los permisos reales del usuario autenticado

## 1.7.9

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `APFs habilitados` dentro de `Formaciones` pasa a ser desplegable
- el botón de cierre de asignaciones APF se simplifica y ahora muestra solo el icono `X`

## 1.7.8

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `Modo edición` en `Formaciones` deja de ser global y pasa a manejarse por bloques independientes
- la gestión de `APFs habilitados` tiene su propio toggle de edición separado
- cada template de formación puede entrar o salir de edición sin afectar a los demás templates

## 1.7.7

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `Formaciones` ahora queda visible para todos los miembros autenticados, tanto desde sidebar como por URL manual
- solo las personas adultas pueden usar `Modo edición` e iniciar la inscripción a planes de formación
- la gestión de `APFs habilitados` queda restringida a `JEFATURA` y a adultos que ya tengan una asignación APF activa

## 1.7.6

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `JEFATURA_RAMA` y `AYUDANTE_RAMA` ahora pueden ingresar a `Eventos` y `Tipos de Evento` tanto desde sidebar como por URL manual
- al crear un evento, las afectaciones se resuelven automaticamente segun el rol autenticado para evitar altas fuera de scope
- en backend las operaciones sobre eventos quedan recortadas a eventos que afecten la rama del usuario cuando se trata de roles de rama

## 1.7.5

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- `JEFATURA_RAMA` y `AYUDANTE_RAMA` ahora pueden ingresar tambien a las subsecciones `Conceptos` y `Métodos` de pagos
- el acceso por URL manual a `/dashboard/conceptos-pago` y `/dashboard/metodos-pago` queda alineado con el acceso desde la interfaz

## 1.7.4

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `Pagos` ahora queda visible para `JEFATURA_RAMA` y `AYUDANTE_RAMA` con scope `RAMA`
- la tabla de pagos incorpora una columna adicional con la fecha de creación del registro
- el frontend queda alineado con el filtrado backend de pagos por protagonistas, adultos y responsables de la rama

## 1.7.3

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `Responsables` ahora queda visible para `JEFATURA_RAMA` y `AYUDANTE_RAMA` con scope `RAMA`
- el acceso visual del frontend queda alineado con el filtrado backend de responsables por protagonistas de la rama
- se preparan los datos de prueba para validar responsables y relaciones familiares por rama

## 1.7.2

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- la sección `Adultos` ahora queda visible también para `AYUDANTE_RAMA` con scope `RAMA`
- `JEFATURA_RAMA` y `AYUDANTE_RAMA` pueden ingresar por sidebar o URL manual a `Adultos`
- el filtrado de adultos por rama sigue resuelto en backend según la entidad del scope del usuario

## 1.7.1

Fecha: 2026-03-17

### Ajustes funcionales relevantes

- jefatura de rama con scope `RAMA` ahora puede ver todas las secciones del dashboard desde el frontend
- la visibilidad de sidebar y rutas protegidas se alinea para `JEFATURA_RAMA` igual que para jefatura general
- protagonistas mantiene el filtrado backend por rama usando el scope del usuario autenticado

## 1.7.0

Fecha: 2026-03-17

### Funcionalidades principales

- se incorpora una matriz centralizada de acceso por rol y scope para rutas y sidebar del dashboard
- el frontend ahora muestra una vista `NotAllowed` cuando se intenta acceder por URL a una seccion no habilitada
- jefatura con scope grupo pasa a tener acceso total de lectura y CRUD en las secciones protegidas del dashboard

## 1.6.2

Fecha: 2026-03-16

### Ajustes funcionales relevantes

- el límite local de adjuntos en Formaciones se alinea con el backend y pasa a 50 MB
- el mensaje preventivo de la interfaz ahora informa correctamente el nuevo máximo permitido

## 1.6.1

Fecha: 2026-03-16

### Ajustes funcionales relevantes

- se mejora la carga de adjuntos de formacion para tolerar requests JSON mas grandes en la API
- el frontend ahora muestra un mensaje claro cuando el archivo supera el tamaño permitido por el servidor
- se evita la promesa rechazada sin capturar al fallar una subida de adjuntos

## 1.6.0

Fecha: 2026-03-16

### Funcionalidades principales

- nueva sección `Formaciones` en la sidebar
- ABM inicial de templates de formación desde el frontend
- gestión de APFs habilitados con decisión asociada a consejo

### Ajustes funcionales relevantes

- se incorpora la tabla histórica `AsignacionAPF` para determinar qué adultos pueden actuar como APF
- la inscripción a planes de desempeño también puede iniciarse desde la nueva sección `Formaciones`
- los templates permiten editar estructura, textos, adjuntos y estado desde una sola pantalla
- los adjuntos de formación ahora pueden cargarse, descargarse y eliminarse desde la UI
- la pantalla distingue lectura general de templates y gestión exclusiva para personas adultas

## 1.5.0

Fecha: 2026-03-16

### Funcionalidades principales

- nueva seccion de formacion dentro del perfil adulto
- inicio de plan de desempeño propio con seleccion de plantilla y APF
- validacion de competencias del plan por parte del APF

### Ajustes funcionales relevantes

- se agregan endpoints y permisos para templates de formacion y planes de desempeño
- el perfil adulto ahora muestra el plan cargado con niveles, competencias, comportamientos, aprendizajes y resultados esperados
- la edicion de validaciones queda restringida al APF asignado aunque la lectura del plan siga disponible desde el perfil
- se amplian los recursos de permisos del backend con `PLAN_DESEMPENO` y `ADJUNTO_FORMACION`

## 1.4.0

Fecha: 2026-03-15

### Funcionalidades principales

- asignacion de secretario y prosecretario por consejo
- restriccion de edicion del temario para secretario y prosecretario
- sincronizacion realtime del acta del consejo mientras se escribe

### Ajustes funcionales relevantes

- los cambios de debate, acuerdo y estado se emiten y persisten con debounce de 500 ms
- el workspace del consejo ahora muestra los cargos de secretaria junto al moderador

## 1.3.3

Fecha: 2026-03-15

### Ajustes funcionales relevantes

- el panel de oradores ahora puede minimizarse a una vista compacta
- en estado minimizado se conserva el titulo y el acceso rapido para levantar o bajar la mano
- se agrega un control directo para volver a expandir el panel

## 1.3.2

Fecha: 2026-03-15

### Ajustes funcionales relevantes

- mejora de compatibilidad del realtime de consejos en produccion al permitir fallback de transporte en Socket.IO
- la conexion deja de depender de websocket puro y tolera despliegues con proxy que requieren polling inicial

## 1.3.1

Fecha: 2026-03-15

### Ajustes funcionales relevantes

- correccion del arrastre del panel de oradores en navegadores de escritorio
- el movimiento del panel ya no depende del ancho de la ventana para habilitarse
- se evita que la seleccion de texto interfiera al mover el panel

## 1.3.0

Fecha: 2026-03-15

### Funcionalidades principales

- panel flotante de oradores movible en desktop
- panel flotante de oradores redimensionable en desktop
- reordenamiento drag-and-drop de oradores para el moderador con sincronizacion realtime

### Ajustes funcionales relevantes

- el backend incorpora un evento realtime especifico para reordenar la lista de oradores
- el orden nuevo se replica para todos los usuarios conectados al mismo consejo

## 1.2.1

Fecha: 2026-03-15

### Ajustes funcionales relevantes

- correccion de la numeracion visible en la lista de oradores para conservar el orden historico de alta
- los ultimos agregados siguen viendose arriba, pero el primer anotado mantiene el numero 1

## 1.2.0

Fecha: 2026-03-15

### Funcionalidades principales

- el moderador de consejo puede agregar oradores directamente desde la asistencia actual
- la seleccion de asistencia excluye automaticamente miembros que ya estan en la lista de oradores

### Ajustes funcionales relevantes

- el panel flotante de oradores ahora combina manos levantadas y alta manual desde asistencia
- se mantiene la logica realtime sin duplicar participantes en la cola

## 1.10.9

Fecha: 2026-03-18

### Ajustes funcionales

- los editores de Consejo y Ciclo de Programa amplían la barra de herramientas con sangría, color de texto, resaltado y limpieza de formato.
- se deja de recortar (`trim`) el contenido rico de debate/acuerdo y de las etapas del ciclo al guardar, para preservar exactamente el HTML del editor.
- el PDF de ciclo queda alineado al HTML enriquecido (títulos, subtítulos, estilos y listas) para una salida más fiel al contenido cargado.

## 1.10.8

Fecha: 2026-03-18

### Ajustes funcionales

- el botón `Exportar PDF` ahora reutiliza el `FilePreviewDialog` común: el PDF se genera, se muestra en preview y desde allí también se puede descargar.

## 1.10.7

Fecha: 2026-03-18

### Funcionalidades nuevas

- incorporación del botón `Exportar PDF` en el detalle de un ciclo de programa para bajar una versión impresa del ciclo, sus bitácoras y los eventos asociados.

### Ajustes de integración

- la API del ciclo expone un endpoint `GET /ciclos-programa/:id/export/pdf` firmado por los permisos de lectura y el cliente lo descarga automáticamente en una nueva pestaña.

## 1.10.6

Fecha: 2026-03-18

### Correcciones

- la navegación lateral del dashboard vuelve a refrescar correctamente el contenido al cambiar de sección sin requerir `F5`
- los selectores de `Asignar moderador` y `Asignar secretaria` dentro de consejo abierto ya se renderizan por encima del footer del dialog
- la bitácora de `Ciclos de Programa` ahora respeta listas y sangrías en modo vista cuando el contenido fue escrito con formato enriquecido

## 1.1.0

Fecha: 2026-03-15

### Funcionalidades principales

- asignacion de moderador dentro del detalle de cada consejo
- lista de oradores en tiempo real visible dentro del consejo
- manos levantadas para asistentes con moderacion controlada
- conexion websocket por sala de consejo, activa solo mientras el usuario permanece en esa vista

### Ajustes funcionales relevantes

- nuevo panel flotante para seguimiento de oradores y participaciones
- integracion de estado realtime con permisos del usuario autenticado
- base preparada para futuras dinamicas en vivo dentro de consejos

## 1.0.0

Fecha: 2026-03-15

### Funcionalidades principales

- inicio de sesion con usuario, email o DNI
- dashboard con navegacion lateral por modulos
- gestion de protagonistas, adultos y responsables
- gestion de relaciones y vinculos familiares
- gestion de pagos, conceptos, metodos y cuentas de dinero
- generacion y envio de comprobantes de pago por WhatsApp
- gestion de eventos, comisiones, consejos y perfil
- calendario con vistas mensual, semestral y anual
- calendario con eventos, cumpleaños y filtros laterales
- reportes de version visibles desde la aplicacion

### Ajustes visuales relevantes

- login personalizado con logo y nombre del grupo
- sidebar institucional con logo, nombre del grupo y version clickeable
- calendario adaptado al tema de PrimeReact
