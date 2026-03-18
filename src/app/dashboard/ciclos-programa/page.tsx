'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { FormEvent } from 'primereact/ts-helpers';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { CicloProgramaFormDialog } from '@/components/ciclos-programa/CicloProgramaFormDialog';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useCiclosProgramaHook } from '@/hooks/useCiclosProgramaHooks';
import {
  hasDeveloperAccess,
  hasPermissionAccess,
  hasProgramCycleGroupManagementAccess,
} from '@/lib/authorization';
import { CicloProgramaResumen } from '@/types/ciclos-programa';

const estadoSeverityMap: Record<
  string,
  'secondary' | 'success' | 'info' | 'warning' | 'danger'
> = {
  DIAGNOSTICO: 'info',
  PLANIFICACION: 'warning',
  DESARROLLO: 'success',
  EVALUACION: 'danger',
  FINALIZADO: 'secondary',
};

const estadoLabelMap: Record<string, string> = {
  DIAGNOSTICO: 'Diagnóstico',
  PLANIFICACION: 'Planificación',
  DESARROLLO: 'Desarrollo',
  EVALUACION: 'Evaluación',
  FINALIZADO: 'Finalizado',
};

export default function CiclosProgramaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    ciclos,
    selectedCiclo,
    setSelectedCiclo,
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
    filters,
    setFilters,
    fetchCiclos,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  } = useCiclosProgramaHook();

  const canCreate = hasPermissionAccess(user, 'CREATE:CICLO_PROGRAMA');
  const canEdit = hasPermissionAccess(user, 'UPDATE:CICLO_PROGRAMA');
  const canDelete = hasPermissionAccess(user, 'DELETE:CICLO_PROGRAMA');
  const canSeeId = hasDeveloperAccess(user);
  const canSelectRama = hasProgramCycleGroupManagementAccess(user);

  const dateRangeValue: [Date | null, Date | null] | null =
    filters.fechaDesde || filters.fechaHasta
      ? [
          filters.fechaDesde ? dayjs(filters.fechaDesde, 'YYYY-MM-DD').toDate() : null,
          filters.fechaHasta ? dayjs(filters.fechaHasta, 'YYYY-MM-DD').toDate() : null,
        ]
      : null;

  const handleDelete = () => {
    if (!selectedCiclo) {
      return;
    }

    confirmDelete({
      message: `Se eliminará de forma lógica el ciclo "${selectedCiclo.nombre}".`,
      impact:
        'El ciclo dejará de aparecer en listados operativos y puede afectar la referencia visible desde eventos vinculados.',
      onAccept: () => void deleteSelected(),
    });
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
          placeholder="Buscar por nombre o descripción"
        />
        <InputIcon className="pi pi-search" />
      </IconField>
      <Calendar
        value={dateRangeValue}
        onChange={(event: FormEvent<(Date | null)[] | null>) => {
          const nextRange = Array.isArray(event.value) ? event.value : null;
          const nextDesde = nextRange?.[0] ?? null;
          const nextHasta = nextRange?.[1] ?? null;

          setFilters({
            ...filters,
            fechaDesde: nextDesde ? dayjs(nextDesde).format('YYYY-MM-DD') : '',
            fechaHasta: nextHasta ? dayjs(nextHasta).format('YYYY-MM-DD') : '',
          });
        }}
        selectionMode="range"
        readOnlyInput
        showButtonBar
        dateFormat="dd/mm/yy"
        placeholder="Rango de fechas"
        className="w-full"
        inputClassName="w-full"
      />
    </>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        relatedActions={[
                {
                  label: 'Ver detalles',
                  icon: 'pi pi-eye',
            onClick: () => {
              if (selectedCiclo) {
                router.push(`/dashboard/ciclos-programa/${selectedCiclo.id}`);
              }
            },
            disabled: !selectedCiclo,
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
                  disabled: !selectedCiclo,
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDelete,
                  disabled: !selectedCiclo,
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
      <Card title="Ciclos de Programa" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={ciclos}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedCiclo}
          onSelectionChange={(event) =>
            setSelectedCiclo((event.value as CicloProgramaResumen | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={(event: DataTablePageEvent) =>
            void fetchCiclos(Math.floor(event.first / event.rows) + 1)
          }
          emptyMessage="No hay ciclos de programa disponibles."
          tableStyle={{ minWidth: '48rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column field="nombre" header="Nombre" />
          <Column
            header="Fecha inicio"
            body={(ciclo: CicloProgramaResumen) =>
              dayjs(ciclo.fecha_inicio).format('DD/MM/YYYY')
            }
          />
          <Column
            header="Fecha fin"
            body={(ciclo: CicloProgramaResumen) =>
              dayjs(ciclo.fecha_fin).format('DD/MM/YYYY')
            }
          />
          <Column
            header="Estado"
            body={(ciclo: CicloProgramaResumen) => (
              <Tag
                value={estadoLabelMap[ciclo.estado] ?? ciclo.estado}
                severity={estadoSeverityMap[ciclo.estado] ?? 'secondary'}
              />
            )}
          />
        </DataTable>
      </Card>

      <CicloProgramaFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        ramas={options.ramas}
        canSelectRama={canSelectRama}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
      {deleteConfirmDialog}
    </div>
  );
}
