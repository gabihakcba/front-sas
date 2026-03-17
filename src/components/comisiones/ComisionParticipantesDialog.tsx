'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { ComisionAdultOption } from '@/types/comisiones';

interface Props {
  visible: boolean;
  submitting: boolean;
  adultos: ComisionAdultOption[];
  selectedIds: number[];
  error: string;
  onHide: () => void;
  onChange: (ids: number[]) => void;
  onSubmit: () => void;
}

export function ComisionParticipantesDialog(props: Props) {
  const selectedAdults = props.adultos.filter((adulto) =>
    props.selectedIds.includes(adulto.Miembro.id),
  );

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
      header="Participantes adultos"
      footer={footer}
      className="w-full max-w-3xl"
      modal
    >
      <div className="flex flex-col gap-4">
        {props.error ? <Message severity="error" text={props.error} /> : null}
        <MultiSelect
          value={props.selectedIds}
          options={props.adultos}
          optionLabel="Miembro.apellidos"
          optionValue="Miembro.id"
          filter
          display="comma"
          placeholder="Seleccionar adultos"
          className="w-full"
          itemTemplate={(option: ComisionAdultOption) =>
            `${option.Miembro.apellidos}, ${option.Miembro.nombre} (${option.Miembro.dni})`
          }
          onChange={(event: MultiSelectChangeEvent) =>
            props.onChange((event.value as number[]) ?? [])
          }
        />
        <div className="flex flex-col gap-2">
          <label>Seleccionados</label>
          <div className="max-h-56 overflow-y-auto rounded border border-surface-300 p-2">
            {selectedAdults.length === 0 ? (
              <span className="text-sm text-color-secondary">
                No hay adultos seleccionados.
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedAdults.map((adulto) => (
                  <div
                    key={adulto.Miembro.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>
                      {adulto.Miembro.apellidos}, {adulto.Miembro.nombre} (
                      {adulto.Miembro.dni})
                    </span>
                    <Button
                      type="button"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      severity="danger"
                      onClick={() =>
                        props.onChange(
                          props.selectedIds.filter((id) => id !== adulto.Miembro.id),
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
