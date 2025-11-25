/**
 * AdultosList Component
 * Refactored to use GenericDataTable
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Protect } from '@/components/auth/Protect';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import {
  useAdultosQuery,
  useCreateAdultoMutation,
  useUpdateAdultoMutation,
  useDeleteAdultoMutation,
  usePaseAdultoMutation,
} from '@/hooks/queries/useAdultos';
import type {
  AdultoRow,
  CreateAdultoDto,
  PaseAdultoDto,
} from '@/common/types/adulto';
import { GenericForm } from '@/common/components/GenericForm';
import {
  getAdultoFormSections,
  getEquipoFormSection,
} from '../forms/adultoFormConfig';
import {
  useAreasQuery,
  usePosicionesQuery,
  useRolesQuery,
} from '@/hooks/queries/useCommon';
import { useRamasQuery } from '@/hooks/queries/useRamas';
import { toCalendarDate } from '@/lib/date';

export default function AdultosList() {
  const { data: adultos = [], isLoading } = useAdultosQuery();
  const { data: areas = [], isLoading: isLoadingAreas } = useAreasQuery();
  const { data: posiciones = [], isLoading: isLoadingPosiciones } =
    usePosicionesQuery();
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery();

  const createAdultoMutation = useCreateAdultoMutation();
  const updateAdultoMutation = useUpdateAdultoMutation();
  const deleteAdultoMutation = useDeleteAdultoMutation();
  const paseAdultoMutation = usePaseAdultoMutation();

  const sections = useMemo(
    () => getAdultoFormSections(areas, posiciones, ramas, roles),
    [areas, posiciones, ramas, roles]
  );

  // Sección de equipo para el formulario de Pase
  const paseSection = useMemo(
    () => [getEquipoFormSection(areas, posiciones, ramas, roles)],
    [areas, posiciones, ramas, roles]
  );

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedAdulto, setSelectedAdulto] = useState<AdultoRow | null>(null);

  // Estado para el diálogo de Pase
  const [paseDialogVisible, setPaseDialogVisible] = useState(false);
  const [selectedAdultoPase, setSelectedAdultoPase] =
    useState<AdultoRow | null>(null);

  /**
   * Column configuration
   */
  const columns: TableColumn<AdultoRow>[] = [
    {
      field: 'nombre', // Keep field for sorting/key
      header: 'Nombre Completo',
      sortable: true,
      transform: (row) => `${row.nombre || ''} ${row.apellidos || ''}`,
      className: 'font-semibold', // Keep styling
    },
    {
      field: 'rama',
      header: 'Rama',
    },
    {
      field: 'totem',
      header: 'Totem',
      hideOnMobile: true,
      textSeverity: 'primary',
      className: 'italic', // Keep italic styling
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
    setSelectedAdulto(null);
    setDialogVisible(true);
  };

  /**
   * Handler para editar un adulto
   */
  const handleEdit = (adulto: AdultoRow) => {
    // Extract IDs from nested equipo object if present (backend might return it nested)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawAdulto = adulto as any;
    console.log(rawAdulto);
    // Buscar el equipo activo en la relación EquipoArea (si existe)
    let activeTeam = null;
    if (Array.isArray(rawAdulto.EquipoArea)) {
      activeTeam = rawAdulto.EquipoArea.find((eq: any) => eq.activo);
    } else if (rawAdulto.equipo) {
      activeTeam = rawAdulto.equipo;
    } else if (rawAdulto.equipoActual) {
      activeTeam = rawAdulto.equipoActual;
    }
    console.log(activeTeam);

    const adultoEditable = {
      ...adulto,
      fecha_nacimiento: toCalendarDate(adulto.fecha_nacimiento),
      id_area: adulto.id_area ?? activeTeam?.id_area,
      id_posicion: adulto.id_posicion ?? activeTeam?.id_posicion,
      id_rama: adulto.id_rama ?? activeTeam?.id_rama,
      id_role: adulto.id_role ?? activeTeam?.id_role,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedAdulto(adultoEditable as any);
    setDialogVisible(true);
  };

  /**
   * Handler para eliminar un adulto con confirmación
   */
  const handleDelete = (adulto: AdultoRow) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar a ${adulto.nombre} ${adulto.apellidos}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteAdultoMutation.mutateAsync(adulto.id);
      },
    });
  };

  /**
   * Handler para abrir el diálogo de Pase
   */
  const handlePase = (adulto: AdultoRow) => {
    setSelectedAdultoPase(adulto);
    setPaseDialogVisible(true);
  };

  /**
   * Handler para el submit del formulario de Pase
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitPase = async (data: any) => {
    const { id_area, id_posicion, id_rama, id_role } = data;

    if (!selectedAdultoPase) return;

    // Construir el DTO de Pase
    const pasePayload: PaseAdultoDto = {
      equipo: {
        id_area,
        id_posicion,
        // Lógica data-driven: solo envía id_rama si el área tiene ramas
        id_rama: (() => {
          const selectedArea = areas.find((a) => a.id === id_area);
          return selectedArea?.Rama && selectedArea.Rama.length > 0
            ? id_rama
            : undefined;
        })(),
        id_role,
      },
    };

    await paseAdultoMutation.mutateAsync({
      id: selectedAdultoPase.id,
      data: pasePayload,
    });

    setPaseDialogVisible(false);
  };

  /**
   * Handler para el submit del formulario de crear/editar
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const {
      nombre,
      apellidos,
      dni,
      fecha_nacimiento,
      direccion,
      email,
      telefono,
      telefono_emergencia,
      totem,
      cualidad,
      es_becado,
      activo,
      id_area,
      id_posicion,
      id_rama,
      id_role,
    } = data;

    // Prepare payload
    const payload: CreateAdultoDto = {
      es_becado: !!es_becado,
      activo: !!activo,
      miembro: {
        nombre,
        apellidos,
        dni,
        fecha_nacimiento: new Date(fecha_nacimiento).toISOString(),
        direccion,
        email,
        telefono,
        telefono_emergencia,
        totem,
        cualidad,
      },
      equipo: {
        id_area,
        id_posicion,
        // Lógica data-driven: solo envía id_rama si el área seleccionada tiene ramas asociadas
        id_rama: (() => {
          const selectedArea = areas.find((a) => a.id === id_area);
          return selectedArea?.Rama && selectedArea.Rama.length > 0
            ? id_rama
            : undefined;
        })(),
        id_role,
      },
    };

    if (selectedAdulto) {
      await updateAdultoMutation.mutateAsync({
        id: selectedAdulto.id,
        data: payload,
      });
    } else {
      await createAdultoMutation.mutateAsync(payload);
    }

    setDialogVisible(false);
  };

  /**
   * Actions for header (Create button)
   */
  const headerActions = (
    <Protect
      resource={RESOURCE.ADULTO}
      action={ACTION.CREATE}
    >
      <Button
        label="Nuevo Adulto"
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
   * Custom row actions (Pase button)
   */
  const rowActions = (adulto: AdultoRow) => (
    <Protect
      resource={RESOURCE.ADULTO}
      action={ACTION.UPDATE}
    >
      <Button
        className="p-button-sm p-button-outlined gap-2"
        severity="warning"
        onClick={() => handlePase(adulto)}
      >
        <span className="hidden md:inline">Pase</span>
        <i className="pi pi-arrow-right" />
      </Button>
    </Protect>
  );

  return (
    <>
      <ConfirmDialog />
      <GenericDataTable
        data={adultos}
        columns={columns}
        isLoading={isLoading}
        title="Gestión de Adultos"
        subtitle="Administra los educadores y colaboradores del grupo"
        actions={headerActions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissionResource={RESOURCE.ADULTO}
        mobileDetailTemplate={undefined}
        rowActions={rowActions}
      />

      {/* Dialog de Creación/Edición */}
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={selectedAdulto ? 'Editar Adulto' : 'Nuevo Adulto'}
        className="w-full md:w-[800px]"
        modal
      >
        <GenericForm
          sections={sections}
          onSubmit={handleSubmit}
          defaultValues={selectedAdulto || { activo: true, es_becado: false }}
          submitLabel={selectedAdulto ? 'Guardar Cambios' : 'Crear Adulto'}
          isLoading={
            createAdultoMutation.isPending ||
            updateAdultoMutation.isPending ||
            isLoadingAreas ||
            isLoadingPosiciones ||
            isLoadingRamas ||
            isLoadingRoles
          }
          actionType={selectedAdulto ? 'update' : 'create'}
        />
      </Dialog>

      {/* Dialog de Pase de Cargo */}
      <Dialog
        visible={paseDialogVisible}
        onHide={() => setPaseDialogVisible(false)}
        header={`Realizar Pase - ${selectedAdultoPase?.nombre || ''} ${selectedAdultoPase?.apellidos || ''}`}
        className="w-full md:w-[600px]"
        modal
      >
        <GenericForm
          sections={paseSection}
          onSubmit={handleSubmitPase}
          defaultValues={{}}
          submitLabel="Confirmar Pase"
          isLoading={
            paseAdultoMutation.isPending ||
            isLoadingAreas ||
            isLoadingPosiciones ||
            isLoadingRamas ||
            isLoadingRoles
          }
          actionType="create"
        />
      </Dialog>
    </>
  );
}
