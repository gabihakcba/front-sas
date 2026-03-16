# Front SAS

Frontend del Sistema de Administracion Scout construido con Next.js App Router y PrimeReact.

## Stack

- Next.js
- React
- PrimeReact
- TailwindCSS
- Axios
- Day.js

## Objetivo

Proveer la interfaz principal del sistema para la gestion de:

- autenticacion y acceso
- protagonistas, adultos y responsables
- relaciones familiares
- pagos, conceptos, metodos y cuentas de dinero
- eventos, comisiones y consejos
- perfil del miembro
- calendario con eventos y cumpleaños
- reportes de version dentro de la app

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Variables de entorno

Crear un archivo `.env.local` con al menos:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_GRUPO_NOMBRE="Grupo Scout Adalberto O. Lopez 494"
```

## Estructura

- `src/app`: rutas App Router
- `src/components`: componentes de interfaz
- `src/hooks`: logica de estado y consumo
- `src/queries`: capa de llamadas HTTP
- `src/types`: contratos TypeScript
- `src/data`: contenido estructurado de soporte, incluyendo reportes de version

## Versionado

- La version visible de la app vive en `package.json`
- El historial funcional para usuarios vive en `CHANGELOG.md`
- La fuente estructurada para renderizar reportes en pantalla vive en `src/data/version-reports.ts`

## Convencion operativa

Cada cambio funcional o correccion relevante del frontend debe actualizar:

1. `src/data/version-reports.ts`
2. `CHANGELOG.md`
3. `package.json` si corresponde subir version
