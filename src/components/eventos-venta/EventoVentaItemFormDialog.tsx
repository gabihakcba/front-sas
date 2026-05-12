'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { EventoVentaItemFormValues } from '@/types/eventos-venta';

interface EventoVentaItemFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  error: string;
  values: EventoVentaItemFormValues;
  onHide: () => void;
  onChange: (values: EventoVentaItemFormValues) => void;
  onSubmit: () => void;
}

export function EventoVentaItemFormDialog({
  visible,
  mode,
  loading,
  error,
  values,
  onHide,
  onChange,
  onSubmit,
}: EventoVentaItemFormDialogProps) {
  return (
    <Dialog
      header={mode === 'create' ? 'Nuevo item' : 'Editar item'}
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
        <InputText
          value={values.descripcion}
          onChange={(event) =>
            onChange({ ...values, descripcion: event.target.value })
          }
          placeholder="Descripción"
        />
        <InputNumber
          value={values.precioUnitario ? Number(values.precioUnitario) : null}
          onValueChange={(event: InputNumberValueChangeEvent) =>
            onChange({
              ...values,
              precioUnitario:
                event.value !== null && event.value !== undefined
                  ? String(event.value)
                  : '',
            })
          }
          mode="currency"
          currency="ARS"
          locale="es-AR"
          placeholder="Precio unitario"
        />
        <div className="flex flex-col gap-2">
          <span>Ofertas opcionales</span>
          {values.ofertas.map((oferta, index) => (
            <div key={`oferta-${index}`} className="flex flex-col gap-2 md:flex-row">
              <InputNumber
                value={oferta.cantidad ? Number(oferta.cantidad) : null}
                onValueChange={(event: InputNumberValueChangeEvent) => {
                  const next = [...values.ofertas];
                  next[index] = {
                    ...next[index],
                    cantidad:
                      event.value !== null && event.value !== undefined
                        ? String(event.value)
                        : '',
                  };
                  onChange({ ...values, ofertas: next });
                }}
                useGrouping={false}
                placeholder="Cantidad"
              />
              <InputNumber
                value={oferta.precioTotal ? Number(oferta.precioTotal) : null}
                onValueChange={(event: InputNumberValueChangeEvent) => {
                  const next = [...values.ofertas];
                  next[index] = {
                    ...next[index],
                    precioTotal:
                      event.value !== null && event.value !== undefined
                        ? String(event.value)
                        : '',
                  };
                  onChange({ ...values, ofertas: next });
                }}
                mode="currency"
                currency="ARS"
                locale="es-AR"
                placeholder="Precio total"
              />
              <InputText
                value={oferta.descripcion}
                onChange={(event) => {
                  const next = [...values.ofertas];
                  next[index] = {
                    ...next[index],
                    descripcion: event.target.value,
                  };
                  onChange({ ...values, ofertas: next });
                }}
                placeholder="Descripción"
              />
              <Button
                type="button"
                label="Quitar"
                icon="pi pi-trash"
                iconPos="right"
                outlined
                size="small"
                severity="danger"
                onClick={() =>
                  onChange({
                    ...values,
                    ofertas: values.ofertas.filter((_, current) => current !== index),
                  })
                }
              />
            </div>
          ))}
          <Button
            type="button"
            label="Agregar oferta"
            icon="pi pi-plus"
            iconPos="right"
            outlined
            size="small"
            onClick={() =>
              onChange({
                ...values,
                ofertas: [
                  ...values.ofertas,
                  { cantidad: '', precioTotal: '', descripcion: '' },
                ],
              })
            }
          />
        </div>
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
