"use client";

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSabatinosHook } from '@/hooks/useSabatinosHooks';
import {
  hasAdultMemberAccess,
  hasDeveloperAccess,
} from '@/lib/authorization';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { Sabatino } from '@/types/sabatinos';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { SabatinoFormDialog } from '@/components/sabatinos/SabatinoFormDialog';

export default function SabatinosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const {
    sabatinos,
    selectedSabatino,
    setSelectedSabatino,
    filters,
    setFilters,
    meta,
    options,
    loading,
    error,
    successMessage,
    setSuccessMessage,
    sabatinoDialogVisible,
    setSabatinoDialogVisible,
    sabatinoDialogMode,
    sabatinoFormValues,
    setSabatinoFormValues,
    submittingSabatino,
    openCreateSabatino,
    submitSabatino,
    deleteSabatino,
  } = useSabatinosHook();

  const canAuditDeleted = (user?.scopes ?? []).some(
    (scope) =>
      ['ADM', 'DEV', 'JEFATURA'].includes(scope.role) &&
      (scope.scopeType === 'GRUPO' || scope.scopeType === 'GLOBAL')
  );
  const canSeeId = hasDeveloperAccess(user);
  const canCRUD = hasAdultMemberAccess(user);

  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();

  useEffect(() => {
    if (successMessage && toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: successMessage,
        life: 3000,
      });
      setSuccessMessage('');
    }
  }, [successMessage, setSuccessMessage]);

  const handleDelete = () => {
    if (!selectedSabatino) return;
    confirmDelete({
      message: `¿Estás seguro de eliminar el sabatino "${selectedSabatino.titulo}"?`,
      onAccept: () => void deleteSabatino(selectedSabatino.id),
    });
  };

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = (event.page ?? 0) + 1;
    setFilters({ ...filters, page: nextPage });
  };

  const filterControls = (
    <>
      <IconField iconPosition="right" className="w-full">
        <InputText
          className="w-full"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
          placeholder="Buscar sabatinos..."
        />
        <InputIcon className="pi pi-search" />
      </IconField>

      <Calendar
        value={
          filters.fechaDesde && filters.fechaHasta
            ? [new Date(filters.fechaDesde), new Date(filters.fechaHasta)]
            : null
        }
        onChange={(e) => {
          const val = e.value as Date[] | null;
          setFilters({
            ...filters,
            fechaDesde: val?.[0] ? dayjs(val[0]).format('YYYY-MM-DD') : '',
            fechaHasta: val?.[1] ? dayjs(val[1]).format('YYYY-MM-DD') : '',
            page: 1,
          });
        }}
        selectionMode="range"
        placeholder="Rango de fechas"
        showButtonBar
        dateFormat="dd/mm/yy"
        className="w-full"
      />

      {canAuditDeleted && (
        <div className="flex items-center gap-2">
          <Checkbox
            inputId="include-deleted"
            checked={filters.includeDeleted}
            onChange={(e) => setFilters({ ...filters, includeDeleted: !!e.checked, page: 1 })}
          />
          <label htmlFor="include-deleted">Ver borrados</label>
        </div>
      )}
    </>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        crudActions={[
          ...(canCRUD
            ? [
                {
                  label: 'Crear',
                  icon: 'pi pi-plus',
                  onClick: openCreateSabatino,
                },
              ]
            : []),
          {
            label: 'Detalles',
            icon: 'pi pi-eye',
            onClick: () => router.push(`/dashboard/sabatinos/${selectedSabatino?.id}`),
            disabled: !selectedSabatino || Boolean(selectedSabatino.borrado),
          },
          ...(canCRUD
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDelete,
                  disabled: !selectedSabatino || Boolean(selectedSabatino.borrado),
                  severity: 'danger' as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      
      <Card title="Sabatinos">
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        
        <DataTable
          value={sabatinos}
          loading={loading}
          lazy
          paginator
          rows={meta.limit}
          totalRecords={meta.total}
          first={(meta.page - 1) * meta.limit}
          onPage={handlePage}
          header={header}
          selectionMode="single"
          selection={selectedSabatino}
          onSelectionChange={(e) => setSelectedSabatino(e.value as Sabatino)}
          className="p-datatable-sm"
          emptyMessage="No se encontraron sabatinos."
          dataKey="id"
        >
          {canSeeId && <Column field="id" header="ID" style={{ width: '5rem' }} />}
          <Column field="titulo" header="Título" sortable />
          <Column
            header="Fecha"
            body={(rowData: Sabatino) => 
              `${dayjs(rowData.fecha_inicio).format('DD/MM/YYYY HH:mm')} - ${dayjs(rowData.fecha_fin).format('HH:mm')}`
            }
          />
          <Column
            header="Ramas"
            body={(rowData: Sabatino) => (
              <div className="flex flex-wrap gap-1">
                {rowData.RamasAfectadas.map(r => r.Rama.nombre).join(', ') || '-'}
              </div>
            )}
          />
          <Column
            header="Actividades"
            body={(rowData: Sabatino) => rowData._count?.Actividades ?? 0}
            style={{ width: '8rem', textAlign: 'center' }}
          />
          {canAuditDeleted && (
            <Column
              header="Borrado"
              body={(rowData: Sabatino) => (
                <Tag
                  value={rowData.borrado ? 'Sí' : 'No'}
                  severity={rowData.borrado ? 'danger' : 'success'}
                />
              )}
            />
          )}
        </DataTable>
      </Card>

      <SabatinoFormDialog
        visible={sabatinoDialogVisible}
        onHide={() => setSabatinoDialogVisible(false)}
        mode={sabatinoDialogMode}
        initialValues={sabatinoFormValues}
        onSubmit={submitSabatino}
        loading={submittingSabatino}
        options={options}
      />

      {deleteConfirmDialog}
    </div>
  );
}
