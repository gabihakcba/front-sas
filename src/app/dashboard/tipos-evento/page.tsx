'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { TipoEventoFormDialog } from '@/components/tipos-evento/TipoEventoFormDialog';
import { useTiposEventoHook } from '@/hooks/useTiposEventoHooks';
import { TipoEvento } from '@/types/tipos-evento';

export default function TiposEventoPage() {
  const {
    tiposEvento,
    selectedTipoEvento,
    setSelectedTipoEvento,
    formValues,
    dialogMode,
    dialogVisible,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total,
    limit,
    refetch,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  } = useTiposEventoHook();

  const handleDelete = () => {
    if (!selectedTipoEvento) return;
    const confirmed = window.confirm(
      `Se eliminará el tipo de evento "${selectedTipoEvento.nombre}".`,
    );
    if (confirmed) void deleteSelected();
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div />
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" label="Crear" icon="pi pi-plus" iconPos="right" outlined size="small" onClick={openCreateDialog} />
        <Button type="button" label="Editar" icon="pi pi-pencil" iconPos="right" outlined size="small" onClick={() => void openEditDialog()} disabled={!selectedTipoEvento} />
        <Button type="button" label="Eliminar" icon="pi pi-trash" iconPos="right" outlined size="small" severity="danger" onClick={handleDelete} disabled={!selectedTipoEvento} />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Tipos de Evento" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? <Message severity="success" text={successMessage} className="mb-3 w-full" /> : null}
        <DataTable value={tiposEvento} dataKey="id" loading={loading} lazy paginator header={header} selectionMode="single" selection={selectedTipoEvento} onSelectionChange={(event) => setSelectedTipoEvento((event.value as TipoEvento | null) ?? null)} first={(page - 1) * limit} rows={10} totalRecords={total} onPage={(event: DataTablePageEvent) => void refetch(Math.floor(event.first / event.rows) + 1)} emptyMessage="No hay tipos de evento disponibles." tableStyle={{ minWidth: '42rem', width: '100%' }}>
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column field="nombre" header="Nombre" />
          <Column header="Descripción" body={(tipoEvento: TipoEvento) => tipoEvento.descripcion ?? '-'} />
          <Column header="Eventos" body={(tipoEvento: TipoEvento) => tipoEvento._count.Evento} />
        </DataTable>
      </Card>
      <TipoEventoFormDialog visible={dialogVisible} mode={dialogMode} loading={dialogLoading} submitting={submitting} values={formValues} error={error} onHide={closeDialog} onSubmit={(values) => void submitForm(values)} />
    </div>
  );
}
