import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { GenericForm } from '@/common/components/GenericForm';
import { Evento } from '@/common/types/evento';
import { ParticipantesComision } from '@/common/types/comision';
import { RESOURCE } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import {
  useComisionesEventoQuery,
  useCreateComisionMutation,
  useDeleteComisionMutation,
  useAddParticipanteMutation,
  useRemoveParticipanteMutation,
} from '@/hooks/queries/useComisiones';
import { useMiembrosQuery } from '@/hooks/queries/useMiembros';
import {
  getComisionFormConfig,
  getAsignarMiembroFormConfig,
} from '@/features/eventos/forms/comisionFormConfig';

interface ComisionesManagerProps {
  evento: Evento;
  onClose: () => void;
}

export const ComisionesManager: React.FC<ComisionesManagerProps> = ({
  evento,
  onClose,
}) => {
  const { data: comisiones = [], isLoading } = useComisionesEventoQuery(
    evento.id
  );
  const { data: miembros = [] } = useMiembrosQuery();

  const createComisionMutation = useCreateComisionMutation();
  const deleteComisionMutation = useDeleteComisionMutation();
  const addParticipanteMutation = useAddParticipanteMutation();
  const removeParticipanteMutation = useRemoveParticipanteMutation();

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isAsignarVisible, setIsAsignarVisible] = useState(false);

  const handleCreateComision = (data: any) => {
    createComisionMutation.mutate(
      { ...data, id_evento: evento.id },
      {
        onSuccess: () => setIsCreateVisible(false),
      }
    );
  };

  const handleAsignarMiembro = (data: any) => {
    addParticipanteMutation.mutate(data, {
      onSuccess: () => setIsAsignarVisible(false),
    });
  };

  const handleDeleteComision = (id: number) => {
    confirmDialog({
      message: '¿Está seguro de eliminar esta comisión?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => deleteComisionMutation.mutate(id),
    });
  };

  const handleRemoveParticipante = (id: number) => {
    confirmDialog({
      message: '¿Está seguro de quitar a este miembro de la comisión?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, quitar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => removeParticipanteMutation.mutate(id),
    });
  };

  const participantColumns: TableColumn<ParticipantesComision>[] = [
    {
      field: 'Miembro',
      header: 'Miembro',
      body: (row) =>
        row.Miembro
          ? `${row.Miembro.nombre} ${row.Miembro.apellidos}`
          : 'Miembro no encontrado',
    },
    {
      field: 'Miembro.dni',
      header: 'DNI',
      body: (row) => row.Miembro?.dni || '-',
    },
  ];

  const participantActions = (row: ParticipantesComision) => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      rounded
      outlined
      size="small"
      tooltip="Quitar"
      tooltipOptions={{
        position: 'top',
        appendTo: typeof document !== 'undefined' ? document.body : null,
      }}
      onClick={() => handleRemoveParticipante(row.id)}
    />
  );

  return (
    <Sidebar
      visible={true}
      onHide={onClose}
      position="right"
      className="w-full! md:w-1/2!"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">Comisiones: {evento.nombre}</h2>
            <p className="text-gray-500">Gestión de equipos de trabajo</p>
          </div>
          <div className="flex gap-2">
            <Button
              icon="pi pi-plus"
              severity="success"
              outlined
              size="small"
              tooltip="Nueva Comisión"
              tooltipOptions={{
                position: 'top',
                appendTo:
                  typeof document !== 'undefined' ? document.body : null,
              }}
              onClick={() => setIsCreateVisible(true)}
            />
            <Button
              icon="pi pi-user-plus"
              severity="info"
              outlined
              size="small"
              tooltip="Asignar Miembro"
              tooltipOptions={{
                position: 'left',
                appendTo:
                  typeof document !== 'undefined' ? document.body : null,
              }}
              onClick={() => setIsAsignarVisible(true)}
              disabled={comisiones.length === 0}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 p-1">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
            </div>
          ) : comisiones.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No hay comisiones creadas para este evento.
            </div>
          ) : (
            comisiones.map((comision) => (
              <Panel
                key={comision.id}
                header={
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="font-bold text-lg">{comision.nombre}</span>
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComision(comision.id);
                      }}
                      tooltip="Eliminar Comisión"
                      tooltipOptions={{
                        position: 'top',
                        appendTo:
                          typeof document !== 'undefined'
                            ? document.body
                            : null,
                      }}
                    />
                  </div>
                }
                toggleable
              >
                {comision.descripcion && (
                  <p className="mb-4 text-gray-600">{comision.descripcion}</p>
                )}
                <GenericDataTable
                  data={comision.ParticipantesComision || []}
                  columns={participantColumns}
                  title="Participantes"
                  permissionResource={RESOURCE.EVENTO}
                  rowActions={participantActions}
                  emptyMessage="No hay participantes asignados."
                />
              </Panel>
            ))
          )}
        </div>
      </div>

      <Dialog
        visible={isCreateVisible}
        onHide={() => setIsCreateVisible(false)}
        header="Nueva Comisión"
        className="w-full max-w-lg"
      >
        <GenericForm
          sections={getComisionFormConfig()}
          onSubmit={handleCreateComision}
          onCancel={() => setIsCreateVisible(false)}
          isLoading={createComisionMutation.isPending}
          submitLabel="Crear Comisión"
        />
      </Dialog>

      <Dialog
        visible={isAsignarVisible}
        onHide={() => setIsAsignarVisible(false)}
        header="Asignar Miembro a Comisión"
        className="w-full max-w-lg"
      >
        <GenericForm
          sections={getAsignarMiembroFormConfig(comisiones, miembros)}
          onSubmit={handleAsignarMiembro}
          onCancel={() => setIsAsignarVisible(false)}
          isLoading={addParticipanteMutation.isPending}
          submitLabel="Asignar"
        />
      </Dialog>
    </Sidebar>
  );
};
