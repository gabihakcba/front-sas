'use client';

import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { useAuth } from '@/context/AuthContext';
import { TipoEventoFormDialog } from '@/components/tipos-evento/TipoEventoFormDialog';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useTiposEventoHook } from '@/hooks/useTiposEventoHooks';
import { hasDeveloperAccess } from '@/lib/authorization';
import { TipoEvento } from '@/types/tipos-evento';

export default function TiposEventoPage() {
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
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
  const canSeeId = hasDeveloperAccess(user);

  const handleDelete = () => {
    if (!selectedTipoEvento) return;
    confirmDelete({
      message: `Se eliminará de forma lógica el tipo de evento "${selectedTipoEvento.nombre}".`,
      impact:
        'El tipo dejará de estar disponible en altas y ediciones, y puede impactar eventos existentes que todavía lo referencien en la interfaz.',
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
            disabled: !selectedTipoEvento,
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            onClick: handleDelete,
            disabled: !selectedTipoEvento,
            severity: 'danger' as const,
          },
        ]}
      />
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Tipos de Evento" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? <Message severity="success" text={successMessage} className="mb-3 w-full" /> : null}
        <DataTable value={tiposEvento} dataKey="id" loading={loading} lazy paginator header={header} selectionMode="single" selection={selectedTipoEvento} onSelectionChange={(event) => setSelectedTipoEvento((event.value as TipoEvento | null) ?? null)} first={(page - 1) * limit} rows={10} totalRecords={total} onPage={(event: DataTablePageEvent) => void refetch(Math.floor(event.first / event.rows) + 1)} emptyMessage="No hay tipos de evento disponibles." tableStyle={{ minWidth: '42rem', width: '100%' }}>
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="nombre" header="Nombre" />
          <Column header="Descripción" body={(tipoEvento: TipoEvento) => tipoEvento.descripcion ?? '-'} />
          <Column header="Eventos" body={(tipoEvento: TipoEvento) => tipoEvento._count.Evento} />
        </DataTable>
      </Card>
      <TipoEventoFormDialog visible={dialogVisible} mode={dialogMode} loading={dialogLoading} submitting={submitting} values={formValues} error={error} onHide={closeDialog} onSubmit={(values) => void submitForm(values)} />
      {deleteConfirmDialog}
    </div>
  );
}
