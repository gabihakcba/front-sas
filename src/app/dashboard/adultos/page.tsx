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
import { AdultoFormDialog } from '@/components/adultos/AdultoFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useAdultosHook } from '@/hooks/useAdultosHooks';
import { hasPermissionAccess } from '@/lib/authorization';
import { Adulto } from '@/types/adultos';

const getAsignacionActual = (adulto: Adulto) => adulto.EquipoArea[0] ?? null;

const getRolesActuales = (adulto: Adulto) =>
  adulto.Miembro.Cuenta.CuentaRole.map((cuentaRole) => cuentaRole.Role.nombre).join(
    ', ',
  );

export default function AdultosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    adultos,
    selectedAdulto,
    setSelectedAdulto,
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
    refetch,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  } = useAdultosHook();
  const canCreate = hasPermissionAccess(user, 'CREATE:ADULTO');
  const canEdit = hasPermissionAccess(user, 'UPDATE:ADULTO');
  const canDelete = hasPermissionAccess(user, 'DELETE:ADULTO');
  const canSeeOperationalColumns = canEdit || canDelete;

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedAdulto) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica a ${selectedAdulto.Miembro.nombre} ${selectedAdulto.Miembro.apellidos}.`,
      impact:
        'La persona adulta dejará de aparecer en los listados operativos y esto puede repercutir en equipos, formación, pagos, firmas y otros vínculos visibles.',
      onAccept: () => void deleteSelected(),
    });
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div />
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
            placeholder="Buscar adulto"
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
            disabled={!selectedAdulto}
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
            disabled={!selectedAdulto}
          />
        ) : null}
      </div>
    </div>
  );

  const areaHeader = (
    <Dropdown
      value={filters.idArea}
      options={options.areas}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idArea: (event.value as number | null) ?? null,
        })
      }
      placeholder="Área"
      showClear
    />
  );

  const ramaHeader = (
    <Dropdown
      value={filters.idRama}
      options={options.ramas}
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

  const posicionHeader = (
    <Dropdown
      value={filters.idPosicion}
      options={options.posiciones}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idPosicion: (event.value as number | null) ?? null,
        })
      }
      placeholder="Posición"
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
      <Card title="Adultos" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={adultos}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedAdulto}
          onSelectionChange={(event) =>
            setSelectedAdulto((event.value as Adulto | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay adultos disponibles para tu scope actual."
          tableStyle={{ minWidth: '60rem', width: '100%' }}
        >
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column
            header="Nombre"
            body={(adulto: Adulto) =>
              `${adulto.Miembro.nombre} ${adulto.Miembro.apellidos}`
            }
          />
          <Column field="Miembro.dni" header="DNI" />
          <Column field="Miembro.email" header="Email" />
          <Column field="Miembro.Cuenta.user" header="Usuario" />
          <Column
            header="Perfil"
            body={(adulto: Adulto) => (
              <Button
                type="button"
                icon="pi pi-eye"
                iconPos="right"
                outlined
                size="small"
                onClick={() => router.push(`/dashboard/perfil/${adulto.Miembro.id}`)}
              />
            )}
          />
          <Column
            header={areaHeader}
            body={(adulto: Adulto) =>
              getAsignacionActual(adulto)?.Area.nombre ?? 'Sin asignación'
            }
          />
          <Column
            header={ramaHeader}
            body={(adulto: Adulto) =>
              getAsignacionActual(adulto)?.Rama?.nombre ?? '-'
            }
          />
          <Column
            header={posicionHeader}
            body={(adulto: Adulto) =>
              getAsignacionActual(adulto)?.Posicion.nombre ?? '-'
            }
          />
          <Column
            header="Inicio"
            body={(adulto: Adulto) => {
              const asignacionActual = getAsignacionActual(adulto);
              return asignacionActual
                ? dayjs(asignacionActual.fecha_inicio).format('DD/MM/YYYY')
                : '-';
            }}
          />
          {canSeeOperationalColumns ? (
            <Column
              header="Roles"
              body={(adulto: Adulto) => getRolesActuales(adulto) || 'Sin roles'}
            />
          ) : null}
          {canSeeOperationalColumns ? (
            <Column
              header={becaHeader}
              body={(adulto: Adulto) => (
                <Tag
                  value={adulto.es_becado ? 'Becado' : 'Sin beca'}
                  severity={adulto.es_becado ? 'success' : 'secondary'}
                />
              )}
            />
          ) : null}
          {canSeeOperationalColumns ? (
            <Column
              header={estadoHeader}
              body={(adulto: Adulto) => (
                <Tag
                  value={adulto.activo ? 'Activo' : 'Inactivo'}
                  severity={adulto.activo ? 'info' : 'danger'}
                />
              )}
            />
          ) : null}
        </DataTable>
      </Card>

      <AdultoFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        options={options}
        values={formValues}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
      {deleteConfirmDialog}
    </div>
  );
}
