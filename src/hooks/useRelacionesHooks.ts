'use client';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  createRelacionRequest,
  deleteRelacionRequest,
  getRelacionRequest,
  getRelacionesRequest,
  updateRelacionRequest,
} from '@/queries/relaciones';
import {
  CreateRelacionPayload,
  Relacion,
  RelacionFormValues,
} from '@/types/relaciones';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): RelacionFormValues => ({
  tipo: '',
  descripcion: '',
});

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message)) {
      return message.join(' ');
    }
  }
  return fallback;
};

const buildPayload = (values: RelacionFormValues): CreateRelacionPayload => ({
  tipo: values.tipo.trim(),
  ...(values.descripcion.trim() ? { descripcion: values.descripcion.trim() } : {}),
});

export const useRelacionesHook = () => {
  const [relaciones, setRelaciones] = useState<Relacion[]>([]);
  const [selectedRelacion, setSelectedRelacion] = useState<Relacion | null>(null);
  const [formValues, setFormValuesState] = useState<RelacionFormValues>(
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

  const fetchRelaciones = async (nextPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getRelacionesRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
      });
      setRelaciones(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedRelacion((current) => {
        if (!current) {
          return null;
        }
        return response.data.find((item) => item.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener las relaciones.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRelaciones();
  }, []);

  const openCreateDialog = () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setFormValuesState(createEmptyFormValues());
    setDialogVisible(true);
  };

  const openEditDialog = async () => {
    if (!selectedRelacion) {
      setError('Seleccioná una relación para editar.');
      return;
    }
    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const relacion = await getRelacionRequest(selectedRelacion.id);
      setFormValuesState({
        tipo: relacion.tipo,
        descripcion: relacion.descripcion ?? '',
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar la relación seleccionada.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: RelacionFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      if (dialogMode === 'create') {
        await createRelacionRequest(buildPayload(values));
        setSuccessMessage('Relación guardada correctamente.');
      } else if (selectedRelacion) {
        await updateRelacionRequest(selectedRelacion.id, buildPayload(values));
        setSuccessMessage('Relación actualizada correctamente.');
      }
      closeDialog();
      await fetchRelaciones(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear la relación.'
            : 'No se pudo actualizar la relación.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedRelacion) {
      setError('Seleccioná una relación para eliminar.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await deleteRelacionRequest(selectedRelacion.id);
      setSelectedRelacion(null);
      setSuccessMessage('Relación eliminada correctamente.');
      await fetchRelaciones(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar la relación.'));
      setLoading(false);
    }
  };

  return {
    relaciones,
    selectedRelacion,
    setSelectedRelacion,
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
    refetch: fetchRelaciones,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
