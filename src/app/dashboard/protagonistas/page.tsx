'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ProtagonistaFormDialog } from '@/components/protagonistas/ProtagonistaFormDialog';
import { ProtagonistaPaseDialog } from '@/components/protagonistas/ProtagonistaPaseDialog';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useProtagonistasHook } from '@/hooks/useProtagonistasHooks';
import { hasPermissionAccess } from '@/lib/authorization';
import { Protagonista } from '@/types/protagonistas';

const getRamaActual = (protagonista: Protagonista) =>
  protagonista.Miembro.MiembroRama[0] ?? null;

export default function ProtagonistasPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    protagonistas,
    ramas,
    selectedProtagonista,
    setSelectedProtagonista,
    formValues,
    paseValues,
    setPaseValues,
    dialogMode,
    dialogVisible,
    paseDialogVisible,
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
    openPaseDialog,
    closeDialog,
    closePaseDialog,
    submitForm,
    submitPase,
    deleteSelected,
  } = useProtagonistasHook();
  const canCreate = hasPermissionAccess(user, 'CREATE:PROTAGONISTA');
  const canEdit = hasPermissionAccess(user, 'UPDATE:PROTAGONISTA');
  const canDelete = hasPermissionAccess(user, 'DELETE:PROTAGONISTA');
  const canRegisterPase = hasPermissionAccess(user, 'UPDATE:PROTAGONISTA');
  const canSeeOperationalColumns = canEdit || canDelete;

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedProtagonista) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica a ${selectedProtagonista.Miembro.nombre} ${selectedProtagonista.Miembro.apellidos}.`,
      impact:
        'La persona protagonista dejará de aparecer en los listados operativos y esto puede afectar relaciones, pagos, asistencias e históricos visibles vinculados.',
      onAccept: () => void deleteSelected(),
    });
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {canRegisterPase ? (
          <Button
            type="button"
            label="Pase"
            icon="pi pi-arrow-right-arrow-left"
            iconPos="right"
            outlined
            size="small"
            onClick={() => void openPaseDialog()}
            disabled={!selectedProtagonista}
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-center">
        <IconField iconPosition="right">
          <InputText
            value={filters.q}
            onChange={(event) =>
              setFilters({
                ...filters,
                q: event.target.value,
              })
            }
            placeholder="Buscar protagonista"
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
            disabled={!selectedProtagonista}
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
            disabled={!selectedProtagonista}
          />
        ) : null}
      </div>
    </div>
  );

  const ramaHeader = (
    <Dropdown
      value={filters.idRama}
      options={ramas}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idRama: (event.value as number | null) ?? null,
        })
      }
      placeholder="Rama"
      showClear
    />
  );

  const becaHeader = (
    <Dropdown
      value={filters.esBecado}
      options={[
        { label: 'Becado', value: true },
        { label: 'Sin beca', value: false },
      ]}
      optionLabel="label"
      optionValue="value"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          esBecado:
            event.value === undefined ? null : (event.value as boolean | null),
        })
      }
      placeholder="Beca"
      showClear
    />
  );

  const estadoHeader = (
    <Dropdown
      value={filters.activo}
      options={[
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ]}
      optionLabel="label"
      optionValue="value"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          activo:
            event.value === undefined ? null : (event.value as boolean | null),
        })
      }
      placeholder="Estado"
      showClear
    />
  );

  return (
    <div className="h-full w-full">
      <Card title="Protagonistas" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={protagonistas}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedProtagonista}
          onSelectionChange={(event) =>
            setSelectedProtagonista((event.value as Protagonista | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay protagonistas disponibles para tu scope actual."
          tableStyle={{ minWidth: '50rem', width: '100%' }}
        >
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column
            header="Nombre"
            body={(protagonista: Protagonista) =>
              `${protagonista.Miembro.nombre} ${protagonista.Miembro.apellidos}`
            }
          />
          <Column field="Miembro.dni" header="DNI" />
          <Column field="Miembro.email" header="Email" />
          <Column field="Miembro.telefono" header="Teléfono" />
          <Column
            header="Perfil"
            body={(protagonista: Protagonista) => (
              <Button
                type="button"
                icon="pi pi-eye"
                iconPos="right"
                outlined
                size="small"
                onClick={() =>
                  router.push(`/dashboard/perfil/${protagonista.Miembro.id}`)
                }
              />
            )}
          />
          <Column
            header={ramaHeader}
            body={(protagonista: Protagonista) =>
              getRamaActual(protagonista)?.Rama.nombre ?? 'Sin rama activa'
            }
          />
          <Column
            header="Ingreso rama"
            body={(protagonista: Protagonista) => {
              const ramaActual = getRamaActual(protagonista);
              return ramaActual
                ? dayjs(ramaActual.fecha_ingreso).format('DD/MM/YYYY')
                : '-';
            }}
          />
          {canSeeOperationalColumns ? (
            <Column
              header={becaHeader}
              body={(protagonista: Protagonista) => (
                <Tag
                  value={protagonista.es_becado ? 'Becado' : 'Sin beca'}
                  severity={protagonista.es_becado ? 'success' : 'secondary'}
                />
              )}
            />
          ) : null}
          {canSeeOperationalColumns ? (
            <Column
              header={estadoHeader}
              body={(protagonista: Protagonista) => (
                <Tag
                  value={protagonista.activo ? 'Activo' : 'Inactivo'}
                  severity={protagonista.activo ? 'info' : 'danger'}
                />
              )}
            />
          ) : null}
        </DataTable>
      </Card>

      <ProtagonistaFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        ramas={ramas}
        values={formValues}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />

      <ProtagonistaPaseDialog
        visible={paseDialogVisible}
        loading={dialogLoading}
        submitting={submitting}
        ramas={ramas}
        values={paseValues}
        onHide={closePaseDialog}
        onSubmit={() => void submitPase()}
        onChange={setPaseValues}
      />
      {deleteConfirmDialog}
    </div>
  );
}
