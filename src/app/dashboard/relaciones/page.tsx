'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { RelacionFormDialog } from '@/components/relaciones/RelacionFormDialog';
import { useRelacionesHook } from '@/hooks/useRelacionesHooks';
import { Relacion } from '@/types/relaciones';

export default function RelacionesPage() {
  const {
    relaciones,
    selectedRelacion,
    setSelectedRelacion,
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
  } = useRelacionesHook();

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedRelacion) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminará la relación "${selectedRelacion.tipo}".`,
    );

    if (confirmed) {
      void deleteSelected();
    }
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div />
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          label="Crear"
          icon="pi pi-plus"
          iconPos="right"
          outlined
          size="small"
          onClick={openCreateDialog}
        />
        <Button
          type="button"
          label="Editar"
          icon="pi pi-pencil"
          iconPos="right"
          outlined
          size="small"
          onClick={() => void openEditDialog()}
          disabled={!selectedRelacion}
        />
        <Button
          type="button"
          label="Eliminar"
          icon="pi pi-trash"
          iconPos="right"
          outlined
          size="small"
          severity="danger"
          onClick={handleDelete}
          disabled={!selectedRelacion}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Relaciones" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={relaciones}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedRelacion}
          onSelectionChange={(event) =>
            setSelectedRelacion((event.value as Relacion | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay relaciones disponibles."
          tableStyle={{ minWidth: '42rem', width: '100%' }}
        >
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column field="tipo" header="Nombre" />
          <Column
            field="descripcion"
            header="Descripción"
            body={(relacion: Relacion) => relacion.descripcion || '-'}
          />
          <Column
            header="Responsabilidades"
            body={(relacion: Relacion) => relacion._count.Responsabilidad}
          />
        </DataTable>
      </Card>

      <RelacionFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
    </div>
  );
}
