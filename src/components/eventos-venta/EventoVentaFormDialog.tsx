'use client';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { EventoVentaFormValues } from '@/types/eventos-venta';

interface EventoVentaFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  error: string;
  values: EventoVentaFormValues;
  onHide: () => void;
  onChange: (values: EventoVentaFormValues) => void;
  onSubmit: () => void;
}

export function EventoVentaFormDialog({
  visible,
  mode,
  loading,
  error,
  values,
  onHide,
  onChange,
  onSubmit,
}: EventoVentaFormDialogProps) {
  return (
    <Dialog
      header={mode === 'create' ? 'Nuevo evento de venta' : 'Editar evento de venta'}
      visible={visible}
      onHide={onHide}
      style={{ width: 'min(42rem, calc(100vw - 2rem))' }}
    >
      <div className="flex flex-col gap-3">
        <InputText
          value={values.nombre}
          onChange={(event) => onChange({ ...values, nombre: event.target.value })}
          placeholder="Nombre"
        />
        <InputTextarea
          value={values.descripcion}
          onChange={(event) =>
            onChange({ ...values, descripcion: event.target.value })
          }
          placeholder="Descripción"
          rows={3}
          autoResize
        />
        <Calendar
          value={values.fechaEvento}
          onChange={(event) =>
            onChange({
              ...values,
              fechaEvento: event.value instanceof Date ? event.value : null,
            })
          }
          showButtonBar
          dateFormat="dd/mm/yy"
          placeholder="Fecha del evento"
        />
        <InputTextarea
          value={values.notas}
          onChange={(event) => onChange({ ...values, notas: event.target.value })}
          placeholder="Notas"
          rows={4}
          autoResize
        />
        {error ? <Message severity="error" text={error} /> : null}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            iconPos="right"
            outlined
            size="small"
            onClick={onHide}
          />
          <Button
            type="button"
            label={mode === 'create' ? 'Crear' : 'Guardar'}
            icon="pi pi-check"
            iconPos="right"
            outlined
            size="small"
            loading={loading}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
}
