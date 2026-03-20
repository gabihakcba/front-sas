'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { UpdateSabatinoPayload } from '@/types/sabatinos';

interface Props {
  visible: boolean;
  onHide: () => void;
  mode?: 'create' | 'edit';
  initialValues: any;
  onSubmit: (values: UpdateSabatinoPayload) => void;
  loading: boolean;
  options: any;
}

export function SabatinoFormDialog({
  visible,
  onHide,
  mode,
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
  } = useForm<UpdateSabatinoPayload>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (visible) {
      reset(initialValues);
    }
  }, [visible, initialValues, reset]);

  const onFormSubmit = (data: any) => {
    // Transform activityIds if they exist into the new required structure
    const payload = {
      ...data,
      actividadIds: data.actividadIds?.map((id: number, index: number) => {
        const existing = initialValues.Actividades?.find((a: any) => a.Actividad.id === id);
        return {
          actividadId: id,
          numero: existing?.numero ?? (index + 1),
          fecha: existing?.fecha ?? data.fechaInicio,
          responsableIds: existing?.Responsables?.map((r: any) => r.Adulto.id) ?? [],
        };
      }),
    };
    onSubmit(payload);
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
        label={mode === 'create' ? 'Crear' : 'Guardar'}
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
      header={mode === 'create' ? 'Nuevo Sabatino' : 'Editar Sabatino'}
      visible={visible}
      onHide={onHide}
      footer={footer}
      {...getResponsiveDialogProps('500px')}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="titulo">Título *</label>
          <Controller
            name="titulo"
            control={control}
            rules={{ required: 'El título es obligatorio.' }}
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

        <div className="flex flex-col gap-2">
          <label htmlFor="fechaInicio">Fecha Inicio *</label>
          <Controller
            name="fechaInicio"
            control={control}
            rules={{ required: 'La fecha de inicio es obligatoria.' }}
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
          <label htmlFor="fechaFin">Fecha Fin *</label>
          <Controller
            name="fechaFin"
            control={control}
            rules={{ required: 'La fecha de fin es obligatoria.' }}
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
          <label htmlFor="educadorIds">Educadores</label>
          <Controller
            name="educadorIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id={field.name}
                value={field.value}
                options={options.adultos}
                optionLabel="label"
                optionValue="id"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccionar educadores"
                filter
                className="w-full"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="ramaIds">Ramas Afectadas</label>
          <Controller
            name="ramaIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id={field.name}
                value={field.value}
                options={options.ramas}
                optionLabel="nombre"
                optionValue="id"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccionar ramas"
                className="w-full"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="areaIds">Áreas Afectadas</label>
          <Controller
            name="areaIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id={field.name}
                value={field.value}
                options={options.areas}
                optionLabel="nombre"
                optionValue="id"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccionar áreas"
                className="w-full"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="actividadIds">Actividades Asociadas</label>
          <Controller
            name="actividadIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id={field.name}
                value={field.value}
                options={options.todasActividades}
                optionLabel="nombre"
                optionValue="id"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccionar actividades"
                filter
                className="w-full"
                display="chip"
              />
            )}
          />
        </div>
      </form>
    </Dialog>
  );
}
