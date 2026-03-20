'use client';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { SpreadsheetImportDialog } from '@/components/common/SpreadsheetImportDialog';
import {
  hasAdultMemberAccess,
  hasDeletedAuditAccess,
  hasDeveloperAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useResponsablesHook } from '@/hooks/useResponsablesHooks';
import { SpreadsheetImportResult } from '@/types/imports';
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
  const [importVisible, setImportVisible] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importResult, setImportResult] = useState<SpreadsheetImportResult | null>(
    null,
  );
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
    importSpreadsheet,
  } = useResponsablesHook();

  const canCreate = hasPermissionAccess(user, 'CREATE:RESPONSABLE');
  const canEdit = hasPermissionAccess(user, 'UPDATE:RESPONSABLE');
  const canDelete = hasPermissionAccess(user, 'DELETE:RESPONSABLE');
  const canAssign = hasPermissionAccess(user, 'UPDATE:RESPONSABLE');
  const canAuditDeleted = hasDeletedAuditAccess(user);
  const canSeeId = hasDeveloperAccess(user);
  const canUseImport = hasAdultMemberAccess(user) && canCreate;

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

  const handleImport = async (file: File) => {
    setImporting(true);
    setImportError('');

    try {
      const result = await importSpreadsheet(file);
      setImportResult(result);
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : 'No se pudo importar la planilla.',
      );
    } finally {
      setImporting(false);
    }
  };

  const filterControls = (
    <>
      <IconField iconPosition="right" className="w-full">
        <InputText
          className="w-full"
          value={filters.q}
          onChange={(event) =>
            setFilters({
              ...filters,
              q: event.target.value,
            })
          }
          placeholder="Buscar responsable"
        />
        <InputIcon className="pi pi-search" />
      </IconField>
      {canAuditDeleted ? (
        <div className="flex items-center gap-2">
          <label htmlFor="responsables-include-deleted">Incluir borrados</label>
          <Checkbox
            inputId="responsables-include-deleted"
            checked={filters.includeDeleted}
            onChange={(event) =>
              setFilters({
                ...filters,
                includeDeleted: Boolean(event.checked),
              })
            }
          />
        </div>
      ) : null}
    </>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        relatedActions={
          canAssign
            ? [
                {
                  label: 'Relaciones',
                  icon: 'pi pi-link',
                  onClick: () => router.push('/dashboard/relaciones'),
                },
              ]
            : []
        }
        specialActions={
          canAssign
            ? [
                {
                  label: 'Responsabilidades',
                  icon: 'pi pi-sitemap',
                  onClick: () => void openAssignmentDialog(),
                  disabled:
                    !selectedResponsable || Boolean(selectedResponsable.borrado),
                },
              ]
            : []
        }
        crudActions={[
          ...(canUseImport
            ? [
                {
                  label: 'Crear',
                  icon: 'pi pi-plus',
                  onClick: () => void openCreateDialog(),
                },
                {
                  label: 'Importar',
                  icon: 'pi pi-upload',
                  onClick: () => {
                    setImportError('');
                    setImportResult(null);
                    setImportVisible(true);
                  },
                },
              ]
            : []),
          ...(canEdit
            ? [
                {
                  label: 'Editar',
                  icon: 'pi pi-pencil',
                  onClick: () => void openEditDialog(),
                  disabled:
                    !selectedResponsable || Boolean(selectedResponsable.borrado),
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDelete,
                  disabled:
                    !selectedResponsable || Boolean(selectedResponsable.borrado),
                  severity: 'danger' as const,
                },
              ]
            : []),
        ]}
      />
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
          {canSeeId ? <Column field="id" header="ID" /> : null}
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
                disabled={Boolean(responsable.borrado)}
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
          {canAuditDeleted ? (
            <Column
              header="Borrado"
              body={(responsable: Responsable) => (
                <Tag
                  value={responsable.borrado ? 'Sí' : 'No'}
                  severity={responsable.borrado ? 'danger' : 'success'}
                />
              )}
            />
          ) : null}
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
      <SpreadsheetImportDialog
        visible={importVisible}
        title="Importar responsables"
        loading={importing}
        error={importError}
        result={importResult}
        exampleFilePath="/documentos-xlsl/plantilla-import-responsables.xlsx"
        exampleFileName="plantilla-import-responsables.xlsx"
        onHide={() => setImportVisible(false)}
        onSubmit={handleImport}
      />
      {deleteConfirmDialog}
    </Card>
  );
}
