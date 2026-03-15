'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ComisionFormDialog } from '@/components/comisiones/ComisionFormDialog';
import { useComisionesHook } from '@/hooks/useComisionesHooks';
import { Comision } from '@/types/comisiones';

export default function ComisionesPage() {
  const {
    comisiones,
    selectedComision,
    setSelectedComision,
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
  } = useComisionesHook();

  const handleDelete = () => {
    if (!selectedComision) return;
    const confirmed = window.confirm(`Se eliminará la comisión "${selectedComision.nombre}".`);
    if (confirmed) void deleteSelected();
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div />
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" label="Crear" icon="pi pi-plus" iconPos="right" outlined size="small" onClick={openCreateDialog} />
        <Button type="button" label="Editar" icon="pi pi-pencil" iconPos="right" outlined size="small" onClick={() => void openEditDialog()} disabled={!selectedComision} />
        <Button type="button" label="Eliminar" icon="pi pi-trash" iconPos="right" outlined size="small" severity="danger" onClick={handleDelete} disabled={!selectedComision} />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Comisiones" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? <Message severity="success" text={successMessage} className="mb-3 w-full" /> : null}
        <DataTable value={comisiones} dataKey="id" loading={loading} lazy paginator header={header} selectionMode="single" selection={selectedComision} onSelectionChange={(event) => setSelectedComision((event.value as Comision | null) ?? null)} first={(page - 1) * limit} rows={10} totalRecords={total} onPage={(event: DataTablePageEvent) => void refetch(Math.floor(event.first / event.rows) + 1)} emptyMessage="No hay comisiones disponibles." tableStyle={{ minWidth: '48rem', width: '100%' }}>
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column field="nombre" header="Nombre" />
          <Column header="Descripción" body={(comision: Comision) => comision.descripcion ?? '-'} />
          <Column header="Evento" body={(comision: Comision) => comision.Evento?.nombre ?? '-'} />
          <Column header="Participantes" body={(comision: Comision) => comision._count.ParticipantesComision} />
        </DataTable>
      </Card>
      <ComisionFormDialog visible={dialogVisible} mode={dialogMode} loading={dialogLoading} submitting={submitting} values={formValues} error={error} onHide={closeDialog} onSubmit={(values) => void submitForm(values)} />
    </div>
  );
}
