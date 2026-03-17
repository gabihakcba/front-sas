'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ComisionFormDialog } from '@/components/comisiones/ComisionFormDialog';
import { ComisionParticipantesDialog } from '@/components/comisiones/ComisionParticipantesDialog';
import { useComisionesHook } from '@/hooks/useComisionesHooks';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { hasPermissionAccess } from '@/lib/authorization';
import { Comision } from '@/types/comisiones';

export default function ComisionesPage() {
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    comisiones,
    selectedComision,
    setSelectedComision,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    participantesVisible,
    participanteIds,
    setParticipanteIds,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    openParticipantesDialog,
    closeDialog,
    closeParticipantesDialog,
    submitForm,
    submitParticipantes,
    deleteSelected,
  } = useComisionesHook();

  const canCreate = hasPermissionAccess(user, 'CREATE:COMISION');
  const canEdit = hasPermissionAccess(user, 'UPDATE:COMISION');
  const canDelete = hasPermissionAccess(user, 'DELETE:COMISION');

  const handleDelete = () => {
    if (!selectedComision) return;
    confirmDelete({
      message: `Se eliminará de forma lógica la comisión "${selectedComision.nombre}".`,
      impact:
        'La comisión dejará de estar disponible en listados operativos y puede afectar la visualización de participantes, vínculos con eventos y referencias históricas visibles.',
      onAccept: () => void deleteSelected(),
    });
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        {canEdit ? <Button type="button" label="Adultos" icon="pi pi-users" iconPos="right" outlined size="small" onClick={() => void openParticipantesDialog()} disabled={!selectedComision} /> : null}
        <IconField iconPosition="right">
          <InputText
            value={filters.q}
            onChange={(event) =>
              setFilters({
                ...filters,
                q: event.target.value,
              })
            }
            placeholder="Buscar por nombre o descripción"
          />
          <InputIcon className="pi pi-search" />
        </IconField>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {canCreate ? <Button type="button" label="Crear" icon="pi pi-plus" iconPos="right" outlined size="small" onClick={openCreateDialog} /> : null}
        {canEdit ? <Button type="button" label="Editar" icon="pi pi-pencil" iconPos="right" outlined size="small" onClick={() => void openEditDialog()} disabled={!selectedComision} /> : null}
        {canDelete ? <Button type="button" label="Eliminar" icon="pi pi-trash" iconPos="right" outlined size="small" severity="danger" onClick={handleDelete} disabled={!selectedComision} /> : null}
      </div>
    </div>
  );

  const eventoHeader = (
    <Dropdown
      value={filters.idEvento}
      options={options.eventos}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idEvento: (event.value as number | null) ?? null,
        })
      }
      placeholder="Evento"
      showClear
    />
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
          <Column header={eventoHeader} body={(comision: Comision) => comision.Evento?.nombre ?? '-'} />
          <Column header="Participantes" body={(comision: Comision) => comision._count.ParticipantesComision} />
        </DataTable>
      </Card>
      <ComisionFormDialog visible={dialogVisible} mode={dialogMode} loading={dialogLoading} submitting={submitting} values={formValues} eventos={options.eventos} error={error} onHide={closeDialog} onSubmit={(values) => void submitForm(values)} />
      <ComisionParticipantesDialog visible={participantesVisible} submitting={submitting} adultos={options.adultos} selectedIds={participanteIds} error={error} onHide={closeParticipantesDialog} onChange={setParticipanteIds} onSubmit={() => void submitParticipantes()} />
      {deleteConfirmDialog}
    </div>
  );
}
