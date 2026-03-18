'use client';

import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { useAuth } from '@/context/AuthContext';
import { MetodoPagoFormDialog } from '@/components/metodos-pago/MetodoPagoFormDialog';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useMetodosPagoHook } from '@/hooks/useMetodosPagoHooks';
import { hasDeveloperAccess } from '@/lib/authorization';
import { MetodoPago } from '@/types/metodos-pago';

export default function MetodosPagoPage() {
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    metodosPago,
    selectedMetodoPago,
    setSelectedMetodoPago,
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
  } = useMetodosPagoHook();
  const canSeeId = hasDeveloperAccess(user);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedMetodoPago) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica el método "${selectedMetodoPago.nombre}".`,
      impact:
        'El método dejará de estar disponible en nuevos pagos y puede afectar formularios o referencias visibles de movimientos ya registrados.',
      onAccept: () => void deleteSelected(),
    });
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div />
      <ResponsiveTableActions
        crudActions={[
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            onClick: openCreateDialog,
          },
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            onClick: () => void openEditDialog(),
            disabled: !selectedMetodoPago,
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            onClick: handleDelete,
            disabled: !selectedMetodoPago,
            severity: 'danger' as const,
          },
        ]}
      />
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Métodos de Pago" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={metodosPago}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedMetodoPago}
          onSelectionChange={(event) =>
            setSelectedMetodoPago((event.value as MetodoPago | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay métodos de pago disponibles."
          tableStyle={{ minWidth: '42rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="nombre" header="Nombre" />
          <Column
            field="descripcion"
            header="Descripción"
            body={(metodoPago: MetodoPago) => metodoPago.descripcion || '-'}
          />
          <Column
            header="Pagos asociados"
            body={(metodoPago: MetodoPago) => metodoPago._count.Pago}
          />
        </DataTable>
      </Card>

      <MetodoPagoFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
      {deleteConfirmDialog}
    </div>
  );
}
