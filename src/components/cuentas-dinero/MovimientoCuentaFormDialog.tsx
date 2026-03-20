'use client';

import dayjs from 'dayjs';
import { ChangeEvent, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { getResponsiveDialogProps } from '@/lib/dialog';
import {
  MovimientoCuentaAdjuntoPayload,
  MovimientoCuentaFormValues,
  MovimientosCuentaOptionsResponse,
} from '@/types/cuentas-dinero';

interface MovimientoCuentaFormDialogProps {
  visible: boolean;
  loading: boolean;
  submitting: boolean;
  values: MovimientoCuentaFormValues;
  options: MovimientosCuentaOptionsResponse;
  error: string;
  onHide: () => void;
  onSubmit: (values: MovimientoCuentaFormValues) => void;
}

export function MovimientoCuentaFormDialog({
  visible,
  loading,
  submitting,
  values,
  options,
  error,
  onHide,
  onSubmit,
}: MovimientoCuentaFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MovimientoCuentaFormValues>({
    defaultValues: values,
  });

  const montoActual = watch('monto');
  const adjuntos = watch('adjuntos');

  useEffect(() => {
    reset(values);
  }, [reset, values, visible]);

  const inferredType =
    (montoActual ?? 0) > 0
      ? 'INGRESO'
      : (montoActual ?? 0) < 0
        ? 'EGRESO'
        : '-';

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
        label="Registrar"
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={handleSubmit(onSubmit)}
        loading={submitting}
      />
    </div>
  );

  const handleSelectFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    const nextAdjuntos = await Promise.all(
      files.map(
        (file) =>
          new Promise<MovimientoCuentaAdjuntoPayload>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result !== 'string') {
                reject(new Error('No se pudo leer el archivo.'));
                return;
              }

              resolve({
                archivoBase64: reader.result,
                mimeType: file.type || 'application/octet-stream',
                nombre: file.name,
              });
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );

    setValue('adjuntos', [...adjuntos, ...nextAdjuntos], {
      shouldValidate: true,
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Registrar movimiento"
      footer={footer}
      {...getResponsiveDialogProps('48rem')}
    >
      {loading ? (
        <div className="py-4">Cargando formulario...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {error ? (
            <div className="md:col-span-2">
              <Message severity="error" text={error} />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="movimiento-monto">
              Monto <span className="text-red-500">*</span>
            </label>
            <Controller
              name="monto"
              control={control}
              rules={{
                required: 'El monto es obligatorio.',
                validate: (value) =>
                  typeof value === 'number' && !Number.isNaN(value) && value !== 0
                    ? true
                    : 'El monto debe ser un número válido distinto de cero.',
              }}
              render={({ field }) => (
                <InputNumber
                  id="movimiento-monto"
                  value={field.value}
                  onValueChange={(event) => field.onChange(event.value)}
                  mode="decimal"
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  locale="es-AR"
                  useGrouping={false}
                  className="w-full"
                  inputClassName="w-full"
                />
              )}
            />
            {errors.monto ? (
              <small className="text-red-500">{errors.monto.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="movimiento-tipo">Tipo inferido</label>
            <InputText id="movimiento-tipo" value={inferredType} disabled className="w-full" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="movimiento-responsable-actual">Responsable</label>
            <InputText
              id="movimiento-responsable-actual"
              value={
                options.responsableActual
                  ? `${options.responsableActual.nombre} ${options.responsableActual.apellidos}`
                  : 'Se registra automáticamente con tu usuario.'
              }
              disabled
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="movimiento-fecha">
              Fecha <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fechaMovimiento"
              control={control}
              rules={{ required: 'La fecha es obligatoria.' }}
              render={({ field }) => (
                <Calendar
                  id="movimiento-fecha"
                  value={field.value ? dayjs(field.value, 'YYYY-MM-DD').toDate() : null}
                  onChange={(event) =>
                    field.onChange(
                      event.value instanceof Date
                        ? dayjs(event.value).format('YYYY-MM-DD')
                        : '',
                    )
                  }
                  dateFormat="dd/mm/yy"
                  showButtonBar
                  className="w-full"
                  inputClassName="w-full"
                />
              )}
            />
            {errors.fechaMovimiento ? (
              <small className="text-red-500">{errors.fechaMovimiento.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="movimiento-metodo">
              Método <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idMetodoPago"
              control={control}
              rules={{ required: 'El método es obligatorio.' }}
              render={({ field }) => (
                <Dropdown
                  id="movimiento-metodo"
                  value={field.value}
                  options={options.metodos}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event) => field.onChange(event.value)}
                  placeholder="Seleccionar método"
                  className="w-full"
                  showClear
                />
              )}
            />
            {errors.idMetodoPago ? (
              <small className="text-red-500">{errors.idMetodoPago.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="movimiento-detalles">Detalles</label>
            <Controller
              name="detalles"
              control={control}
              render={({ field }) => (
                <InputText
                  id="movimiento-detalles"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="movimiento-adjuntos">Adjuntos</label>
            <input
              ref={fileInputRef}
              id="movimiento-adjuntos"
              type="file"
              accept="application/pdf,image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void handleSelectFiles(event);
              }}
            />
            <div>
              <Button
                type="button"
                label="Seleccionar archivos"
                icon="pi pi-upload"
                iconPos="right"
                outlined
                size="small"
                onClick={() => fileInputRef.current?.click()}
              />
            </div>
            {adjuntos.length ? (
              <div className="flex flex-col gap-2">
                {adjuntos.map((adjunto, index) => (
                  <div
                    key={`${adjunto.nombre}-${index}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <small>{adjunto.nombre}</small>
                    <Button
                      type="button"
                      label="Quitar"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() =>
                        setValue(
                          'adjuntos',
                          adjuntos.filter((_, currentIndex) => currentIndex !== index),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Dialog>
  );
}
