# Contexto del Proyecto

## 2. Arquitectura Frontend & Patrones

### B. Peticiones HTTP & Estado

### E. Estándar de Datos (Backend -> Frontend)

- **Listados (Tablas):** El backend debe devolver objetos **"Aplanados" (Flattened)** siempre que sea posible.
  - _Mal:_ `{ id: 1, Miembro: { nombre: "Juan", Rama: { nombre: "Manada" } } }`
  - _Bien:_ `{ id: 1, nombre: "Juan", rama: "Manada" }`
  - _Objetivo:_ Facilitar el binding en `DataTable` (`field="nombre"` en lugar de `field="Miembro.nombre"`) y reducir el procesamiento en el cliente.
