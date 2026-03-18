'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { EventoOption, EventoRamaOption } from '@/types/eventos';

interface Props {
  visible: boolean;
  submitting: boolean;
  areas: EventoOption[];
  ramas: EventoRamaOption[];
  selectedAreaIds: number[];
  selectedRamaIds: number[];
  error: string;
  onHide: () => void;
  onAreaChange: (ids: number[]) => void;
  onRamaChange: (ids: number[]) => void;
  onSubmit: () => void;
}

export function EventoAfectacionesDialog(props: Props) {
  const selectedAreas = props.areas.filter((area) =>
    props.selectedAreaIds.includes(area.id),
  );
  const selectedRamas = props.ramas.filter((rama) =>
    props.selectedRamaIds.includes(rama.id),
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" iconPos="right" outlined size="small" onClick={props.onHide} disabled={props.submitting} />
      <Button type="button" label="Guardar" icon={props.submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'} iconPos="right" outlined size="small" onClick={props.onSubmit} loading={props.submitting} />
    </div>
  );

  return (
    <Dialog
      visible={props.visible}
      onHide={props.onHide}
      header="Áreas y ramas afectadas"
      footer={footer}
      {...getResponsiveDialogProps('48rem')}
    >
      <div className="flex flex-col gap-4">
        {props.error ? <Message severity="error" text={props.error} /> : null}
        <div className="flex flex-col gap-2">
          <label>Áreas</label>
          <MultiSelect value={props.selectedAreaIds} options={props.areas} optionLabel="nombre" optionValue="id" filter display="comma" placeholder="Seleccionar áreas" className="w-full" onChange={(event: MultiSelectChangeEvent) => props.onAreaChange((event.value as number[]) ?? [])} appendTo="self" />
          <div className="max-h-40 overflow-y-auto rounded border border-surface-300 p-2">
            {selectedAreas.length === 0 ? (
              <span className="text-sm text-color-secondary">
                No hay áreas seleccionadas.
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{area.nombre}</span>
                    <Button
                      type="button"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      severity="danger"
                      onClick={() =>
                        props.onAreaChange(
                          props.selectedAreaIds.filter((id) => id !== area.id),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label>Ramas</label>
          <MultiSelect value={props.selectedRamaIds} options={props.ramas} optionLabel="nombre" optionValue="id" filter display="comma" placeholder="Seleccionar ramas" className="w-full" onChange={(event: MultiSelectChangeEvent) => props.onRamaChange((event.value as number[]) ?? [])} appendTo="self" />
          <div className="max-h-40 overflow-y-auto rounded border border-surface-300 p-2">
            {selectedRamas.length === 0 ? (
              <span className="text-sm text-color-secondary">
                No hay ramas seleccionadas.
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedRamas.map((rama) => (
                  <div
                    key={rama.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{rama.nombre}</span>
                    <Button
                      type="button"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      severity="danger"
                      onClick={() =>
                        props.onRamaChange(
                          props.selectedRamaIds.filter((id) => id !== rama.id),
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
