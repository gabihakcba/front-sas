'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { TabMenu } from 'primereact/tabmenu';
import type { MenuItem } from 'primereact/menuitem';
import { EventoFormDialog } from '@/components/eventos/EventoFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useCicloProgramaDetailHook } from '@/hooks/useCiclosProgramaHooks';
import {
  hasDeveloperAccess,
  hasPermissionAccess,
  hasProgramCycleGroupManagementAccess,
} from '@/lib/authorization';
import { getResponsiveDialogProps } from '@/lib/dialog';
import NotAllowed from '@/components/common/NotAllowed';
import {
  createEventoRequest,
  getEventoRequest,
  getEventosOptionsRequest,
  getEventosRequest,
  updateEventoRequest,
} from '@/queries/eventos';
import { CicloProgramaDetalle, EstadoCiclo, UpdateCicloProgramaPayload } from '@/types/ciclos-programa';
import { Evento, EventoFormValues, EventosOptionsResponse } from '@/types/eventos';

const estadoLabelMap: Record<EstadoCiclo, string> = {
  DIAGNOSTICO: 'Diagnóstico',
  PLANIFICACION: 'Planificación',
  DESARROLLO: 'Desarrollo',
  EVALUACION: 'Evaluación',
  FINALIZADO: 'Finalizado',
};

const STAGE_TABS: Array<{
  key: EstadoCiclo;
  label: string;
  field: 'diagnostico' | 'planificacion' | 'desarrollo' | 'evaluacion' | null;
}> = [
  { key: 'DIAGNOSTICO', label: 'Diagnóstico', field: 'diagnostico' },
  { key: 'PLANIFICACION', label: 'Planificación', field: 'planificacion' },
  { key: 'DESARROLLO', label: 'Desarrollo', field: 'desarrollo' },
  { key: 'EVALUACION', label: 'Evaluación', field: 'evaluacion' },
  { key: 'FINALIZADO', label: 'Finalizado', field: null },
];

const EDITOR_HEADER = (
  <>
    <span className="ql-formats">
      <select
        className="ql-header"
        defaultValue=""
        aria-label="Formato"
        title="Formato de bloque"
      >
        <option value="">Normal</option>
        <option value="1">Titulo</option>
        <option value="2">Subtitulo</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Negrita" title="Negrita (Ctrl+B)" />
      <button
        className="ql-underline"
        aria-label="Subrayado"
        title="Subrayado (Ctrl+U)"
      />
      <button className="ql-italic" aria-label="Cursiva" title="Cursiva (Ctrl+I)" />
      <button className="ql-link" aria-label="Enlace" title="Enlace (Ctrl+K)" />
      <button
        className="ql-list"
        value="ordered"
        aria-label="Lista ordenada"
        title="Lista ordenada (Ctrl+Shift+7)"
      />
      <button
        className="ql-list"
        value="bullet"
        aria-label="Lista desordenada"
        title="Lista desordenada (Ctrl+Shift+8)"
      />
    </span>
  </>
);

type QuillKeyboardModule = {
  addBinding: (
    binding: {
      key: string;
      shortKey: boolean;
      shiftKey: boolean;
    },
    handler: () => boolean,
  ) => void;
};

type QuillEditorInstance = {
  keyboard?: QuillKeyboardModule;
  getFormat: () => Record<string, unknown>;
  format: (name: string, value: false | string, source?: 'user') => void;
};

interface CicloProgramaEditState {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCiclo;
  idRama: number | null;
  diagnostico: string;
  planificacion: string;
  desarrollo: string;
  evaluacion: string;
}

const createEmptyEventoFormValues = (): EventoFormValues => ({
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  lugar: '',
  terminado: false,
  costoMp: '0',
  costoMa: '0',
  costoAyudante: '0',
  idTipo: null,
  areaIds: [],
  ramaIds: [],
});

const registerEditorShortcuts = (quill: QuillEditorInstance) => {
  if (!quill.keyboard) {
    return;
  }

  quill.keyboard.addBinding(
    {
      key: '7',
      shortKey: true,
      shiftKey: true,
    },
    () => {
      const currentList = quill.getFormat().list;
      quill.format('list', currentList === 'ordered' ? false : 'ordered', 'user');
      return false;
    },
  );

  quill.keyboard.addBinding(
    {
      key: '8',
      shortKey: true,
      shiftKey: true,
    },
    () => {
      const currentList = quill.getFormat().list;
      quill.format('list', currentList === 'bullet' ? false : 'bullet', 'user');
      return false;
    },
  );
};

const buildEditState = (ciclo: CicloProgramaDetalle): CicloProgramaEditState => ({
  nombre: ciclo.nombre,
  descripcion: ciclo.descripcion ?? '',
  fechaInicio: dayjs(ciclo.fecha_inicio).format('YYYY-MM-DD'),
  fechaFin: dayjs(ciclo.fecha_fin).format('YYYY-MM-DD'),
  estado: ciclo.estado,
  idRama: ciclo.Rama.id,
  diagnostico: ciclo.diagnostico ?? '',
  planificacion: ciclo.planificacion ?? '',
  desarrollo: ciclo.desarrollo ?? '',
  evaluacion: ciclo.evaluacion ?? '',
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }

  return fallback;
};

export default function CicloProgramaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const cicloId = Number(params.id);
  const {
    ciclo,
    options,
    loading,
    saving,
    error,
    successMessage,
    forbidden,
    setError,
    reload,
    save,
  } = useCicloProgramaDetailHook(cicloId);
  const [editing, setEditing] = useState(false);
  const [draftState, setDraftState] = useState<CicloProgramaEditState | null>(null);
  const [activeTab, setActiveTab] = useState<EstadoCiclo>('DIAGNOSTICO');
  const [eventOptions, setEventOptions] = useState<EventosOptionsResponse>({
    tipos: [],
    areas: [],
    ramas: [],
    miembros: [],
    comisiones: [],
  });
  const [eventoDialogVisible, setEventoDialogVisible] = useState(false);
  const [eventoDialogMode, setEventoDialogMode] = useState<'create' | 'edit'>('create');
  const [eventoDialogLoading, setEventoDialogLoading] = useState(false);
  const [eventoSubmitting, setEventoSubmitting] = useState(false);
  const [eventoDialogError, setEventoDialogError] = useState('');
  const [eventoFormValues, setEventoFormValues] = useState<EventoFormValues>(
    createEmptyEventoFormValues(),
  );
  const [editingEventoId, setEditingEventoId] = useState<number | null>(null);
  const [linkEventoVisible, setLinkEventoVisible] = useState(false);
  const [linkEventoLoading, setLinkEventoLoading] = useState(false);
  const [linkEventoSubmitting, setLinkEventoSubmitting] = useState(false);
  const [linkEventoError, setLinkEventoError] = useState('');
  const [selectedLinkEventoId, setSelectedLinkEventoId] = useState<number | null>(null);
  const [linkableEventos, setLinkableEventos] = useState<Evento[]>([]);

  const canUpdate = hasPermissionAccess(user, 'UPDATE:CICLO_PROGRAMA');
  const canManageEvents = hasPermissionAccess(user, 'UPDATE:EVENTO');
  const canSeeId = hasDeveloperAccess(user);
  const canManageRama = hasProgramCycleGroupManagementAccess(user);

  const editState = useMemo(
    () => (editing ? draftState : ciclo ? buildEditState(ciclo) : null),
    [ciclo, draftState, editing],
  );

  const stageMenuItems = useMemo<MenuItem[]>(
    () =>
      STAGE_TABS.map((stage) => ({
        label: stage.label,
        command: () => setActiveTab(stage.key),
      })),
    [],
  );

  const activeStageConfig =
    STAGE_TABS.find((stage) => stage.key === activeTab) ?? STAGE_TABS[0];
  const activeStageValue =
    editState && activeStageConfig.field ? editState[activeStageConfig.field] : '';

  const updateStageValue = (nextValue: string) => {
    if (!activeStageConfig.field) {
      return;
    }

    const field = activeStageConfig.field;

    setDraftState((current) =>
      current
        ? {
            ...current,
            [field]: nextValue,
          }
        : current,
    );
  };

  const loadEventOptions = async () => {
    const response = await getEventosOptionsRequest();
    setEventOptions(response);
    return response;
  };

  const buildCycleEventoDefaults = (
    cicloDetalle: CicloProgramaDetalle,
    optionsResponse: EventosOptionsResponse,
  ): EventoFormValues => {
    const areaRama = optionsResponse.areas.find((area) => area.nombre === 'Rama');

    return {
      ...createEmptyEventoFormValues(),
      areaIds: areaRama ? [areaRama.id] : [],
      ramaIds: [cicloDetalle.Rama.id],
    };
  };

  const openCreateEventoDialog = async () => {
    if (!ciclo) {
      setEventoDialogError('No se pudo resolver el ciclo actual.');
      return;
    }

    const currentCiclo = ciclo;

    setEventoDialogMode('create');
    setEditingEventoId(null);
    setEventoDialogLoading(true);
    setEventoDialogError('');

    try {
      const optionsResponse = await loadEventOptions();
      setEventoFormValues(buildCycleEventoDefaults(currentCiclo, optionsResponse));
      setEventoDialogVisible(true);
    } catch (err: unknown) {
      setEventoDialogError(
        getErrorMessage(err, 'No se pudieron cargar las opciones del evento.'),
      );
    } finally {
      setEventoDialogLoading(false);
    }
  };

  const openEditEventoDialog = async (eventoId: number) => {
    setEventoDialogMode('edit');
    setEditingEventoId(eventoId);
    setEventoDialogLoading(true);
    setEventoDialogError('');

    try {
      const [evento] = await Promise.all([getEventoRequest(eventoId), loadEventOptions()]);
      setEventoFormValues({
        nombre: evento.nombre,
        descripcion: evento.descripcion ?? '',
        fechaInicio: dayjs(evento.fecha_inicio).format('YYYY-MM-DD'),
        fechaFin: dayjs(evento.fecha_fin).format('YYYY-MM-DD'),
        lugar: evento.lugar ?? '',
        terminado: evento.terminado,
        costoMp: evento.costo_mp,
        costoMa: evento.costo_ma,
        costoAyudante: evento.costo_ayudante,
        idTipo: evento.TipoEvento.id,
        areaIds: evento.AreaAfectada.map((item) => item.Area.id),
        ramaIds: evento.RamaAfectada.map((item) => item.Rama.id),
      });
      setEventoDialogVisible(true);
    } catch (err: unknown) {
      setEventoDialogError(getErrorMessage(err, 'No se pudo cargar el evento.'));
    } finally {
      setEventoDialogLoading(false);
    }
  };

  const closeEventoDialog = () => {
    setEventoDialogVisible(false);
    setEventoDialogError('');
    setEditingEventoId(null);
    setEventoFormValues(createEmptyEventoFormValues());
  };

  const handleEventoSubmit = async (values: EventoFormValues) => {
    if (!ciclo) {
      setEventoDialogError('No se pudo resolver el ciclo actual.');
      return;
    }

    const currentCiclo = ciclo;
    setEventoSubmitting(true);
    setEventoDialogError('');

    try {
      const payload = {
        nombre: values.nombre.trim(),
        ...(values.descripcion.trim() ? { descripcion: values.descripcion.trim() } : {}),
        fechaInicio: dayjs(values.fechaInicio).toISOString(),
        fechaFin: dayjs(values.fechaFin).toISOString(),
        ...(values.lugar.trim() ? { lugar: values.lugar.trim() } : {}),
        terminado: values.terminado,
        costoMp: Number(values.costoMp),
        costoMa: Number(values.costoMa),
        costoAyudante: Number(values.costoAyudante),
        idTipo: values.idTipo!,
        areaIds: values.areaIds,
        ramaIds: values.ramaIds,
        idCicloPrograma: currentCiclo.id,
      };

      if (eventoDialogMode === 'create') {
        await createEventoRequest(payload);
      } else if (editingEventoId) {
        await updateEventoRequest(editingEventoId, payload);
      }

      closeEventoDialog();
      await reload();
    } catch (err: unknown) {
      setEventoDialogError(
        getErrorMessage(err, 'No se pudo guardar el evento vinculado al ciclo.'),
      );
    } finally {
      setEventoSubmitting(false);
    }
  };

  const openLinkEventoDialog = async () => {
    if (!ciclo) {
      setLinkEventoError('No se pudo resolver el ciclo actual.');
      return;
    }

    const currentCiclo = ciclo;
    setLinkEventoVisible(true);
    setLinkEventoLoading(true);
    setLinkEventoError('');
    setSelectedLinkEventoId(null);

    try {
      const response = await getEventosRequest({
        page: 1,
        limit: 100,
        filters: {
          q: '',
          idTipo: null,
          fechaDesde: '',
          fechaHasta: '',
          includeDeleted: false,
        },
      });
      setLinkableEventos(
        response.data.filter(
          (evento) => !currentCiclo.Evento.some((item) => item.id === evento.id),
        ),
      );
    } catch (err: unknown) {
      setLinkEventoError(
        getErrorMessage(err, 'No se pudieron cargar eventos para vincular.'),
      );
    } finally {
      setLinkEventoLoading(false);
    }
  };

  const handleLinkEvento = async () => {
    if (!selectedLinkEventoId) {
      setLinkEventoError('Seleccioná un evento para vincular.');
      return;
    }

    if (!ciclo) {
      setLinkEventoError('No se pudo resolver el ciclo actual.');
      return;
    }

    const currentCiclo = ciclo;

    setLinkEventoSubmitting(true);
    setLinkEventoError('');

    try {
      const evento = await getEventoRequest(selectedLinkEventoId);
      await updateEventoRequest(selectedLinkEventoId, {
        idCicloPrograma: currentCiclo.id,
        areaIds: evento.AreaAfectada.map((item) => item.Area.id),
        ramaIds: evento.RamaAfectada.map((item) => item.Rama.id),
      });
      setLinkEventoVisible(false);
      await reload();
    } catch (err: unknown) {
      setLinkEventoError(
        getErrorMessage(err, 'No se pudo vincular el evento al ciclo.'),
      );
    } finally {
      setLinkEventoSubmitting(false);
    }
  };

  const handleUnlinkEvento = async (eventoId: number) => {
    try {
      const evento = await getEventoRequest(eventoId);
      await updateEventoRequest(eventoId, {
        idCicloPrograma: null,
        areaIds: evento.AreaAfectada.map((item) => item.Area.id),
        ramaIds: evento.RamaAfectada.map((item) => item.Rama.id),
      });
      await reload();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo quitar el evento del ciclo.'));
    }
  };

  const handleSave = useCallback(async (stayInEditMode = false) => {
    if (!editState || !ciclo) {
      return;
    }

    if (!editState.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!editState.fechaInicio || !editState.fechaFin) {
      setError('Las fechas de inicio y fin son obligatorias.');
      return;
    }

    if (dayjs(editState.fechaFin).isBefore(dayjs(editState.fechaInicio), 'day')) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    if (canManageRama && !editState.idRama) {
      setError('La rama es obligatoria.');
      return;
    }

    const payload: UpdateCicloProgramaPayload = {
      nombre: editState.nombre.trim(),
      descripcion: editState.descripcion.trim() || undefined,
      fechaInicio: dayjs(editState.fechaInicio).toISOString(),
      fechaFin: dayjs(editState.fechaFin).toISOString(),
      estado: editState.estado,
      diagnostico: editState.diagnostico.trim() || undefined,
      planificacion: editState.planificacion.trim() || undefined,
      desarrollo: editState.desarrollo.trim() || undefined,
      evaluacion: editState.evaluacion.trim() || undefined,
      ...(canManageRama && editState.idRama ? { idRama: editState.idRama } : {}),
    };

    try {
      await save(payload);
      if (stayInEditMode) {
        setDraftState(editState);
      } else {
        setDraftState(null);
        setEditing(false);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo actualizar el ciclo de programa.'));
    }
  }, [canManageRama, ciclo, editState, save, setError]);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void handleSave(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editing, handleSave]);

  if (forbidden) {
    return (
      <NotAllowed
        title="Sin acceso al ciclo"
        message="Tu cuenta no tiene permisos para ver este ciclo de programa."
      />
    );
  }

  if (loading) {
    return (
      <div className="h-full w-full">
        <Card title="Ciclo de Programa">
          <div>Cargando ciclo de programa...</div>
        </Card>
      </div>
    );
  }

  if (!ciclo || !editState) {
    return (
      <div className="h-full w-full">
        <Card title="Ciclo de Programa">
          <Message severity="error" text={error || 'No se pudo cargar el ciclo de programa.'} />
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Card title="Detalle del Ciclo de Programa" className="h-full">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="m-0 text-2xl font-semibold">{ciclo.nombre}</h2>
              <span>
                {dayjs(ciclo.fecha_inicio).format('DD/MM/YYYY')} -{' '}
                {dayjs(ciclo.fecha_fin).format('DD/MM/YYYY')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                label="Volver"
                icon="pi pi-arrow-left"
                iconPos="right"
                outlined
                size="small"
                onClick={() => router.push('/dashboard/ciclos-programa')}
              />
              {canUpdate ? (
                editing ? (
                  <>
                    <Button
                      type="button"
                      label="Cancelar"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => {
                        setDraftState(buildEditState(ciclo));
                        setEditing(false);
                      }}
                    />
                    <Button
                      type="button"
                      label="Guardar"
                      icon="pi pi-check"
                      iconPos="right"
                      outlined
                      size="small"
                      loading={saving}
                      onClick={() => void handleSave()}
                    />
                  </>
                ) : (
                  <Button
                    type="button"
                    label="Modo edición"
                    icon="pi pi-pencil"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() => {
                      setDraftState(buildEditState(ciclo));
                      setEditing(true);
                    }}
                  />
                )
              ) : null}
            </div>
          </div>

          {error ? <Message severity="error" text={error} className="w-full" /> : null}
          {successMessage ? (
            <Message severity="success" text={successMessage} className="w-full" />
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              {canSeeId ? (
                <div className="flex flex-col gap-1">
                  <strong>ID</strong>
                  <span>{ciclo.id}</span>
                </div>
              ) : null}

              <div className="flex flex-col gap-1">
                <strong>Nombre</strong>
                {editing ? (
                  <InputText
                    value={editState.nombre}
                    onChange={(event) =>
                        setDraftState((current) =>
                          current ? { ...current, nombre: event.target.value } : current,
                        )
                    }
                    className="w-full"
                  />
                ) : (
                  <span>{ciclo.nombre}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <strong>Descripción</strong>
                {editing ? (
                  <InputTextarea
                    value={editState.descripcion}
                    onChange={(event) =>
                        setDraftState((current) =>
                          current
                            ? { ...current, descripcion: event.target.value }
                          : current,
                      )
                    }
                    rows={4}
                    className="w-full"
                  />
                ) : (
                  <span>{ciclo.descripcion || '-'}</span>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <strong>Fecha de inicio</strong>
                  {editing ? (
                    <Calendar
                      value={dayjs(editState.fechaInicio, 'YYYY-MM-DD').toDate()}
                      onChange={(event) =>
                        setDraftState((current) =>
                          current
                            ? {
                                ...current,
                                fechaInicio:
                                  event.value instanceof Date
                                    ? dayjs(event.value).format('YYYY-MM-DD')
                                    : current.fechaInicio,
                              }
                            : current,
                        )
                      }
                      dateFormat="dd/mm/yy"
                      showButtonBar
                      className="w-full"
                      inputClassName="w-full"
                    />
                  ) : (
                    <span>{dayjs(ciclo.fecha_inicio).format('DD/MM/YYYY')}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <strong>Fecha de fin</strong>
                  {editing ? (
                    <Calendar
                      value={dayjs(editState.fechaFin, 'YYYY-MM-DD').toDate()}
                      onChange={(event) =>
                        setDraftState((current) =>
                          current
                            ? {
                                ...current,
                                fechaFin:
                                  event.value instanceof Date
                                    ? dayjs(event.value).format('YYYY-MM-DD')
                                    : current.fechaFin,
                              }
                            : current,
                        )
                      }
                      dateFormat="dd/mm/yy"
                      showButtonBar
                      className="w-full"
                      inputClassName="w-full"
                    />
                  ) : (
                    <span>{dayjs(ciclo.fecha_fin).format('DD/MM/YYYY')}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <strong>Estado actual</strong>
                {editing ? (
                  <Dropdown
                    value={editState.estado}
                    options={options.estados.map((estado) => ({
                      label: estadoLabelMap[estado],
                      value: estado,
                    }))}
                    onChange={(event) =>
                      setDraftState((current) =>
                        current
                          ? { ...current, estado: event.value as EstadoCiclo }
                          : current,
                      )
                    }
                    className="w-full"
                    appendTo="self"
                  />
                ) : (
                  <span>{estadoLabelMap[ciclo.estado]}</span>
                )}
              </div>

              {canManageRama ? (
                <div className="flex flex-col gap-1">
                  <strong>Rama</strong>
                  {editing ? (
                    <Dropdown
                      value={editState.idRama}
                      options={options.ramas}
                      optionLabel="nombre"
                      optionValue="id"
                      onChange={(event) =>
                        setDraftState((current) =>
                          current
                            ? { ...current, idRama: (event.value as number | null) ?? null }
                            : current,
                        )
                      }
                      className="w-full"
                      appendTo="self"
                    />
                  ) : (
                    <span>{ciclo.Rama.nombre}</span>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <strong>Eventos vinculados</strong>
                {editing && canManageEvents ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      label="Crear y vincular"
                      icon="pi pi-plus"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => void openCreateEventoDialog()}
                    />
                    <Button
                      type="button"
                      label="Vincular existente"
                      icon="pi pi-link"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => void openLinkEventoDialog()}
                    />
                  </div>
                ) : null}
                {ciclo.Evento.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {ciclo.Evento.map((evento) => (
                      <Card key={evento.id}>
                        <div className="flex flex-col gap-1">
                          <strong>{evento.nombre}</strong>
                          <span>Tipo: {evento.TipoEvento.nombre}</span>
                          <span>
                            {dayjs(evento.fecha_inicio).format('DD/MM/YYYY')} -{' '}
                            {dayjs(evento.fecha_fin).format('DD/MM/YYYY')}
                          </span>
                          <span>{evento.terminado ? 'Terminado' : 'En curso'}</span>
                          {editing && canManageEvents ? (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                label="Editar"
                                icon="pi pi-pencil"
                                iconPos="right"
                                outlined
                                size="small"
                                onClick={() => void openEditEventoDialog(evento.id)}
                              />
                              <Button
                                type="button"
                                label="Quitar del ciclo"
                                icon="pi pi-times"
                                iconPos="right"
                                outlined
                                size="small"
                                severity="danger"
                                onClick={() => void handleUnlinkEvento(evento.id)}
                              />
                            </div>
                          ) : null}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <span>No hay eventos vinculados a este ciclo.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0">Bitácora del ciclo</h3>
              <Button
                type="button"
                label="Recargar"
                icon="pi pi-refresh"
                iconPos="right"
                outlined
                size="small"
                onClick={() => void reload()}
              />
            </div>

            <TabMenu
              model={stageMenuItems}
              activeIndex={STAGE_TABS.findIndex((stage) => stage.key === activeTab)}
              onTabChange={(event) =>
                setActiveTab(STAGE_TABS[event.index]?.key ?? 'DIAGNOSTICO')
              }
            />

            <Card
              title={activeStageConfig.label}
              subTitle={
                activeStageConfig.key === editState.estado
                  ? 'Etapa actual del ciclo'
                  : `Estado actual: ${estadoLabelMap[editState.estado]}`
              }
            >
              {activeStageConfig.field ? (
                editing ? (
                  <Editor
                    value={activeStageValue}
                    onTextChange={(event: EditorTextChangeEvent) =>
                      updateStageValue(event.htmlValue ?? '')
                    }
                    headerTemplate={EDITOR_HEADER}
                    style={{ minHeight: '20rem' }}
                    onLoad={registerEditorShortcuts}
                  />
                ) : activeStageValue ? (
                  <div
                    className="overflow-x-auto break-words"
                    dangerouslySetInnerHTML={{ __html: activeStageValue }}
                  />
                ) : (
                  <span>No hay contenido cargado para esta etapa.</span>
                )
              ) : (
                <Message
                  severity="info"
                  text="La etapa Finalizado no tiene bitácora propia. El cierre del ciclo se refleja en el estado actual y en la evaluación."
                  className="w-full"
                />
              )}
            </Card>
          </div>
        </div>
      </Card>
      <EventoFormDialog
        visible={eventoDialogVisible}
        mode={eventoDialogMode}
        loading={eventoDialogLoading}
        submitting={eventoSubmitting}
        values={eventoFormValues}
        tipos={eventOptions.tipos}
        error={eventoDialogError}
        title={
          eventoDialogMode === 'create'
            ? 'Crear evento y vincular al ciclo'
            : 'Editar evento vinculado'
        }
        onHide={closeEventoDialog}
        onSubmit={(values) => void handleEventoSubmit(values)}
      />
      <Dialog
        visible={linkEventoVisible}
        onHide={() => {
          setLinkEventoVisible(false);
          setLinkEventoError('');
          setSelectedLinkEventoId(null);
        }}
        header="Vincular evento existente"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              iconPos="right"
              outlined
              size="small"
              onClick={() => {
                setLinkEventoVisible(false);
                setLinkEventoError('');
                setSelectedLinkEventoId(null);
              }}
            />
            <Button
              type="button"
              label="Vincular"
              icon="pi pi-link"
              iconPos="right"
              outlined
              size="small"
              loading={linkEventoSubmitting}
              onClick={() => void handleLinkEvento()}
            />
          </div>
        }
        {...getResponsiveDialogProps('42rem')}
      >
        <div className="flex flex-col gap-3">
          {linkEventoError ? (
            <Message severity="error" text={linkEventoError} className="w-full" />
          ) : null}
          {linkEventoLoading ? (
            <div>Cargando eventos...</div>
          ) : (
            <Dropdown
              value={selectedLinkEventoId}
              options={linkableEventos}
              optionLabel="nombre"
              optionValue="id"
              filter
              showClear
              placeholder="Seleccionar evento"
              className="w-full"
              onChange={(event) =>
                setSelectedLinkEventoId((event.value as number | null) ?? null)
              }
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}
