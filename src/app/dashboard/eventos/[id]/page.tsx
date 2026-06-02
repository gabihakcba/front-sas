'use client';

import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { useAuth } from '@/context/AuthContext';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { EventoAfectacionesDialog } from '@/components/eventos/EventoAfectacionesDialog';
import { EventoComisionDialog } from '@/components/eventos/EventoComisionDialog';
import { EventoFormDialog } from '@/components/eventos/EventoFormDialog';
import { EventoInscripcionesDialog } from '@/components/eventos/EventoInscripcionesDialog';
import { SabatinoFormDialog } from '@/components/sabatinos/SabatinoFormDialog';
import { EVENT_MANAGEMENT_ACCESS } from '@/data/access-control';
import { useEventoDetailHook } from '@/hooks/useEventosHooks';
import { useSabatinosHook } from '@/hooks/useSabatinosHooks';
import {
  hasAccessRule,
  hasAdultMemberAccess,
  hasDeletedAuditAccess,
  hasDeveloperAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import { Evento } from '@/types/eventos';

export default function EventoDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const eventoId = Number(params.id);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const {
    evento,
    formValues,
    options,
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
    setError,
    successMessage,
    setSuccessMessage,
    loading,
    dialogLoading,
    submitting,
    auxSubmitting,
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
    refetch,
  } = useEventoDetailHook(eventoId);

  const canEdit = hasPermissionAccess(user, 'UPDATE:EVENTO');
  const canManageInscripciones = hasPermissionAccess(user, 'UPDATE:INSCRIPCION');
  const canManageEventModules = hasAccessRule(user?.scopes, EVENT_MANAGEMENT_ACCESS);
  const canAuditDeleted = hasDeletedAuditAccess(user);
  const canSeeId = hasDeveloperAccess(user);
  const inscripciones = evento?.InscripcionEvento ?? [];
  const sabatinos = evento?.Sabatino ?? [];
  const canCreateSabatino = hasAdultMemberAccess(user);
  const {
    options: sabatinoOptions,
    error: sabatinoError,
    successMessage: sabatinoSuccessMessage,
    sabatinoDialogVisible,
    setSabatinoDialogVisible,
    sabatinoDialogMode,
    sabatinoFormValues,
    submittingSabatino,
    openCreateSabatino,
    submitSabatino,
    setError: setSabatinoError,
    setSuccessMessage: setSabatinoSuccessMessage,
  } = useSabatinosHook();

  const handleTabChange = (event: TabViewTabChangeEvent) => {
    setActiveTabIndex(event.index);
  };

  const handleSubmitSabatino = async (
    values: Parameters<typeof submitSabatino>[0],
  ) => {
    const didSave = await submitSabatino(values);
    if (didSave) {
      await refetch();
    }
  };

  const feedbackSeverity = error || sabatinoError ? 'error' : 'success';
  const feedbackMessage =
    error || sabatinoError || successMessage || sabatinoSuccessMessage;

  const clearFeedback = useCallback(() => {
    setError('');
    setSuccessMessage('');
    setSabatinoError('');
    setSabatinoSuccessMessage('');
  }, [setError, setSuccessMessage, setSabatinoError, setSabatinoSuccessMessage]);

  useEffect(() => {
    if (!evento || !feedbackMessage || !toast.current) {
      return;
    }

    toast.current.show({
      severity: feedbackSeverity,
      summary: feedbackSeverity === 'error' ? 'Error' : 'Éxito',
      detail: feedbackMessage,
    });
    clearFeedback();
  }, [
    evento,
    feedbackMessage,
    feedbackSeverity,
    clearFeedback,
  ]);

  if (loading) {
    return <div className="p-4">Cargando evento...</div>;
  }

  if (!evento) {
    return (
      <div className="p-4">
        <Message severity="error" text={error || 'No se encontró el evento.'} />
      </div>
    );
  }

  const acciones = canManageEventModules
    ? [
        {
          label: 'Inscripciones',
          icon: 'pi pi-users',
          onClick: () => void openInscripcionesDialog(),
          disabled: !canManageInscripciones || Boolean(evento.borrado),
        },
        {
          label: 'Afectaciones',
          icon: 'pi pi-sitemap',
          onClick: () => void openAfectacionesDialog(),
          disabled: !canEdit || Boolean(evento.borrado),
        },
        {
          label: 'Comisión',
          icon: 'pi pi-briefcase',
          onClick: () => void openComisionDialog(),
          disabled: !canEdit || Boolean(evento.borrado),
        },
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          onClick: () => void openEditDialog(),
          disabled: !canEdit || Boolean(evento.borrado),
        },
        ...(canCreateSabatino
          ? [
              {
                label: 'Crear sabatino',
                icon: 'pi pi-plus',
                onClick: () =>
                  openCreateSabatino({
                    idEvento: evento.id,
                    fechaInicio: evento.fecha_inicio,
                    fechaFin: evento.fecha_fin,
                    ramaIds: evento.RamaAfectada.map((item) => item.Rama.id),
                    areaIds: evento.AreaAfectada.map((item) => item.Area.id),
                  }),
                disabled: Boolean(evento.borrado),
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            icon="pi pi-arrow-left"
            iconPos="right"
            outlined
            size="small"
            onClick={() => router.push('/dashboard/eventos')}
          />
          <h1 className="m-0 text-2xl font-bold">{evento.nombre}</h1>
        </div>
        <ResponsiveTableActions crudActions={acciones} />
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {canSeeId ? (
            <div className="flex flex-col gap-1">
              <small className="text-color-secondary">ID</small>
              <span>{evento.id}</span>
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Tipo</small>
            <span>{evento.TipoEvento.nombre}</span>
          </div>
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Fechas</small>
            <span>
              {dayjs(evento.fecha_inicio).format('DD/MM/YYYY')} al{' '}
              {dayjs(evento.fecha_fin).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Lugar</small>
            <span>{evento.lugar ?? '-'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Comisión</small>
            <span>{evento.Comision[0]?.nombre ?? '-'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Estado</small>
            <div>
              <Tag
                value={evento.terminado ? 'Terminado' : 'Activo'}
                severity={evento.terminado ? 'contrast' : 'success'}
              />
            </div>
          </div>
          {canAuditDeleted ? (
            <div className="flex flex-col gap-1">
              <small className="text-color-secondary">Borrado</small>
              <div>
                <Tag
                  value={evento.borrado ? 'Sí' : 'No'}
                  severity={evento.borrado ? 'danger' : 'success'}
                />
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Costo MP</small>
            <span>{evento.costo_mp}</span>
          </div>
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Costo MA</small>
            <span>{evento.costo_ma}</span>
          </div>
          <div className="flex flex-col gap-1">
            <small className="text-color-secondary">Costo Ayudante</small>
            <span>{evento.costo_ayudante}</span>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-5">
            <small className="text-color-secondary">Descripción</small>
            <span>{evento.descripcion?.trim() ? evento.descripcion : '-'}</span>
          </div>
        </div>
      </Card>

      <Card>
        <TabView activeIndex={activeTabIndex} onTabChange={handleTabChange}>
          <TabPanel header={`Sabatinos (${sabatinos.length})`}>
            <DataTable
              value={sabatinos}
              dataKey="id"
              emptyMessage="No hay sabatinos vinculados."
              tableStyle={{ minWidth: '32rem', width: '100%' }}
            >
              <Column field="titulo" header="Título" />
              <Column
                header="Inicio"
                body={(sabatino: NonNullable<Evento['Sabatino']>[number]) =>
                  dayjs(sabatino.fecha_inicio).format('DD/MM/YYYY')
                }
              />
              <Column
                header="Fin"
                body={(sabatino: NonNullable<Evento['Sabatino']>[number]) =>
                  dayjs(sabatino.fecha_fin).format('DD/MM/YYYY')
                }
              />
              <Column
                header="Abrir"
                body={(sabatino: NonNullable<Evento['Sabatino']>[number]) => (
                  <Button
                    label="Abrir"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() => router.push(`/dashboard/sabatinos/${sabatino.id}`)}
                  />
                )}
              />
            </DataTable>
          </TabPanel>

          <TabPanel header={`Inscripciones (${evento._count.InscripcionEvento})`}>
            <DataTable
              value={inscripciones}
              dataKey="id"
              emptyMessage="No hay miembros inscriptos."
              tableStyle={{ minWidth: '32rem', width: '100%' }}
            >
              <Column
                header="Apellido y nombre"
                body={(inscripcion: NonNullable<Evento['InscripcionEvento']>[number]) =>
                  `${inscripcion.Miembro.apellidos}, ${inscripcion.Miembro.nombre}`
                }
              />
              <Column
                header="DNI"
                body={(inscripcion: NonNullable<Evento['InscripcionEvento']>[number]) =>
                  inscripcion.Miembro.dni
                }
              />
            </DataTable>
          </TabPanel>

          <TabPanel header="Afectaciones">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <small className="text-color-secondary">Áreas</small>
                <div className="flex flex-wrap gap-2">
                  {evento.AreaAfectada.length > 0 ? (
                    evento.AreaAfectada.map((item) => (
                      <Tag
                        key={item.Area.id}
                        value={item.Area.nombre}
                        severity="info"
                      />
                    ))
                  ) : (
                    <span>Sin áreas afectadas.</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <small className="text-color-secondary">Ramas</small>
                <div className="flex flex-wrap gap-2">
                  {evento.RamaAfectada.length > 0 ? (
                    evento.RamaAfectada.map((item) => (
                      <Tag
                        key={item.Rama.id}
                        value={item.Rama.nombre}
                        severity="secondary"
                      />
                    ))
                  ) : (
                    <span>Sin ramas afectadas.</span>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </Card>

      <EventoFormDialog
        visible={dialogVisible}
        mode="edit"
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        tipos={options.tipos}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />
      <EventoInscripcionesDialog
        visible={inscripcionesVisible}
        submitting={auxSubmitting}
        miembros={options.miembros}
        selectedIds={inscripcionIds}
        error={error}
        onHide={closeInscripcionesDialog}
        onChange={setInscripcionIds}
        onSubmit={() => void submitInscripciones()}
      />
      <EventoAfectacionesDialog
        visible={afectacionesVisible}
        submitting={auxSubmitting}
        areas={options.areas}
        ramas={options.ramas}
        selectedAreaIds={areaIds}
        selectedRamaIds={ramaIds}
        error={error}
        onHide={closeAfectacionesDialog}
        onAreaChange={setAreaIds}
        onRamaChange={setRamaIds}
        onSubmit={() => void submitAfectaciones()}
      />
      <EventoComisionDialog
        visible={comisionVisible}
        submitting={auxSubmitting}
        comisiones={options.comisiones}
        selectedId={selectedComisionId}
        error={error}
        onHide={closeComisionDialog}
        onChange={setSelectedComisionId}
        onSubmit={() => void submitComision()}
      />
      <SabatinoFormDialog
        visible={sabatinoDialogVisible}
        onHide={() => setSabatinoDialogVisible(false)}
        mode={sabatinoDialogMode}
        initialValues={sabatinoFormValues}
        onSubmit={(values) => void handleSubmitSabatino(values)}
        loading={submittingSabatino}
        options={sabatinoOptions}
      />
    </div>
  );
}
