'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { CuentaDineroFormDialog } from '@/components/cuentas-dinero/CuentaDineroFormDialog';
import { useCuentasDineroHook } from '@/hooks/useCuentasDineroHooks';
import { CuentaDinero } from '@/types/cuentas-dinero';

export default function CuentasDineroPage() {
  const {
    cuentasDinero,
    selectedCuentaDinero,
    setSelectedCuentaDinero,
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
  } = useCuentasDineroHook();

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedCuentaDinero) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminará de forma lógica la cuenta "${selectedCuentaDinero.nombre}".`,
    );

    if (confirmed) {
      void deleteSelected();
    }
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <span className="text-lg font-semibold">Listado</span>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          label="Crear"
          icon="pi pi-plus"
          iconPos="right"
          outlined
          size="small"
          onClick={() => void openCreateDialog()}
        />
        <Button
          type="button"
          label="Editar"
          icon="pi pi-pencil"
          iconPos="right"
          outlined
          size="small"
          onClick={() => void openEditDialog()}
          disabled={!selectedCuentaDinero}
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
          disabled={!selectedCuentaDinero}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Cuentas de Dinero" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={cuentasDinero}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedCuentaDinero}
          onSelectionChange={(event) =>
            setSelectedCuentaDinero((event.value as CuentaDinero | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay cuentas de dinero disponibles para tu scope actual."
          tableStyle={{ minWidth: '52rem', width: '100%' }}
        >
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column field="nombre" header="Nombre" />
          <Column
            header="Descripción"
            body={(cuenta: CuentaDinero) => cuenta.descripcion || '-'}
          />
          <Column field="monto_actual" header="Monto actual" />
          <Column
            header="Asignación"
            body={(cuenta: CuentaDinero) =>
              cuenta.Rama
                ? `Rama: ${cuenta.Rama.nombre}`
                : cuenta.Area
                  ? `Área: ${cuenta.Area.nombre}`
                  : '-'
            }
          />
          <Column
            header="Pagos asociados"
            body={(cuenta: CuentaDinero) => cuenta._count.Pago}
          />
        </DataTable>
      </Card>

      <CuentaDineroFormDialog
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
