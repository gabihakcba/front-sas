'use client';

import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  CuentaDineroFormValues,
  CuentaDineroOptionsResponse,
} from '@/types/cuentas-dinero';

interface CuentaDineroFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: CuentaDineroFormValues;
  options: CuentaDineroOptionsResponse;
  error: string;
  onHide: () => void;
  onSubmit: (values: CuentaDineroFormValues) => void;
}

export function CuentaDineroFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  options,
  error,
  onHide,
  onSubmit,
}: CuentaDineroFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CuentaDineroFormValues>({
    defaultValues: values,
  });

  const tipoAsignacion = useWatch({
    control,
    name: 'tipoAsignacion',
  });

  useEffect(() => {
    reset(values);
  }, [reset, values, visible]);

  const tipoOptions = [
    { label: 'Área', value: 'AREA' },
    { label: 'Rama', value: 'RAMA' },
    { label: 'Miembro', value: 'MIEMBRO' },
  ];

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
      header={mode === 'create' ? 'Crear cuenta de dinero' : 'Editar cuenta de dinero'}
      footer={footer}
      className="w-full max-w-2xl"
      modal
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
            <label htmlFor="cuenta-nombre">
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
                <InputText id="cuenta-nombre" {...field} className="w-full" />
              )}
            />
            {errors.nombre ? (
              <small className="text-red-500">{errors.nombre.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="cuenta-monto">
              Monto actual <span className="text-red-500">*</span>
            </label>
            <Controller
              name="montoActual"
              control={control}
              rules={{
                required: 'El monto actual es obligatorio.',
                validate: (value) =>
                  !Number.isNaN(Number(value)) && Number(value) >= 0
                    ? true
                    : 'El monto actual debe ser un número válido mayor o igual a cero.',
              }}
              render={({ field }) => (
                <InputText id="cuenta-monto" {...field} className="w-full" />
              )}
            />
            {errors.montoActual ? (
              <small className="text-red-500">
                {errors.montoActual.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="cuenta-descripcion">Descripción</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputText
                  id="cuenta-descripcion"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="cuenta-tipo">
              Tipo de asignación <span className="text-red-500">*</span>
            </label>
            <Controller
              name="tipoAsignacion"
              control={control}
              rules={{ required: 'Debes seleccionar un tipo de asignación.' }}
              render={({ field }) => (
                <Dropdown
                  id="cuenta-tipo"
                  value={field.value}
                  options={tipoOptions}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(event: DropdownChangeEvent) => {
                    field.onChange(event.value);
                    if (event.value === 'AREA') {
                      setValue('idRama', null);
                      setValue('idMiembro', null);
                    } else if (event.value === 'RAMA') {
                      setValue('idArea', null);
                      setValue('idMiembro', null);
                    } else {
                      setValue('idArea', null);
                      setValue('idRama', null);
                    }
                  }}
                  className="w-full"
                />
              )}
            />
            {errors.tipoAsignacion ? (
              <small className="text-red-500">
                {errors.tipoAsignacion.message}
              </small>
            ) : null}
          </div>

          {tipoAsignacion === 'AREA' ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="cuenta-area">
                Área <span className="text-red-500">*</span>
              </label>
              <Controller
                name="idArea"
                control={control}
                rules={{
                  validate: (value) =>
                    tipoAsignacion !== 'AREA' || value
                      ? true
                      : 'Debes seleccionar un área.',
                }}
                render={({ field }) => (
                  <Dropdown
                    id="cuenta-area"
                    value={field.value}
                    options={options.areas}
                    optionLabel="nombre"
                    optionValue="id"
                    onChange={(event: DropdownChangeEvent) =>
                      field.onChange(event.value as number | null)
                    }
                    className="w-full"
                    placeholder="Seleccioná un área"
                  />
                )}
              />
              {errors.idArea ? (
                <small className="text-red-500">{errors.idArea.message}</small>
              ) : null}
            </div>
          ) : tipoAsignacion === 'RAMA' ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="cuenta-rama">
                Rama <span className="text-red-500">*</span>
              </label>
              <Controller
                name="idRama"
                control={control}
                rules={{
                  validate: (value) =>
                    tipoAsignacion !== 'RAMA' || value
                      ? true
                      : 'Debes seleccionar una rama.',
                }}
                render={({ field }) => (
                  <Dropdown
                    id="cuenta-rama"
                    value={field.value}
                    options={options.ramas}
                    optionLabel="nombre"
                    optionValue="id"
                    onChange={(event: DropdownChangeEvent) =>
                      field.onChange(event.value as number | null)
                    }
                    className="w-full"
                    placeholder="Seleccioná una rama"
                  />
                )}
              />
              {errors.idRama ? (
                <small className="text-red-500">{errors.idRama.message}</small>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="cuenta-miembro">
                Miembro <span className="text-red-500">*</span>
              </label>
              <Controller
                name="idMiembro"
                control={control}
                rules={{
                  validate: (value) =>
                    tipoAsignacion !== 'MIEMBRO' || value
                      ? true
                      : 'Debes seleccionar un miembro.',
                }}
                render={({ field }) => (
                  <Dropdown
                    id="cuenta-miembro"
                    value={field.value}
                    options={options.miembros}
                    optionLabel="apellidos"
                    optionValue="id"
                    onChange={(event: DropdownChangeEvent) =>
                      field.onChange(event.value as number | null)
                    }
                    className="w-full"
                    placeholder="Seleccioná un miembro"
                    itemTemplate={(miembro) =>
                      miembro
                        ? `${miembro.apellidos}, ${miembro.nombre} (${miembro.dni})`
                        : null
                    }
                    valueTemplate={(miembro) =>
                      miembro
                        ? `${miembro.apellidos}, ${miembro.nombre} (${miembro.dni})`
                        : 'Seleccioná un miembro'
                    }
                  />
                )}
              />
              {errors.idMiembro ? (
                <small className="text-red-500">
                  {errors.idMiembro.message}
                </small>
              ) : null}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
