'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { Controller, useForm } from 'react-hook-form';
import { ResponsableFormValues } from '@/types/responsables';

interface ResponsableFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: ResponsableFormValues;
  error: string;
  onHide: () => void;
  onSubmit: (values: ResponsableFormValues) => void;
}

export function ResponsableFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  error,
  onHide,
  onSubmit,
}: ResponsableFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResponsableFormValues>({
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
      header={mode === 'create' ? 'Crear responsable' : 'Editar responsable'}
      footer={footer}
      className="w-full max-w-4xl"
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
            <label htmlFor="user">
              Usuario <span className="text-red-500">*</span>
            </label>
            <Controller
              name="user"
              control={control}
              rules={{
                required: 'El usuario es obligatorio.',
                minLength: {
                  value: 3,
                  message: 'El usuario debe tener al menos 3 caracteres.',
                },
              }}
              render={({ field }) => (
                <InputText id="user" {...field} className="w-full" />
              )}
            />
            {errors.user ? (
              <small className="text-red-500">{errors.user.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">
              {mode === 'create' ? 'Contraseña' : 'Contraseña nueva'}
              {mode === 'create' ? (
                <span className="text-red-500"> *</span>
              ) : null}
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                validate: (value) =>
                  mode === 'edit' || value.trim().length >= 8
                    ? true
                    : 'La contraseña debe tener al menos 8 caracteres.',
              }}
              render={({ field }) => (
                <Password
                  id="password"
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  feedback={false}
                  toggleMask
                  className="w-full"
                  inputClassName="w-full"
                />
              )}
            />
            {errors.password ? (
              <small className="text-red-500">{errors.password.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es obligatorio.' }}
              render={({ field }) => (
                <InputText id="nombre" {...field} className="w-full" />
              )}
            />
            {errors.nombre ? (
              <small className="text-red-500">{errors.nombre.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <Controller
              name="apellidos"
              control={control}
              rules={{ required: 'Los apellidos son obligatorios.' }}
              render={({ field }) => (
                <InputText id="apellidos" {...field} className="w-full" />
              )}
            />
            {errors.apellidos ? (
              <small className="text-red-500">{errors.apellidos.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dni">
              DNI <span className="text-red-500">*</span>
            </label>
            <Controller
              name="dni"
              control={control}
              rules={{
                required: 'El DNI es obligatorio.',
                minLength: {
                  value: 7,
                  message: 'El DNI debe tener al menos 7 caracteres.',
                },
              }}
              render={({ field }) => (
                <InputText id="dni" {...field} className="w-full" />
              )}
            />
            {errors.dni ? (
              <small className="text-red-500">{errors.dni.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fechaNacimiento">
              Fecha de nacimiento <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fechaNacimiento"
              control={control}
              rules={{ required: 'La fecha de nacimiento es obligatoria.' }}
              render={({ field }) => (
                <Calendar
                  id="fechaNacimiento"
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
            {errors.fechaNacimiento ? (
              <small className="text-red-500">
                {errors.fechaNacimiento.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="direccion">
              Dirección <span className="text-red-500">*</span>
            </label>
            <Controller
              name="direccion"
              control={control}
              rules={{
                required: 'La dirección es obligatoria.',
                minLength: {
                  value: 3,
                  message: 'La dirección debe tener al menos 3 caracteres.',
                },
              }}
              render={({ field }) => (
                <InputText id="direccion" {...field} className="w-full" />
              )}
            />
            {errors.direccion ? (
              <small className="text-red-500">{errors.direccion.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputText id="email" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="telefono">Teléfono</label>
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <InputText id="telefono" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="telefonoEmergencia">
              Teléfono de emergencia <span className="text-red-500">*</span>
            </label>
            <Controller
              name="telefonoEmergencia"
              control={control}
              rules={{ required: 'El teléfono de emergencia es obligatorio.' }}
              render={({ field }) => (
                <InputText
                  id="telefonoEmergencia"
                  {...field}
                  className="w-full"
                />
              )}
            />
            {errors.telefonoEmergencia ? (
              <small className="text-red-500">
                {errors.telefonoEmergencia.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="totem">Totem</label>
            <Controller
              name="totem"
              control={control}
              render={({ field }) => (
                <InputText id="totem" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="cualidad">Cualidad</label>
            <Controller
              name="cualidad"
              control={control}
              render={({ field }) => (
                <InputText id="cualidad" {...field} className="w-full" />
              )}
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
