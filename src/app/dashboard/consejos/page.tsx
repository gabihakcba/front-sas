'use client';

import { startTransition } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ConsejoFormDialog } from '@/components/consejos/ConsejoFormDialog';
import { ConsejoTemarioDialog } from '@/components/consejos/ConsejoTemarioDialog';
import { ConsejoTemarioFormDialog } from '@/components/consejos/ConsejoTemarioFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useConsejosHook } from '@/hooks/useConsejosHooks';
import { Consejo } from '@/types/consejos';

const hasPermission = (permissions: string[], required: string) => {
  if (permissions.includes(required)) {
    return true;
  }

  const [, resource] = required.split(':');
  return permissions.includes(`MANAGE:${resource}`);
};

export default function ConsejosPage() {
  const { user } = useAuth();
  const router = useRouter();
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

  const permissions = user?.permissions ?? [];
  const canCreate = hasPermission(permissions, 'CREATE:CONSEJO');
  const canEdit = hasPermission(permissions, 'UPDATE:CONSEJO');
  const canDelete = hasPermission(permissions, 'DELETE:CONSEJO');
  const canManageTemario = hasPermission(permissions, 'UPDATE:CONSEJO');

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedConsejo) {
      return;
    }

    const confirmed = window.confirm(
      `Se eliminará de forma lógica el consejo ${selectedConsejo.nombre}.`,
    );

    if (confirmed) {
      void deleteSelected();
    }
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <span className="text-lg font-semibold">Listado</span>
      <div className="flex flex-wrap gap-2">
        {canCreate ? (
          <Button
            type="button"
            label="Crear"
            icon="pi pi-plus"
            iconPos="right"
            outlined
            size="small"
            onClick={openCreateDialog}
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
            disabled={!selectedConsejo}
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
            disabled={!selectedConsejo}
          />
        ) : null}
        <Button
          type="button"
          label="Temario"
          icon="pi pi-list"
          iconPos="right"
          outlined
          size="small"
          onClick={() => void openTemarioDialog()}
          disabled={!selectedConsejo}
        />
        <Button
          type="button"
          label="Iniciar consejo"
          icon="pi pi-play"
          iconPos="right"
          outlined
          size="small"
          onClick={() => {
            if (!selectedConsejo) {
              return;
            }

            startTransition(() =>
              router.push(`/dashboard/consejos/${selectedConsejo.id}`),
            );
          }}
          disabled={!selectedConsejo}
        />
      </div>
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
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
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

          const confirmed = window.confirm(
            `Se eliminará de forma lógica el tema ${selectedTemario.titulo}.`,
          );

          if (confirmed) {
            void deleteSelectedTemario();
          }
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
    </div>
  );
}
