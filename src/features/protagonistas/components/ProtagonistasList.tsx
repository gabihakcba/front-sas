/**
 * ProtagonistasList Component
 * Uses GenericDataTable for standardized list view
 * Refactored to use Container Components for forms
 */

'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Protect } from '@/components/auth/Protect';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import {
  useProtagonistasQuery,
  useCreateProtagonistaMutation,
  useUpdateProtagonistaMutation,
  useDeleteProtagonistaMutation,
  usePaseRamaMutation,
} from '@/hooks/queries/useProtagonistas';
import type {
  ProtagonistaRow,
  CreateProtagonistaDto,
} from '@/common/types/protagonista';
import { toCalendarDate, toApiDate, calcularEdad } from '@/lib/date';
import { useToast } from '@/providers/ToastProvider';
import { ProtagonistaFormContainer } from './ProtagonistaFormContainer';
import { PaseRamaContainer } from './PaseRamaContainer';
import { VinculoResponsableContainer } from './VinculoResponsableContainer';

export default function ProtagonistasList() {
  const { data: protagonistas = [], isLoading } = useProtagonistasQuery();
  const createMutation = useCreateProtagonistaMutation();
  const updateMutation = useUpdateProtagonistaMutation();
  const deleteMutation = useDeleteProtagonistaMutation();
  const paseRamaMutation = usePaseRamaMutation();
  const { showErrorToast } = useToast();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [paseDialogVisible, setPaseDialogVisible] = useState(false);
  const [vinculoDialogVisible, setVinculoDialogVisible] = useState(false);

  const [selectedProtagonista, setSelectedProtagonista] =
    useState<ProtagonistaRow | null>(null);
  const [selectedPaseProtagonista, setSelectedPaseProtagonista] =
    useState<ProtagonistaRow | null>(null);
  const [selectedProtagonistaVinculo, setSelectedProtagonistaVinculo] =
    useState<ProtagonistaRow | null>(null);

  /**
   * Column configuration
   */
  const columns: TableColumn<ProtagonistaRow>[] = [
    {
      header: 'Nombre Completo',
      field: 'nombre',
      transform: (row) => `${row.nombre} ${row.apellidos}`,
      sortable: true,
    },
    {
      field: 'rama',
      header: 'Rama',
      type: 'tag',
      tagConfig: {
        getSeverity: () => 'info',
      },
    },
    {
      field: 'dni',
      header: 'DNI',
      sortable: true,
      hideOnMobile: true,
    },
    {
      field: 'telefono',
      header: 'Teléfono',
      hideOnMobile: true,
    },
    {
      field: 'fecha_nacimiento',
      header: 'Edad',
      hideOnMobile: true,
      body: (rowData) => {
        if (!rowData.fecha_nacimiento) return '-';
        const edad = calcularEdad(rowData.fecha_nacimiento);
        return `${edad} años`;
      },
    },
    {
      field: 'activo',
      header: 'Estado',
      hideOnMobile: true,
      type: 'tag',
      tagConfig: {
        getLabel: (v) => (v ? 'Activo' : 'Inactivo'),
        getSeverity: (v) => (v ? 'success' : 'danger'),
      },
    },
  ];

  /**
   * Handler para abrir el diálogo de creación
   */
  const handleCreate = () => {
    setSelectedProtagonista(null);
    setDialogVisible(true);
  };

  /**
   * Handler para editar un protagonista
   */
  const handleEdit = (protagonista: ProtagonistaRow) => {
    const protagonistaEditable = {
      ...protagonista,
      fecha_nacimiento: toCalendarDate(protagonista.fecha_nacimiento),
    };
    setSelectedProtagonista(protagonistaEditable as any);
    setDialogVisible(true);
  };

  /**
   * Handler para eliminar un protagonista con confirmación
   */
  const handleDelete = (protagonista: ProtagonistaRow) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar a ${protagonista.nombre} ${protagonista.apellidos}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteMutation.mutateAsync(protagonista.id);
      },
    });
  };

  /**
   * Handler para abrir diálogo de pase de rama
   */
  const handlePaseRama = (protagonista: ProtagonistaRow) => {
    setSelectedPaseProtagonista(protagonista);
    setPaseDialogVisible(true);
  };

  /**
   * Handler para abrir el diálogo de vinculación
   */
  const handleVincular = (protagonista: ProtagonistaRow) => {
    setSelectedProtagonistaVinculo(protagonista);
    setVinculoDialogVisible(true);
  };

  /**
   * Handler para submit de pase de rama
   */
  const submitPaseRama = async (formData: any) => {
    if (!selectedPaseProtagonista) return;

    const idRama = Number(formData.rama);
    if (!idRama) {
      console.error('Rama no válida:', formData.rama);
      showErrorToast('Error', 'La rama seleccionada no es válida');
      return;
    }

    await paseRamaMutation.mutateAsync({
      id: selectedPaseProtagonista.id,
      id_rama: idRama,
      fecha_pase: toApiDate(formData.fecha_pase) ?? undefined,
    });

    setPaseDialogVisible(false);
    setSelectedPaseProtagonista(null);
  };

  /**
   * Handler para el submit del formulario
   * Transforma datos planos del formulario a estructura anidada del backend
   */
  const handleSubmit = async (formData: any) => {
    const payload: CreateProtagonistaDto = {
      id_rama: formData.id_rama,
      es_becado: Boolean(formData.es_becado),
      activo: Boolean(formData.activo),
      miembro: {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        dni: formData.dni,
        fecha_nacimiento: toApiDate(formData.fecha_nacimiento) as any,
        direccion: formData.direccion,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
        telefono_emergencia: formData.telefono_emergencia,
        totem: formData.totem || undefined,
        cualidad: formData.cualidad || undefined,
      },
    };

    if (selectedProtagonista) {
      await updateMutation.mutateAsync({
        id: selectedProtagonista.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setDialogVisible(false);
  };

  /**
   * Actions for header (Create button)
   */
  const headerActions = (
    <Protect
      resource={RESOURCE.PROTAGONISTA}
      action={ACTION.CREATE}
    >
      <Button
        label="Nuevo Protagonista"
        icon="pi pi-plus"
        iconPos="right"
        size="small"
        outlined
        severity="success"
        onClick={handleCreate}
      />
    </Protect>
  );

  /**
   * Custom row actions (Pase de Rama y Vincular)
   */
  const rowActions = (rowData: ProtagonistaRow) => (
    <div className="flex gap-2">
      <Protect
        resource={RESOURCE.PROTAGONISTA}
        action={ACTION.UPDATE}
      >
        <Button
          className="p-button-sm p-button-outlined gap-2"
          severity="warning"
          onClick={() => handlePaseRama(rowData)}
          tooltip="Pase de Rama"
          tooltipOptions={{ position: 'top', appendTo: document.body }}
        >
          <i className="pi pi-arrow-right" />
        </Button>
      </Protect>
      <Protect
        resource={RESOURCE.RESPONSABLE}
        action={ACTION.UPDATE}
      >
        <Button
          className="p-button-sm p-button-outlined gap-2"
          severity="help"
          onClick={() => handleVincular(rowData)}
          tooltip="Vincular Responsable"
          tooltipOptions={{ position: 'top', appendTo: document.body }}
        >
          <i className="pi pi-link" />
        </Button>
      </Protect>
    </div>
  );

  return (
    <>
      <ConfirmDialog />
      <GenericDataTable
        data={protagonistas}
        columns={columns}
        isLoading={isLoading}
        title="Gestión de Protagonistas"
        subtitle="Administra los niños y jóvenes del grupo scout"
        actions={headerActions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissionResource={RESOURCE.PROTAGONISTA}
        mobileDetailTemplate={undefined}
        rowActions={rowActions}
      />

      {/* Dialog de Creación/Edición */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={
          selectedProtagonista ? 'Editar Protagonista' : 'Nuevo Protagonista'
        }
        className="w-full md:w-[800px]"
        modal
      >
        {dialogVisible && (
          <ProtagonistaFormContainer
            defaultValues={selectedProtagonista}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            actionType={selectedProtagonista ? 'update' : 'create'}
            submitLabel={
              selectedProtagonista ? 'Guardar Cambios' : 'Crear Protagonista'
            }
          />
        )}
      </Dialog>

      {/* Dialog de Pase de Rama */}
      <Dialog
        visible={paseDialogVisible}
        onHide={() => setPaseDialogVisible(false)}
        header="Realizar Pase de Rama"
        className="w-full md:w-[400px]"
        modal
      >
        {paseDialogVisible && (
          <PaseRamaContainer
            onSubmit={submitPaseRama}
            isLoading={paseRamaMutation.isPending}
          />
        )}
      </Dialog>

      {/* Dialog de Vinculación */}
      <Dialog
        visible={vinculoDialogVisible}
        onHide={() => setVinculoDialogVisible(false)}
        header={`Asignar Responsable a ${selectedProtagonistaVinculo?.nombre} ${selectedProtagonistaVinculo?.apellidos}`}
        className="w-full md:w-[500px]"
        modal
      >
        {vinculoDialogVisible && selectedProtagonistaVinculo && (
          <VinculoResponsableContainer
            protagonistaId={selectedProtagonistaVinculo.id}
            onClose={() => setVinculoDialogVisible(false)}
          />
        )}
      </Dialog>
    </>
  );
}
