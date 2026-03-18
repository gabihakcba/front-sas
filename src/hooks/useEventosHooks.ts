'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  assignEventoComisionRequest,
  createEventoRequest,
  deleteEventoRequest,
  getEventoInscripcionesRequest,
  getEventoRequest,
  getEventosOptionsRequest,
  getEventosRequest,
  updateEventoAfectacionesRequest,
  updateEventoInscripcionesRequest,
  updateEventoRequest,
} from '@/queries/eventos';
import {
  CreateEventoPayload,
  Evento,
  EventoFilters,
  EventoFormValues,
  EventoInscripcion,
  EventosOptionsResponse,
  UpdateEventoPayload,
} from '@/types/eventos';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create' | 'edit';

const createEmptyFilters = (): EventoFilters => ({
  q: '',
  idTipo: null,
  fechaDesde: '',
  fechaHasta: '',
});

const createEmptyFormValues = (): EventoFormValues => ({
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

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

const buildPayload = (values: EventoFormValues): CreateEventoPayload => ({
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
});

const buildScopedAffectaciones = (
  scopes: Array<{ role: string; scopeType: string; scopeId: number | null }>,
  options: EventosOptionsResponse,
): { areaIds: number[]; ramaIds: number[] } => {
  const hasGroupJefatura = scopes.some(
    (scope) =>
      scope.role === 'JEFATURA' &&
      (scope.scopeType === 'GRUPO' || scope.scopeType === 'GLOBAL'),
  );

  if (hasGroupJefatura) {
    const areaJefatura = options.areas.find((area) => area.nombre === 'Jefatura');

    return {
      areaIds: areaJefatura ? [areaJefatura.id] : [],
      ramaIds: [],
    };
  }

  const ramaScopeIds = scopes
    .filter(
      (scope) =>
        (scope.role === 'JEFATURA_RAMA' || scope.role === 'AYUDANTE_RAMA') &&
        scope.scopeType === 'RAMA' &&
        scope.scopeId !== null,
    )
    .map((scope) => scope.scopeId as number);

  if (ramaScopeIds.length > 0) {
    const areaRama = options.areas.find((area) => area.nombre === 'Rama');

    return {
      areaIds: areaRama ? [areaRama.id] : [],
      ramaIds: Array.from(new Set(ramaScopeIds)),
    };
  }

  return {
    areaIds: [],
    ramaIds: [],
  };
};

export const useEventosHook = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [formValues, setFormValuesState] = useState<EventoFormValues>(
    createEmptyFormValues(),
  );
  const [options, setOptions] = useState<EventosOptionsResponse>({
    tipos: [],
    areas: [],
    ramas: [],
    miembros: [],
    comisiones: [],
  });
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inscripcionesVisible, setInscripcionesVisible] = useState(false);
  const [afectacionesVisible, setAfectacionesVisible] = useState(false);
  const [comisionVisible, setComisionVisible] = useState(false);
  const [inscripciones, setInscripciones] = useState<EventoInscripcion[]>([]);
  const [inscripcionIds, setInscripcionIds] = useState<number[]>([]);
  const [areaIds, setAreaIds] = useState<number[]>([]);
  const [ramaIds, setRamaIds] = useState<number[]>([]);
  const [selectedComisionId, setSelectedComisionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [auxSubmitting, setAuxSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFiltersState] = useState<EventoFilters>(createEmptyFilters());
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const fetchOptions = async () => {
    const response = await getEventosOptionsRequest();
    setOptions(response);
  };

  const setFilters = (nextFilters: EventoFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchEventos = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getEventosRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        filters,
      });
      setEventos(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedEvento((current) =>
        current ? response.data.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los eventos.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, []);

  useEffect(() => {
    void fetchEventos(1);
  }, [fetchEventos]);

  const openCreateDialog = async () => {
    setDialogMode('create');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await getEventosOptionsRequest();
      setOptions(response);
      const scopedAffectaciones = buildScopedAffectaciones(
        user?.scopes ?? [],
        response,
      );
      setFormValuesState({
        ...createEmptyFormValues(),
        ...scopedAffectaciones,
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las opciones.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openEditDialog = async () => {
    if (!selectedEvento) return;
    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const [evento] = await Promise.all([getEventoRequest(selectedEvento.id), fetchOptions()]);
      setFormValuesState({
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
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el evento.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openInscripcionesDialog = async () => {
    if (!selectedEvento) return;
    setError('');
    setAuxSubmitting(false);
    try {
      const current = await getEventoInscripcionesRequest(selectedEvento.id);
      setInscripciones(current);
      setInscripcionIds(current.map((item) => item.Miembro.id));
      setInscripcionesVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las inscripciones.'));
    }
  };

  const openAfectacionesDialog = async () => {
    if (!selectedEvento) return;
    setError('');
    try {
      const evento = await getEventoRequest(selectedEvento.id);
      setAreaIds(evento.AreaAfectada.map((item) => item.Area.id));
      setRamaIds(evento.RamaAfectada.map((item) => item.Rama.id));
      setAfectacionesVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las afectaciones.'));
    }
  };

  const openComisionDialog = async () => {
    if (!selectedEvento) return;
    setError('');
    try {
      const evento = await getEventoRequest(selectedEvento.id);
      setSelectedComisionId(evento.Comision[0]?.id ?? null);
      setComisionVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar la comisión actual.'));
    }
  };

  const closeDialog = () => setDialogVisible(false);
  const closeInscripcionesDialog = () => setInscripcionesVisible(false);
  const closeAfectacionesDialog = () => setAfectacionesVisible(false);
  const closeComisionDialog = () => setComisionVisible(false);

  const submitForm = async (values: EventoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      if (dialogMode === 'create') {
        await createEventoRequest(buildPayload(values));
        setSuccessMessage('Evento creado correctamente.');
      } else if (selectedEvento) {
        await updateEventoRequest(selectedEvento.id, buildPayload(values) as UpdateEventoPayload);
        setSuccessMessage('Evento actualizado correctamente.');
      }
      closeDialog();
      await fetchEventos(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el evento.'
            : 'No se pudo actualizar el evento.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitInscripciones = async () => {
    if (!selectedEvento) return;
    setAuxSubmitting(true);
    setError('');
    try {
      await updateEventoInscripcionesRequest(selectedEvento.id, inscripcionIds);
      setSuccessMessage('Inscripciones actualizadas correctamente.');
      closeInscripcionesDialog();
      await fetchEventos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron actualizar las inscripciones.'));
    } finally {
      setAuxSubmitting(false);
    }
  };

  const submitAfectaciones = async () => {
    if (!selectedEvento) return;
    setAuxSubmitting(true);
    setError('');
    try {
      await updateEventoAfectacionesRequest(selectedEvento.id, areaIds, ramaIds);
      setSuccessMessage('Afectaciones actualizadas correctamente.');
      closeAfectacionesDialog();
      await fetchEventos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron actualizar las afectaciones.'));
    } finally {
      setAuxSubmitting(false);
    }
  };

  const submitComision = async () => {
    if (!selectedEvento) return;
    setAuxSubmitting(true);
    setError('');
    try {
      await assignEventoComisionRequest(selectedEvento.id, selectedComisionId);
      setSuccessMessage('Comisión actualizada correctamente.');
      closeComisionDialog();
      await fetchEventos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo asignar la comisión.'));
    } finally {
      setAuxSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedEvento) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await deleteEventoRequest(selectedEvento.id);
      setSelectedEvento(null);
      setSuccessMessage('Evento eliminado correctamente.');
      await fetchEventos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el evento.'));
      setLoading(false);
    }
  };

  return {
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
    inscripciones,
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
    total: meta.total,
    limit: meta.limit,
    filters,
    setFilters,
    refetch: fetchEventos,
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
  };
};
