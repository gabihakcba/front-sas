# Changelog

Todas las versiones deben listarse de mas nueva a mas vieja.

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
