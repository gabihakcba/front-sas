'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface DeleteConfirmOptions {
  title?: string;
  message: string;
  impact?: string;
  onAccept: () => void | Promise<void>;
}

interface DeleteConfirmState extends DeleteConfirmOptions {
  visible: boolean;
}

const DEFAULT_IMPACT =
  'La acción realiza un borrado lógico. El registro dejará de estar disponible en listados operativos y puede impactar relaciones visibles asociadas.';

export function useDeleteConfirm() {
  const [state, setState] = useState<DeleteConfirmState | null>(null);

  const close = () => setState(null);

  const confirmDelete = (options: DeleteConfirmOptions) => {
    setState({
      visible: true,
      title: options.title ?? 'Confirmar eliminación',
      message: options.message,
      impact: options.impact ?? DEFAULT_IMPACT,
      onAccept: options.onAccept,
    });
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
        onClick={close}
      />
      <Button
        type="button"
        label="Eliminar"
        icon="pi pi-trash"
        iconPos="right"
        outlined
        size="small"
        severity="danger"
        onClick={() => {
          const action = state?.onAccept;
          close();
          action?.();
        }}
      />
    </div>
  );

  const dialog = (
    <Dialog
      visible={Boolean(state?.visible)}
      onHide={close}
      header={state?.title ?? 'Confirmar eliminación'}
      footer={footer}
      className="w-full max-w-xl"
      modal
    >
      <div className="flex flex-col gap-3">
        <span>{state?.message}</span>
        <small>{state?.impact}</small>
      </div>
    </Dialog>
  );

  return {
    confirmDelete,
    deleteConfirmDialog: dialog,
  };
}
