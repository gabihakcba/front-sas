'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Message } from 'primereact/message';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { CreateActividadPayload } from '@/types/sabatinos';

interface Props {
  visible: boolean;
  onHide: () => void;
  mode?: 'create' | 'edit';
  initialValues: any;
  onSubmit: (values: CreateActividadPayload) => void;
  loading: boolean;
  options: any;
}

export function ActividadFormDialog({
  visible,
  onHide,
  mode = 'create',
  initialValues,
  onSubmit,
  loading,
  options,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateActividadPayload>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (visible) {
      reset(initialValues);
    }
  }, [visible, initialValues, reset]);

  const onFormSubmit = (data: CreateActividadPayload) => {
    onSubmit(data);
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        outlined
        size="small"
        type="button"
      />
      <Button
        label={mode === 'create' ? 'Guardar Actividad' : 'Actualizar Actividad'}
        icon="pi pi-check"
        onClick={handleSubmit(onFormSubmit)}
        loading={loading}
        size="small"
        outlined
        type="submit"
      />
    </div>
  );

  return (
    <Dialog
      header={mode === 'create' ? 'Nueva Actividad' : 'Editar Actividad'}
      visible={visible}
      onHide={onHide}
      footer={footer}
      {...getResponsiveDialogProps('600px')}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre">Nombre *</label>
          <Controller
            name="nombre"
            control={control}
            rules={{ required: 'El nombre es obligatorio.' }}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  {...field}
                  className={`w-full ${fieldState.invalid ? 'p-invalid' : ''}`}
                />
                {fieldState.error && (
                  <small className="p-error">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="fecha">Fecha y Hora *</label>
            <Controller
              name="fecha"
              control={control}
              rules={{ required: 'La fecha es obligatoria.' }}
              render={({ field, fieldState }) => (
                <>
                  <Calendar
                    id={field.name}
                    value={field.value ? dayjs(field.value).toDate() : null}
                    onChange={(e) => field.onChange(e.value ? dayjs(e.value).toISOString() : '')}
                    showTime
                    hourFormat="24"
                    dateFormat="dd/mm/yy"
                    showIcon
                    className={`w-full ${fieldState.invalid ? 'p-invalid' : ''}`}
                  />
                  {fieldState.error && (
                    <small className="p-error">{fieldState.error.message}</small>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="id_tipo">Tipo de Actividad *</label>
            <Controller
              name="id_tipo"
              control={control}
              rules={{ required: 'El tipo es obligatorio.' }}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    options={options.tiposActividad}
                    optionLabel="nombre"
                    optionValue="id"
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Seleccionar tipo"
                    className={`w-full ${fieldState.invalid ? 'p-invalid' : ''}`}
                  />
                  {fieldState.error && (
                    <small className="p-error">{fieldState.error.message}</small>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="descripcion">Descripción</label>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <InputTextarea
                id={field.name}
                {...field}
                value={field.value || ''}
                rows={3}
                autoResize
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="objetivos">Objetivos</label>
          <Controller
            name="objetivos"
            control={control}
            render={({ field }) => (
              <InputTextarea
                id={field.name}
                {...field}
                value={field.value || ''}
                rows={2}
                autoResize
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="materiales">Materiales</label>
          <Controller
            name="materiales"
            control={control}
            render={({ field }) => (
              <InputTextarea
                id={field.name}
                {...field}
                value={field.value || ''}
                rows={2}
                autoResize
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="responsableIds">Responsables (Adultos)</label>
          <Controller
            name="responsableIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id={field.name}
                value={field.value}
                options={options.adultos}
                optionLabel="label"
                optionValue="id"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccionar responsables"
                filter
                className="w-full"
              />
            )}
          />
        </div>
      </form>
    </Dialog>
  );
}
