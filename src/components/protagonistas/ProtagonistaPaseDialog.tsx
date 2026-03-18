'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getResponsiveDialogProps } from '@/lib/dialog';
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
      {...getResponsiveDialogProps('28rem')}
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
              appendTo="self"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pase-fecha">Fecha de pase</label>
            <Calendar
              id="pase-fecha"
              value={
                values.fechaIngresoRama
                  ? dayjs(values.fechaIngresoRama, 'YYYY-MM-DD').toDate()
                  : null
              }
              onChange={(event) =>
                onChange({
                  ...values,
                  fechaIngresoRama:
                    event.value instanceof Date
                      ? dayjs(event.value).format('YYYY-MM-DD')
                      : '',
                })
              }
              dateFormat="dd/mm/yy"
              showButtonBar
              className="w-full"
              inputClassName="w-full"
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
