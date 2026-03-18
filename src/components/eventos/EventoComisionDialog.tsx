'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { EventoComisionOption } from '@/types/eventos';

interface Props {
  visible: boolean;
  submitting: boolean;
  comisiones: EventoComisionOption[];
  selectedId: number | null;
  error: string;
  onHide: () => void;
  onChange: (id: number | null) => void;
  onSubmit: () => void;
}

export function EventoComisionDialog(props: Props) {
  const selectedComision =
    props.comisiones.find((comision) => comision.id === props.selectedId) ?? null;

  const footer = (
    <div className="flex justify-end gap-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" iconPos="right" outlined size="small" onClick={props.onHide} disabled={props.submitting} />
      <Button type="button" label="Guardar" icon={props.submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'} iconPos="right" outlined size="small" onClick={props.onSubmit} loading={props.submitting} />
    </div>
  );

  return (
    <Dialog visible={props.visible} onHide={props.onHide} header="Asignar comisión" footer={footer} className="w-full max-w-xl" modal>
      <div className="flex flex-col gap-4">
        {props.error ? <Message severity="error" text={props.error} /> : null}
        <Dropdown value={props.selectedId} options={props.comisiones} optionLabel="nombre" optionValue="id" placeholder="Seleccionar comisión" showClear filter className="w-full" onChange={(event: DropdownChangeEvent) => props.onChange((event.value as number | null) ?? null)} />
        <div className="flex flex-col gap-2">
          <label>Asignada</label>
          <div className="max-h-40 overflow-y-auto rounded border border-surface-300 p-2">
            {selectedComision ? (
              <div className="flex items-center justify-between gap-2">
                <span>{selectedComision.nombre}</span>
                <Button
                  type="button"
                  icon="pi pi-times"
                  iconPos="right"
                  outlined
                  size="small"
                  severity="danger"
                  onClick={() => props.onChange(null)}
                />
              </div>
            ) : (
              <span className="text-sm text-color-secondary">
                No hay comisión asignada.
              </span>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
