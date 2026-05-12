'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createEventoVentaRequest,
  deleteEventoVentaRequest,
  getEventoVentaRequest,
  getEventosVentaRequest,
  updateEventoVentaRequest,
} from '@/queries/eventos-venta';
import {
  CreateEventoVentaPayload,
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
    submitForm,
    deleteSelected,
  };
};
