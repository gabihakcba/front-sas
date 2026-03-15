'use client';

import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { ComisionFormValues } from '@/types/comisiones';

interface Props {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: ComisionFormValues;
  error: string;
  onHide: () => void;
  onSubmit: (values: ComisionFormValues) => void;
}

export function ComisionFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  error,
  onHide,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ComisionFormValues>({
    defaultValues: values,
  });

  useEffect(() => {
    reset(values);
  }, [reset, values, visible]);

  const footer = (
    <div className="flex justify-end gap-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" iconPos="right" outlined size="small" onClick={onHide} disabled={submitting} />
      <Button type="button" label={mode === 'create' ? 'Crear' : 'Guardar'} icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'} iconPos="right" outlined size="small" onClick={handleSubmit(onSubmit)} loading={submitting} />
    </div>
  );

  return (
    <Dialog visible={visible} onHide={onHide} header={mode === 'create' ? 'Crear comisión' : 'Editar comisión'} footer={footer} className="w-full max-w-xl" modal>
      {loading ? (
        <div className="py-4">Cargando formulario...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {error ? <Message severity="error" text={error} /> : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="comision-nombre">Nombre <span className="text-red-500">*</span></label>
            <Controller name="nombre" control={control} rules={{ required: 'El nombre es obligatorio.' }} render={({ field }) => <InputText id="comision-nombre" {...field} className="w-full" />} />
            {errors.nombre ? <small className="text-red-500">{errors.nombre.message}</small> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="comision-descripcion">Descripción</label>
            <Controller name="descripcion" control={control} render={({ field }) => <InputText id="comision-descripcion" {...field} className="w-full" />} />
          </div>
        </div>
      )}
    </Dialog>
  );
}
