'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ProtagonistaFormDialog } from '@/components/protagonistas/ProtagonistaFormDialog';
import { ProtagonistaPaseDialog } from '@/components/protagonistas/ProtagonistaPaseDialog';
import { useProtagonistasHook } from '@/hooks/useProtagonistasHooks';
import { Protagonista } from '@/types/protagonistas';

const getRamaActual = (protagonista: Protagonista) =>
  protagonista.Miembro.MiembroRama[0] ?? null;

export default function ProtagonistasPage() {
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

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedProtagonista) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminará de forma lógica a ${selectedProtagonista.Miembro.nombre} ${selectedProtagonista.Miembro.apellidos}.`,
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
          disabled={!selectedProtagonista}
        />
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
      </div>
    </div>
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
            header="Rama actual"
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
          <Column
            header="Beca"
            body={(protagonista: Protagonista) => (
              <Tag
                value={protagonista.es_becado ? 'Becado' : 'Sin beca'}
                severity={protagonista.es_becado ? 'success' : 'secondary'}
              />
            )}
          />
          <Column
            header="Estado"
            body={(protagonista: Protagonista) => (
              <Tag
                value={protagonista.activo ? 'Activo' : 'Inactivo'}
                severity={protagonista.activo ? 'info' : 'danger'}
              />
            )}
          />
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
    </div>
  );
}
