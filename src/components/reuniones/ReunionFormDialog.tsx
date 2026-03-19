'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Controller, useForm } from 'react-hook-form';
import { getResponsiveDialogProps } from '@/lib/dialog';
import {
  ReunionFormValues,
  ReunionModalidad,
  ReunionOption,
  ReunionRamaOption,
} from '@/types/reuniones';

interface Props {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: ReunionFormValues;
  areas: ReunionOption[];
  ramas: ReunionRamaOption[];
  error: string;
  onHide: () => void;
  onSubmit: (values: ReunionFormValues) => void;
}

const MODALIDAD_OPTIONS: Array<{ label: string; value: ReunionModalidad }> = [
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
  { label: 'Hibrida', value: 'HIBRIDA' },
];

export function ReunionFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  areas,
  ramas,
  error,
  onHide,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReunionFormValues>({
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
      header={mode === 'create' ? 'Crear reunion' : 'Editar reunion'}
      footer={footer}
      {...getResponsiveDialogProps('56rem')}
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
            <label htmlFor="reunion-titulo">
              Titulo <span className="text-red-500">*</span>
            </label>
            <Controller
              name="titulo"
              control={control}
              rules={{ required: 'El titulo es obligatorio.' }}
              render={({ field }) => (
                <InputText id="reunion-titulo" {...field} className="w-full" />
              )}
            />
            {errors.titulo ? (
              <small className="text-red-500">{errors.titulo.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reunion-inicio">
              Fecha inicio <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fechaInicio"
              control={control}
              rules={{ required: 'La fecha de inicio es obligatoria.' }}
              render={({ field }) => (
                <Calendar
                  id="reunion-inicio"
                  value={field.value ? dayjs(field.value).toDate() : null}
                  onChange={(event) =>
                    field.onChange(
                      event.value instanceof Date ? dayjs(event.value).toISOString() : '',
                    )
                  }
                  dateFormat="dd/mm/yy"
                  showTime
                  hourFormat="24"
                  stepMinute={1}
                  showIcon
                  showButtonBar
                  className="w-full"
                  inputClassName="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reunion-fin">
              Fecha fin <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fechaFin"
              control={control}
              rules={{ required: 'La fecha de fin es obligatoria.' }}
              render={({ field }) => (
                <Calendar
                  id="reunion-fin"
                  value={field.value ? dayjs(field.value).toDate() : null}
                  onChange={(event) =>
                    field.onChange(
                      event.value instanceof Date ? dayjs(event.value).toISOString() : '',
                    )
                  }
                  dateFormat="dd/mm/yy"
                  showTime
                  hourFormat="24"
                  stepMinute={1}
                  showIcon
                  showButtonBar
                  className="w-full"
                  inputClassName="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reunion-modalidad">
              Modalidad <span className="text-red-500">*</span>
            </label>
            <Controller
              name="modalidad"
              control={control}
              rules={{ required: 'La modalidad es obligatoria.' }}
              render={({ field }) => (
                <Dropdown
                  id="reunion-modalidad"
                  value={field.value}
                  options={MODALIDAD_OPTIONS}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(event) =>
                    field.onChange((event.value as ReunionModalidad) ?? 'PRESENCIAL')
                  }
                  className="w-full"
                />
              )}
            />
            {errors.modalidad ? (
              <small className="text-red-500">{errors.modalidad.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reunion-lugar">Lugar fisico</label>
            <Controller
              name="lugarFisico"
              control={control}
              render={({ field }) => (
                <InputText id="reunion-lugar" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="reunion-url">URL virtual</label>
            <Controller
              name="urlVirtual"
              control={control}
              render={({ field }) => (
                <InputText id="reunion-url" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="reunion-descripcion">Descripcion</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputText id="reunion-descripcion" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Areas afectadas</label>
            <Controller
              name="areaIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  value={field.value}
                  options={areas}
                  optionLabel="nombre"
                  optionValue="id"
                  filter
                  display="comma"
                  placeholder="Seleccionar areas"
                  className="w-full"
                  appendTo="self"
                  onChange={(event: MultiSelectChangeEvent) =>
                    field.onChange((event.value as number[]) ?? [])
                  }
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Ramas afectadas</label>
            <Controller
              name="ramaIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  value={field.value}
                  options={ramas}
                  optionLabel="nombre"
                  optionValue="id"
                  filter
                  display="comma"
                  placeholder="Seleccionar ramas"
                  className="w-full"
                  appendTo="self"
                  onChange={(event: MultiSelectChangeEvent) =>
                    field.onChange((event.value as number[]) ?? [])
                  }
                />
              )}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
