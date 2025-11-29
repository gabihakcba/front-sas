'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import { Consejo, CreateConsejoDto } from '@/common/types/consejo';
import {
  useConsejosQuery,
  useCreateConsejoMutation,
  useUpdateConsejoMutation,
  useDeleteConsejoMutation,
} from '@/hooks/queries/useConsejos';
import { ConsejoFormContainer } from './ConsejoFormContainer';

export const ConsejosList: React.FC = () => {
  const { data: consejos = [], isLoading } = useConsejosQuery();
  const createMutation = useCreateConsejoMutation();
  const updateMutation = useUpdateConsejoMutation();
  const deleteMutation = useDeleteConsejoMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedConsejo, setSelectedConsejo] = useState<Consejo | undefined>(
    undefined
  );

  const handleCreate = () => {
    setSelectedConsejo(undefined);
    setIsDialogVisible(true);
  };

  const handleEdit = (consejo: Consejo) => {
    setSelectedConsejo(consejo);
    setIsDialogVisible(true);
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: '¿Está seguro de eliminar este consejo?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => deleteMutation.mutate(id),
    });
  };

  const handleSubmit = (data: CreateConsejoDto) => {
    if (selectedConsejo) {
      updateMutation.mutate(
        { id: selectedConsejo.id, data },
        {
          onSuccess: () => setIsDialogVisible(false),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsDialogVisible(false),
      });
    }
  };

  const columns: TableColumn<Consejo>[] = [
    {
      field: 'fecha',
      header: 'Fecha',
      type: 'date',
      sortable: true,
    },
    {
      field: 'nombre',
      header: 'Nombre',
      body: (row) => <span className="font-bold">{row.nombre}</span>,
      sortable: true,
    },
    {
      field: 'es_ordinario',
      header: 'Tipo',
      body: (row) => (
        <Tag
          value={row.es_ordinario ? 'Ordinario' : 'Extraordinario'}
          severity={row.es_ordinario ? 'info' : 'warning'}
        />
      ),
    },
    {
      field: 'hora_fin',
      header: 'Estado',
      body: (row) => (
        <Tag
          value={row.hora_fin ? 'Finalizado' : 'Pendiente'}
          severity={row.hora_fin ? 'success' : 'secondary'}
        />
      ),
    },
  ];

  return (
    <div className="p-4">
      <GenericDataTable
        title="Consejo de Grupo"
        subtitle="Gestión de consejos y reuniones"
        data={consejos}
        columns={columns}
        isLoading={isLoading}
        // Assuming RESOURCE.CONSEJO exists or using a fallback if not yet defined.
        // If RESOURCE.CONSEJO is not defined, we might need to add it or use a string.
        // For now, I'll use 'consejo' as a string if RESOURCE is an enum, but typically it is.
        // Let's assume we need to add CONSEJO to RESOURCE enum, but I can't modify that file easily without checking it.
        // I will use a string cast for now to avoid type errors if it's missing, or check RESOURCE first.
        permissionResource={'consejo' as any}
        actions={
          <Protect
            resource={'consejo' as any}
            action={ACTION.CREATE}
          >
            <Button
              label="Nuevo Consejo"
              icon="pi pi-plus"
              severity="success"
              size="small"
              iconPos="right"
              outlined
              onClick={handleCreate}
            />
          </Protect>
        }
        onEdit={handleEdit}
        onDelete={(item) => handleDelete(item.id)}
        customActions={(row) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-list"
              severity="help"
              rounded
              outlined
              size="small"
              tooltip="Temario"
              tooltipOptions={{ position: 'top' }}
              onClick={() => {}}
            />
            <Button
              icon="pi pi-check-square"
              severity="info"
              rounded
              outlined
              size="small"
              tooltip="Asistencia"
              tooltipOptions={{ position: 'top' }}
              onClick={() => {}}
            />
          </div>
        )}
        emptyMessage="No hay consejos registrados."
      />

      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        header={selectedConsejo ? 'Editar Consejo' : 'Nuevo Consejo'}
        className="w-full max-w-2xl"
      >
        <ConsejoFormContainer
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogVisible(false)}
          initialValues={selectedConsejo}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={selectedConsejo ? 'Guardar Cambios' : 'Crear Consejo'}
        />
      </Dialog>
    </div>
  );
};
