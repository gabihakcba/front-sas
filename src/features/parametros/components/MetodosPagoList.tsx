'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { GenericForm } from '@/common/components/GenericForm';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import {
  useMetodosPagoQuery,
  useCreateMetodoPagoMutation,
  useUpdateMetodoPagoMutation,
  useDeleteMetodoPagoMutation,
} from '@/hooks/queries/useMetodosPago';
import {
  MetodoPago,
  CreateMetodoPagoDto,
  UpdateMetodoPagoDto,
} from '@/common/types/metodo-pago';
import { metodoPagoFormSections } from '../forms/metodoPagoFormConfig';

export const MetodosPagoList = () => {
  const { data: metodos = [], isLoading } = useMetodosPagoQuery();
  const createMutation = useCreateMetodoPagoMutation();
  const updateMutation = useUpdateMetodoPagoMutation();
  const deleteMutation = useDeleteMetodoPagoMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null);

  const columns: TableColumn<MetodoPago>[] = [
    {
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      className: 'font-bold',
    },
    {
      field: 'descripcion',
      header: 'Descripción',
      hideOnMobile: true,
    },
  ];

  const handleCreate = (data: any) => {
    const payload: CreateMetodoPagoDto = {
      nombre: data.nombre,
      descripcion: data.descripcion,
    };
    createMutation.mutate(payload, {
      onSuccess: () => setIsDialogVisible(false),
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedMetodo) return;
    const payload: UpdateMetodoPagoDto = {
      nombre: data.nombre,
      descripcion: data.descripcion,
    };
    updateMutation.mutate(
      { id: selectedMetodo.id, data: payload },
      {
        onSuccess: () => {
          setIsDialogVisible(false);
          setSelectedMetodo(null);
        },
      }
    );
  };

  const handleDelete = (item: MetodoPago) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar el método "${item.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteMutation.mutateAsync(item.id);
      },
    });
  };

  const openCreateDialog = () => {
    setSelectedMetodo(null);
    setIsDialogVisible(true);
  };

  const openEditDialog = (item: MetodoPago) => {
    setSelectedMetodo(item);
    setIsDialogVisible(true);
  };

  return (
    <div className="p-4">
      <ConfirmDialog />
      <GenericDataTable
        title="Métodos de Pago"
        subtitle="Gestión de formas de pago aceptadas"
        data={metodos}
        columns={columns}
        isLoading={isLoading}
        permissionResource={RESOURCE.METODO_PAGO}
        actions={
          <Protect
            resource={RESOURCE.METODO_PAGO}
            action={ACTION.CREATE}
          >
            <Button
              label="Nuevo Método"
              icon="pi pi-plus"
              iconPos="right"
              size="small"
              outlined
              severity="success"
              onClick={openCreateDialog}
            />
          </Protect>
        }
        onEdit={openEditDialog}
        onDelete={handleDelete}
      />

      <Dialog
        header={selectedMetodo ? 'Editar Método' : 'Nuevo Método'}
        visible={isDialogVisible}
        onHide={() => {
          setIsDialogVisible(false);
          setSelectedMetodo(null);
        }}
        className="w-full md:w-1/2"
      >
        {isDialogVisible && (
          <GenericForm
            sections={metodoPagoFormSections}
            defaultValues={selectedMetodo || {}}
            onSubmit={selectedMetodo ? handleEdit : handleCreate}
            onCancel={() => {
              setIsDialogVisible(false);
              setSelectedMetodo(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitLabel={selectedMetodo ? 'Guardar' : 'Crear'}
            actionType={selectedMetodo ? 'update' : 'create'}
          />
        )}
      </Dialog>
    </div>
  );
};
