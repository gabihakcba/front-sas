'use client';

import dayjs from 'dayjs';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { ReunionFormDialog } from '@/components/reuniones/ReunionFormDialog';
import { ReunionInvitadosDialog } from '@/components/reuniones/ReunionInvitadosDialog';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useReunionesHook } from '@/hooks/useReunionesHooks';
import {
  hasAdultMemberAccess,
  hasDeveloperAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import { Reunion, ReunionModalidad } from '@/types/reuniones';

const MODALIDAD_FILTER_OPTIONS: Array<{ label: string; value: ReunionModalidad }> = [
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
  { label: 'Hibrida', value: 'HIBRIDA' },
];

export default function ReunionesPage() {
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    reuniones,
    selectedReunion,
    setSelectedReunion,
    formValues,
    dialogMode,
    dialogVisible,
    invitadosVisible,
    invitadoIds,
    setInvitadoIds,
    options,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    auxSubmitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    openInvitadosDialog,
    closeDialog,
    closeInvitadosDialog,
    submitForm,
    deleteSelected,
    submitInvitados,
  } = useReunionesHook();

  const canCreate =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'CREATE:REUNION');
  const canEdit =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'UPDATE:REUNION');
  const canDelete =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'DELETE:REUNION');
  const canManageInvitados =
    hasAdultMemberAccess(user) &&
    hasPermissionAccess(user, 'UPDATE:INVITADO_REUNION');
  const canAuditDeleted = (user?.scopes ?? []).some(
    (scope) =>
      ['ADM', 'DEV', 'JEFATURA'].includes(scope.role) &&
      (scope.scopeType === 'GRUPO' || scope.scopeType === 'GLOBAL')
  );
  const canSeeId = hasDeveloperAccess(user);

  const handleDelete = () => {
    if (!selectedReunion) {
      return;
    }

    confirmDelete({
      message: `Se eliminara de forma logica la reunion "${selectedReunion.titulo}".`,
      impact:
        'La reunion dejara de verse en listados operativos y puede afectar invitaciones y trazabilidad historica visible.',
      onAccept: () => void deleteSelected(),
    });
  };

  const dateRangeValue: [Date | null, Date | null] | null =
    filters.fechaDesde || filters.fechaHasta
      ? [
          filters.fechaDesde
            ? dayjs(filters.fechaDesde, 'YYYY-MM-DD').toDate()
            : null,
          filters.fechaHasta
            ? dayjs(filters.fechaHasta, 'YYYY-MM-DD').toDate()
            : null,
        ]
      : null;

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
          placeholder="Buscar por titulo, descripcion, lugar o URL"
        />
        <InputIcon className="pi pi-search" />
      </IconField>

      <Calendar
        value={dateRangeValue}
        onChange={(event) =>
          setFilters({
            ...filters,
            fechaDesde:
              Array.isArray(event.value) && event.value[0] instanceof Date
                ? dayjs(event.value[0]).format('YYYY-MM-DD')
                : '',
            fechaHasta:
              Array.isArray(event.value) && event.value[1] instanceof Date
                ? dayjs(event.value[1]).format('YYYY-MM-DD')
                : '',
          })
        }
        selectionMode="range"
        dateFormat="dd/mm/yy"
        showButtonBar
        placeholder="Rango de fechas"
      />

      {canAuditDeleted ? (
        <div className="flex items-center gap-2">
          <label htmlFor="reuniones-include-deleted">Incluir borrados</label>
          <Checkbox
            inputId="reuniones-include-deleted"
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

  const modalidadHeader = (
    <Dropdown
      value={filters.modalidad}
      options={MODALIDAD_FILTER_OPTIONS}
      optionLabel="label"
      optionValue="value"
      placeholder="Modalidad"
      showClear
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          modalidad: (event.value as ReunionModalidad | null) ?? null,
        })
      }
    />
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        specialActions={
          canManageInvitados
            ? [
                {
                  label: 'Invitados',
                  icon: 'pi pi-users',
                  onClick: () => void openInvitadosDialog(),
                  disabled:
                    !selectedReunion ||
                    !canManageInvitados ||
                    Boolean(selectedReunion?.borrado),
                },
              ]
            : []
        }
        crudActions={[
          ...(canCreate
            ? [
                {
                  label: 'Crear',
                  icon: 'pi pi-plus',
                  onClick: () => void openCreateDialog(),
                },
              ]
            : []),
          ...(canEdit
            ? [
                {
                  label: 'Editar',
                  icon: 'pi pi-pencil',
                  onClick: () => void openEditDialog(),
                  disabled: !selectedReunion || Boolean(selectedReunion.borrado),
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDelete,
                  disabled: !selectedReunion || Boolean(selectedReunion.borrado),
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
      <Card title="Reuniones" className="h-full">
        {error ? (
          <Message severity="error" text={error} className="mb-3 w-full" />
        ) : null}
        {successMessage ? (
          <Message
            severity="success"
            text={successMessage}
            className="mb-3 w-full"
          />
        ) : null}

        <DataTable
          value={reuniones}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedReunion}
          onSelectionChange={(event) =>
            setSelectedReunion((event.value as Reunion | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={(event: DataTablePageEvent) =>
            void refetch(Math.floor(event.first / event.rows) + 1)
          }
          emptyMessage="No hay reuniones disponibles."
          tableStyle={{ minWidth: '72rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="titulo" header="Titulo" />
          <Column
            header={modalidadHeader}
            body={(reunion: Reunion) => reunion.modalidad}
          />
          <Column
            header="Inicio"
            body={(reunion: Reunion) =>
              dayjs(reunion.fecha_inicio).format('DD/MM/YYYY HH:mm')
            }
          />
          <Column
            header="Fin"
            body={(reunion: Reunion) =>
              dayjs(reunion.fecha_fin).format('DD/MM/YYYY HH:mm')
            }
          />
          <Column
            header="Lugar"
            body={(reunion: Reunion) => reunion.lugar_fisico ?? '-'}
          />
          <Column
            header="URL"
            body={(reunion: Reunion) => reunion.url_virtual ?? '-'}
          />
          <Column
            header="Areas"
            body={(reunion: Reunion) =>
              reunion.AreasAfectadas.length > 0
                ? reunion.AreasAfectadas.map((item) => item.Area.nombre).join(', ')
                : '-'
            }
          />
          <Column
            header="Ramas"
            body={(reunion: Reunion) =>
              reunion.RamasAfectadas.length > 0
                ? reunion.RamasAfectadas.map((item) => item.Rama.nombre).join(', ')
                : '-'
            }
          />
          <Column
            header="Invitados"
            body={(reunion: Reunion) => reunion._count.Invitados}
          />
          {canAuditDeleted ? (
            <Column
              header="Borrado"
              body={(reunion: Reunion) => (
                <Tag
                  value={reunion.borrado ? 'Si' : 'No'}
                  severity={reunion.borrado ? 'danger' : 'success'}
                />
              )}
            />
          ) : null}
        </DataTable>
      </Card>

      <ReunionFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        areas={options.areas}
        ramas={options.ramas}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />

      <ReunionInvitadosDialog
        visible={invitadosVisible}
        submitting={auxSubmitting}
        miembros={options.miembros}
        selectedIds={invitadoIds}
        error={error}
        onHide={closeInvitadosDialog}
        onChange={setInvitadoIds}
        onSubmit={() => void submitInvitados()}
      />

      {deleteConfirmDialog}
    </div>
  );
}
