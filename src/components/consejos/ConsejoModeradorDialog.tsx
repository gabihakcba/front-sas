'use client';

import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { getResponsiveDialogProps } from '@/lib/dialog';
import {
  ConsejoAsistenciaOption,
  ConsejoModeradorMember,
} from '@/types/consejos';

interface ConsejoModeradorFormValues {
  idModerador: number | null;
}

interface ConsejoModeradorDialogProps {
  visible: boolean;
  loading: boolean;
  options: ConsejoAsistenciaOption[];
  currentModerador: ConsejoModeradorMember | null;
  error: string;
  onHide: () => void;
  onSubmit: (idModerador: number | null) => void;
}

export function ConsejoModeradorDialog({
  visible,
  loading,
  options,
  currentModerador,
  error,
  onHide,
  onSubmit,
}: ConsejoModeradorDialogProps) {
  const { control, handleSubmit, reset } = useForm<ConsejoModeradorFormValues>({
    defaultValues: {
      idModerador: currentModerador?.id ?? null,
    },
  });

  useEffect(() => {
    reset({
      idModerador: currentModerador?.id ?? null,
    });
  }, [currentModerador, reset, visible]);

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
        label="Guardar"
        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        loading={loading}
        onClick={handleSubmit((values) => onSubmit(values.idModerador))}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Asignar moderador"
      footer={footer}
      {...getResponsiveDialogProps('40rem')}
    >
      <div className="flex flex-col gap-3">
        {error ? <Message severity="error" text={error} /> : null}
        <div className="flex flex-col gap-2">
          <label htmlFor="consejo-moderador">Miembro</label>
          <Controller
            name="idModerador"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="consejo-moderador"
                value={field.value}
                options={options}
                optionLabel="displayLabel"
                optionValue="id"
                onChange={(event: DropdownChangeEvent) =>
                  field.onChange((event.value as number | null) ?? null)
                }
                placeholder="Sin moderador asignado"
                filter
                showClear
                className="w-full"
              />
            )}
          />
        </div>
      </div>
    </Dialog>
  );
}
