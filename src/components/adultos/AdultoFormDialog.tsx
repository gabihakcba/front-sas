'use client';

import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { AdultoFormValues, AdultoOptionsResponse } from '@/types/adultos';

interface AdultoFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  options: AdultoOptionsResponse;
  values: AdultoFormValues;
  error: string;
  onHide: () => void;
  onSubmit: (values: AdultoFormValues) => void;
}

export function AdultoFormDialog({
  visible,
  mode,
  loading,
  submitting,
  options,
  values,
  error,
  onHide,
  onSubmit,
}: AdultoFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdultoFormValues>({
    defaultValues: values,
  });

  const tipoScope = useWatch({ control, name: 'tipoScope' });
  const idRole = useWatch({ control, name: 'idRole' });

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

  const scopeOptions = options.scopes.map((scope) => ({
    label: scope,
    value: scope,
  }));

  const scopeIdOptions =
    tipoScope === 'AREA'
      ? options.areas.map((area) => ({
          label: area.nombre,
          value: area.id,
        }))
      : tipoScope === 'RAMA'
        ? options.ramas.map((rama) => ({
            label: rama.nombre,
            value: rama.id,
          }))
        : [];

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={mode === 'create' ? 'Crear adulto' : 'Editar adulto'}
      footer={footer}
      className="w-full max-w-5xl"
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
            <label htmlFor="adulto-user">
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
                <InputText id="adulto-user" {...field} className="w-full" />
              )}
            />
            {errors.user ? (
              <small className="text-red-500">{errors.user.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-password">
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
                  id="adulto-password"
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
            <label htmlFor="adulto-nombre">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'El nombre es obligatorio.' }}
              render={({ field }) => (
                <InputText id="adulto-nombre" {...field} className="w-full" />
              )}
            />
            {errors.nombre ? (
              <small className="text-red-500">{errors.nombre.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-apellidos">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <Controller
              name="apellidos"
              control={control}
              rules={{ required: 'Los apellidos son obligatorios.' }}
              render={({ field }) => (
                <InputText id="adulto-apellidos" {...field} className="w-full" />
              )}
            />
            {errors.apellidos ? (
              <small className="text-red-500">
                {errors.apellidos.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-dni">
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
                <InputText id="adulto-dni" {...field} className="w-full" />
              )}
            />
            {errors.dni ? (
              <small className="text-red-500">{errors.dni.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-fecha-nacimiento">
              Fecha de nacimiento <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fechaNacimiento"
              control={control}
              rules={{ required: 'La fecha de nacimiento es obligatoria.' }}
              render={({ field }) => (
                <InputText
                  id="adulto-fecha-nacimiento"
                  type="date"
                  {...field}
                  className="w-full"
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
            <label htmlFor="adulto-direccion">
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
                <InputText id="adulto-direccion" {...field} className="w-full" />
              )}
            />
            {errors.direccion ? (
              <small className="text-red-500">{errors.direccion.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-email">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputText id="adulto-email" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-telefono">Teléfono</label>
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <InputText id="adulto-telefono" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-telefono-emergencia">
              Teléfono de emergencia <span className="text-red-500">*</span>
            </label>
            <Controller
              name="telefonoEmergencia"
              control={control}
              rules={{ required: 'El teléfono de emergencia es obligatorio.' }}
              render={({ field }) => (
                <InputText
                  id="adulto-telefono-emergencia"
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
            <label htmlFor="adulto-area">
              Área <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idArea"
              control={control}
              rules={{ required: 'Debes seleccionar un área.' }}
              render={({ field }) => (
                <Dropdown
                  id="adulto-area"
                  value={field.value}
                  options={options.areas}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) => {
                    field.onChange(event.value as number | null);
                    setValue('idRama', null);
                    if (tipoScope === 'AREA') {
                      setValue('idScope', event.value as number | null);
                    }
                  }}
                  placeholder="Seleccioná un área"
                  className="w-full"
                />
              )}
            />
            {errors.idArea ? (
              <small className="text-red-500">{errors.idArea.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-posicion">
              Posición <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idPosicion"
              control={control}
              rules={{ required: 'Debes seleccionar una posición.' }}
              render={({ field }) => (
                <Dropdown
                  id="adulto-posicion"
                  value={field.value}
                  options={options.posiciones}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  placeholder="Seleccioná una posición"
                  className="w-full"
                />
              )}
            />
            {errors.idPosicion ? (
              <small className="text-red-500">{errors.idPosicion.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-rama">Rama</label>
            <Controller
              name="idRama"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="adulto-rama"
                  value={field.value}
                  options={options.ramas}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) => {
                    field.onChange(event.value as number | null);
                    if (tipoScope === 'RAMA') {
                      setValue('idScope', event.value as number | null);
                    }
                  }}
                  placeholder="Seleccioná una rama"
                  className="w-full"
                  showClear
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-fecha-inicio">Inicio de asignación</label>
            <Controller
              name="fechaInicioEquipo"
              control={control}
              render={({ field }) => (
                <InputText
                  id="adulto-fecha-inicio"
                  type="date"
                  {...field}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-totem">Totem</label>
            <Controller
              name="totem"
              control={control}
              render={({ field }) => (
                <InputText id="adulto-totem" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-cualidad">Cualidad</label>
            <Controller
              name="cualidad"
              control={control}
              render={({ field }) => (
                <InputText id="adulto-cualidad" {...field} className="w-full" />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-role">Rol</label>
            <Controller
              name="idRole"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="adulto-role"
                  value={field.value}
                  options={options.roles}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) => {
                    field.onChange(event.value as number | null);
                    if (!event.value) {
                      setValue('tipoScope', '');
                      setValue('idScope', null);
                    }
                  }}
                  placeholder="Sin rol"
                  className="w-full"
                  showClear
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-scope">Scope</label>
            <Controller
              name="tipoScope"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="adulto-scope"
                  value={field.value}
                  options={scopeOptions}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(event: DropdownChangeEvent) => {
                    const nextScope = (event.value as string) ?? '';
                    field.onChange(nextScope);
                    if (nextScope === 'AREA') {
                      setValue('idScope', values.idArea);
                    } else if (nextScope === 'RAMA') {
                      setValue('idScope', values.idRama);
                    } else {
                      setValue('idScope', null);
                    }
                  }}
                  placeholder="Seleccioná un scope"
                  className="w-full"
                  disabled={!idRole}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adulto-id-scope">Entidad del scope</label>
            <Controller
              name="idScope"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="adulto-id-scope"
                  value={field.value}
                  options={scopeIdOptions}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  placeholder="Seleccioná una entidad"
                  className="w-full"
                  disabled={
                    !idRole ||
                    !tipoScope ||
                    ['GLOBAL', 'GRUPO', 'OWN'].includes(tipoScope)
                  }
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="esBecado"
              control={control}
              render={({ field }) => (
                <Checkbox
                  inputId="adulto-becado"
                  checked={field.value}
                  onChange={(event) => field.onChange(!!event.checked)}
                />
              )}
            />
            <label htmlFor="adulto-becado">Becado</label>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="activo"
              control={control}
              render={({ field }) => (
                <Checkbox
                  inputId="adulto-activo"
                  checked={field.value}
                  onChange={(event) => field.onChange(!!event.checked)}
                />
              )}
            />
            <label htmlFor="adulto-activo">Activo</label>
          </div>
        </div>
      )}
    </Dialog>
  );
}
