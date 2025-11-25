/**
 * ProtagonistasList Component
 * Uses GenericDataTable for standardized list view
 */

'use client';

import { useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
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
import { useRamasQuery } from '@/hooks/queries/useRamas';
import type {
  ProtagonistaRow,
  CreateProtagonistaDto,
} from '@/common/types/protagonista';
import { GenericForm } from '@/common/components/GenericForm';
import { protagonistaFormSections } from '../forms/protagonistaFormConfig';
import { toCalendarDate, toApiDate, formatDate } from '@/lib/date';

import { useToast } from '@/providers/ToastProvider';

/**
 * Calcula la edad basándose en la fecha de nacimiento
 */
const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

export default function ProtagonistasList() {
  const { data: protagonistas = [], isLoading } = useProtagonistasQuery();
  const createMutation = useCreateProtagonistaMutation();
  const updateMutation = useUpdateProtagonistaMutation();
  const deleteMutation = useDeleteProtagonistaMutation();
  const paseRamaMutation = usePaseRamaMutation();
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();
  const { showErrorToast } = useToast();

  const ramaOptions = ramas?.map((rama) => ({
    label: rama.nombre,
    value: rama.id,
  }));

  const [dialogVisible, setDialogVisible] = useState(false);
  const [paseDialogVisible, setPaseDialogVisible] = useState(false);
  const [selectedProtagonista, setSelectedProtagonista] =
    useState<ProtagonistaRow | null>(null);
  const [selectedPaseProtagonista, setSelectedPaseProtagonista] =
    useState<ProtagonistaRow | null>(null);

  /**
   * Memoized form sections with dynamic options
   */
  const formSections = useMemo(() => {
    return protagonistaFormSections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        if (field.name === 'rama') {
          return {
            ...field,
            options: ramaOptions,
            isLoading: isLoadingRamas,
          };
        }
        return field;
      }),
    }));
  }, [ramaOptions, isLoadingRamas]);

  /**
   * Column configuration
   */
  const columns: TableColumn<ProtagonistaRow>[] = [
    {
      header: 'Nombre Completo',
      // field es opcional si usas transform, pero sirve para sortear si el back lo soporta
      field: 'nombre',
      transform: (row) => `${row.nombre} ${row.apellidos}`, // ✨ Magia 1
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
    // Buscar el ID de la rama basado en el nombre (label) - Case insensitive
    const ramaId = ramaOptions.find(
      (opt) => opt.label.toUpperCase() === protagonista.rama?.toUpperCase()
    )?.value;

    const protagonistaEditable = {
      ...protagonista,
      rama: ramaId, // Pasamos el ID para que el Dropdown lo reconozca
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
      id_nueva_rama: idRama,
    });

    setPaseDialogVisible(false);
    setSelectedPaseProtagonista(null);
  };

  /**
   * Handler para el submit del formulario
   * Transforma datos planos del formulario a estructura anidada del backend
   */
  const handleSubmit = async (formData: any) => {
    const idRama = Number(formData.rama);

    if (!idRama) {
      console.error('Rama no válida:', formData.rama);
      showErrorToast('Error', 'La rama seleccionada no es válida');
      return;
    }

    const payload: CreateProtagonistaDto = {
      id_rama: idRama,
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
   * Custom row actions (Pase de Rama)
   */
  const rowActions = (rowData: ProtagonistaRow) => (
    <Protect
      resource={RESOURCE.PROTAGONISTA}
      action={ACTION.UPDATE}
    >
      <Button
        className="p-button-sm p-button-outlined gap-2"
        severity="warning"
        onClick={() => handlePaseRama(rowData)}
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
        data={protagonistas}
        columns={columns}
        isLoading={isLoading}
        title="Gestión de Protagonistas"
        subtitle="Administra los niños y jóvenes del grupo scout"
        actions={headerActions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissionResource={RESOURCE.PROTAGONISTA}
        mobileDetailTemplate={undefined} // Let GenericDataTable handle it automatically
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
        <GenericForm
          sections={formSections}
          onSubmit={handleSubmit}
          defaultValues={
            selectedProtagonista || { activo: true, es_becado: false }
          }
          submitLabel={
            selectedProtagonista ? 'Guardar Cambios' : 'Crear Protagonista'
          }
          isLoading={
            createMutation.isPending ||
            updateMutation.isPending ||
            isLoadingRamas
          }
          actionType={selectedProtagonista ? 'update' : 'create'}
        />
      </Dialog>

      {/* Dialog de Pase de Rama */}
      <Dialog
        visible={paseDialogVisible}
        onHide={() => setPaseDialogVisible(false)}
        header="Realizar Pase de Rama"
        className="w-full md:w-[400px]"
        modal
      >
        <GenericForm
          sections={[
            {
              title: '',
              layout: { cols: 1 },
              fields: [
                {
                  name: 'rama',
                  label: 'Nueva Rama',
                  type: 'dropdown',
                  rules: { required: 'La rama es requerida' },
                  options: ramaOptions,
                  isLoading: isLoadingRamas,
                  placeholder: 'Seleccione la nueva rama',
                },
              ],
            },
          ]}
          onSubmit={submitPaseRama}
          defaultValues={{ rama: undefined }}
          submitLabel="Confirmar Pase"
          isLoading={paseRamaMutation.isPending || isLoadingRamas}
          actionType="update"
        />
      </Dialog>
    </>
  );
}
