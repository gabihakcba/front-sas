'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { ConsejoTemarioItem } from '@/types/consejos';

interface ConsejoTemarioDialogProps {
  visible: boolean;
  canEdit: boolean;
  loading: boolean;
  submitting: boolean;
  error: string;
  successMessage: string;
  items: ConsejoTemarioItem[];
  selectedItem: ConsejoTemarioItem | null;
  onSelectionChange: (item: ConsejoTemarioItem | null) => void;
  onHide: () => void;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const estadoLabel = (estado: string) => {
  switch (estado) {
    case 'EN_TRATAMIENTO':
      return 'En tratamiento';
    case 'TRATADO':
      return 'Tratado';
    case 'POSPUESTO':
      return 'Pospuesto';
    default:
      return 'Pendiente';
  }
};

const getEstadoColorClass = (value: string) => {
  switch (value) {
    case 'EN_TRATAMIENTO':
      return 'text-yellow-500';
    case 'TRATADO':
      return 'text-green-500';
    case 'POSPUESTO':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};

const getSinMpColorClass = (sinMp: boolean) =>
  sinMp ? 'text-red-500' : 'text-green-500';

export function ConsejoTemarioDialog({
  visible,
  canEdit,
  loading,
  submitting,
  error,
  successMessage,
  items,
  selectedItem,
  onSelectionChange,
  onHide,
  onCreate,
  onEdit,
  onDelete,
}: ConsejoTemarioDialogProps) {
  const footer = (
    <div className="flex justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        {canEdit ? (
          <>
            <Button
              type="button"
              label="Agregar tema"
              icon="pi pi-plus"
              iconPos="right"
              outlined
              size="small"
              onClick={onCreate}
            />
            <Button
              type="button"
              label="Editar"
              icon="pi pi-pencil"
              iconPos="right"
              outlined
              size="small"
              onClick={onEdit}
              disabled={!selectedItem || submitting}
            />
            <Button
              type="button"
              label="Eliminar"
              icon="pi pi-trash"
              iconPos="right"
              outlined
              size="small"
              severity="danger"
              onClick={onDelete}
              disabled={!selectedItem || submitting}
            />
          </>
        ) : null}
      </div>
      <Button
        type="button"
        label="Cerrar"
        icon="pi pi-times"
        iconPos="right"
        outlined
        size="small"
        onClick={onHide}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Temario"
      footer={footer}
      className="w-full max-w-5xl"
      modal
    >
      {error ? <Message severity="error" text={error} className="mb-3" /> : null}
      {successMessage ? (
        <Message severity="success" text={successMessage} className="mb-3" />
      ) : null}

      <DataTable
        value={items}
        dataKey="id"
        loading={loading}
        selectionMode="single"
        selection={selectedItem}
        onSelectionChange={(event) =>
          onSelectionChange((event.value as ConsejoTemarioItem | null) ?? null)
        }
        emptyMessage="No hay temas cargados para este consejo."
        tableStyle={{ minWidth: '64rem', width: '100%' }}
      >
        <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
        <Column field="titulo" header="Titulo" />
        <Column
          header="Estado"
          body={(item: ConsejoTemarioItem) => (
            <span className="flex items-center gap-2">
              <i
                className={`pi pi-circle-fill ${getEstadoColorClass(item.estado)}`}
                title={estadoLabel(item.estado)}
              />
              <span>{estadoLabel(item.estado)}</span>
            </span>
          )}
        />
        <Column
          header="Sin MP"
          body={(item: ConsejoTemarioItem) => (
            <span className="flex items-center gap-2">
              <i
                className={`pi pi-info-circle ${getSinMpColorClass(item.sin_mp)}`}
                title={item.sin_mp ? 'Sin MP' : 'Con MP'}
              />
              <span>{item.sin_mp ? 'Si' : 'No'}</span>
            </span>
          )}
        />
        <Column
          field="descripcion"
          header="Descripcion"
          body={(item: ConsejoTemarioItem) => item.descripcion ?? '-'}
        />
      </DataTable>
    </Dialog>
  );
}
