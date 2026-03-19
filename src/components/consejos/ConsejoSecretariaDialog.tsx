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
  ConsejoSecretariaMember,
} from '@/types/consejos';

interface ConsejoSecretariaFormValues {
  idSecretario: number | null;
  idProsecretario: number | null;
}

interface ConsejoSecretariaDialogProps {
  visible: boolean;
  loading: boolean;
  options: ConsejoAsistenciaOption[];
  secretario: ConsejoSecretariaMember | null;
  prosecretario: ConsejoSecretariaMember | null;
  error: string;
  onHide: () => void;
  onSubmit: (values: ConsejoSecretariaFormValues) => void;
}

export function ConsejoSecretariaDialog({
  visible,
  loading,
  options,
  secretario,
  prosecretario,
  error,
  onHide,
  onSubmit,
}: ConsejoSecretariaDialogProps) {
  const adultOptions = options.filter((option) => option.Adulto !== null);
  const { control, handleSubmit, reset } = useForm<ConsejoSecretariaFormValues>({
    defaultValues: {
      idSecretario: secretario?.id ?? null,
      idProsecretario: prosecretario?.id ?? null,
    },
  });

  useEffect(() => {
    reset({
      idSecretario: secretario?.id ?? null,
      idProsecretario: prosecretario?.id ?? null,
    });
  }, [prosecretario, reset, secretario, visible]);

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
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Asignar secretaria"
      footer={footer}
      {...getResponsiveDialogProps('40rem')}
    >
      <div className="flex flex-col gap-3">
        {error ? <Message severity="error" text={error} /> : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="consejo-secretario">Secretario</label>
            <Controller
              name="idSecretario"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="consejo-secretario"
                  value={field.value}
                  options={adultOptions}
                  optionLabel="displayLabel"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange((event.value as number | null) ?? null)
                  }
                  placeholder="Sin secretario"
                  filter
                  showClear
                  className="w-full"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="consejo-prosecretario">Prosecretario</label>
            <Controller
              name="idProsecretario"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="consejo-prosecretario"
                  value={field.value}
                  options={adultOptions}
                  optionLabel="displayLabel"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange((event.value as number | null) ?? null)
                  }
                  placeholder="Sin prosecretario"
                  filter
                  showClear
                  className="w-full"
                />
              )}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
