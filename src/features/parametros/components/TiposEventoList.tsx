import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { GenericForm } from '@/common/components/GenericForm';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import { TipoEvento } from '@/common/types/tipo-evento';
import {
  useTiposEventoQuery,
  useCreateTipoEventoMutation,
  useUpdateTipoEventoMutation,
  useDeleteTipoEventoMutation,
} from '@/hooks/queries/useTiposEvento';
import { tipoEventoFormSections } from '@/features/parametros/forms/tipoEventoFormConfig';

export const TiposEventoList: React.FC = () => {
  const { data: tiposEvento = [], isLoading } = useTiposEventoQuery();
  const createMutation = useCreateTipoEventoMutation();
  const updateMutation = useUpdateTipoEventoMutation();
  const deleteMutation = useDeleteTipoEventoMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedTipoEvento, setSelectedTipoEvento] =
    useState<TipoEvento | null>(null);

  const handleCreate = () => {
    setSelectedTipoEvento(null);
    setIsDialogVisible(true);
  };

  const handleEdit = (tipoEvento: TipoEvento) => {
    setSelectedTipoEvento(tipoEvento);
    setIsDialogVisible(true);
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: '¿Está seguro de eliminar este tipo de evento?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => deleteMutation.mutate(id),
    });
  };

  const handleSubmit = (data: any) => {
    if (selectedTipoEvento) {
      updateMutation.mutate(
        { id: selectedTipoEvento.id, data },
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

  const columns: TableColumn<TipoEvento>[] = [
    {
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      body: (row) => <span className="font-bold">{row.nombre}</span>,
    },
    {
      field: 'descripcion',
      header: 'Descripción',
      hideOnMobile: true,
    },
  ];

  return (
    <div className="p-4">
      <GenericDataTable
        title="Tipos de Evento"
        subtitle="Gestión de tipos de evento"
        data={tiposEvento}
        columns={columns}
        isLoading={isLoading}
        permissionResource={RESOURCE.TIPO_EVENTO}
        actions={
          <Protect
            resource={RESOURCE.TIPO_EVENTO}
            action={ACTION.CREATE}
          >
            <Button
              label="Nuevo"
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
        emptyMessage="No hay tipos de evento registrados."
      />

      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        header={
          selectedTipoEvento ? 'Editar Tipo de Evento' : 'Nuevo Tipo de Evento'
        }
        className="w-full max-w-lg"
      >
        <GenericForm
          sections={tipoEventoFormSections}
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogVisible(false)}
          defaultValues={selectedTipoEvento || undefined}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={selectedTipoEvento ? 'Guardar Cambios' : 'Crear'}
        />
      </Dialog>
    </div>
  );
};
