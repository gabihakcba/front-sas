/**
 * AdultosList Component
 * Refactored to use GenericDataTable
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
  useAdultosQuery,
  useCreateAdultoMutation,
  useUpdateAdultoMutation,
  useDeleteAdultoMutation,
} from '@/hooks/queries/useAdultos';
import type { AdultoRow, CreateAdultoDto } from '@/common/types/adulto';
import { GenericForm } from '@/common/components/GenericForm';
import { adultoFormSections } from '../forms/adultoFormConfig';
import { toCalendarDate, toApiDate, formatDate } from '@/lib/date';
import { Tag } from 'primereact/tag';

export default function AdultosList() {
  const { data: adultos = [], isLoading } = useAdultosQuery();
  const createMutation = useCreateAdultoMutation();
  const updateMutation = useUpdateAdultoMutation();
  const deleteMutation = useDeleteAdultoMutation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedAdulto, setSelectedAdulto] = useState<AdultoRow | null>(null);

  /**
   * Column configuration
   */
  const columns: TableColumn<AdultoRow>[] = [
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
      body: (rowData) => rowData.rama || 'Sin rama',
    },
    {
      field: 'totem',
      header: 'Totem',
      className: 'hidden md:table-cell',
      body: (rowData) =>
        rowData.totem ? (
          <span className="italic text-primary">{rowData.totem}</span>
        ) : (
          <span className="text-gray-500">-</span>
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
  const mobileDetailTemplate = (rowData: AdultoRow) => {
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

          {/* Fecha de Nacimiento */}
          <div>
            <strong className="text-text-secondary block mb-1">
              Fecha de Nacimiento:
            </strong>
            <p className="text-text-main">
              {rowData.fecha_nacimiento
                ? formatDate(rowData.fecha_nacimiento)
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
    setSelectedAdulto(null);
    setDialogVisible(true);
  };

  /**
   * Handler para editar un adulto
   */
  const handleEdit = (adulto: AdultoRow) => {
    const adultoEditable = {
      ...adulto,
      fecha_nacimiento: toCalendarDate(adulto.fecha_nacimiento),
    };
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
        await deleteMutation.mutateAsync(adulto.id);
      },
    });
  };

  /**
   * Handler para el submit del formulario
   */
  const handleSubmit = async (formData: any) => {
    const payload: CreateAdultoDto = {
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

    if (selectedAdulto) {
      await updateMutation.mutateAsync({
        id: selectedAdulto.id,
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
        mobileDetailTemplate={mobileDetailTemplate}
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
          sections={adultoFormSections}
          onSubmit={handleSubmit}
          defaultValues={selectedAdulto || { activo: true, es_becado: false }}
          submitLabel={selectedAdulto ? 'Guardar Cambios' : 'Crear Adulto'}
          isLoading={createMutation.isPending || updateMutation.isPending}
          actionType={selectedAdulto ? 'update' : 'create'}
        />
      </Dialog>
    </>
  );
}
