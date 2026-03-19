'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { ReunionMiembroOption } from '@/types/reuniones';

interface Props {
  visible: boolean;
  submitting: boolean;
  miembros: ReunionMiembroOption[];
  selectedIds: number[];
  error: string;
  onHide: () => void;
  onChange: (ids: number[]) => void;
  onSubmit: () => void;
}

export function ReunionInvitadosDialog(props: Props) {
  const [filterQuery, setFilterQuery] = useState('');

  React.useEffect(() => {
    if (!props.visible) {
      setFilterQuery('');
    }
  }, [props.visible]);

  const selectedMiembros = props.miembros
    .filter((miembro) => props.selectedIds.includes(miembro.id))
    .filter((miembro) => {
      if (!filterQuery) return true;
      const search = filterQuery.toLowerCase();
      return (
        miembro.nombre.toLowerCase().includes(search) ||
        miembro.apellidos.toLowerCase().includes(search) ||
        miembro.dni.toLowerCase().includes(search)
      );
    });

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        iconPos="right"
        outlined
        size="small"
        onClick={props.onHide}
        disabled={props.submitting}
      />
      <Button
        type="button"
        label="Guardar"
        icon={props.submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={props.onSubmit}
        loading={props.submitting}
      />
    </div>
  );

  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header="Invitaciones"
      footer={footer}
      {...getResponsiveDialogProps('48rem')}
    >
      <div className="flex flex-col gap-4">
        {props.error ? <Message severity="error" text={props.error} /> : null}

        <MultiSelect
          value={props.selectedIds}
          options={props.miembros}
          optionLabel="apellidos"
          optionValue="id"
          filter
          display="comma"
          placeholder="Seleccionar invitados"
          className="w-full"
          appendTo="self"
          itemTemplate={(option: ReunionMiembroOption) =>
            `${option.apellidos}, ${option.nombre} (${option.dni})`
          }
          onChange={(event: MultiSelectChangeEvent) =>
            props.onChange((event.value as number[]) ?? [])
          }
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label>Seleccionados ({props.selectedIds.length})</label>
            {props.selectedIds.length > 0 && (
              <IconField iconPosition="right" className="w-full max-w-xs">
                <InputText
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filtrar seleccionados..."
                  className="w-full py-1 text-sm"
                />
                <InputIcon className="pi pi-search" />
              </IconField>
            )}
          </div>
          <div className="max-h-56 overflow-y-auto rounded border border-surface-300 p-2">
            {selectedMiembros.length === 0 ? (
              <span className="text-sm text-color-secondary">
                {filterQuery
                  ? 'No se encontraron resultados para el filtro.'
                  : 'No hay miembros seleccionados.'}
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedMiembros.map((miembro) => (
                  <div
                    key={miembro.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm">
                      {miembro.apellidos}, {miembro.nombre} ({miembro.dni})
                    </span>
                    <Button
                      type="button"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      severity="danger"
                      className="h-8 w-8"
                      onClick={() =>
                        props.onChange(
                          props.selectedIds.filter((id) => id !== miembro.id),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
