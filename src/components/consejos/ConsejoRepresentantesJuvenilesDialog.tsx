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
import { ConsejoRepresentanteJuvenilItem } from '@/types/consejos';

interface ConsejoRepresentantesJuvenilesDialogProps {
  visible: boolean;
  loading: boolean;
  searching: boolean;
  submitting: boolean;
  error: string;
  successMessage: string;
  assigned: ConsejoRepresentanteJuvenilItem[];
  options: ConsejoRepresentanteJuvenilItem[];
  onHide: () => void;
  onSearch: (value: string) => void;
  onAssign: (memberId: number) => void;
  onRemove: (memberId: number) => void;
}

export function ConsejoRepresentantesJuvenilesDialog({
  visible,
  loading,
  searching,
  submitting,
  error,
  successMessage,
  assigned,
  options,
  onHide,
  onSearch,
  onAssign,
  onRemove,
}: ConsejoRepresentantesJuvenilesDialogProps) {
  const [search, setSearch] = useState('');
  const [currentAssignedSearch, setCurrentAssignedSearch] = useState('');

  const filteredAssigned = useMemo(() => {
    const normalizedSearch = currentAssignedSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return assigned;
    }

    return assigned.filter((item) => {
      const fullName =
        `${item.apellidos}, ${item.nombre}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        item.dni.toLowerCase().includes(normalizedSearch) ||
        (item.ramaActualNombre ?? '').toLowerCase().includes(normalizedSearch)
      );
    });
  }, [assigned, currentAssignedSearch]);

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
      header="Representantes juveniles"
      footer={footer}
      {...getResponsiveDialogProps('72rem')}
    >
      {error ? <Message severity="error" text={error} className="mb-3" /> : null}
      {successMessage ? (
        <Message severity="success" text={successMessage} className="mb-3" />
      ) : null}

      <div className="grid max-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Asignados</h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="consejo-representantes-current-search">
                Filtrar asignados
              </label>
              <IconField iconPosition="right" className="w-full">
                <InputText
                  id="consejo-representantes-current-search"
                  value={currentAssignedSearch}
                  onChange={(event) => setCurrentAssignedSearch(event.target.value)}
                  placeholder="Nombre, apellido, DNI o rama"
                  className="w-full"
                />
                <InputIcon className="pi pi-search" />
              </IconField>
            </div>
          </div>

          {loading ? <div>Cargando representantes...</div> : null}

          <ScrollPanel className="h-96 w-full">
            <div className="flex flex-col gap-2 pr-3">
              {filteredAssigned.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded border px-3 py-2"
                >
                  <div>
                    <div className="font-medium">
                      {item.apellidos}, {item.nombre}
                    </div>
                    <div className="text-sm">
                      {item.ramaActualNombre ?? 'Sin rama activa'} · DNI {item.dni}
                    </div>
                  </div>
                  <Button
                    type="button"
                    label="Quitar"
                    icon="pi pi-times"
                    iconPos="right"
                    outlined
                    size="small"
                    severity="danger"
                    disabled={submitting}
                    onClick={() => onRemove(item.id)}
                  />
                </div>
              ))}
              {!loading && assigned.length === 0 ? (
                <div>No hay representantes juveniles asignados.</div>
              ) : null}
              {!loading && assigned.length > 0 && filteredAssigned.length === 0 ? (
                <div>No hay representantes asignados que coincidan con el filtro.</div>
              ) : null}
            </div>
          </ScrollPanel>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Elegibles</h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="consejo-representantes-search">
                Buscar protagonista
              </label>
              <IconField iconPosition="right" className="w-full">
                <InputText
                  id="consejo-representantes-search"
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

          {searching ? <div>Buscando protagonistas...</div> : null}

          <ScrollPanel className="h-96 w-full">
            <div className="flex min-h-0 flex-col gap-2 pr-3">
              {options.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded border px-3 py-2"
                >
                  <div>
                    <div className="font-medium">
                      {item.apellidos}, {item.nombre}
                    </div>
                    <div className="text-sm">
                      {item.ramaActualNombre ?? 'Sin rama activa'} · DNI {item.dni}
                    </div>
                  </div>
                  <Button
                    type="button"
                    label={item.alreadyAssigned ? 'Asignado' : 'Asignar'}
                    icon={item.alreadyAssigned ? 'pi pi-check' : 'pi pi-plus'}
                    iconPos="right"
                    outlined
                    size="small"
                    disabled={submitting || item.alreadyAssigned}
                    onClick={() => onAssign(item.id)}
                  />
                </div>
              ))}
              {!searching && options.length === 0 ? (
                <div>No se encontraron protagonistas elegibles.</div>
              ) : null}
            </div>
          </ScrollPanel>
        </div>
      </div>
    </Dialog>
  );
}
