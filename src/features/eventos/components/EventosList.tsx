'use client';

import React, { useState } from 'react';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import {
  useEventosQuery,
  useCreateEventoMutation,
  useUpdateEventoMutation,
  useDeleteEventoMutation,
} from '@/hooks/queries/useEventos';
import { Evento, CreateEventoDto } from '@/common/types/evento';
import { TableColumn } from '@/common/types/table';
import { RESOURCE } from '@/common/types/rbac';
import { EventoFormContainer } from './EventoFormContainer';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Sidebar } from 'primereact/sidebar';
import { ParticipantesManager } from './ParticipantesManager';
import { ComisionesManager } from './ComisionesManager';

export const EventosList = () => {
  const { data: eventos = [], isLoading } = useEventosQuery();
  const createMutation = useCreateEventoMutation();
  const updateMutation = useUpdateEventoMutation();
  const deleteMutation = useDeleteEventoMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isParticipantesVisible, setIsParticipantesVisible] = useState(false);
  const [showComisiones, setShowComisiones] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  const handleCreate = () => {
    setSelectedEvento(null);
    setIsDialogVisible(true);
  };

  const handleEdit = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsDialogVisible(true);
  };

  const handleDelete = (evento: Evento) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas eliminar el evento "${evento.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => deleteMutation.mutate(evento.id),
    });
  };

  const handleParticipantes = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsParticipantesVisible(true);
  };

  const handleSubmit = (data: CreateEventoDto) => {
    if (selectedEvento) {
      updateMutation.mutate(
        { id: selectedEvento.id, data },
        { onSuccess: () => setIsDialogVisible(false) }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsDialogVisible(false),
      });
    }
  };

  const columns: TableColumn<Evento>[] = [
    {
      field: 'nombre',
      header: 'Nombre',
      body: (rowData: Evento) => (
        <span className="font-bold">{rowData.nombre}</span>
      ),
      sortable: true,
    },
    {
      field: 'TipoEvento',
      header: 'Tipo',
      body: (rowData: Evento) => (
        <Tag
          value={rowData.TipoEvento?.nombre}
          severity="info"
        />
      ),
      sortable: true,
    },
    {
      field: 'fecha_inicio',
      header: 'Fecha Inicio',
      type: 'date',
      sortable: true,
    },
    {
      field: 'participantes',
      header: 'Participantes',
      body: (rowData: Evento) => (
        <div className="flex flex-wrap gap-1">
          {(rowData.RamaAfectada || []).map((rama) => (
            <Tag
              key={`rama-${rama.id}`}
              value={rama.Rama?.nombre}
              severity="warning"
              className="mr-1"
            />
          ))}
          {(rowData.AreaAfectada || []).map((area) => (
            <Tag
              key={`area-${area.id}`}
              value={area.Area?.nombre}
              severity="info"
              className="mr-1"
            />
          ))}
        </div>
      ),
    },
    {
      field: 'terminado',
      header: 'Estado',
      body: (rowData: Evento) => {
        const isFinished = new Date(rowData.fecha_fin) < new Date();
        return (
          <Tag
            value={isFinished ? 'Finalizado' : 'Activo'}
            severity={isFinished ? 'danger' : 'success'}
          />
        );
      },
      sortable: true,
    },
  ];

  const initialFormData = selectedEvento
    ? {
        ...selectedEvento,
        id_tipo: selectedEvento.TipoEvento?.id ?? selectedEvento.id_tipo,
        ids_ramas: selectedEvento.RamaAfectada?.map((r) => r.id_rama) || [],
        ids_areas: selectedEvento.AreaAfectada?.map((a) => a.id_area) || [],
      }
    : undefined;

  return (
    <div className="card">
      <GenericDataTable<Evento>
        data={eventos}
        columns={columns}
        isLoading={isLoading}
        title="Gestión de Eventos"
        actions={
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            onClick={handleCreate}
            severity="success"
            size="small"
            outlined
            iconPos="right"
          />
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissionResource={RESOURCE.EVENTO}
        customActions={(rowData: Evento) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-users"
              severity="info"
              rounded
              outlined
              size="small"
              tooltip="Participantes"
              tooltipOptions={{ position: 'top', appendTo: document.body }}
              onClick={() => handleParticipantes(rowData)}
            />
            <Button
              icon="pi pi-sitemap"
              severity="help"
              rounded
              outlined
              size="small"
              tooltip="Comisiones"
              tooltipOptions={{ position: 'top', appendTo: document.body }}
              onClick={() => {
                setSelectedEvento(rowData);
                setShowComisiones(true);
              }}
            />
          </div>
        )}
      />

      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        header={selectedEvento ? 'Editar Evento' : 'Nuevo Evento'}
        className="w-full max-w-4xl"
      >
        <EventoFormContainer
          initialData={initialFormData}
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogVisible(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={selectedEvento ? 'Actualizar' : 'Crear'}
        />
      </Dialog>

      <Sidebar
        visible={isParticipantesVisible}
        onHide={() => setIsParticipantesVisible(false)}
        position="right"
        className="!w-full md:!w-1/2"
      >
        {selectedEvento && (
          <ParticipantesManager
            evento={selectedEvento}
            onClose={() => setIsParticipantesVisible(false)}
          />
        )}
      </Sidebar>

      {showComisiones && selectedEvento && (
        <ComisionesManager
          evento={selectedEvento}
          onClose={() => setShowComisiones(false)}
        />
      )}
    </div>
  );
};
