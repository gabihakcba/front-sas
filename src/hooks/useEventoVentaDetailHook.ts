'use client';

import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createEventoVentaCostoItemRequest,
  createEventoVentaItemRequest,
  createEventoVentaReservaRequest,
  deleteEventoVentaCostoItemRequest,
  deleteEventoVentaItemRequest,
  deleteEventoVentaReservaRequest,
  exportEventoVentaSpreadsheetRequest,
  getEventoVentaRequest,
  updateEventoVentaCostoItemRequest,
  updateEventoVentaReservaRequest,
  updateEventoVentaItemRequest,
} from '@/queries/eventos-venta';
import {
  CreateEventoVentaItemPayload,
  EventoVentaCostoItemPayload,
  EventoVenta,
  EventoVentaItem,
  EventoVentaItemFormValues,
} from '@/types/eventos-venta';

const createEmptyItemFormValues = (): EventoVentaItemFormValues => ({
  nombre: '',
  descripcion: '',
  precioUnitario: '',
  ofertas: [],
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

const buildItemPayload = (
  values: EventoVentaItemFormValues,
): CreateEventoVentaItemPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim()
    ? { descripcion: values.descripcion.trim() }
    : {}),
  precioUnitario: Number(values.precioUnitario),
  ofertas: values.ofertas.map((oferta) => ({
    cantidad: Number(oferta.cantidad),
    precioTotal: Number(oferta.precioTotal),
    ...(oferta.descripcion.trim() ? { descripcion: oferta.descripcion.trim() } : {}),
  })),
});

const buildCostoPayload = (payload: EventoVentaCostoItemPayload) => payload;

export const useEventoVentaDetailHook = (eventoVentaId: number) => {
  const [eventoVenta, setEventoVenta] = useState<EventoVenta | null>(null);
  const [selectedItem, setSelectedItem] = useState<EventoVentaItem | null>(null);
  const [itemDialogVisible, setItemDialogVisible] = useState(false);
  const [itemDialogMode, setItemDialogMode] = useState<'create' | 'edit'>('create');
  const [itemFormValues, setItemFormValues] = useState<EventoVentaItemFormValues>(
    createEmptyItemFormValues(),
  );
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [rowSubmitting, setRowSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchEventoVenta = useCallback(async () => {
    if (!Number.isFinite(eventoVentaId)) {
      setError('Evento de venta inválido.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getEventoVentaRequest(eventoVentaId);
      setEventoVenta(response);
      setSelectedItem((current) =>
        current ? response.Items.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el evento de venta.'));
    } finally {
      setLoading(false);
    }
  }, [eventoVentaId]);

  useEffect(() => {
    void fetchEventoVenta();
  }, [fetchEventoVenta]);

  const openCreateItemDialog = () => {
    setItemDialogMode('create');
    setItemFormValues(createEmptyItemFormValues());
    setItemDialogVisible(true);
    setError('');
    setSuccessMessage('');
  };

  const openEditItemDialog = (itemToEdit?: EventoVentaItem) => {
    const item = itemToEdit ?? selectedItem;
    if (!item) return;
    setItemDialogMode('edit');
    setItemFormValues({
      nombre: item.nombre,
      descripcion: item.descripcion ?? '',
      precioUnitario: item.precio_unitario,
      ofertas: item.Ofertas.map((oferta) => ({
        cantidad: String(oferta.cantidad),
        precioTotal: oferta.precio_total,
        descripcion: oferta.descripcion ?? '',
      })),
    });
    setSelectedItem(item);
    setItemDialogVisible(true);
    setError('');
    setSuccessMessage('');
  };

  const closeItemDialog = () => {
    setItemDialogVisible(false);
    setSubmitting(false);
  };

  const submitItem = async () => {
    if (!eventoVenta) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = buildItemPayload(itemFormValues);
      if (itemDialogMode === 'create') {
        await createEventoVentaItemRequest(eventoVenta.id, payload);
        setSuccessMessage('Item creado.');
      } else if (selectedItem) {
        await updateEventoVentaItemRequest(eventoVenta.id, selectedItem.id, payload);
        setSuccessMessage('Item actualizado.');
      }
      setItemDialogVisible(false);
      await fetchEventoVenta();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo guardar el item.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelectedItem = async (itemToDelete?: EventoVentaItem) => {
    const item = itemToDelete ?? selectedItem;
    if (!eventoVenta || !item) return;
    setError('');
    try {
      await deleteEventoVentaItemRequest(eventoVenta.id, item.id);
      setSelectedItem(null);
      setSuccessMessage('Item eliminado.');
      await fetchEventoVenta();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el item.'));
    }
  };

  const exportSpreadsheet = async () => {
    if (!eventoVenta) return;
    setExporting(true);
    setError('');
    try {
      const blob = await exportEventoVentaSpreadsheetRequest(eventoVenta.id);
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `evento-venta-${eventoVenta.id}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
      setSuccessMessage('Planilla exportada.');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo exportar la planilla.'));
    } finally {
      setExporting(false);
    }
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  return {
    eventoVenta,
    selectedItem,
    setSelectedItem,
    itemDialogVisible,
    itemDialogMode,
    itemFormValues,
    setItemFormValues,
    error,
    successMessage,
    loading,
    submitting,
    quickSubmitting,
    rowSubmitting,
    exporting,
    clearSuccessMessage,
    refetch: fetchEventoVenta,
    openCreateItemDialog,
    openEditItemDialog,
    closeItemDialog,
    submitItem,
    deleteSelectedItem,
    exportSpreadsheet,
    createReserva: async (payload: Parameters<typeof createEventoVentaReservaRequest>[1]) => {
      if (!eventoVenta) return;
      setQuickSubmitting(true);
      setError('');
      try {
        await createEventoVentaReservaRequest(eventoVenta.id, payload);
        setSuccessMessage('Reserva cargada.');
        await fetchEventoVenta();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo cargar la reserva.'));
        throw err;
      } finally {
        setQuickSubmitting(false);
      }
    },
    updateReserva: async (
      reservaId: number,
      payload: Parameters<typeof updateEventoVentaReservaRequest>[2],
    ) => {
      if (!eventoVenta) return;
      setRowSubmitting(true);
      setError('');
      try {
        await updateEventoVentaReservaRequest(eventoVenta.id, reservaId, payload);
        setSuccessMessage('Reserva actualizada.');
        await fetchEventoVenta();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo actualizar la reserva.'));
        throw err;
      } finally {
        setRowSubmitting(false);
      }
    },
    deleteReserva: async (reservaId: number) => {
      if (!eventoVenta) return;
      setRowSubmitting(true);
      setError('');
      try {
        await deleteEventoVentaReservaRequest(eventoVenta.id, reservaId);
        setSuccessMessage('Reserva eliminada.');
        await fetchEventoVenta();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo eliminar la reserva.'));
        throw err;
      } finally {
        setRowSubmitting(false);
      }
    },
    createCostoItem: async (payload: EventoVentaCostoItemPayload) => {
      if (!eventoVenta) return;
      setRowSubmitting(true);
      setError('');
      try {
        await createEventoVentaCostoItemRequest(
          eventoVenta.id,
          buildCostoPayload(payload),
        );
        setSuccessMessage('Gasto creado.');
        await fetchEventoVenta();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo crear el gasto.'));
        throw err;
      } finally {
        setRowSubmitting(false);
      }
    },
    updateCostoItem: async (
      costoItemId: number,
      payload: EventoVentaCostoItemPayload,
    ) => {
      if (!eventoVenta) return;
      setRowSubmitting(true);
      setError('');
      try {
        await updateEventoVentaCostoItemRequest(
          eventoVenta.id,
          costoItemId,
          buildCostoPayload(payload),
        );
        setSuccessMessage('Gasto actualizado.');
        await fetchEventoVenta();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo actualizar el gasto.'));
        throw err;
      } finally {
        setRowSubmitting(false);
      }
    },
    deleteCostoItem: async (costoItemId: number) => {
      if (!eventoVenta) return;
      setRowSubmitting(true);
      setError('');
      try {
        await deleteEventoVentaCostoItemRequest(eventoVenta.id, costoItemId);
        setSuccessMessage('Gasto eliminado.');
        await fetchEventoVenta();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo eliminar el gasto.'));
        throw err;
      } finally {
        setRowSubmitting(false);
      }
    },
  };
};
