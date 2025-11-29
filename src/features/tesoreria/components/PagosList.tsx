'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import { Pago } from '@/common/types/pago';
import {
  usePagosQuery,
  useCreatePagoMutation,
  useUpdatePagoMutation,
  useDeletePagoMutation,
} from '@/hooks/queries/usePagos';
import { PagoFormContainer } from './PagoFormContainer';

export const PagosList: React.FC = () => {
  const { data: pagos = [], isLoading } = usePagosQuery();
  const createMutation = useCreatePagoMutation();
  const updateMutation = useUpdatePagoMutation();
  const deleteMutation = useDeletePagoMutation();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedPago, setSelectedPago] = useState<Pago | undefined>(undefined);

  const handleCreate = () => {
    setSelectedPago(undefined);
    setIsDialogVisible(true);
  };

  const handleEdit = (pago: Pago) => {
    setSelectedPago(pago);
    setIsDialogVisible(true);
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: '¿Está seguro de eliminar este pago?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => deleteMutation.mutate(id),
    });
  };

  const handleSubmit = (data: any) => {
    if (selectedPago) {
      // Filter out restricted fields for update
      const {
        id_miembro,
        id_cuenta_dinero,
        id_evento,
        usar_cuenta_personal,
        id_cuenta_origen,
        ...updateData
      } = data;

      updateMutation.mutate(
        { id: selectedPago.id, data: updateData },
        {
          onSuccess: () => setIsDialogVisible(false),
        }
      );
    } else {
      const createData = {
        ...data,
        id_evento: data.id_evento || undefined,
      };
      createMutation.mutate(createData, {
        onSuccess: () => setIsDialogVisible(false),
      });
    }
  };

  const columns: TableColumn<Pago>[] = [
    {
      field: 'fecha_pago',
      header: 'Fecha',
      type: 'date',
      sortable: true,
    },
    {
      field: 'miembro',
      header: 'Miembro',
      sortable: true,
      body: (row) =>
        row.Miembro ? (
          <span className="font-bold">
            {row.Miembro.nombre} {row.Miembro.apellidos}
          </span>
        ) : (
          '-'
        ),
    },
    {
      field: 'concepto',
      header: 'Concepto',
      sortable: true,
      body: (row) => row.ConceptoPago?.nombre || '-',
    },
    {
      field: 'monto',
      header: 'Monto',
      sortable: true,
      body: (row) => `$${row.monto}`,
    },
    {
      field: 'cuenta_dinero',
      header: 'Destino',
      hideOnMobile: true,
      body: (row) => row.CuentaDinero?.nombre || '-',
    },
  ];

  return (
    <div className="p-4">
      <GenericDataTable
        title="Pagos"
        subtitle="Registro y gestión de pagos"
        data={pagos}
        columns={columns}
        isLoading={isLoading}
        permissionResource={RESOURCE.PAGO}
        actions={
          <Protect
            resource={RESOURCE.PAGO}
            action={ACTION.CREATE}
          >
            <Button
              label="Nuevo Pago"
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
        emptyMessage="No hay pagos registrados."
        globalFilterFields={[
          'Miembro.nombre',
          'Miembro.apellidos',
          'Miembro.dni',
        ]}
      />

      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        header={selectedPago ? 'Editar Pago' : 'Nuevo Pago'}
        className="w-full max-w-2xl"
      >
        <PagoFormContainer
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogVisible(false)}
          initialValues={selectedPago}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitLabel={selectedPago ? 'Guardar Cambios' : 'Registrar Pago'}
        />
      </Dialog>
    </div>
  );
};
