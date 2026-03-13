# AGENTS.md (Frontend)

## Project Overview

Aplicación cliente desarrollada con la última versión de Next.js (App Router). La interfaz de usuario se construye utilizando componentes de PrimeReact, estilizados estructuralmente con TailwindCSS.

## Code Style Guidelines

- **TypeScript Estricto:** Está estrictamente prohibido el uso del tipo `any`. Siempre debes crear `Interfaces` o `Types` específicos para tipar las propiedades de los componentes, las respuestas de Axios y el estado local.
- **Estándar de Botones (PrimeReact):** Para mantener la consistencia visual, todos los componentes `<Button />` deben ser pequeños y delineados por defecto. Siempre que se renderice un botón, debe incluir las propiedades: `size="small"` y `outlined`. Si el botón lleva un icono, este debe renderizarse a la derecha utilizando `iconPos="right"`.
- **Manejo de Fechas:** Está absolutamente prohibido importar o instalar `moment`. Todo el manejo, formateo y manipulación de fechas debe realizarse utilizando `dayjs`.
- **Comunicación HTTP:** Utilizar `axios` configurado con interceptores para enviar el token de sesión en cada petición.
- **Reponsive:** Las debe ser mobile first, el 90% de los usuarios utilizan dispositivos moviles, sobre todo las tablas deben ser utilizables y leibles en mobile.

## Development Commands

- Instalar dependencias: `npm install`
- Iniciar servidor de desarrollo: `npm run dev`
- Compilar para producción: `npm run build`
- Linter: `npm run lint`

## Component Structure & Clean Architecture

- Priorizar _Server Components_ para la carga de datos inicial y _Client Components_ (`"use client"`) solo donde la interactividad con PrimeReact o el manejo de estado (`useState`, `useEffect`) lo requiera.

* **Modularidad Estricta:** El proyecto sigue un patrón de separación de capas (Service-Hook Pattern). Los componentes de la interfaz gráfica deben ser "tontos" (presentacionales) y no deben contener lógica directa de llamadas a la API (Axios) ni manejo de estado complejo si puede ser extraído.
* **Data Fetching (Capa de Red):** Toda petición HTTP a la API debe vivir obligatoriamente en la carpeta `/queries`. Se debe crear un archivo por modelo o dominio (ej. `queries/users.ts`, `queries/eventos.ts`). Estos archivos solo exportan funciones asíncronas con Axios.
* **Lógica de Estado (Capa de Hooks):** Todo consumo de las funciones de `/queries` debe realizarse a través de Custom Hooks ubicados en la carpeta `/hooks`. Se debe crear un archivo por dominio (ej. `hooks/usersHooks.ts`). Los componentes UI solo deben importar e invocar estos hooks.
* **Paginación obligatoria:** Toda petición que devuelva colecciones de registros de un modelo o listados multi-registro debe paginarse del lado del backend. El tamaño por defecto es `10`.
* **Tablas del frontend:** Las tablas que consumen colecciones paginadas deben trabajar con paginación backend y mantener fijo `rows=10`. No deben descargar listas completas para paginar en cliente.

## Styling Guidelines (¡CRÍTICO!)

- **Estilos Nativos por Defecto:** Está estrictamente PROHIBIDO agregar clases de TailwindCSS, CSS en línea o archivos `.css`/`.module.css` adicionales para estilizar componentes a menos que el usuario lo solicite explícitamente.
- **Prioridad PrimeReact:** Debes confiar en los estilos, márgenes y comportamientos por defecto que proveen los componentes de PrimeReact.
- **Uso de Tailwind:** TailwindCSS solo se debe utilizar de forma mínima y general para layouts estructurales de alto nivel (ej. crear grillas para la página, o alinear elementos en un contenedor con `flex` o `grid`), NUNCA para sobrescribir la estética interna de un botón, tabla o input. PROHIBIDO el uso de Tailwind para estilos de botones, tablas o inputs y/o colores de fondo, sombras.
