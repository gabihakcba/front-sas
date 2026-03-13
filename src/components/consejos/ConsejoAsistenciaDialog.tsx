'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import {
  ConsejoAsistenciaItem,
  ConsejoAsistenciaOption,
} from '@/types/consejos';

interface ConsejoAsistenciaDialogProps {
  visible: boolean;
  canManage: boolean;
  loading: boolean;
  searching: boolean;
  error: string;
  successMessage: string;
  asistencias: ConsejoAsistenciaItem[];
  options: ConsejoAsistenciaOption[];
  onHide: () => void;
  onSearch: (value: string) => void;
  onAdd: (idMiembro: number) => void;
}

export function ConsejoAsistenciaDialog({
  visible,
  canManage,
  loading,
  searching,
  error,
  successMessage,
  asistencias,
  options,
  onHide,
  onSearch,
  onAdd,
}: ConsejoAsistenciaDialogProps) {
  const [search, setSearch] = useState('');

  const footer = (
    <div className="flex justify-end">
      <Button
        type="button"
        label="Cerrar"
        icon="pi pi-times"
        iconPos="right"
        outlined
        size="small"
        onClick={onHide}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Asistencia"
      footer={footer}
      className="w-full max-w-5xl"
      modal
    >
      {error ? <Message severity="error" text={error} className="mb-3" /> : null}
      {successMessage ? (
        <Message severity="success" text={successMessage} className="mb-3" />
      ) : null}

      <div className="grid max-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Asistencias actuales</h3>
          {loading ? <div>Cargando asistencias...</div> : null}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {asistencias.map((item) => (
              <div key={item.id} className="rounded border px-3 py-2">
                <div className="font-medium">
                  {item.Miembro.apellidos}, {item.Miembro.nombre}
                </div>
                <div className="text-sm">{item.descripcion}</div>
              </div>
            ))}
            {!loading && asistencias.length === 0 ? (
              <div>No hay asistencias registradas.</div>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <h3 className="text-lg font-semibold">Agregar asistencia</h3>
          <div className="sticky top-0 z-10 bg-white">
            <div className="flex flex-col gap-2 pb-3">
              <label htmlFor="consejo-asistencia-search">Buscar miembro</label>
              <InputText
                id="consejo-asistencia-search"
                value={search}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearch(value);
                  onSearch(value);
                }}
                placeholder="Nombre, apellido o DNI"
              />
            </div>
          </div>
          {searching ? <div>Buscando miembros...</div> : null}
          <div className="flex min-h-0 flex-col gap-2 overflow-y-auto">
            {options.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded border px-3 py-2"
              >
                <div>
                  <div className="font-medium">{item.displayLabel}</div>
                  <div className="text-sm">{item.categoryLabel}</div>
                </div>
                {canManage ? (
                  <Button
                    type="button"
                    label="Agregar"
                    icon="pi pi-plus"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() => onAdd(item.id)}
                  />
                ) : null}
              </div>
            ))}
            {!searching && options.length === 0 ? (
              <div>No se encontraron miembros para agregar.</div>
            ) : null}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
