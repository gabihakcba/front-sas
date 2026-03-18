'use client';

import { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ScrollPanel } from 'primereact/scrollpanel';
import { getResponsiveDialogProps } from '@/lib/dialog';
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
  const [currentSearch, setCurrentSearch] = useState('');

  const filteredAsistencias = useMemo(() => {
    const normalizedSearch = currentSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return asistencias;
    }

    return asistencias.filter((item) => {
      const fullName =
        `${item.Miembro.apellidos}, ${item.Miembro.nombre}`.toLowerCase();
      const dni = item.Miembro.dni.toLowerCase();
      const descripcion = item.descripcion.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        dni.includes(normalizedSearch) ||
        descripcion.includes(normalizedSearch)
      );
    });
  }, [asistencias, currentSearch]);

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
      {...getResponsiveDialogProps('72rem')}
    >
      {error ? <Message severity="error" text={error} className="mb-3" /> : null}
      {successMessage ? (
        <Message severity="success" text={successMessage} className="mb-3" />
      ) : null}

      <div
        className={`grid max-h-[70vh] grid-cols-1 gap-4 ${
          canManage ? 'lg:grid-cols-2' : ''
        }`}
      >
        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Asistencias actuales</h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="consejo-asistencia-current-search">
                Filtrar asistencias actuales
              </label>
              <IconField iconPosition="right" className="w-full">
                <InputText
                  id="consejo-asistencia-current-search"
                  value={currentSearch}
                  onChange={(event) => setCurrentSearch(event.target.value)}
                  placeholder="Nombre, apellido, DNI o descripción"
                  className="w-full"
                />
                <InputIcon className="pi pi-search" />
              </IconField>
            </div>
          </div>
          {loading ? <div>Cargando asistencias...</div> : null}
          <ScrollPanel className="h-96 w-full">
            <div className="flex flex-col gap-2 pr-3">
              {filteredAsistencias.map((item) => (
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
              {!loading && asistencias.length > 0 && filteredAsistencias.length === 0 ? (
                <div>No hay asistencias que coincidan con el filtro.</div>
              ) : null}
            </div>
          </ScrollPanel>
        </div>

        {canManage ? (
          <div className="flex min-h-0 flex-col gap-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Agregar asistencia</h3>
              <div className="flex flex-col gap-2">
                <label htmlFor="consejo-asistencia-search">Buscar miembro</label>
                <IconField iconPosition="right" className="w-full">
                  <InputText
                    id="consejo-asistencia-search"
                    value={search}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSearch(value);
                      onSearch(value);
                    }}
                    placeholder="Nombre, apellido o DNI"
                    className="w-full"
                  />
                  <InputIcon className="pi pi-search" />
                </IconField>
              </div>
            </div>
            {searching ? <div>Buscando miembros...</div> : null}
            <ScrollPanel className="h-96 w-full">
              <div className="flex min-h-0 flex-col gap-2 pr-3">
                {options.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded border px-3 py-2"
                  >
                    <div>
                      <div className="font-medium">{item.displayLabel}</div>
                      <div className="text-sm">{item.categoryLabel}</div>
                    </div>
                    <Button
                      type="button"
                      label="Agregar"
                      icon="pi pi-plus"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => onAdd(item.id)}
                    />
                  </div>
                ))}
                {!searching && options.length === 0 ? (
                  <div>No se encontraron miembros para agregar.</div>
                ) : null}
              </div>
            </ScrollPanel>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
