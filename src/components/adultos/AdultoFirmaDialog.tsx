'use client';

import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  useEffect,
  useRef,
} from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

interface AdultoFirmaDialogProps {
  visible: boolean;
  adultoNombre: string;
  firmaBase64: string | null;
  loading: boolean;
  submitting: boolean;
  editable: boolean;
  error: string;
  onHide: () => void;
  onSave: (firmaBase64: string | null) => void;
}

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 280;

export function AdultoFirmaDialog({
  visible,
  adultoNombre,
  firmaBase64,
  loading,
  submitting,
  editable,
  error,
  onHide,
  onSave,
}: AdultoFirmaDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const hasStrokeRef = useRef(false);

  useEffect(() => {
    if (!visible || loading) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#111827';
    context.lineWidth = 2;
    hasStrokeRef.current = Boolean(firmaBase64);

    if (!firmaBase64) {
      return;
    }

    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = firmaBase64;
  }, [editable, firmaBase64, loading, visible]);

  const getPoint = (
    event: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const source =
      'touches' in event ? event.touches[0] ?? event.changedTouches[0] : event;

    if (!source) {
      return null;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (source.clientX - rect.left) * scaleX,
      y: (source.clientY - rect.top) * scaleY,
    };
  };

  const beginDrawing = (
    event: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    const point = getPoint(event);

    if (!canvas || !point) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    event.preventDefault();
    context.beginPath();
    context.moveTo(point.x, point.y);
    isDrawingRef.current = true;
    hasStrokeRef.current = true;
  };

  const draw = (
    event: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawingRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const point = getPoint(event);

    if (!canvas || !point) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    event.preventDefault();
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = (resetPersisted = false) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokeRef.current = false;
    if (resetPersisted) {
      endDrawing();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    onSave(hasStrokeRef.current ? canvas.toDataURL('image/png') : null);
  };

  const footer = (
    <div className="flex flex-wrap justify-end gap-2">
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
        label="Rehacer"
        icon="pi pi-refresh"
        iconPos="right"
        outlined
        size="small"
        onClick={() => clearCanvas(true)}
        disabled={submitting || !editable}
      />
      <Button
        type="button"
        label="Eliminar firma"
        icon="pi pi-trash"
        iconPos="right"
        outlined
        size="small"
        severity="danger"
        onClick={() => onSave(null)}
        disabled={submitting || !editable}
      />
      <Button
        type="button"
        label="Guardar firma"
        icon={submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        iconPos="right"
        outlined
        size="small"
        onClick={handleSave}
        loading={submitting}
        disabled={!editable}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={`Firma de ${adultoNombre}`}
      footer={footer}
      className="w-full max-w-4xl"
      modal
    >
      {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
      {loading ? (
        <div className="py-4">Cargando firma...</div>
      ) : (
        <div className="flex flex-col gap-3">
          <span>Firmá en el recuadro y guardá el cambio cuando termines.</span>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="bg-gray-300 touch-none"
            onMouseDown={beginDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={beginDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
          {!editable ? (
            <small>No tienes permisos para editar esta firma.</small>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}
