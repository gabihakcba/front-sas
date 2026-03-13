'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { AdultoFormDialog } from '@/components/adultos/AdultoFormDialog';
import { useAdultosHook } from '@/hooks/useAdultosHooks';
import { Adulto } from '@/types/adultos';

const getAsignacionActual = (adulto: Adulto) => adulto.EquipoArea[0] ?? null;

const getRolesActuales = (adulto: Adulto) =>
  adulto.Miembro.Cuenta.CuentaRole.map((cuentaRole) => cuentaRole.Role.nombre).join(
    ', ',
  );

export default function AdultosPage() {
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
    refetch,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  } = useAdultosHook();

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedAdulto) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminará de forma lógica a ${selectedAdulto.Miembro.nombre} ${selectedAdulto.Miembro.apellidos}.`,
    );

    if (confirmed) {
      void deleteSelected();
    }
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <span className="text-lg font-semibold">Listado</span>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          label="Crear"
          icon="pi pi-plus"
          iconPos="right"
          outlined
          size="small"
          onClick={() => void openCreateDialog()}
        />
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
      </div>
    </div>
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
            header="Área"
            body={(adulto: Adulto) =>
              getAsignacionActual(adulto)?.Area.nombre ?? 'Sin asignación'
            }
          />
          <Column
            header="Rama"
            body={(adulto: Adulto) =>
              getAsignacionActual(adulto)?.Rama?.nombre ?? '-'
            }
          />
          <Column
            header="Posición"
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
          <Column
            header="Roles"
            body={(adulto: Adulto) => getRolesActuales(adulto) || 'Sin roles'}
          />
          <Column
            header="Beca"
            body={(adulto: Adulto) => (
              <Tag
                value={adulto.es_becado ? 'Becado' : 'Sin beca'}
                severity={adulto.es_becado ? 'success' : 'secondary'}
              />
            )}
          />
          <Column
            header="Estado"
            body={(adulto: Adulto) => (
              <Tag
                value={adulto.activo ? 'Activo' : 'Inactivo'}
                severity={adulto.activo ? 'info' : 'danger'}
              />
            )}
          />
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
    </div>
  );
}
