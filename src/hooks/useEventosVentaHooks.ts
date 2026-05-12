'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  assignEventoVentaEncargadoJuvenilRequest,
  createEventoVentaRequest,
  deleteEventoVentaRequest,
  getEventoVentaEncargadosJuvenilesOptionsRequest,
  getEventoVentaEncargadosJuvenilesRequest,
  getEventoVentaRequest,
  getEventosVentaRequest,
  removeEventoVentaEncargadoJuvenilRequest,
  updateEventoVentaRequest,
} from '@/queries/eventos-venta';
import {
  CreateEventoVentaPayload,
  EventoVentaEncargadoJuvenilItem,
  EventoVentaFilters,
  EventoVentaFormValues,
  EventoVentaListItem,
} from '@/types/eventos-venta';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

const createEmptyFilters = (): EventoVentaFilters => ({
  q: '',
  includeDeleted: false,
});

const createEmptyFormValues = (): EventoVentaFormValues => ({
  nombre: '',
  descripcion: '',
  fechaEvento: null,
  notas: '',
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

const buildPayload = (
  values: EventoVentaFormValues,
): CreateEventoVentaPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim()
    ? { descripcion: values.descripcion.trim() }
    : {}),
  fechaEvento: dayjs(values.fechaEvento).toISOString(),
  ...(values.notas.trim() ? { notas: values.notas.trim() } : {}),
});

export const useEventosVentaHooks = () => {
  const [eventosVenta, setEventosVenta] = useState<EventoVentaListItem[]>([]);
  const [selectedEventoVenta, setSelectedEventoVenta] =
    useState<EventoVentaListItem | null>(null);
  const [formValues, setFormValues] = useState<EventoVentaFormValues>(
    createEmptyFormValues(),
  );
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<EventoVentaFilters>(createEmptyFilters());
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [encargadosJuveniles, setEncargadosJuveniles] = useState<
    EventoVentaEncargadoJuvenilItem[]
  >([]);
  const [encargadosJuvenilesOptions, setEncargadosJuvenilesOptions] = useState<
    EventoVentaEncargadoJuvenilItem[]
  >([]);
  const [encargadosJuvenilesVisible, setEncargadosJuvenilesVisible] =
    useState(false);
  const [encargadosJuvenilesLoading, setEncargadosJuvenilesLoading] =
    useState(false);
  const [encargadosJuvenilesSearching, setEncargadosJuvenilesSearching] =
    useState(false);
  const [encargadosJuvenilesSubmitting, setEncargadosJuvenilesSubmitting] =
    useState(false);
  const [encargadosJuvenilesError, setEncargadosJuvenilesError] = useState('');
  const [encargadosJuvenilesSuccessMessage, setEncargadosJuvenilesSuccessMessage] =
    useState('');

  const fetchEventosVenta = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError('');
      try {
        const response = await getEventosVentaRequest({
          page: nextPage,
          limit: DEFAULT_LIMIT,
          filters,
        });
        setEventosVenta(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setSelectedEventoVenta((current) =>
          current
            ? response.data.find((item) => item.id === current.id) ?? null
            : null,
        );
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudieron obtener los eventos de venta.'));
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void fetchEventosVenta(1);
  }, [fetchEventosVenta]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setFormValues(createEmptyFormValues());
    setDialogVisible(true);
    setError('');
    setSuccessMessage('');
  };

  const openEditDialog = async () => {
    if (!selectedEventoVenta) return;
    setError('');
    setSuccessMessage('');
    try {
      const evento = await getEventoVentaRequest(selectedEventoVenta.id);
      setDialogMode('edit');
      setFormValues({
        nombre: evento.nombre,
        descripcion: evento.descripcion ?? '',
        fechaEvento: new Date(evento.fecha_evento),
        notas: evento.notas ?? '',
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo obtener el evento de venta.'));
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSubmitting(false);
  };

  const openEncargadosJuvenilesDialog = async () => {
    setEncargadosJuvenilesVisible(true);
    setEncargadosJuvenilesLoading(true);
    setEncargadosJuvenilesError('');
    setEncargadosJuvenilesSuccessMessage('');

    try {
      const [assigned, options] = await Promise.all([
        getEventoVentaEncargadosJuvenilesRequest(),
        getEventoVentaEncargadosJuvenilesOptionsRequest(),
      ]);
      setEncargadosJuveniles(assigned);
      setEncargadosJuvenilesOptions(options);
    } catch (err: unknown) {
      setEncargadosJuvenilesError(
        getErrorMessage(
          err,
          'No se pudieron cargar los encargados juveniles.',
        ),
      );
    } finally {
      setEncargadosJuvenilesLoading(false);
    }
  };

  const closeEncargadosJuvenilesDialog = () => {
    setEncargadosJuvenilesVisible(false);
    setEncargadosJuveniles([]);
    setEncargadosJuvenilesOptions([]);
    setEncargadosJuvenilesError('');
    setEncargadosJuvenilesSuccessMessage('');
  };

  const searchEncargadosJuvenilesOptions = async (value: string) => {
    setEncargadosJuvenilesSearching(true);

    try {
      const options = await getEventoVentaEncargadosJuvenilesOptionsRequest(value);
      setEncargadosJuvenilesOptions(options);
    } catch (err: unknown) {
      setEncargadosJuvenilesError(
        getErrorMessage(
          err,
          'No se pudieron buscar protagonistas elegibles.',
        ),
      );
    } finally {
      setEncargadosJuvenilesSearching(false);
    }
  };

  const assignEncargadoJuvenil = async (memberId: number) => {
    setEncargadosJuvenilesSubmitting(true);
    setEncargadosJuvenilesError('');
    setEncargadosJuvenilesSuccessMessage('');

    try {
      await assignEventoVentaEncargadoJuvenilRequest(memberId);
      const [assigned, options] = await Promise.all([
        getEventoVentaEncargadosJuvenilesRequest(),
        getEventoVentaEncargadosJuvenilesOptionsRequest(),
      ]);
      setEncargadosJuveniles(assigned);
      setEncargadosJuvenilesOptions(options);
      setEncargadosJuvenilesSuccessMessage(
        'Encargado juvenil asignado correctamente.',
      );
    } catch (err: unknown) {
      setEncargadosJuvenilesError(
        getErrorMessage(
          err,
          'No se pudo asignar el encargado juvenil.',
        ),
      );
    } finally {
      setEncargadosJuvenilesSubmitting(false);
    }
  };

  const removeEncargadoJuvenil = async (memberId: number) => {
    setEncargadosJuvenilesSubmitting(true);
    setEncargadosJuvenilesError('');
    setEncargadosJuvenilesSuccessMessage('');

    try {
      await removeEventoVentaEncargadoJuvenilRequest(memberId);
      const [assigned, options] = await Promise.all([
        getEventoVentaEncargadosJuvenilesRequest(),
        getEventoVentaEncargadosJuvenilesOptionsRequest(),
      ]);
      setEncargadosJuveniles(assigned);
      setEncargadosJuvenilesOptions(options);
      setEncargadosJuvenilesSuccessMessage(
        'Encargado juvenil removido correctamente.',
      );
    } catch (err: unknown) {
      setEncargadosJuvenilesError(
        getErrorMessage(
          err,
          'No se pudo remover el encargado juvenil.',
        ),
      );
    } finally {
      setEncargadosJuvenilesSubmitting(false);
    }
  };

  const submitForm = async () => {
    if (!formValues.fechaEvento) {
      setError('Debes indicar la fecha del evento.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = buildPayload(formValues);
      if (dialogMode === 'create') {
        await createEventoVentaRequest(payload);
        setSuccessMessage('Evento de venta creado.');
      } else if (selectedEventoVenta) {
        await updateEventoVentaRequest(selectedEventoVenta.id, payload);
        setSuccessMessage('Evento de venta actualizado.');
      }
      setDialogVisible(false);
      await fetchEventosVenta(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo guardar el evento de venta.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedEventoVenta) return;
    setError('');
    try {
      await deleteEventoVentaRequest(selectedEventoVenta.id);
      setSelectedEventoVenta(null);
      setSuccessMessage('Evento de venta eliminado.');
      await fetchEventosVenta(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el evento de venta.'));
    }
  };

  return {
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
    total: meta.total,
    limit: meta.limit,
    filters,
    setFilters,
    refetch: fetchEventosVenta,
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
  };
};
