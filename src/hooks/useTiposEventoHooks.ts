'use client';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  createTipoEventoRequest,
  deleteTipoEventoRequest,
  getTipoEventoRequest,
  getTiposEventoRequest,
  updateTipoEventoRequest,
} from '@/queries/tipos-evento';
import {
  CreateTipoEventoPayload,
  TipoEvento,
  TipoEventoFormValues,
} from '@/types/tipos-evento';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): TipoEventoFormValues => ({
  nombre: '',
  descripcion: '',
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

const buildPayload = (values: TipoEventoFormValues): CreateTipoEventoPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim() ? { descripcion: values.descripcion.trim() } : {}),
});

export const useTiposEventoHook = () => {
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [selectedTipoEvento, setSelectedTipoEvento] = useState<TipoEvento | null>(null);
  const [formValues, setFormValuesState] = useState<TipoEventoFormValues>(
    createEmptyFormValues(),
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const fetchTiposEvento = async (nextPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getTiposEventoRequest({ page: nextPage, limit: DEFAULT_LIMIT });
      setTiposEvento(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedTipoEvento((current) =>
        current ? response.data.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los tipos de evento.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTiposEvento();
  }, []);

  const openCreateDialog = () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setFormValuesState(createEmptyFormValues());
    setDialogVisible(true);
  };

  const openEditDialog = async () => {
    if (!selectedTipoEvento) {
      setError('Seleccioná un tipo de evento para editar.');
      return;
    }
    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const tipoEvento = await getTipoEventoRequest(selectedTipoEvento.id);
      setFormValuesState({
        nombre: tipoEvento.nombre,
        descripcion: tipoEvento.descripcion ?? '',
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el tipo de evento.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: TipoEventoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      if (dialogMode === 'create') {
        await createTipoEventoRequest(buildPayload(values));
        setSuccessMessage('Tipo de evento creado correctamente.');
      } else if (selectedTipoEvento) {
        await updateTipoEventoRequest(selectedTipoEvento.id, buildPayload(values));
        setSuccessMessage('Tipo de evento actualizado correctamente.');
      }
      closeDialog();
      await fetchTiposEvento(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el tipo de evento.'
            : 'No se pudo actualizar el tipo de evento.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedTipoEvento) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await deleteTipoEventoRequest(selectedTipoEvento.id);
      setSelectedTipoEvento(null);
      setSuccessMessage('Tipo de evento eliminado correctamente.');
      await fetchTiposEvento(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el tipo de evento.'));
      setLoading(false);
    }
  };

  return {
    tiposEvento,
    selectedTipoEvento,
    setSelectedTipoEvento,
    formValues,
    dialogMode,
    dialogVisible,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total: meta.total,
    limit: meta.limit,
    refetch: fetchTiposEvento,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
