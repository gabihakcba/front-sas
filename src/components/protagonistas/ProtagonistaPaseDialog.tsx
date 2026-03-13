'use client';

import { ChangeEvent } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import {
  ProtagonistaPaseValues,
  RamaOption,
} from '@/types/protagonistas';

interface ProtagonistaPaseDialogProps {
  visible: boolean;
  loading: boolean;
  submitting: boolean;
  ramas: RamaOption[];
  values: ProtagonistaPaseValues;
  onHide: () => void;
  onSubmit: () => void;
  onChange: (values: ProtagonistaPaseValues) => void;
}

export function ProtagonistaPaseDialog({
  visible,
  loading,
  submitting,
  ramas,
  values,
  onHide,
  onSubmit,
  onChange,
}: ProtagonistaPaseDialogProps) {
  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        iconPos="right"
        outlined
        size="small"
        onClick={onHide}
        disabled={submitting}
      />
      <Button
        type="button"
        label="Registrar pase"
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={onSubmit}
        loading={submitting}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Registrar pase"
      footer={footer}
      className="w-full max-w-md"
      modal
    >
      {loading ? (
        <div className="py-4">Cargando formulario...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="pase-rama">Nueva rama</label>
            <Dropdown
              id="pase-rama"
              value={values.idRama}
              options={ramas}
              optionLabel="nombre"
              optionValue="id"
              onChange={(event: DropdownChangeEvent) =>
                onChange({
                  ...values,
                  idRama: event.value as number | null,
                })
              }
              placeholder="Seleccioná una rama"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pase-fecha">Fecha de pase</label>
            <InputText
              id="pase-fecha"
              type="date"
              value={values.fechaIngresoRama}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...values,
                  fechaIngresoRama: event.target.value,
                })
              }
              className="w-full"
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
