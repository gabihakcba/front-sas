"use client";

import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { useAuth } from '@/context/AuthContext';
import { useActividadesHook } from '@/hooks/useActividadesHooks';
import {
  hasDeveloperAccess,
} from '@/lib/authorization';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { Actividad } from '@/types/sabatinos';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { ActividadFormDialog } from '@/components/sabatinos/ActividadFormDialog';

export default function ActividadesPage() {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const {
    actividades,
    selectedActividad,
    setSelectedActividad,
    loading,
    error,
    successMessage,
    setSuccessMessage,
    filters,
    setFilters,
    meta,
    options,
    actividadDialogVisible,
    setActividadDialogVisible,
    actividadDialogMode,
    actividadFormValues,
    submitting,
    openCreateDialog,
    openEditDialog,
    submitForm,
    deleteActividad,
  } = useActividadesHook();

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailActividad, setDetailActividad] = useState<Actividad | null>(null);

  const canAuditDeleted = (user?.scopes ?? []).some(
    (scope) =>
      ['ADM', 'DEV', 'JEFATURA'].includes(scope.role) &&
      (scope.scopeType === 'GRUPO' || scope.scopeType === 'GLOBAL')
  );
  const canSeeId = hasDeveloperAccess(user);

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
    if (!selectedActividad) return;
    confirmDelete({
      message: `¿Estás seguro de eliminar permanentemente la actividad "${selectedActividad.nombre}"?`,
      onAccept: () => void deleteActividad(selectedActividad.id),
    });
  };

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = (event.page ?? 0) + 1;
    setFilters({ ...filters, page: nextPage });
  };

  const handleRowDoubleClick = (event: any) => {
    setDetailActividad(event.data as Actividad);
    setDetailVisible(true);
  };

  const filterControls = (
    <IconField iconPosition="right" className="w-full">
      <InputText
        className="w-full"
        value={filters.q}
        onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
        placeholder="Buscar actividades por nombre..."
      />
      <InputIcon className="pi pi-search" />
    </IconField>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:w-20rem">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        crudActions={[
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            onClick: openCreateDialog,
          },
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            onClick: () => {
              if (selectedActividad) void openEditDialog(selectedActividad);
            },
            disabled: !selectedActividad,
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            onClick: handleDelete,
            disabled: !selectedActividad,
            severity: 'danger',
          },
        ]}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      
      <Card title="Listado Maestro de Actividades">
        <p className="text-color-secondary mt-0 mb-4">
          Repositorio global de actividades del sistema. Estas actividades pueden ser vinculadas a Sabatinos o Programas.
        </p>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        
        <DataTable
          value={actividades}
          loading={loading}
          lazy
          paginator
          rows={meta?.limit ?? 10}
          totalRecords={meta?.total ?? 0}
          first={((meta?.page ?? 1) - 1) * (meta?.limit ?? 10)}
          onPage={handlePage}
          header={header}
          selectionMode="single"
          selection={selectedActividad}
          onSelectionChange={(e) => setSelectedActividad(e.value as Actividad)}
          onRowDoubleClick={handleRowDoubleClick}
          className="p-datatable-sm"
          emptyMessage="No se encontraron actividades."
          dataKey="id"
        >
          {canSeeId && <Column field="id" header="ID" style={{ width: '5rem' }} />}
          <Column field="nombre" header="Nombre" sortable />
          <Column 
            header="Tipo" 
            body={(act: Actividad) => (
              <Tag 
                value={act.Tipo.nombre} 
                style={{ backgroundColor: act.Tipo.color || '#eee', color: '#000' }} 
              />
            )} 
          />
          <Column 
            header="Descripción" 
            body={(act: Actividad) => (
              <div className="max-h-12 overflow-y-auto text-sm italic">
                {act.descripcion || '-'}
              </div>
            )}
          />
          <Column 
            header="Objetivos" 
            body={(act: Actividad) => (
              <div className="max-h-12 overflow-y-auto text-sm">
                {act.objetivos || '-'}
              </div>
            )}
          />
        </DataTable>
      </Card>

      <ActividadFormDialog
        visible={actividadDialogVisible}
        onHide={() => setActividadDialogVisible(false)}
        mode={actividadDialogMode}
        initialValues={actividadFormValues}
        onSubmit={(data) => void submitForm(data)}
        loading={submitting}
        options={options}
      />

      <Dialog
        header={detailActividad?.nombre}
        visible={detailVisible}
        onHide={() => setDetailVisible(false)}
        {...getResponsiveDialogProps('600px')}
      >
        {detailActividad && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold block text-sm text-color-secondary">Tipo</label>
                <Tag 
                  value={detailActividad.Tipo.nombre} 
                  style={{ backgroundColor: detailActividad.Tipo.color || '#eee', color: '#000' }} 
                />
              </div>
            </div>

            <Divider />

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Descripción</label>
              <p className="m-0 whitespace-pre-wrap text-sm italic">{detailActividad.descripcion || 'Sin descripción'}</p>
            </div>

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Objetivos</label>
              <p className="m-0 whitespace-pre-wrap text-sm">{detailActividad.objetivos || 'Sin objetivos definidos'}</p>
            </div>

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Materiales</label>
              <p className="m-0 whitespace-pre-wrap text-sm">{detailActividad.materiales || 'Sin materiales especificados'}</p>
            </div>
          </div>
        )}
      </Dialog>

      {deleteConfirmDialog}
    </div>
  );
}
