'use client';

import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { useAuth } from '@/context/AuthContext';
import { ConceptoPagoFormDialog } from '@/components/conceptos-pago/ConceptoPagoFormDialog';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useConceptosPagoHook } from '@/hooks/useConceptosPagoHooks';
import { hasDeveloperAccess } from '@/lib/authorization';
import { ConceptoPago } from '@/types/conceptos-pago';

export default function ConceptosPagoPage() {
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    conceptosPago,
    selectedConceptoPago,
    setSelectedConceptoPago,
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
  } = useConceptosPagoHook();
  const canSeeId = hasDeveloperAccess(user);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedConceptoPago) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica el concepto "${selectedConceptoPago.nombre}".`,
      impact:
        'El concepto dejará de estar disponible en nuevos pagos y puede repercutir en filtros, formularios y referencias visibles de movimientos ya registrados.',
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
            disabled: !selectedConceptoPago,
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            onClick: handleDelete,
            disabled: !selectedConceptoPago,
            severity: 'danger' as const,
          },
        ]}
      />
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Conceptos de Pago" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={conceptosPago}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedConceptoPago}
          onSelectionChange={(event) =>
            setSelectedConceptoPago((event.value as ConceptoPago | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay conceptos de pago disponibles."
          tableStyle={{ minWidth: '42rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="nombre" header="Nombre" />
          <Column
            field="descripcion"
            header="Descripción"
            body={(conceptoPago: ConceptoPago) =>
              conceptoPago.descripcion || '-'
            }
          />
          <Column
            header="Pagos asociados"
            body={(conceptoPago: ConceptoPago) => conceptoPago._count.Pago}
          />
        </DataTable>
      </Card>

      <ConceptoPagoFormDialog
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
