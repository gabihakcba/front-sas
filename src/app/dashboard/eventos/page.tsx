'use client';

import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';
import { EventoAfectacionesDialog } from '@/components/eventos/EventoAfectacionesDialog';
import { EventoComisionDialog } from '@/components/eventos/EventoComisionDialog';
import { EventoFormDialog } from '@/components/eventos/EventoFormDialog';
import { EventoInscripcionesDialog } from '@/components/eventos/EventoInscripcionesDialog';
import { EVENT_MANAGEMENT_ACCESS } from '@/data/access-control';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useEventosHook } from '@/hooks/useEventosHooks';
import { hasAccessRule, hasPermissionAccess } from '@/lib/authorization';
import { Evento } from '@/types/eventos';

export default function EventosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const {
    eventos,
    selectedEvento,
    setSelectedEvento,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    inscripcionesVisible,
    afectacionesVisible,
    comisionVisible,
    inscripcionIds,
    setInscripcionIds,
    areaIds,
    setAreaIds,
    ramaIds,
    setRamaIds,
    selectedComisionId,
    setSelectedComisionId,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    auxSubmitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    openInscripcionesDialog,
    openAfectacionesDialog,
    openComisionDialog,
    closeDialog,
    closeInscripcionesDialog,
    closeAfectacionesDialog,
    closeComisionDialog,
    submitForm,
    submitInscripciones,
    submitAfectaciones,
    submitComision,
    deleteSelected,
  } = useEventosHook();

  const canCreate = hasPermissionAccess(user, 'CREATE:EVENTO');
  const canEdit = hasPermissionAccess(user, 'UPDATE:EVENTO');
  const canDelete = hasPermissionAccess(user, 'DELETE:EVENTO');
  const canManageInscripciones = hasPermissionAccess(user, 'UPDATE:INSCRIPCION');
  const canManageEventModules = hasAccessRule(user?.scopes, EVENT_MANAGEMENT_ACCESS);

  const handleDelete = () => {
    if (!selectedEvento) return;
    confirmDelete({
      message: `Se eliminará de forma lógica el evento "${selectedEvento.nombre}".`,
      impact:
        'El evento dejará de verse en listados y puede repercutir sobre comisiones, inscripciones, afectaciones y referencias históricas visibles en la interfaz.',
      onAccept: () => void deleteSelected(),
    });
  };

  const dateRangeValue: [Date | null, Date | null] | null =
    filters.fechaDesde || filters.fechaHasta
      ? [
          filters.fechaDesde
            ? dayjs(filters.fechaDesde, 'YYYY-MM-DD').toDate()
            : null,
          filters.fechaHasta
            ? dayjs(filters.fechaHasta, 'YYYY-MM-DD').toDate()
            : null,
        ]
      : null;

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <IconField iconPosition="right">
            <InputText
              value={filters.q}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  q: event.target.value,
                })
              }
              placeholder="Buscar por nombre, descripción o lugar"
            />
            <InputIcon className="pi pi-search" />
          </IconField>
          <Calendar
            value={dateRangeValue}
            onChange={(event) =>
              setFilters({
                ...filters,
                fechaDesde:
                  Array.isArray(event.value) && event.value[0] instanceof Date
                    ? dayjs(event.value[0]).format('YYYY-MM-DD')
                    : '',
                fechaHasta:
                  Array.isArray(event.value) && event.value[1] instanceof Date
                    ? dayjs(event.value[1]).format('YYYY-MM-DD')
                    : '',
              })
            }
            selectionMode="range"
            dateFormat="dd/mm/yy"
            showButtonBar
            placeholder="Rango de fechas"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageEventModules ? (
            <>
              <Button type="button" label="Inscripciones" icon="pi pi-users" iconPos="right" outlined size="small" onClick={() => void openInscripcionesDialog()} disabled={!selectedEvento || !canManageInscripciones} />
              <Button type="button" label="Afectaciones" icon="pi pi-sitemap" iconPos="right" outlined size="small" onClick={() => void openAfectacionesDialog()} disabled={!selectedEvento || !canEdit} />
              <Button type="button" label="Comisión" icon="pi pi-briefcase" iconPos="right" outlined size="small" onClick={() => void openComisionDialog()} disabled={!selectedEvento || !canEdit} />
              <Button type="button" label="Tipos" icon="pi pi-tags" iconPos="right" outlined size="small" onClick={() => router.push('/dashboard/tipos-evento')} />
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {canCreate ? <Button type="button" label="Crear" icon="pi pi-plus" iconPos="right" outlined size="small" onClick={() => void openCreateDialog()} /> : null}
        {canEdit ? <Button type="button" label="Editar" icon="pi pi-pencil" iconPos="right" outlined size="small" onClick={() => void openEditDialog()} disabled={!selectedEvento} /> : null}
        {canDelete ? <Button type="button" label="Eliminar" icon="pi pi-trash" iconPos="right" outlined size="small" severity="danger" onClick={handleDelete} disabled={!selectedEvento} /> : null}
      </div>
    </div>
  );

  const tipoHeader = (
    <Dropdown
      value={filters.idTipo}
      options={options.tipos}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idTipo: (event.value as number | null) ?? null,
        })
      }
      placeholder="Tipo"
      showClear
    />
  );

  return (
    <div className="h-full w-full">
      <Card title="Eventos" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? <Message severity="success" text={successMessage} className="mb-3 w-full" /> : null}
        <DataTable value={eventos} dataKey="id" loading={loading} lazy paginator header={header} selectionMode="single" selection={selectedEvento} onSelectionChange={(event) => setSelectedEvento((event.value as Evento | null) ?? null)} first={(page - 1) * limit} rows={10} totalRecords={total} onPage={(event: DataTablePageEvent) => void refetch(Math.floor(event.first / event.rows) + 1)} emptyMessage="No hay eventos disponibles." tableStyle={{ minWidth: '70rem', width: '100%' }}>
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          <Column field="id" header="ID" />
          <Column field="nombre" header="Nombre" />
          <Column header={tipoHeader} body={(evento: Evento) => evento.TipoEvento.nombre} />
          <Column header="Inicio" body={(evento: Evento) => dayjs(evento.fecha_inicio).format('DD/MM/YYYY')} />
          <Column header="Fin" body={(evento: Evento) => dayjs(evento.fecha_fin).format('DD/MM/YYYY')} />
          <Column header="Lugar" body={(evento: Evento) => evento.lugar ?? '-'} />
          <Column header="Comisión" body={(evento: Evento) => evento.Comision[0]?.nombre ?? '-'} />
          <Column header="Inscriptos" body={(evento: Evento) => evento._count.InscripcionEvento} />
        </DataTable>
      </Card>

      <EventoFormDialog visible={dialogVisible} mode={dialogMode} loading={dialogLoading} submitting={submitting} values={formValues} tipos={options.tipos} error={error} onHide={closeDialog} onSubmit={(values) => void submitForm(values)} />
      <EventoInscripcionesDialog visible={inscripcionesVisible} submitting={auxSubmitting} miembros={options.miembros} selectedIds={inscripcionIds} error={error} onHide={closeInscripcionesDialog} onChange={setInscripcionIds} onSubmit={() => void submitInscripciones()} />
      <EventoAfectacionesDialog visible={afectacionesVisible} submitting={auxSubmitting} areas={options.areas} ramas={options.ramas} selectedAreaIds={areaIds} selectedRamaIds={ramaIds} error={error} onHide={closeAfectacionesDialog} onAreaChange={setAreaIds} onRamaChange={setRamaIds} onSubmit={() => void submitAfectaciones()} />
      <EventoComisionDialog visible={comisionVisible} submitting={auxSubmitting} comisiones={options.comisiones} selectedId={selectedComisionId} error={error} onHide={closeComisionDialog} onChange={setSelectedComisionId} onSubmit={() => void submitComision()} />
      {deleteConfirmDialog}
    </div>
  );
}
