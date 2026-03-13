'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { useAuth } from '@/context/AuthContext';
import { PagoFormDialog } from '@/components/pagos/PagoFormDialog';
import { usePagosHook } from '@/hooks/usePagosHooks';
import { Pago } from '@/types/pagos';

const hasPermission = (permissions: string[], required: string) => {
  if (permissions.includes(required)) {
    return true;
  }

  const [, resource] = required.split(':');
  return permissions.includes(`MANAGE:${resource}`);
};

export default function PagosPage() {
  const { user } = useAuth();
  const {
    pagos,
    selectedPago,
    setSelectedPago,
    formValues,
    options,
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
  } = usePagosHook();

  const permissions = user?.permissions ?? [];
  const canCreate = hasPermission(permissions, 'CREATE:PAGO');
  const canEdit = hasPermission(permissions, 'UPDATE:PAGO');
  const canDelete = hasPermission(permissions, 'DELETE:PAGO');

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedPago) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminará de forma lógica el pago ${selectedPago.codigo_validacion}.`,
    );

    if (confirmed) {
      void deleteSelected();
    }
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <span className="text-lg font-semibold">Listado</span>
      <div className="flex flex-wrap gap-2">
        {canCreate ? (
          <Button
            type="button"
            label="Crear"
            icon="pi pi-plus"
            iconPos="right"
            outlined
            size="small"
            onClick={() => void openCreateDialog()}
          />
        ) : null}
        {canEdit ? (
          <Button
            type="button"
            label="Editar"
            icon="pi pi-pencil"
            iconPos="right"
            outlined
            size="small"
            onClick={() => void openEditDialog()}
            disabled={!selectedPago}
          />
        ) : null}
        {canDelete ? (
          <Button
            type="button"
            label="Eliminar"
            icon="pi pi-trash"
            iconPos="right"
            outlined
            size="small"
            severity="danger"
            onClick={handleDelete}
            disabled={!selectedPago}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Pagos" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={pagos}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedPago}
          onSelectionChange={(event) =>
            setSelectedPago((event.value as Pago | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay pagos disponibles para tu scope actual."
          tableStyle={{ minWidth: '72rem', width: '100%' }}
        >
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column
            header="Fecha"
            body={(pago: Pago) => dayjs(pago.fecha_pago).format('DD/MM/YYYY')}
          />
          <Column field="monto" header="Monto" />
          <Column
            header="Miembro"
            body={(pago: Pago) => `${pago.Miembro.apellidos}, ${pago.Miembro.nombre}`}
          />
          <Column field="ConceptoPago.nombre" header="Concepto" />
          <Column field="MetodoPago.nombre" header="Método" />
          <Column field="CuentaDinero.nombre" header="Cuenta destino" />
          <Column
            header="Cuenta origen"
            body={(pago: Pago) => pago.CuentaOrigen?.nombre ?? '-'}
          />
          <Column
            header="Código"
            body={(pago: Pago) => pago.codigo_validacion.slice(0, 8)}
          />
        </DataTable>
      </Card>

      <PagoFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        options={options}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
    </div>
  );
}
