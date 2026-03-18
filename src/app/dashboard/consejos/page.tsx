'use client';

import { startTransition } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { ConsejoFormDialog } from '@/components/consejos/ConsejoFormDialog';
import { ConsejoTemarioDialog } from '@/components/consejos/ConsejoTemarioDialog';
import { ConsejoTemarioFormDialog } from '@/components/consejos/ConsejoTemarioFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useConsejosHook } from '@/hooks/useConsejosHooks';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import {
  hasAdultMemberAccess,
  hasDeletedAuditAccess,
  hasDeveloperAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import { Consejo } from '@/types/consejos';

export default function ConsejosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    consejos,
    selectedConsejo,
    setSelectedConsejo,
    formValues,
    temario,
    selectedTemario,
    setSelectedTemario,
    temarioFormValues,
    dialogMode,
    dialogVisible,
    temarioDialogMode,
    temarioDialogVisible,
    temarioFormVisible,
    error,
    temarioError,
    successMessage,
    temarioSuccessMessage,
    loading,
    dialogLoading,
    temarioLoading,
    temarioSubmitting,
    submitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    openTemarioDialog,
    openCreateTemarioDialog,
    openEditTemarioDialog,
    closeDialog,
    closeTemarioDialog,
    closeTemarioFormDialog,
    submitForm,
    submitTemarioForm,
    deleteSelected,
    deleteSelectedTemario,
  } = useConsejosHook();

  const canCreate =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'CREATE:CONSEJO');
  const canEdit =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'UPDATE:CONSEJO');
  const canDelete =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'DELETE:CONSEJO');
  const canManageTemario = hasAdultMemberAccess(user);
  const canAuditDeleted = hasDeletedAuditAccess(user);
  const canSeeId = hasDeveloperAccess(user);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedConsejo) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica el consejo "${selectedConsejo.nombre}".`,
      impact:
        'El consejo dejará de estar disponible en listados operativos y puede afectar temario, asistencias y referencias históricas visibles en la interfaz.',
      onAccept: () => void deleteSelected(),
    });
  };

  const filterControls = canAuditDeleted ? (
    <div className="flex items-center gap-2">
      <label htmlFor="consejos-include-deleted">Incluir borrados</label>
      <Checkbox
        inputId="consejos-include-deleted"
        checked={filters.includeDeleted}
        onChange={(event) =>
          setFilters({
            includeDeleted: Boolean(event.checked),
          })
        }
      />
    </div>
  ) : null;

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        specialActions={[
          {
            label: 'Temario',
            icon: 'pi pi-list',
            onClick: () => void openTemarioDialog(),
            disabled: !selectedConsejo || Boolean(selectedConsejo.borrado),
          },
          {
            label: 'Iniciar consejo',
            icon: 'pi pi-play',
            onClick: () => {
              if (!selectedConsejo) {
                return;
              }

              startTransition(() =>
                router.push(`/dashboard/consejos/${selectedConsejo.id}`),
              );
            },
            disabled: !selectedConsejo || Boolean(selectedConsejo.borrado),
          },
        ]}
        crudActions={[
          ...(canCreate
            ? [
                {
                  label: 'Crear',
                  icon: 'pi pi-plus',
                  onClick: openCreateDialog,
                },
              ]
            : []),
          ...(canEdit
            ? [
                {
                  label: 'Editar',
                  icon: 'pi pi-pencil',
                  onClick: () => void openEditDialog(),
                  disabled: !selectedConsejo || Boolean(selectedConsejo.borrado),
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDelete,
                  disabled: !selectedConsejo || Boolean(selectedConsejo.borrado),
                  severity: 'danger' as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );

  return (
    <div className="h-full w-full">
      <Card title="Consejos" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={consejos}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedConsejo}
          onSelectionChange={(event) =>
            setSelectedConsejo((event.value as Consejo | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay consejos disponibles."
          tableStyle={{ minWidth: '70rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="nombre" header="Nombre" />
          <Column
            header="Fecha"
            body={(consejo: Consejo) => dayjs(consejo.fecha).format('DD/MM/YYYY')}
          />
          <Column
            header="Tipo"
            body={(consejo: Consejo) =>
              consejo.es_ordinario ? 'Ordinario' : 'Extraordinario'
            }
          />
          <Column
            header="Horario"
            body={(consejo: Consejo) => {
              if (!consejo.hora_inicio && !consejo.hora_fin) {
                return '-';
              }

              const inicio = consejo.hora_inicio
                ? dayjs(consejo.hora_inicio).format('HH:mm')
                : '--:--';
              const fin = consejo.hora_fin
                ? dayjs(consejo.hora_fin).format('HH:mm')
                : '--:--';

              return `${inicio} - ${fin}`;
            }}
          />
          <Column
            header="Temas"
            body={(consejo: Consejo) => consejo._count.TemarioConsejo}
          />
          <Column
            header="Asistencias"
            body={(consejo: Consejo) => consejo._count.AsistenciaConsejo}
          />
          {canAuditDeleted ? (
            <Column
              header="Borrado"
              body={(consejo: Consejo) => (
                <Tag
                  value={consejo.borrado ? 'Sí' : 'No'}
                  severity={consejo.borrado ? 'danger' : 'success'}
                />
              )}
            />
          ) : null}
        </DataTable>
      </Card>

      <ConsejoFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
      <ConsejoTemarioDialog
        visible={temarioDialogVisible}
        canEdit={canManageTemario}
        loading={temarioLoading}
        submitting={temarioSubmitting}
        error={temarioError}
        successMessage={temarioSuccessMessage}
        items={temario}
        selectedItem={selectedTemario}
        onSelectionChange={setSelectedTemario}
        onHide={closeTemarioDialog}
        onCreate={openCreateTemarioDialog}
        onEdit={openEditTemarioDialog}
        onDelete={() => {
          if (!selectedTemario) {
            return;
          }
          confirmDelete({
            title: 'Confirmar eliminación de tema',
            message: `Se eliminará de forma lógica el tema "${selectedTemario.titulo}".`,
            impact:
              'El tema dejará de verse en el temario operativo del consejo y puede alterar el seguimiento visible de lo tratado en esa reunión.',
            onAccept: () => void deleteSelectedTemario(),
          });
        }}
      />
      <ConsejoTemarioFormDialog
        visible={temarioFormVisible}
        mode={temarioDialogMode}
        loading={temarioSubmitting}
        values={temarioFormValues}
        error={temarioError}
        onHide={closeTemarioFormDialog}
        onSubmit={(values) => void submitTemarioForm(values)}
      />
      {deleteConfirmDialog}
    </div>
  );
}
