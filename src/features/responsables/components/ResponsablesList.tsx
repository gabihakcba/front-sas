'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { TableColumn } from '@/common/types/table';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { Protect } from '@/components/auth/Protect';
import {
  useResponsablesQuery,
  useCreateResponsableMutation,
  useUpdateResponsableMutation,
  useDeleteResponsableMutation,
} from '@/hooks/queries/useResponsables';
import { useCrearRelacionMutation } from '@/hooks/queries/useRelaciones';
import { toCalendarDate } from '@/lib/date';
import {
  ResponsableRow,
  CreateResponsableDto,
  UpdateResponsableDto,
} from '@/common/types/responsable';
import { ResponsableFormContainer } from './ResponsableFormContainer';
import { VinculoFormContainer } from './VinculoFormContainer';
import { ImportarAdultoContainer } from './ImportarAdultoContainer';
import { Dropdown } from 'primereact/dropdown';

export const ResponsablesList = () => {
  // Queries
  const { data: responsables = [], isLoading } = useResponsablesQuery();

  // Mutations
  const createMutation = useCreateResponsableMutation();
  const updateMutation = useUpdateResponsableMutation();
  const deleteMutation = useDeleteResponsableMutation();
  const vincularMutation = useCrearRelacionMutation();

  // State
  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
  const [isImportarDialogVisible, setIsImportarDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isVincularDialogVisible, setIsVincularDialogVisible] = useState(false);
  const [selectedResponsable, setSelectedResponsable] =
    useState<ResponsableRow | null>(null);

  // Columns
  const columns: TableColumn<ResponsableRow>[] = [
    { field: 'nombre', header: 'Nombre', sortable: true },
    { field: 'apellidos', header: 'Apellidos', sortable: true },
    { field: 'dni', header: 'DNI', sortable: true },
    { field: 'telefono', header: 'Teléfono' },
    {
      field: 'hijos',
      header: 'Hijos / Tutoriados',
      body: (rowData) => {
        const hijos = rowData.hijos || [];

        if (hijos.length === 0) return <span className="text-gray-400">-</span>;

        const opcionesHijos = hijos.map((h: any) => ({
          label: `${h.nombre} ${h.apellidos}`,
          value: h.id,
        }));

        return (
          <Dropdown
            value={null}
            options={opcionesHijos}
            optionLabel="label"
            placeholder={`${hijos.length} asignados`}
            className="w-full md:w-14rem"
            appendTo={typeof document !== 'undefined' ? document.body : 'self'}
            pt={{
              root: { className: 'border-0 bg-transparent' },
              input: { className: 'font-medium' },
            }}
          />
        );
      },
    },
  ];

  // Actions
  const handleCreate = (data: any) => {
    const payload: CreateResponsableDto = {
      activo: true,
      miembro: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        dni: data.dni,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento).toISOString()
          : new Date().toISOString(),
        telefono: data.telefono,
        telefono_emergencia: data.telefono_emergencia,
        direccion: data.direccion,
        email: data.email,
      },
    };
    createMutation.mutate(payload, {
      onSuccess: () => setIsCreateDialogVisible(false),
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedResponsable) return;
    const payload: UpdateResponsableDto = {
      activo: selectedResponsable.activo, // Preserve existing status or add field to form
      miembro: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        dni: data.dni,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento).toISOString()
          : new Date().toISOString(),
        telefono: data.telefono,
        telefono_emergencia: data.telefono_emergencia,
        direccion: data.direccion,
        email: data.email,
      },
    };
    updateMutation.mutate(
      { id: selectedResponsable.id, data: payload },
      {
        onSuccess: () => {
          setIsEditDialogVisible(false);
          setSelectedResponsable(null);
        },
      }
    );
  };

  const handleDelete = (responsable: ResponsableRow) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar a ${responsable.nombre} ${responsable.apellidos}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteMutation.mutateAsync(responsable.id);
      },
    });
  };

  const handleVincular = (data: any) => {
    if (!selectedResponsable) return;
    vincularMutation.mutate(
      {
        id_responsable: selectedResponsable.id,
        id_protagonista: data.id_protagonista,
        id_relacion: data.id_relacion,
      },
      {
        onSuccess: () => {
          setIsVincularDialogVisible(false);
          setSelectedResponsable(null);
        },
      }
    );
  };

  const openEditDialog = (item: ResponsableRow) => {
    const responsableEditable = {
      ...item,
      ...item.Miembro,
      fecha_nacimiento: toCalendarDate(
        item.Miembro?.fecha_nacimiento ||
          (item.fecha_nacimiento instanceof Date
            ? item.fecha_nacimiento.toISOString()
            : item.fecha_nacimiento)
      ),
    };
    setSelectedResponsable(responsableEditable as ResponsableRow);
    setIsEditDialogVisible(true);
  };

  const openVincularDialog = (item: ResponsableRow) => {
    setSelectedResponsable(item);
    setIsVincularDialogVisible(true);
  };

  return (
    <div className="p-4">
      <ConfirmDialog />
      <GenericDataTable
        title="Gestión de Responsables"
        subtitle="Administración de padres, tutores y responsables"
        data={responsables}
        columns={columns}
        isLoading={isLoading}
        permissionResource={RESOURCE.RESPONSABLE}
        actions={
          <Protect
            resource={RESOURCE.RESPONSABLE}
            action={ACTION.CREATE}
          >
            <Button
              label="Nuevo Responsable"
              icon="pi pi-plus"
              iconPos="right"
              size="small"
              outlined
              severity="success"
              onClick={() => setIsCreateDialogVisible(true)}
            />
            <Button
              label="Importar Adulto"
              icon="pi pi-user-plus"
              iconPos="right"
              size="small"
              outlined
              severity="secondary"
              className="ml-2"
              onClick={() => setIsImportarDialogVisible(true)}
            />
          </Protect>
        }
        onEdit={openEditDialog}
        onDelete={handleDelete}
        rowActions={(item) => (
          <Protect
            resource={RESOURCE.RESPONSABLE}
            action={ACTION.UPDATE}
          >
            <Button
              icon="pi pi-link"
              className="p-button-sm p-button-outlined p-button-help"
              tooltip="Vincular Protagonista"
              tooltipOptions={{ position: 'top', appendTo: document.body }}
              onClick={() => openVincularDialog(item)}
            />
          </Protect>
        )}
      />

      {/* Create Dialog */}
      <Dialog
        header="Nuevo Responsable"
        visible={isCreateDialogVisible}
        onHide={() => setIsCreateDialogVisible(false)}
        className="w-full md:w-1/2"
      >
        {isCreateDialogVisible && (
          <ResponsableFormContainer
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogVisible(false)}
            isLoading={createMutation.isPending}
            submitLabel="Crear"
            defaultValues={{ fecha_nacimiento: new Date() }}
            actionType="create"
          />
        )}
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        header="Editar Responsable"
        visible={isEditDialogVisible}
        onHide={() => {
          setIsEditDialogVisible(false);
          setSelectedResponsable(null);
        }}
        className="w-full md:w-1/2"
      >
        {isEditDialogVisible && (
          <ResponsableFormContainer
            defaultValues={selectedResponsable}
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditDialogVisible(false);
              setSelectedResponsable(null);
            }}
            isLoading={updateMutation.isPending}
            submitLabel="Guardar"
            actionType="update"
          />
        )}
      </Dialog>

      {/* Vincular Dialog */}
      <Dialog
        header={`Vincular a ${selectedResponsable?.nombre} ${selectedResponsable?.apellidos}`}
        visible={isVincularDialogVisible}
        onHide={() => {
          setIsVincularDialogVisible(false);
          setSelectedResponsable(null);
        }}
        className="w-full md:w-1/3"
      >
        {isVincularDialogVisible && (
          <VinculoFormContainer
            onSubmit={handleVincular}
            onCancel={() => {
              setIsVincularDialogVisible(false);
              setSelectedResponsable(null);
            }}
            isLoading={vincularMutation.isPending}
            submitLabel="Vincular"
          />
        )}
      </Dialog>

      {/* Importar Dialog */}
      <Dialog
        header="Importar Adulto como Responsable"
        visible={isImportarDialogVisible}
        onHide={() => setIsImportarDialogVisible(false)}
        className="w-full md:w-1/3"
      >
        {isImportarDialogVisible && (
          <ImportarAdultoContainer
            onClose={() => setIsImportarDialogVisible(false)}
          />
        )}
      </Dialog>
    </div>
  );
};
