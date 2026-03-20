'use client';

import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { SpreadsheetImportResult } from '@/types/imports';

interface SpreadsheetImportRamaOption {
  id: number;
  nombre: string;
}

interface SpreadsheetImportDialogProps {
  visible: boolean;
  title: string;
  loading: boolean;
  error: string;
  result: SpreadsheetImportResult | null;
  exampleFilePath?: string;
  exampleFileName?: string;
  ramaOptions?: SpreadsheetImportRamaOption[];
  selectedRamaId?: number | null;
  requireRamaSelection?: boolean;
  onRamaChange?: (id: number | null) => void;
  onHide: () => void;
  onSubmit: (file: File) => Promise<void>;
}

export function SpreadsheetImportDialog({
  visible,
  title,
  loading,
  error,
  result,
  exampleFilePath,
  exampleFileName,
  ramaOptions = [],
  selectedRamaId = null,
  requireRamaSelection = false,
  onRamaChange,
  onHide,
  onSubmit,
}: SpreadsheetImportDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetState = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      onHide={() => {
        resetState();
        onHide();
      }}
      style={{ width: 'min(42rem, calc(100vw - 2rem))' }}
    >
      <div className="flex flex-col gap-3">
        <span>
          Subí una planilla `.xlsx`, `.csv` o `.tsv` con encabezados compatibles.
        </span>
        <span>
          `DNI` se usa automáticamente como `user` y `password` durante la
          importación.
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv,.tsv"
          className="hidden"
          onChange={(event) =>
            setSelectedFile(event.target.files?.[0] ?? null)
          }
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            label={selectedFile ? 'Cambiar archivo' : 'Click para seleccionar archivo'}
            icon="pi pi-paperclip"
            iconPos="right"
            outlined
            size="small"
            onClick={() => inputRef.current?.click()}
          />
          <span>{selectedFile ? selectedFile.name : 'Ningún archivo seleccionado.'}</span>
        </div>
        {requireRamaSelection ? (
          <Dropdown
            value={selectedRamaId}
            options={ramaOptions}
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccionar rama"
            showClear
            onChange={(event: DropdownChangeEvent) =>
              onRamaChange?.((event.value as number | null) ?? null)
            }
          />
        ) : null}
        <span>
          Encabezados recomendados:
          `nombre`, `apellidos`, `dni`, `fechaNacimiento`, `direccion`,
          `telefonoEmergencia` y, según el caso, campos operativos adicionales.
        </span>
        {error ? <Message severity="error" text={error} /> : null}
        {result ? (
          <div className="flex flex-col gap-2">
            <Message
              severity={result.errorCount > 0 ? 'warn' : 'success'}
              text={`Filas: ${result.totalRows} · creadas: ${result.createdCount} · errores: ${result.errorCount}`}
            />
            {result.errors.length > 0 ? (
              <div className="max-h-14rem overflow-y-auto">
                {result.errors.map((item) => (
                  <div key={`${item.rowNumber}-${item.identifier}`} className="mb-2">
                    <strong>Fila {item.rowNumber}</strong>: {item.message}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="flex justify-end gap-2">
          {exampleFilePath ? (
            <Button
              type="button"
              label="Descargar ejemplo"
              icon="pi pi-download"
              iconPos="right"
              outlined
              size="small"
              onClick={() => {
                const apiBaseUrl = (
                  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
                ).replace(/\/+$/, '');
                const href = `${apiBaseUrl}${exampleFilePath.startsWith('/') ? exampleFilePath : `/${exampleFilePath}`}`;
                const anchor = document.createElement('a');
                anchor.href = href;
                anchor.download = exampleFileName ?? '';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
              }}
            />
          ) : null}
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            iconPos="right"
            outlined
            size="small"
            onClick={() => {
              resetState();
              onHide();
            }}
          />
          <Button
            type="button"
            label="Importar"
            icon="pi pi-upload"
            iconPos="right"
            outlined
            size="small"
            disabled={!selectedFile || (requireRamaSelection && !selectedRamaId)}
            loading={loading}
            onClick={() => {
              if (!selectedFile) {
                return;
              }

              void onSubmit(selectedFile);
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
