'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import {
  useCuentasDineroQuery,
  useCreateCuentaDineroMutation,
  useUpdateCuentaDineroMutation,
  useDeleteCuentaDineroMutation,
} from '@/hooks/queries/useCuentasDinero';
import {
  CuentaDineroRow,
  CreateCuentaDineroDto,
  UpdateCuentaDineroDto,
} from '@/common/types/cuenta-dinero';
import { CuentaDineroFormContainer } from './CuentaDineroFormContainer';
import { Tag } from 'primereact/tag';

export const CuentasDineroList = () => {
  const { data: cuentas = [], isLoading } = useCuentasDineroQuery();
  const createMutation = useCreateCuentaDineroMutation();
  const updateMutation = useUpdateCuentaDineroMutation();
  const deleteMutation = useDeleteCuentaDineroMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaDineroRow | null>(
    null
  );

  const columns: TableColumn<CuentaDineroRow>[] = [
    {
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      className: 'font-bold',
    },
    {
      field: 'propietario', // Virtual field for sorting/filtering if needed
      header: 'Propietario',
      body: (row) => {
        if (row.Area) {
          return (
            <div className="flex items-center gap-2">
              <Tag
                value="Área"
                severity="info"
              />
              <span>{row.Area.nombre}</span>
            </div>
          );
        }
        if (row.Rama) {
          return (
            <div className="flex items-center gap-2">
              <Tag
                value="Rama"
                severity="warning"
              />
              <span>{row.Rama.nombre}</span>
            </div>
          );
        }
        if (row.Miembro) {
          return (
            <div className="flex items-center gap-2">
              <Tag
                value="Miembro"
                severity="success"
              />
              <span>
                {row.Miembro.nombre} {row.Miembro.apellidos}
              </span>
            </div>
          );
        }
        return <span className="text-slate-400">-</span>;
      },
    },
    {
      field: 'monto_actual',
      header: 'Saldo',
      sortable: true,
      textSeverity: (row) => (row.monto_actual > 0 ? 'success' : 'secondary'),
      transform: (row) =>
        new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
        }).format(row.monto_actual),
    },
    {
      field: 'descripcion',
      header: 'Descripción',
      hideOnMobile: true,
    },
  ];

  const handleCreate = (data: any) => {
    // Data is already cleaned by Container
    createMutation.mutate(data, {
      onSuccess: () => setIsDialogVisible(false),
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedCuenta) return;
    // Data is already cleaned by Container
    updateMutation.mutate(
      { id: selectedCuenta.id, data },
      {
        onSuccess: () => {
          setIsDialogVisible(false);
          setSelectedCuenta(null);
        },
      }
    );
  };

  const handleDelete = (item: CuentaDineroRow) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar la cuenta "${item.nombre}"?`,
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
    setSelectedCuenta(null);
    setIsDialogVisible(true);
  };

  const openEditDialog = (item: CuentaDineroRow) => {
    setSelectedCuenta(item);
    setIsDialogVisible(true);
  };

  return (
    <div className="p-4">
      <ConfirmDialog />
      <GenericDataTable
        title="Cuentas de Dinero"
        subtitle="Gestión de cuentas y cajas"
        data={cuentas}
        columns={columns}
        isLoading={isLoading}
        permissionResource={RESOURCE.CUENTA_DINERO}
        actions={
          <Protect
            resource={RESOURCE.CUENTA_DINERO}
            action={ACTION.CREATE}
          >
            <Button
              label="Nueva Cuenta"
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
        header={selectedCuenta ? 'Editar Cuenta' : 'Nueva Cuenta'}
        visible={isDialogVisible}
        onHide={() => {
          setIsDialogVisible(false);
          setSelectedCuenta(null);
        }}
        className="w-full md:w-1/2"
      >
        {isDialogVisible && (
          <CuentaDineroFormContainer
            defaultValues={selectedCuenta || {}}
            onSubmit={selectedCuenta ? handleEdit : handleCreate}
            onCancel={() => {
              setIsDialogVisible(false);
              setSelectedCuenta(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitLabel={selectedCuenta ? 'Guardar' : 'Crear'}
            actionType={selectedCuenta ? 'update' : 'create'}
          />
        )}
      </Dialog>
    </div>
  );
};
