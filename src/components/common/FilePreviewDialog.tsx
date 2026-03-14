'use client';

import { useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

interface FilePreviewDialogProps {
  visible: boolean;
  title: string;
  fileName: string;
  mimeType: string;
  blob: Blob | null;
  loading?: boolean;
  error?: string;
  onHide: () => void;
}

const isPdfMime = (mimeType: string) => mimeType.toLowerCase().includes('pdf');
const isImageMime = (mimeType: string) => mimeType.toLowerCase().startsWith('image/');

export function FilePreviewDialog({
  visible,
  title,
  fileName,
  mimeType,
  blob,
  loading = false,
  error = '',
  onHide,
}: FilePreviewDialogProps) {
  const objectUrl = useMemo(
    () => (visible && blob ? window.URL.createObjectURL(blob) : null),
    [blob, visible],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const canPreviewPdf = useMemo(
    () => (mimeType ? isPdfMime(mimeType) : false),
    [mimeType],
  );
  const canPreviewImage = useMemo(
    () => (mimeType ? isImageMime(mimeType) : false),
    [mimeType],
  );

  const handleDownload = () => {
    if (!blob || !objectUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const footer = (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        type="button"
        label="Cerrar"
        icon="pi pi-times"
        iconPos="right"
        outlined
        size="small"
        onClick={onHide}
      />
      <Button
        type="button"
        label="Descargar"
        icon="pi pi-download"
        iconPos="right"
        outlined
        size="small"
        onClick={handleDownload}
        disabled={!blob || loading}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer}
      className="w-full max-w-6xl"
      modal
    >
      {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
      {loading ? (
        <div className="py-4">Generando preview...</div>
      ) : null}
      {!loading && blob && objectUrl && canPreviewPdf ? (
        <iframe
          title={title}
          src={objectUrl}
          className="h-[75vh] w-full"
        />
      ) : null}
      {!loading && blob && objectUrl && canPreviewImage ? (
        <div className="flex justify-center">
          <object
            data={objectUrl}
            type={mimeType}
            aria-label={fileName}
            className="max-h-[75vh] max-w-full"
          />
        </div>
      ) : null}
      {!loading && blob && objectUrl && !canPreviewPdf && !canPreviewImage ? (
        <Message
          severity="warn"
          text="No hay preview disponible para este tipo de archivo."
          className="w-full"
        />
      ) : null}
    </Dialog>
  );
}
