'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { ConsejoFormValues } from '@/types/consejos';

interface ConsejoFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: ConsejoFormValues;
  error: string;
  onHide: () => void;
  onSubmit: (values: ConsejoFormValues) => void;
}

export function ConsejoFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  error,
  onHide,
  onSubmit,
}: ConsejoFormDialogProps) {
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ConsejoFormValues>({
    defaultValues: values,
  });

  useEffect(() => {
    reset(values);
  }, [reset, values, visible]);

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
        label={mode === 'create' ? 'Crear' : 'Guardar'}
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={handleSubmit(onSubmit)}
        loading={submitting}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={mode === 'create' ? 'Crear consejo' : 'Editar consejo'}
      footer={footer}
      {...getResponsiveDialogProps('40rem')}
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

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="consejo-nombre">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: 'El nombre es obligatorio.',
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres.',
                },
              }}
              render={({ field }) => (
                <InputText id="consejo-nombre" {...field} className="w-full" />
              )}
            />
            {errors.nombre ? (
              <small className="text-red-500">{errors.nombre.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="consejo-fecha">
              Fecha <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fecha"
              control={control}
              rules={{ required: 'La fecha es obligatoria.' }}
              render={({ field }) => (
                <Calendar
                  id="consejo-fecha"
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
            {errors.fecha ? (
              <small className="text-red-500">{errors.fecha.message}</small>
            ) : null}
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Controller
                name="esOrdinario"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    inputId="consejo-ordinario"
                    checked={field.value}
                    onChange={(event: CheckboxChangeEvent) =>
                      field.onChange(!!event.checked)
                    }
                  />
                )}
              />
              <label htmlFor="consejo-ordinario">Es ordinario</label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="consejo-hora-inicio">Hora de inicio</label>
            <Controller
              name="horaInicio"
              control={control}
              render={({ field }) => (
                <InputText
                  id="consejo-hora-inicio"
                  type="time"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="consejo-hora-fin">Hora de fin</label>
            <Controller
              name="horaFin"
              control={control}
              rules={{
                validate: (value) => {
                  const horaInicio = getValues('horaInicio');

                  if (!value || !horaInicio) {
                    return true;
                  }

                  return value >= horaInicio
                    ? true
                    : 'La hora de fin no puede ser anterior a la de inicio.';
                },
              }}
              render={({ field }) => (
                <InputText
                  id="consejo-hora-fin"
                  type="time"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full"
                />
              )}
            />
            {errors.horaFin ? (
              <small className="text-red-500">{errors.horaFin.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="consejo-descripcion">Descripcion</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id="consejo-descripcion"
                  {...field}
                  value={field.value ?? ''}
                  rows={4}
                  autoResize
                />
              )}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
