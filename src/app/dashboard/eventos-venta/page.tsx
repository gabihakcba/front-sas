'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { EventoVentaEncargadosJuvenilesDialog } from '@/components/eventos-venta/EventoVentaEncargadosJuvenilesDialog';
import { EventoVentaFormDialog } from '@/components/eventos-venta/EventoVentaFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useEventosVentaHooks } from '@/hooks/useEventosVentaHooks';
import { hasPermissionAccess } from '@/lib/authorization';
import { EventoVentaListItem } from '@/types/eventos-venta';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);

export default function EventosVentaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    eventosVenta,
    selectedEventoVenta,
    setSelectedEventoVenta,
    formValues,
    setFormValues,
    dialogMode,
    dialogVisible,
    error,
    successMessage,
    loading,
    submitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    encargadosJuveniles,
    encargadosJuvenilesOptions,
    encargadosJuvenilesVisible,
    encargadosJuvenilesLoading,
    encargadosJuvenilesSearching,
    encargadosJuvenilesSubmitting,
    encargadosJuvenilesError,
    encargadosJuvenilesSuccessMessage,
    openEncargadosJuvenilesDialog,
    closeEncargadosJuvenilesDialog,
    searchEncargadosJuvenilesOptions,
    assignEncargadoJuvenil,
    removeEncargadoJuvenil,
    submitForm,
    deleteSelected,
  } = useEventosVentaHooks();
  const canCreate = hasPermissionAccess(user, 'CREATE:EVENTO');
  const canEdit = hasPermissionAccess(user, 'UPDATE:EVENTO');
  const canDelete = hasPermissionAccess(user, 'DELETE:EVENTO');
  const canManageEncargadosJuveniles = hasPermissionAccess(user, 'UPDATE:EVENTO');

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const filterControls = (
    <>
      <IconField iconPosition="right" className="w-full">
        <InputText
          className="w-full"
          value={filters.q}
          onChange={(event) =>
            setFilters({
              ...filters,
              q: event.target.value,
            })
          }
          placeholder="Buscar evento de venta"
        />
        <InputIcon className="pi pi-search" />
      </IconField>
      <div className="flex items-center gap-2">
        <label htmlFor="eventos-venta-include-deleted">Incluir borrados</label>
        <Checkbox
          inputId="eventos-venta-include-deleted"
          checked={filters.includeDeleted}
          onChange={(event) =>
            setFilters({
              ...filters,
              includeDeleted: Boolean(event.checked),
            })
          }
        />
      </div>
    </>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        crudActions={[
          ...(canCreate
            ? [
                {
                  label: 'Crear',
                  icon: 'pi pi-plus',
                  onClick: () => openCreateDialog(),
                },
              ]
            : []),
          ...(canManageEncargadosJuveniles
            ? [
                {
                  label: 'Encargados juveniles',
                  icon: 'pi pi-user-plus',
                  onClick: () => void openEncargadosJuvenilesDialog(),
                },
              ]
            : []),
          ...(canEdit
            ? [
                {
                  label: 'Editar',
                  icon: 'pi pi-pencil',
                  onClick: () => void openEditDialog(),
                  disabled: !selectedEventoVenta,
                },
              ]
            : []),
          {
            label: 'Abrir',
            icon: 'pi pi-arrow-right',
            onClick: () => {
              if (selectedEventoVenta) {
                router.push(`/dashboard/eventos-venta/${selectedEventoVenta.id}`);
              }
            },
            disabled: !selectedEventoVenta,
          },
          ...(canDelete
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: () => {
                    if (!selectedEventoVenta) return;
                    confirmDelete({
                      message: `Se eliminará de forma lógica el evento de venta "${selectedEventoVenta.nombre}".`,
                      impact:
                        'Las reservas importadas quedarán fuera de la operatoria normal pero seguirán preservadas a nivel histórico.',
                      onAccept: () => void deleteSelected(),
                    });
                  },
                  disabled: !selectedEventoVenta,
                  severity: 'danger' as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );

  const moneyBody = (rowData: EventoVentaListItem, field: keyof EventoVentaListItem['resumen']) =>
    formatMoney(rowData.resumen[field] as number);

  return (
    <div className="flex flex-col gap-4">
      <Card title="Eventos de venta">
        <div className="flex flex-col gap-3">
          <span>
            Módulo separado de pagos y cuentas para manejar ventas como locro,
            sorteos o cualquier evento con reservas, retiros y rendiciones.
          </span>
          {successMessage ? <Message severity="success" text={successMessage} /> : null}
          {error ? <Message severity="error" text={error} /> : null}
          <DataTable
            value={eventosVenta}
            selectionMode="single"
            selection={selectedEventoVenta}
            onSelectionChange={(event) =>
              setSelectedEventoVenta((event.value as EventoVentaListItem | null) ?? null)
            }
            dataKey="id"
            paginator
            lazy
            rows={limit}
            totalRecords={total}
            first={(page - 1) * limit}
            onPage={handlePage}
            loading={loading}
            header={header}
            emptyMessage="No hay eventos de venta."
            scrollable
          >
            <Column field="nombre" header="Nombre" />
            <Column
              field="fecha_evento"
              header="Fecha"
              body={(rowData: EventoVentaListItem) =>
                dayjs(rowData.fecha_evento).format('DD/MM/YYYY')
              }
            />
            <Column
              header="Items"
              body={(rowData: EventoVentaListItem) => rowData._count.Items}
            />
            <Column
              header="Sectores"
              body={(rowData: EventoVentaListItem) => rowData._count.Sectores}
            />
            <Column
              header="Reservas"
              body={(rowData: EventoVentaListItem) => rowData._count.Reservas}
            />
            <Column
              header="Vendidas"
              body={(rowData: EventoVentaListItem) => rowData.resumen.cantidadVendida}
            />
            <Column
              header="Pagado"
              body={(rowData: EventoVentaListItem) => moneyBody(rowData, 'montoPagado')}
            />
            <Column
              header="Pendiente"
              body={(rowData: EventoVentaListItem) =>
                moneyBody(rowData, 'montoPendiente')
              }
            />
          </DataTable>
        </div>
      </Card>
      <EventoVentaFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={submitting}
        error={error}
        values={formValues}
        onHide={closeDialog}
        onChange={setFormValues}
        onSubmit={() => void submitForm()}
      />
      <EventoVentaEncargadosJuvenilesDialog
        visible={encargadosJuvenilesVisible}
        loading={encargadosJuvenilesLoading}
        searching={encargadosJuvenilesSearching}
        submitting={encargadosJuvenilesSubmitting}
        error={encargadosJuvenilesError}
        successMessage={encargadosJuvenilesSuccessMessage}
        assigned={encargadosJuveniles}
        options={encargadosJuvenilesOptions}
        onHide={closeEncargadosJuvenilesDialog}
        onSearch={(value) => void searchEncargadosJuvenilesOptions(value)}
        onAssign={(memberId) => void assignEncargadoJuvenil(memberId)}
        onRemove={(memberId) => void removeEncargadoJuvenil(memberId)}
      />
      {deleteConfirmDialog}
    </div>
  );
}
