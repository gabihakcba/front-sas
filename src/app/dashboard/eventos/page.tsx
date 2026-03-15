'use client';

import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';
import { EventoAfectacionesDialog } from '@/components/eventos/EventoAfectacionesDialog';
import { EventoComisionDialog } from '@/components/eventos/EventoComisionDialog';
import { EventoFormDialog } from '@/components/eventos/EventoFormDialog';
import { EventoInscripcionesDialog } from '@/components/eventos/EventoInscripcionesDialog';
import { useEventosHook } from '@/hooks/useEventosHooks';
import { Evento } from '@/types/eventos';

const hasPermission = (permissions: string[], required: string) => {
  if (permissions.includes(required)) return true;
  const [, resource] = required.split(':');
  return permissions.includes(`MANAGE:${resource}`);
};

export default function EventosPage() {
  const router = useRouter();
  const { user } = useAuth();
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

  const permissions = user?.permissions ?? [];
  const roles = user?.roles ?? [];
  const canCreate = hasPermission(permissions, 'CREATE:EVENTO');
  const canEdit = hasPermission(permissions, 'UPDATE:EVENTO');
  const canDelete = roles.includes('JEFATURA') || roles.includes('ADM') || roles.includes('OWN');
  const canManageInscripciones = hasPermission(permissions, 'UPDATE:INSCRIPCION');

  const handleDelete = () => {
    if (!selectedEvento) return;
    const confirmed = window.confirm(`Se eliminará el evento "${selectedEvento.nombre}".`);
    if (confirmed) void deleteSelected();
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        <Button type="button" label="Inscripciones" icon="pi pi-users" iconPos="right" outlined size="small" onClick={() => void openInscripcionesDialog()} disabled={!selectedEvento || !canManageInscripciones} />
        <Button type="button" label="Afectaciones" icon="pi pi-sitemap" iconPos="right" outlined size="small" onClick={() => void openAfectacionesDialog()} disabled={!selectedEvento || !canEdit} />
        <Button type="button" label="Comisión" icon="pi pi-briefcase" iconPos="right" outlined size="small" onClick={() => void openComisionDialog()} disabled={!selectedEvento || !canEdit} />
        <Button type="button" label="Tipos" icon="pi pi-tags" iconPos="right" outlined size="small" onClick={() => router.push('/dashboard/tipos-evento')} />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {canCreate ? <Button type="button" label="Crear" icon="pi pi-plus" iconPos="right" outlined size="small" onClick={() => void openCreateDialog()} /> : null}
        {canEdit ? <Button type="button" label="Editar" icon="pi pi-pencil" iconPos="right" outlined size="small" onClick={() => void openEditDialog()} disabled={!selectedEvento} /> : null}
        {canDelete ? <Button type="button" label="Eliminar" icon="pi pi-trash" iconPos="right" outlined size="small" severity="danger" onClick={handleDelete} disabled={!selectedEvento} /> : null}
      </div>
    </div>
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
          <Column header="Tipo" body={(evento: Evento) => evento.TipoEvento.nombre} />
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
    </div>
  );
}
