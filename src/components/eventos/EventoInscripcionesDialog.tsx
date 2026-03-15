'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { EventoMiembroOption } from '@/types/eventos';

interface Props {
  visible: boolean;
  submitting: boolean;
  miembros: EventoMiembroOption[];
  selectedIds: number[];
  error: string;
  onHide: () => void;
  onChange: (ids: number[]) => void;
  onSubmit: () => void;
}

export function EventoInscripcionesDialog({
  visible,
  submitting,
  miembros,
  selectedIds,
  error,
  onHide,
  onChange,
  onSubmit,
}: Props) {
  const selectedMiembros = miembros.filter((miembro) =>
    selectedIds.includes(miembro.id),
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" iconPos="right" outlined size="small" onClick={onHide} disabled={submitting} />
      <Button type="button" label="Guardar" icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'} iconPos="right" outlined size="small" onClick={onSubmit} loading={submitting} />
    </div>
  );

  return (
    <Dialog visible={visible} onHide={onHide} header="Inscripciones" footer={footer} className="w-full max-w-3xl" modal>
      <div className="flex flex-col gap-4">
        {error ? <Message severity="error" text={error} /> : null}
        <MultiSelect
          value={selectedIds}
          options={miembros}
          optionLabel="apellidos"
          optionValue="id"
          filter
          display="comma"
          placeholder="Seleccionar miembros"
          className="w-full"
          itemTemplate={(option: EventoMiembroOption) =>
            `${option.apellidos}, ${option.nombre} (${option.dni})`
          }
          onChange={(event: MultiSelectChangeEvent) =>
            onChange((event.value as number[]) ?? [])
          }
        />
        <div className="flex flex-col gap-2">
          <label>Seleccionados</label>
          <div className="max-h-56 overflow-y-auto rounded border border-surface-300 p-2">
            {selectedMiembros.length === 0 ? (
              <span className="text-sm text-color-secondary">
                No hay miembros seleccionados.
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedMiembros.map((miembro) => (
                  <div
                    key={miembro.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>
                      {miembro.apellidos}, {miembro.nombre} ({miembro.dni})
                    </span>
                    <Button
                      type="button"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      severity="danger"
                      onClick={() =>
                        onChange(selectedIds.filter((id) => id !== miembro.id))
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
