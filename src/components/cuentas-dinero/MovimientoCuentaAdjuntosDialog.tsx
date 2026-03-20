'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { getResponsiveDialogProps } from '@/lib/dialog';
import {
  MovimientoCuentaAdjuntoPayload,
  MovimientoCuentaAdjuntosFormValues,
} from '@/types/cuentas-dinero';

interface MovimientoCuentaAdjuntosDialogProps {
  visible: boolean;
  submitting: boolean;
  values: MovimientoCuentaAdjuntosFormValues;
  error: string;
  onHide: () => void;
  onChange: (values: MovimientoCuentaAdjuntosFormValues) => void;
  onSubmit: () => void;
}

export function MovimientoCuentaAdjuntosDialog({
  visible,
  submitting,
  values,
  error,
  onHide,
  onChange,
  onSubmit,
}: MovimientoCuentaAdjuntosDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!visible) {
      onChange({ adjuntos: [] });
    }
  }, [onChange, visible]);

  const handleSelectFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    const nextAdjuntos = await Promise.all(
      files.map(
        (file) =>
          new Promise<MovimientoCuentaAdjuntoPayload>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result !== 'string') {
                reject(new Error('No se pudo leer el archivo.'));
                return;
              }

              resolve({
                archivoBase64: reader.result,
                mimeType: file.type || 'application/octet-stream',
                nombre: file.name,
              });
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );

    onChange({
      adjuntos: [...values.adjuntos, ...nextAdjuntos],
    });

    if (event.target) {
      event.target.value = '';
    }
  };

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
        label="Agregar"
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={onSubmit}
        loading={submitting}
        disabled={!values.adjuntos.length}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Agregar adjuntos"
      footer={footer}
      {...getResponsiveDialogProps('40rem')}
    >
      {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}

      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void handleSelectFiles(event);
          }}
        />

        <div>
          <Button
            type="button"
            label="Seleccionar archivos"
            icon="pi pi-upload"
            iconPos="right"
            outlined
            size="small"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>

        {values.adjuntos.length ? (
          <div className="flex flex-col gap-2">
            {values.adjuntos.map((adjunto, index) => (
              <div
                key={`${adjunto.nombre}-${index}`}
                className="flex items-center justify-between gap-2"
              >
                <small>{adjunto.nombre}</small>
                <Button
                  type="button"
                  label="Quitar"
                  icon="pi pi-times"
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={() =>
                    onChange({
                      adjuntos: values.adjuntos.filter(
                        (_item, currentIndex) => currentIndex !== index,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <small>No hay adjuntos seleccionados.</small>
        )}
      </div>
    </Dialog>
  );
}
