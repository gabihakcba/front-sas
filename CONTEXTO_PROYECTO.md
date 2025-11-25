# 📘 SAS (Sistema de Administración Scout) - Contexto Frontend v3.0

Este documento define la arquitectura, componentes y estándares de UI/UX del frontend SAS.

## 1. Stack & Configuración

- **Framework:** Next.js 15 (App Router).
- **UI:** PrimeReact (v10+) + Tailwind CSS.
- **Theme:** Variables CSS semánticas (`--surface-card`, `--text-color`) mapeadas en `globals.css` para soportar Light/Dark mode sin hardcoding.
- **Estado:** React Query v5 (Server State) + React Context (Auth/Toast).
- **Fechas:** `dayjs` con plugins UTC/Timezone. **Librería centralizada:** `src/lib/date.ts`.

## 2. Componentes Core (La "Magia" de la Productividad)

### **A. `GenericDataTable` (v3.0 - Smart Table)**

_Componente inteligente que elimina el boilerplate de las listas._

- **Props Clave:** `columns`, `data`, `onEdit`, `onDelete`, `mobileDetailTemplate` (opcional, auto-generado si no está).
- **Configuración de Columnas (`TableColumn`):**
  - `field`: Clave del dato.
  - `transform`: `(row) => string` (Para combinar campos, ej: Nombre + Apellido).
  - `type`: `'text' | 'date' | 'boolean' | 'tag'`.
  - `tagConfig`: `{ getLabel: (v) => string, getSeverity: (v) => 'success'|'danger'... }`.
  - `textSeverity`: Color de texto semántico (`primary`, `danger`, etc.).
  - `hideOnMobile`: `boolean` (Oculta la columna en tabla y la muestra en el desplegable móvil).
- **Responsive:** Row Expansion habilitado por defecto para ver detalles en móvil.

### **B. `GenericForm` (v2.0 - Smart Form)**

_Constructor de formularios validado y estandarizado._

- **Props Clave:** `sections` (para FieldSets) o `fields` (plano), `onSubmit`, `actionType`.
- **Configuración de Campos:**
  - `type`: `'text' | 'password' | 'dropdown' | 'date' ...`.
  - `showIf`: `(values) => boolean` (Lógica condicional dinámica).
  - `rules`: Reglas nativas de RHF (`required`, `minLength`). **SIN Zod.**
- **Integración PrimeReact:**
  - Todo dentro de `<Controller />`.
  - `Password`: Usa `inputRef` para foco de error.
  - `Date`: Usa `dateFormat="dd/mm/yy"` visual, pero maneja objeto `Date`.

## 3. Patrones de Diseño & UX

### **A. Mobile First & Estilos**

- **Botones:** Siempre `size="small"`, `outlined`, `iconPos="right"`.
  - _Crear:_ `severity="success"`.
  - _Editar:_ `severity="warning"`.
  - _Eliminar:_ `severity="danger"`.
  - _Pase/Acción:_ `severity="warning"` o `info`.
- **Layout:** Sidebar fijo en desktop (`md:flex`), Drawer flotante en móvil (`visible` state).
- **Colores:** PROHIBIDO hardcodear hex o clases como `bg-slate-900`. Usar `bg-surface-card`, `text-text-main`.

### **B. Manejo de Fechas (UTC vs Local)**

- **Visualización:** `formatDate(row.fecha)` (Usa `dayjs.utc` para evitar desfase de zona).
- **Edición (Form):** `toCalendarDate(isoString)` (Convierte UTC a Local 00:00 para el picker).
- **Envío (API):** `toApiDate(dateObj)` (Convierte Local 00:00 a UTC puro para el back).

### **C. Consumo de API**

- **Listados:** Esperan DTOs "aplanados" (`{ rama: "Manada" }` en lugar de `{ Miembro: { ... } }`).
- **Dropdowns:** Binding directo de ID (`value: 1`). Nada de mapas manuales de strings.
