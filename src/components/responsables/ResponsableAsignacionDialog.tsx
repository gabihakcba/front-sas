'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { ResponsableOptionProtagonista } from '@/types/responsables';

interface ResponsableAsignacionDialogProps {
  visible: boolean;
  submitting: boolean;
  protagonistas: ResponsableOptionProtagonista[];
  values: number[];
  error: string;
  onHide: () => void;
  onChange: (values: number[]) => void;
  onSubmit: () => void;
}

const formatProtagonistaOption = (option: ResponsableOptionProtagonista) => {
  const fullName = `${option.apellidos}, ${option.nombre}`;
  const rama = option.rama?.nombre ? ` • ${option.rama.nombre}` : '';
  return `${fullName} (${option.dni})${rama}`;
};

export function ResponsableAsignacionDialog({
  visible,
  submitting,
  protagonistas,
  values,
  error,
  onHide,
  onChange,
  onSubmit,
}: ResponsableAsignacionDialogProps) {
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
        label="Guardar"
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={onSubmit}
        loading={submitting}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Asignar responsabilidades"
      footer={footer}
      className="w-full max-w-3xl"
      modal
    >
      <div className="flex flex-col gap-4">
        {error ? <Message severity="error" text={error} /> : null}
        <div className="flex flex-col gap-2">
          <label htmlFor="responsabilidades">Protagonistas</label>
          <MultiSelect
            inputId="responsabilidades"
            value={values}
            options={protagonistas}
            optionLabel="apellidos"
            optionValue="id"
            filter
            display="chip"
            placeholder="Seleccionar protagonistas"
            className="w-full"
            selectedItemsLabel="{0} protagonistas"
            itemTemplate={(option: ResponsableOptionProtagonista) =>
              formatProtagonistaOption(option)
            }
            onChange={(event: MultiSelectChangeEvent) =>
              onChange((event.value as number[]) ?? [])
            }
          />
        </div>
      </div>
    </Dialog>
  );
}
