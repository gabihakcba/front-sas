'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { GenericForm } from '@/common/components/GenericForm';
import { TableColumn } from '@/common/types/table';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { Protect } from '@/components/auth/Protect';
import {
  useResponsablesQuery,
  useCreateResponsableMutation,
  useUpdateResponsableMutation,
  useDeleteResponsableMutation,
} from '@/hooks/queries/useResponsables';
import {
  useRelacionesQuery,
  useCrearRelacionMutation,
} from '@/hooks/queries/useRelaciones';
import { useProtagonistasQuery } from '@/hooks/queries/useProtagonistas';
import {
  getResponsableFormSections,
  getVinculoFormConfig,
} from '../forms/responsableFormConfig';
import { toCalendarDate } from '@/lib/date';
import {
  ResponsableRow,
  CreateResponsableDto,
  UpdateResponsableDto,
  VincularResponsableDto,
} from '@/common/types/responsable';

export const ResponsablesList = () => {
  // Queries
  const { data: responsables = [], isLoading } = useResponsablesQuery();
  const { data: relaciones = [] } = useRelacionesQuery();
  const { data: protagonistas = [] } = useProtagonistasQuery();

  // Mutations
  const createMutation = useCreateResponsableMutation();
  const updateMutation = useUpdateResponsableMutation();
  const deleteMutation = useDeleteResponsableMutation();
  const vincularMutation = useCrearRelacionMutation();

  // State
  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
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
        if (!rowData.hijos || rowData.hijos.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {rowData.hijos.map((hijo: any) => (
              <span
                key={hijo.id}
                className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs"
              >
                {hijo.nombre} {hijo.apellido}
              </span>
            ))}
          </div>
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

  const handleDelete = (item: ResponsableRow) => {
    if (confirm('¿Está seguro de eliminar este responsable?')) {
      deleteMutation.mutate(item.id);
    }
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
      fecha_nacimiento: toCalendarDate(item.fecha_nacimiento),
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
              onClick={() => setIsCreateDialogVisible(true)}
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
        <GenericForm
          sections={getResponsableFormSections()}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateDialogVisible(false)}
          isLoading={createMutation.isPending}
          submitLabel="Crear"
          defaultValues={{ fecha_nacimiento: new Date() }}
        />
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
        <GenericForm
          sections={getResponsableFormSections()}
          defaultValues={selectedResponsable || {}}
          onSubmit={handleEdit}
          onCancel={() => {
            setIsEditDialogVisible(false);
            setSelectedResponsable(null);
          }}
          isLoading={updateMutation.isPending}
          submitLabel="Guardar"
        />
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
        <GenericForm
          sections={getVinculoFormConfig(protagonistas, relaciones)}
          onSubmit={handleVincular}
          onCancel={() => {
            setIsVincularDialogVisible(false);
            setSelectedResponsable(null);
          }}
          isLoading={vincularMutation.isPending}
          submitLabel="Vincular"
        />
      </Dialog>
    </div>
  );
};
