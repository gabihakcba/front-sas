'use client';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm } from 'react-hook-form';
import { EventoFormValues, EventoOption } from '@/types/eventos';

interface Props {
  visible: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  submitting: boolean;
  values: EventoFormValues;
  tipos: EventoOption[];
  error: string;
  onHide: () => void;
  onSubmit: (values: EventoFormValues) => void;
}

export function EventoFormDialog({
  visible,
  mode,
  loading,
  submitting,
  values,
  tipos,
  error,
  onHide,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<EventoFormValues>({
    defaultValues: values,
  });

  useEffect(() => {
    reset(values);
  }, [reset, values, visible]);

  const footer = (
    <div className="flex justify-end gap-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" iconPos="right" outlined size="small" onClick={onHide} disabled={submitting} />
      <Button type="button" label={mode === 'create' ? 'Crear' : 'Guardar'} icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'} iconPos="right" outlined size="small" onClick={handleSubmit(onSubmit)} loading={submitting} />
    </div>
  );

  return (
    <Dialog visible={visible} onHide={onHide} header={mode === 'create' ? 'Crear evento' : 'Editar evento'} footer={footer} className="w-full max-w-4xl" modal>
      {loading ? (
        <div className="py-4">Cargando formulario...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {error ? <div className="md:col-span-2"><Message severity="error" text={error} /></div> : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-nombre">Nombre <span className="text-red-500">*</span></label>
            <Controller name="nombre" control={control} rules={{ required: 'El nombre es obligatorio.' }} render={({ field }) => <InputText id="evento-nombre" {...field} className="w-full" />} />
            {errors.nombre ? <small className="text-red-500">{errors.nombre.message}</small> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-tipo">Tipo <span className="text-red-500">*</span></label>
            <Controller name="idTipo" control={control} rules={{ required: 'El tipo es obligatorio.' }} render={({ field }) => <Dropdown id="evento-tipo" value={field.value} options={tipos} optionLabel="nombre" optionValue="id" onChange={(event) => field.onChange((event.value as number | null) ?? null)} placeholder="Tipo de evento" className="w-full" />} />
            {errors.idTipo ? <small className="text-red-500">{errors.idTipo.message}</small> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-inicio">Fecha inicio <span className="text-red-500">*</span></label>
            <Controller name="fechaInicio" control={control} rules={{ required: 'La fecha de inicio es obligatoria.' }} render={({ field }) => <Calendar id="evento-inicio" value={field.value ? dayjs(field.value, 'YYYY-MM-DD').toDate() : null} onChange={(event) => field.onChange(event.value instanceof Date ? dayjs(event.value).format('YYYY-MM-DD') : '')} dateFormat="dd/mm/yy" showButtonBar className="w-full" inputClassName="w-full" />} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-fin">Fecha fin <span className="text-red-500">*</span></label>
            <Controller name="fechaFin" control={control} rules={{ required: 'La fecha de fin es obligatoria.' }} render={({ field }) => <Calendar id="evento-fin" value={field.value ? dayjs(field.value, 'YYYY-MM-DD').toDate() : null} onChange={(event) => field.onChange(event.value instanceof Date ? dayjs(event.value).format('YYYY-MM-DD') : '')} dateFormat="dd/mm/yy" showButtonBar className="w-full" inputClassName="w-full" />} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="evento-descripcion">Descripción</label>
            <Controller name="descripcion" control={control} render={({ field }) => <InputText id="evento-descripcion" {...field} className="w-full" />} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="evento-lugar">Lugar</label>
            <Controller name="lugar" control={control} render={({ field }) => <InputText id="evento-lugar" {...field} className="w-full" />} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-costo-mp">Costo MP <span className="text-red-500">*</span></label>
            <Controller name="costoMp" control={control} rules={{ required: 'El costo MP es obligatorio.' }} render={({ field }) => <InputText id="evento-costo-mp" {...field} className="w-full" />} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-costo-ma">Costo MA <span className="text-red-500">*</span></label>
            <Controller name="costoMa" control={control} rules={{ required: 'El costo MA es obligatorio.' }} render={({ field }) => <InputText id="evento-costo-ma" {...field} className="w-full" />} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="evento-costo-ayudante">Costo Ayudante <span className="text-red-500">*</span></label>
            <Controller name="costoAyudante" control={control} rules={{ required: 'El costo de ayudante es obligatorio.' }} render={({ field }) => <InputText id="evento-costo-ayudante" {...field} className="w-full" />} />
          </div>
          <div className="flex align-items-center gap-2">
            <Controller name="terminado" control={control} render={({ field }) => <Checkbox inputId="evento-terminado" checked={field.value} onChange={(event) => field.onChange(Boolean(event.checked))} />} />
            <label htmlFor="evento-terminado">Terminado</label>
          </div>
        </div>
      )}
    </Dialog>
  );
}
