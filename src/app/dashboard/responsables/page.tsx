'use client';

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { hasPermissionAccess } from '@/lib/authorization';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useResponsablesHook } from '@/hooks/useResponsablesHooks';
import { Responsable } from '@/types/responsables';
import { ResponsableAsignacionDialog } from '@/components/responsables/ResponsableAsignacionDialog';
import { ResponsableFormDialog } from '@/components/responsables/ResponsableFormDialog';

const formatAssignedNames = (responsable: Responsable) =>
  responsable.Responsabilidad.map(
    (item) =>
      `${item.Protagonista.Miembro.apellidos}, ${item.Protagonista.Miembro.nombre}`,
  ).join(', ');

export default function ResponsablesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    responsables,
    selectedResponsable,
    setSelectedResponsable,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    assignmentDialogVisible,
    assignmentValues,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    assignmentSubmitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    openAssignmentDialog,
    closeDialog,
    closeAssignmentDialog,
    setAssignmentValues,
    submitForm,
    submitAssignments,
    deleteSelected,
  } = useResponsablesHook();

  const canCreate = hasPermissionAccess(user, 'CREATE:RESPONSABLE');
  const canEdit = hasPermissionAccess(user, 'UPDATE:RESPONSABLE');
  const canDelete = hasPermissionAccess(user, 'DELETE:RESPONSABLE');
  const canAssign = hasPermissionAccess(user, 'UPDATE:RESPONSABLE');

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedResponsable) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica a ${selectedResponsable.Miembro.nombre} ${selectedResponsable.Miembro.apellidos}.`,
      impact:
        'El responsable dejará de estar disponible en listados operativos y puede impactar asignaciones, pagos asociados y referencias visibles sobre protagonistas a cargo.',
      onAccept: () => void deleteSelected(),
    });
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {canAssign ? (
          <Button
            type="button"
            label="Relaciones"
            icon="pi pi-link"
            iconPos="right"
            outlined
            size="small"
            onClick={() => router.push('/dashboard/relaciones')}
          />
        ) : null}
        {canAssign ? (
          <Button
            type="button"
            label="Responsabilidades"
            icon="pi pi-sitemap"
            iconPos="right"
            outlined
            size="small"
            onClick={() => void openAssignmentDialog()}
            disabled={!selectedResponsable}
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-center">
        <IconField iconPosition="right">
          <InputText
            value={filters.q}
            onChange={(event) =>
              setFilters({
                q: event.target.value,
              })
            }
            placeholder="Buscar responsable"
          />
          <InputIcon className="pi pi-search" />
        </IconField>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
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
            disabled={!selectedResponsable}
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
            disabled={!selectedResponsable}
          />
        ) : null}
      </div>
    </div>
  );

  const rows = useMemo(() => responsables, [responsables]);

  return (
    <Card title="Responsables">
      <div className="flex flex-col gap-4">
        {error ? <Message severity="error" text={error} /> : null}
        {successMessage ? <Message severity="success" text={successMessage} /> : null}

        <DataTable
          value={rows}
          selectionMode="single"
          selection={selectedResponsable}
          onSelectionChange={(event) =>
            setSelectedResponsable((event.value as Responsable | null) ?? null)
          }
          dataKey="id"
          loading={loading}
          paginator
          lazy
          rows={limit}
          totalRecords={total}
          first={(page - 1) * limit}
          onPage={handlePage}
          header={header}
          emptyMessage="No hay responsables para mostrar."
          className="p-datatable-sm"
        >
          <Column
            field="Miembro.Cuenta.user"
            header="Usuario"
            body={(responsable: Responsable) => responsable.Miembro.Cuenta.user}
          />
          <Column
            field="Miembro.nombre"
            header="Nombre"
            body={(responsable: Responsable) =>
              `${responsable.Miembro.nombre} ${responsable.Miembro.apellidos}`
            }
          />
          <Column
            field="Miembro.dni"
            header="DNI"
            body={(responsable: Responsable) => responsable.Miembro.dni}
          />
          <Column
            field="Miembro.email"
            header="Email"
            body={(responsable: Responsable) => responsable.Miembro.email ?? '-'}
          />
          <Column
            field="Miembro.telefono"
            header="Teléfono"
            body={(responsable: Responsable) => responsable.Miembro.telefono ?? '-'}
          />
          <Column
            header="Perfil"
            body={(responsable: Responsable) => (
              <Button
                type="button"
                icon="pi pi-eye"
                iconPos="right"
                outlined
                size="small"
                onClick={() =>
                  router.push(`/dashboard/perfil/${responsable.Miembro.id}`)
                }
              />
            )}
          />
          <Column
            header="Responsabilidades"
            body={(responsable: Responsable) =>
              responsable.Responsabilidad.length > 0
                ? formatAssignedNames(responsable)
                : '-'
            }
          />
          <Column
            header="F. nac."
            body={(responsable: Responsable) =>
              dayjs(responsable.Miembro.fecha_nacimiento).isValid()
                ? dayjs(responsable.Miembro.fecha_nacimiento).format('DD/MM/YYYY')
                : '-'
            }
          />
        </DataTable>
      </div>

      {canCreate || canEdit ? (
        <ResponsableFormDialog
          visible={dialogVisible}
          mode={dialogMode}
          loading={dialogLoading}
          submitting={submitting}
          values={formValues}
          error={error}
          onHide={closeDialog}
          onSubmit={(values) => void submitForm(values)}
        />
      ) : null}

      {canAssign ? (
        <ResponsableAsignacionDialog
          visible={assignmentDialogVisible}
          submitting={assignmentSubmitting}
          protagonistas={options.protagonistas}
          values={assignmentValues}
          error={error}
          onHide={closeAssignmentDialog}
          onChange={setAssignmentValues}
          onSubmit={() => void submitAssignments()}
        />
      ) : null}
      {deleteConfirmDialog}
    </Card>
  );
}
