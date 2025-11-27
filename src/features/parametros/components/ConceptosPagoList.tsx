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
  useConceptosPagoQuery,
  useCreateConceptoPagoMutation,
  useUpdateConceptoPagoMutation,
  useDeleteConceptoPagoMutation,
} from '@/hooks/queries/useConceptosPago';
import {
  ConceptoPago,
  CreateConceptoPagoDto,
  UpdateConceptoPagoDto,
} from '@/common/types/concepto-pago';
import { conceptoPagoFormSections } from '../forms/conceptoPagoFormConfig';

export const ConceptosPagoList = () => {
  const { data: conceptos = [], isLoading } = useConceptosPagoQuery();
  const createMutation = useCreateConceptoPagoMutation();
  const updateMutation = useUpdateConceptoPagoMutation();
  const deleteMutation = useDeleteConceptoPagoMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedConcepto, setSelectedConcepto] = useState<ConceptoPago | null>(
    null
  );

  const columns: TableColumn<ConceptoPago>[] = [
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
    const payload: CreateConceptoPagoDto = {
      nombre: data.nombre,
      descripcion: data.descripcion,
    };
    createMutation.mutate(payload, {
      onSuccess: () => setIsDialogVisible(false),
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedConcepto) return;
    const payload: UpdateConceptoPagoDto = {
      nombre: data.nombre,
      descripcion: data.descripcion,
    };
    updateMutation.mutate(
      { id: selectedConcepto.id, data: payload },
      {
        onSuccess: () => {
          setIsDialogVisible(false);
          setSelectedConcepto(null);
        },
      }
    );
  };

  const handleDelete = (item: ConceptoPago) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar el concepto "${item.nombre}"?`,
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
    setSelectedConcepto(null);
    setIsDialogVisible(true);
  };

  const openEditDialog = (item: ConceptoPago) => {
    setSelectedConcepto(item);
    setIsDialogVisible(true);
  };

  return (
    <div className="p-4">
      <ConfirmDialog />
      <GenericDataTable
        title="Conceptos de Pago"
        subtitle="Gestión de tipos de conceptos para pagos"
        data={conceptos}
        columns={columns}
        isLoading={isLoading}
        permissionResource={RESOURCE.CONCEPTO_PAGO}
        actions={
          <Protect
            resource={RESOURCE.CONCEPTO_PAGO}
            action={ACTION.CREATE}
          >
            <Button
              label="Nuevo Concepto"
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
        header={selectedConcepto ? 'Editar Concepto' : 'Nuevo Concepto'}
        visible={isDialogVisible}
        onHide={() => {
          setIsDialogVisible(false);
          setSelectedConcepto(null);
        }}
        className="w-full md:w-1/2"
      >
        {isDialogVisible && (
          <GenericForm
            sections={conceptoPagoFormSections}
            defaultValues={selectedConcepto || {}}
            onSubmit={selectedConcepto ? handleEdit : handleCreate}
            onCancel={() => {
              setIsDialogVisible(false);
              setSelectedConcepto(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitLabel={selectedConcepto ? 'Guardar' : 'Crear'}
            actionType={selectedConcepto ? 'update' : 'create'}
          />
        )}
      </Dialog>
    </div>
  );
};
