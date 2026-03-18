'use client';

import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { ConsejoTemarioFormValues } from '@/types/consejos';

interface ConsejoTemarioFormDialogProps {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  values: ConsejoTemarioFormValues;
  error: string;
  showEstado?: boolean;
  showContentFields?: boolean;
  onHide: () => void;
  onSubmit: (values: ConsejoTemarioFormValues) => void;
}

const ESTADO_OPTIONS = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'En tratamiento', value: 'EN_TRATAMIENTO' },
  { label: 'Tratado', value: 'TRATADO' },
  { label: 'Pospuesto', value: 'POSPUESTO' },
];

export function ConsejoTemarioFormDialog({
  visible,
  mode,
  loading,
  values,
  error,
  showEstado = true,
  showContentFields = true,
  onHide,
  onSubmit,
}: ConsejoTemarioFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsejoTemarioFormValues>({
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
      />
      <Button
        type="button"
        label={mode === 'create' ? 'Agregar' : 'Guardar'}
        icon="pi pi-check"
        iconPos="right"
        outlined
        size="small"
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={mode === 'create' ? 'Agregar tema' : 'Editar tema'}
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
            <label htmlFor="temario-titulo">
              Titulo <span className="text-red-500">*</span>
            </label>
            <Controller
              name="titulo"
              control={control}
              rules={{
                required: 'El titulo es obligatorio.',
                minLength: {
                  value: 3,
                  message: 'El titulo debe tener al menos 3 caracteres.',
                },
              }}
              render={({ field }) => (
                <InputText id="temario-titulo" {...field} className="w-full" />
              )}
            />
            {errors.titulo ? (
              <small className="text-red-500">{errors.titulo.message}</small>
            ) : null}
          </div>
          {showEstado ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="temario-estado">
                Estado <span className="text-red-500">*</span>
              </label>
              <Controller
                name="estado"
                control={control}
                rules={{ required: 'El estado es obligatorio.' }}
                render={({ field }) => (
                  <Dropdown
                    id="temario-estado"
                    value={field.value}
                    options={ESTADO_OPTIONS}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(event: DropdownChangeEvent) =>
                      field.onChange(event.value as string)
                    }
                    className="w-full"
                    appendTo="self"
                  />
                )}
              />
              {errors.estado ? (
                <small className="text-red-500">{errors.estado.message}</small>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Controller
                name="sinMp"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    inputId="temario-sin-mp"
                    checked={field.value}
                    onChange={(event: CheckboxChangeEvent) =>
                      field.onChange(!!event.checked)
                    }
                  />
                )}
              />
              <label htmlFor="temario-sin-mp">Sin MP</label>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="temario-descripcion">Descripcion</label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id="temario-descripcion"
                  {...field}
                  value={field.value ?? ''}
                  rows={3}
                  autoResize
                />
              )}
            />
          </div>
          {showContentFields ? (
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="temario-debate">Debate</label>
              <Controller
                name="debate"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    id="temario-debate"
                    {...field}
                    value={field.value ?? ''}
                    rows={3}
                    autoResize
                  />
                )}
              />
            </div>
          ) : null}
          {showContentFields ? (
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="temario-acuerdo">Acuerdo</label>
              <Controller
                name="acuerdo"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    id="temario-acuerdo"
                    {...field}
                    value={field.value ?? ''}
                    rows={3}
                    autoResize
                  />
                )}
              />
            </div>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}
