'use client';

import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { PagoFormValues, PagosOptionsResponse } from '@/types/pagos';

interface PagoFormDialogProps {
  visible: boolean;
  mode: 'create';
  loading: boolean;
  submitting: boolean;
  values: PagoFormValues;
  options: PagosOptionsResponse;
  error: string;
  onHide: () => void;
  onSubmit: (values: PagoFormValues) => void;
}

export function PagoFormDialog({
  visible,
  loading,
  submitting,
  values,
  options,
  error,
  onHide,
  onSubmit,
}: PagoFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PagoFormValues>({
    defaultValues: values,
  });

  const currentAttachmentName = useWatch({
    control,
    name: 'comprobantePagoNombre',
  });

  useEffect(() => {
    reset(values);
  }, [reset, values, visible]);

  const cuentaOptions = useMemo(
    () =>
      options.cuentas.map((cuenta) => ({
        ...cuenta,
        label: `${cuenta.nombre} (${cuenta.monto_actual})`,
      })),
    [options.cuentas],
  );

  const miembroOptions = useMemo(
    () =>
      options.miembros.map((miembro) => ({
        ...miembro,
        label: `${miembro.apellidos}, ${miembro.nombre} (${miembro.dni})`,
      })),
    [options.miembros],
  );

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
        label="Crear"
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={handleSubmit(onSubmit)}
        loading={submitting}
      />
    </div>
  );

  const handleSelectFile = (
    event: FileUploadSelectEvent,
    onChange: (
      value: {
        base64: string | null;
        mimeType: string | null;
        fileName: string | null;
      },
    ) => void,
  ) => {
    const file = event.files[0];

    if (!(file instanceof File)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return;
      }

      onChange({
        base64: reader.result,
        mimeType: file.type || 'application/octet-stream',
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Crear pago"
      footer={footer}
      className="w-full max-w-3xl"
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
            <label htmlFor="pago-monto">
              Monto <span className="text-red-500">*</span>
            </label>
            <Controller
              name="monto"
              control={control}
              rules={{
                required: 'El monto es obligatorio.',
                validate: (value) =>
                  !Number.isNaN(Number(value)) && Number(value) > 0
                    ? true
                    : 'El monto debe ser un número válido mayor a cero.',
              }}
              render={({ field }) => (
                <InputText id="pago-monto" {...field} className="w-full" />
              )}
            />
            {errors.monto ? (
              <small className="text-red-500">{errors.monto.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pago-fecha">
              Fecha <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fechaPago"
              control={control}
              rules={{ required: 'La fecha es obligatoria.' }}
              render={({ field }) => (
                <Calendar
                  id="pago-fecha"
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
            {errors.fechaPago ? (
              <small className="text-red-500">{errors.fechaPago.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="pago-detalles">Detalle / Nro Transaccion</label>
            <Controller
              name="detalles"
              control={control}
              render={({ field }) => (
                <InputText
                  id="pago-detalles"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="pago-comprobante-adjunto">Comprobante de transferencia</label>
            <Controller
              name="comprobantePagoBase64"
              control={control}
              render={({ field }) => (
                <>
                  <FileUpload
                    mode="basic"
                    name="pago-comprobante-adjunto"
                    customUpload
                    auto={false}
                    chooseLabel="Seleccionar archivo"
                    accept="application/pdf,image/*"
                    maxFileSize={10000000}
                    chooseOptions={{
                      icon: 'pi pi-upload',
                    }}
                    onSelect={(event) =>
                      handleSelectFile(event, ({ base64, mimeType, fileName }) => {
                        field.onChange(base64);
                        setValue('comprobantePagoMimeType', mimeType);
                        setValue('comprobantePagoNombre', fileName);
                      })
                    }
                  />
                  {currentAttachmentName || field.value ? (
                    <div className="flex items-center gap-2">
                      <small>{currentAttachmentName ?? 'Adjunto seleccionado'}</small>
                      <Button
                        type="button"
                        label="Quitar"
                        icon="pi pi-times"
                        iconPos="right"
                        outlined
                        size="small"
                        onClick={() => {
                          field.onChange(null);
                          setValue('comprobantePagoMimeType', null);
                          setValue('comprobantePagoNombre', null);
                        }}
                      />
                    </div>
                  ) : null}
                </>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pago-miembro">
              Miembro <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idMiembro"
              control={control}
              rules={{ required: 'Debes seleccionar un miembro.' }}
              render={({ field }) => (
                <Dropdown
                  id="pago-miembro"
                  value={field.value}
                  options={miembroOptions}
                  optionLabel="label"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  className="w-full"
                  placeholder="Seleccioná un miembro"
                  filter
                />
              )}
            />
            {errors.idMiembro ? (
              <small className="text-red-500">{errors.idMiembro.message}</small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pago-cuenta-destino">
              Cuenta destino <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idCuentaDinero"
              control={control}
              rules={{ required: 'Debes seleccionar una cuenta destino.' }}
              render={({ field }) => (
                <Dropdown
                  id="pago-cuenta-destino"
                  value={field.value}
                  options={cuentaOptions}
                  optionLabel="label"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  className="w-full"
                  placeholder="Seleccioná una cuenta"
                  filter
                />
              )}
            />
            {errors.idCuentaDinero ? (
              <small className="text-red-500">
                {errors.idCuentaDinero.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pago-cuenta-origen">Cuenta origen</label>
            <Controller
              name="idCuentaOrigen"
              control={control}
              rules={{
                validate: (value, formValues) =>
                  !value || value !== formValues.idCuentaDinero
                    ? true
                    : 'La cuenta de origen y destino no pueden coincidir.',
              }}
              render={({ field }) => (
                <Dropdown
                  id="pago-cuenta-origen"
                  value={field.value}
                  options={cuentaOptions}
                  optionLabel="label"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  className="w-full"
                  placeholder="Sin cuenta origen"
                  showClear
                  filter
                />
              )}
            />
            {errors.idCuentaOrigen ? (
              <small className="text-red-500">
                {errors.idCuentaOrigen.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pago-concepto">
              Concepto <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idConceptoPago"
              control={control}
              rules={{ required: 'Debes seleccionar un concepto.' }}
              render={({ field }) => (
                <Dropdown
                  id="pago-concepto"
                  value={field.value}
                  options={options.conceptos}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  className="w-full"
                  placeholder="Seleccioná un concepto"
                />
              )}
            />
            {errors.idConceptoPago ? (
              <small className="text-red-500">
                {errors.idConceptoPago.message}
              </small>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pago-metodo">
              Método <span className="text-red-500">*</span>
            </label>
            <Controller
              name="idMetodoPago"
              control={control}
              rules={{ required: 'Debes seleccionar un método.' }}
              render={({ field }) => (
                <Dropdown
                  id="pago-metodo"
                  value={field.value}
                  options={options.metodos}
                  optionLabel="nombre"
                  optionValue="id"
                  onChange={(event: DropdownChangeEvent) =>
                    field.onChange(event.value as number | null)
                  }
                  className="w-full"
                  placeholder="Seleccioná un método"
                />
              )}
            />
            {errors.idMetodoPago ? (
              <small className="text-red-500">
                {errors.idMetodoPago.message}
              </small>
            ) : null}
          </div>
        </div>
      )}
    </Dialog>
  );
}
