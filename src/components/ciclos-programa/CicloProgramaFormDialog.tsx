'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { getResponsiveDialogProps } from '@/lib/dialog';
import {
  CicloProgramaFormValues,
  CicloProgramaRamaOption,
} from '@/types/ciclos-programa';

interface CicloProgramaFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: CicloProgramaFormValues;
  ramas: CicloProgramaRamaOption[];
  canSelectRama: boolean;
  error: string;
  onHide: () => void;
  onSubmit: (values: CicloProgramaFormValues) => void;
}

export function CicloProgramaFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  ramas,
  canSelectRama,
  error,
  onHide,
  onSubmit,
}: CicloProgramaFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CicloProgramaFormValues>({
    defaultValues: values,
  });

  const title =
    mode === 'create' ? 'Crear ciclo de programa' : 'Editar ciclo de programa';

  useEffect(() => {
    if (!visible) {
      return;
    }

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
      />
      <Button
        type="button"
        label={mode === 'create' ? 'Crear' : 'Guardar'}
        icon={mode === 'create' ? 'pi pi-plus' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        loading={submitting}
        onClick={() => void handleSubmit(onSubmit)()}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer}
      {...getResponsiveDialogProps('38rem')}
    >
      {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
      {loading ? (
        <div className="py-4">Cargando formulario...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="ciclo-programa-nombre">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es obligatorio.' }}
              render={({ field }) => (
                <InputText id="ciclo-programa-nombre" {...field} className="w-full" />
              )}
            />
            {errors.nombre ? <small className="text-red-500">{errors.nombre.message}</small> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ciclo-programa-descripcion">Descripción</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id="ciclo-programa-descripcion"
                  {...field}
                  rows={3}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="ciclo-programa-fecha-inicio">
                Fecha de inicio <span className="text-red-500">*</span>
              </label>
              <Controller
                name="fechaInicio"
                control={control}
                rules={{ required: 'La fecha de inicio es obligatoria.' }}
                render={({ field }) => (
                  <Calendar
                    id="ciclo-programa-fecha-inicio"
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
              {errors.fechaInicio ? (
                <small className="text-red-500">{errors.fechaInicio.message}</small>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="ciclo-programa-fecha-fin">
                Fecha de fin <span className="text-red-500">*</span>
              </label>
              <Controller
                name="fechaFin"
                control={control}
                rules={{ required: 'La fecha de fin es obligatoria.' }}
                render={({ field }) => (
                  <Calendar
                    id="ciclo-programa-fecha-fin"
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
              {errors.fechaFin ? (
                <small className="text-red-500">{errors.fechaFin.message}</small>
              ) : null}
            </div>
          </div>

          {canSelectRama ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="ciclo-programa-rama">
                Rama <span className="text-red-500">*</span>
              </label>
              <Controller
                name="idRama"
                control={control}
                rules={{ required: 'La rama es obligatoria.' }}
                render={({ field }) => (
                  <Dropdown
                    id="ciclo-programa-rama"
                    value={field.value}
                    options={ramas}
                    optionLabel="nombre"
                    optionValue="id"
                    onChange={(event) =>
                      field.onChange((event.value as number | null) ?? null)
                    }
                    placeholder="Seleccionar rama"
                    className="w-full"
                  />
                )}
              />
              {errors.idRama ? <small className="text-red-500">{errors.idRama.message}</small> : null}
            </div>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}
