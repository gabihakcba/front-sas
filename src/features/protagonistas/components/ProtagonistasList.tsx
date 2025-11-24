/**
 * ProtagonistasList Component
 * Uses GenericDataTable for standardized list view
 */

'use client';

import { useState } from 'react';
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
import type {
  ProtagonistaRow,
  CreateProtagonistaDto,
} from '@/common/types/protagonista';
import { GenericForm } from '@/common/components/GenericForm';
import { protagonistaFormSections } from '../forms/protagonistaFormConfig';
import { toCalendarDate, toApiDate, formatDate } from '@/lib/date';

/**
 * Mapeo de rama a id_rama
 * TODO: Este mapeo debería venir del backend o de un endpoint /ramas
 */
const RAMA_ID_MAP: Record<string, number> = {
  CASTORES: 1,
  MANADA: 2,
  UNIDAD: 3,
  CAMINANTES: 4,
  ROVERS: 5,
};

/**
 * Opciones para el dropdown de Rama
 */
const ramaOptions = [
  { label: 'Castores', value: 'CASTORES' },
  { label: 'Manada', value: 'MANADA' },
  { label: 'Unidad', value: 'UNIDAD' },
  { label: 'Caminantes', value: 'CAMINANTES' },
  { label: 'Rovers', value: 'ROVERS' },
];

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

  const [dialogVisible, setDialogVisible] = useState(false);
  const [paseDialogVisible, setPaseDialogVisible] = useState(false);
  const [selectedProtagonista, setSelectedProtagonista] =
    useState<ProtagonistaRow | null>(null);
  const [selectedPaseProtagonista, setSelectedPaseProtagonista] =
    useState<ProtagonistaRow | null>(null);

  /**
   * Column configuration
   */
  const columns: TableColumn<ProtagonistaRow>[] = [
    {
      field: 'nombre',
      header: 'Nombre Completo',
      sortable: true,
      body: (rowData) => (
        <div className="flex flex-col">
          <span className="font-semibold">{`${rowData.nombre || ''} ${rowData.apellidos || ''}`}</span>
          {rowData.totem && (
            <span className="text-sm text-gray-400 md:hidden italic">
              {rowData.totem}
            </span>
          )}
        </div>
      ),
    },
    {
      field: 'rama',
      header: 'Rama',
      body: (rowData) => (
        <Tag
          value={rowData.rama}
          severity="info"
        />
      ),
    },
    {
      field: 'dni',
      header: 'DNI',
      sortable: true,
      className: 'hidden md:table-cell',
    },
    {
      field: 'telefono',
      header: 'Teléfono',
      className: 'hidden md:table-cell',
    },
    {
      field: 'fecha_nacimiento',
      header: 'Edad',
      className: 'hidden md:table-cell',
      body: (rowData) => {
        if (!rowData.fecha_nacimiento) return '-';
        const edad = calcularEdad(rowData.fecha_nacimiento);
        return `${edad} años`;
      },
    },
    {
      field: 'activo',
      header: 'Estado',
      className: 'hidden md:table-cell',
      body: (rowData) => (
        <Tag
          value={rowData.activo ? 'Activo' : 'Inactivo'}
          severity={rowData.activo ? 'success' : 'danger'}
        />
      ),
    },
  ];

  /**
   * Mobile detail template - shows all hidden columns
   */
  const mobileDetailTemplate = (rowData: ProtagonistaRow) => {
    return (
      <div className="p-4 bg-surface-50 rounded-lg">
        <div className="grid grid-cols-1 gap-4 text-sm">
          {/* Totem */}
          {rowData.totem && (
            <div>
              <strong className="text-text-secondary block mb-1">Totem:</strong>
              <p className="text-text-main italic">{rowData.totem}</p>
            </div>
          )}

          {/* Cualidad */}
          {rowData.cualidad && (
            <div>
              <strong className="text-text-secondary block mb-1">
                Cualidad:
              </strong>
              <p className="text-text-main">{rowData.cualidad}</p>
            </div>
          )}

          {/* DNI */}
          <div>
            <strong className="text-text-secondary block mb-1">DNI:</strong>
            <p className="text-text-main">{rowData.dni || '-'}</p>
          </div>

          {/* Email */}
          <div>
            <strong className="text-text-secondary block mb-1">Email:</strong>
            <p className="text-text-main">{rowData.email || '-'}</p>
          </div>

          {/* Teléfono */}
          <div>
            <strong className="text-text-secondary block mb-1">
              Teléfono:
            </strong>
            <p className="text-text-main">{rowData.telefono || '-'}</p>
          </div>

          {/* Teléfono Emergencia */}
          <div>
            <strong className="text-text-secondary block mb-1">
              Tel. Emergencia:
            </strong>
            <p className="text-text-main">
              {rowData.telefono_emergencia || '-'}
            </p>
          </div>

          {/* Dirección */}
          <div>
            <strong className="text-text-secondary block mb-1">
              Dirección:
            </strong>
            <p className="text-text-main">{rowData.direccion || '-'}</p>
          </div>

          {/* Fecha de Nacimiento y Edad */}
          <div>
            <strong className="text-text-secondary block mb-1">
              Nacimiento / Edad:
            </strong>
            <p className="text-text-main">
              {rowData.fecha_nacimiento
                ? `${formatDate(rowData.fecha_nacimiento)} (${calcularEdad(rowData.fecha_nacimiento)} años)`
                : '-'}
            </p>
          </div>

          {/* Becado */}
          <div>
            <strong className="text-text-secondary block mb-1">Becado:</strong>
            <div className="flex items-center gap-2">
              {rowData.es_becado ? (
                <i className="pi pi-check text-green-500" />
              ) : (
                <i className="pi pi-times text-red-500" />
              )}
              <span className="text-text-main">
                {rowData.es_becado ? 'Sí' : 'No'}
              </span>
            </div>
          </div>

          {/* Estado */}
          <div>
            <strong className="text-text-secondary block mb-1">Estado:</strong>
            <Tag
              value={rowData.activo ? 'Activo' : 'Inactivo'}
              severity={rowData.activo ? 'success' : 'danger'}
            />
          </div>
        </div>
      </div>
    );
  };

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
   * Handler para submit de pase de rama
   */
  const submitPaseRama = async (formData: any) => {
    if (!selectedPaseProtagonista) return;

    const idRama = RAMA_ID_MAP[formData.rama];
    if (!idRama) return;

    await paseRamaMutation.mutateAsync({
      id: selectedPaseProtagonista.id,
      id_rama: idRama,
    });

    setPaseDialogVisible(false);
    setSelectedPaseProtagonista(null);
  };

  /**
   * Handler para el submit del formulario
   * Transforma datos planos del formulario a estructura anidada del backend
   */
  const handleSubmit = async (formData: any) => {
    // Obtener id_rama desde el valor de rama
    const idRama = RAMA_ID_MAP[formData.rama] || 1;

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
        mobileDetailTemplate={mobileDetailTemplate}
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
          sections={protagonistaFormSections}
          onSubmit={handleSubmit}
          defaultValues={
            selectedProtagonista || { activo: true, es_becado: false }
          }
          submitLabel={
            selectedProtagonista ? 'Guardar Cambios' : 'Crear Protagonista'
          }
          isLoading={createMutation.isPending || updateMutation.isPending}
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
                  placeholder: 'Seleccione la nueva rama',
                },
              ],
            },
          ]}
          onSubmit={submitPaseRama}
          defaultValues={{ rama: selectedPaseProtagonista?.rama }}
          submitLabel="Confirmar Pase"
          isLoading={paseRamaMutation.isPending}
          actionType="update"
        />
      </Dialog>
    </>
  );
}
