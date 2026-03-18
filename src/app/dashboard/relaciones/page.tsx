'use client';

import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { useAuth } from '@/context/AuthContext';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { RelacionFormDialog } from '@/components/relaciones/RelacionFormDialog';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useRelacionesHook } from '@/hooks/useRelacionesHooks';
import { hasDeveloperAccess } from '@/lib/authorization';
import { Relacion } from '@/types/relaciones';

export default function RelacionesPage() {
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
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
  const canSeeId = hasDeveloperAccess(user);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedRelacion) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica la relación "${selectedRelacion.tipo}".`,
      impact:
        'La relación dejará de poder usarse en nuevas asignaciones y puede afectar la lectura de responsabilidades asociadas en pantallas operativas.',
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
            disabled: !selectedRelacion,
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            onClick: handleDelete,
            disabled: !selectedRelacion,
            severity: 'danger' as const,
          },
        ]}
      />
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
          rowClassName={(data) =>
            selectedRelacion?.id === data.id ? 'p-highlight' : ''
          }
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
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
      {deleteConfirmDialog}
    </div>
  );
}
