import React from 'react';

export default function LogsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-slate-300">
      <i
        className="pi pi-cog pi-spin text-blue-500 mb-6"
        style={{ fontSize: '5rem' }}
      />
      <h1 className="text-4xl font-bold mb-2 text-white">
        Sección en Construcción
      </h1>
      <p className="text-xl text-slate-400">
        Estamos trabajando para traerte esta funcionalidad pronto.
      </p>
    </div>
  );
}
