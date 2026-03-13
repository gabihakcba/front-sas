'use client';

import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { MetodoPagoFormValues } from '@/types/metodos-pago';

interface MetodoPagoFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: MetodoPagoFormValues;
  error: string;
  onHide: () => void;
  onSubmit: (values: MetodoPagoFormValues) => void;
}

export function MetodoPagoFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  error,
  onHide,
  onSubmit,
}: MetodoPagoFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetodoPagoFormValues>({
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
      header={mode === 'create' ? 'Crear metodo de pago' : 'Editar metodo de pago'}
      footer={footer}
      className="w-full max-w-xl"
      modal
    >
      {loading ? (
        <div className="py-4">Cargando formulario...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {error ? <Message severity="error" text={error} /> : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="metodo-nombre">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: 'El nombre es obligatorio.',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres.',
                },
              }}
              render={({ field }) => (
                <InputText id="metodo-nombre" {...field} className="w-full" />
              )}
            />
            {errors.nombre ? (
              <small className="text-red-500">{errors.nombre.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="metodo-descripcion">Descripción</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputText
                  id="metodo-descripcion"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full"
                />
              )}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
