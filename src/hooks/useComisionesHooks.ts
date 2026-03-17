'use client';

import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createComisionRequest,
  deleteComisionRequest,
  getComisionRequest,
  getComisionParticipantesRequest,
  getComisionesOptionsRequest,
  getComisionesRequest,
  updateComisionParticipantesRequest,
  updateComisionRequest,
} from '@/queries/comisiones';
import {
  Comision,
  ComisionFilters,
  ComisionFormValues,
  ComisionesOptionsResponse,
  CreateComisionPayload,
} from '@/types/comisiones';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): ComisionFormValues => ({
  nombre: '',
  descripcion: '',
  idEvento: null,
});

const createEmptyFilters = (): ComisionFilters => ({
  q: '',
  idEvento: null,
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

const buildPayload = (values: ComisionFormValues): CreateComisionPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim() ? { descripcion: values.descripcion.trim() } : {}),
  idEvento: values.idEvento,
});

export const useComisionesHook = () => {
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [selectedComision, setSelectedComision] = useState<Comision | null>(null);
  const [formValues, setFormValuesState] = useState<ComisionFormValues>(
    createEmptyFormValues(),
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [participantesVisible, setParticipantesVisible] = useState(false);
  const [participanteIds, setParticipanteIds] = useState<number[]>([]);
  const [options, setOptions] = useState<ComisionesOptionsResponse>({
    eventos: [],
    adultos: [],
  });
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
  const [filters, setFiltersState] = useState<ComisionFilters>(createEmptyFilters());

  const setFilters = (nextFilters: ComisionFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = async () => {
    const response = await getComisionesOptionsRequest();
    setOptions(response);
  };

  const fetchComisiones = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getComisionesRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        filters,
      });
      setComisiones(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedComision((current) =>
        current ? response.data.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener las comisiones.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, []);

  useEffect(() => {
    void fetchComisiones();
  }, [fetchComisiones]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setFormValuesState(createEmptyFormValues());
    setDialogVisible(true);
  };

  const openEditDialog = async () => {
    if (!selectedComision) {
      setError('Seleccioná una comisión para editar.');
      return;
    }
    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const comision = await getComisionRequest(selectedComision.id);
      setFormValuesState({
        nombre: comision.nombre,
        descripcion: comision.descripcion ?? '',
        idEvento: comision.Evento?.id ?? null,
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar la comisión.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const openParticipantesDialog = async () => {
    if (!selectedComision) {
      setError('Seleccioná una comisión para administrar participantes.');
      return;
    }

    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [participantes] = await Promise.all([
        getComisionParticipantesRequest(selectedComision.id),
        fetchOptions(),
      ]);
      setParticipanteIds(participantes.map((item) => item.Miembro.id));
      setParticipantesVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar los participantes.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeParticipantesDialog = () => {
    setParticipantesVisible(false);
    setParticipanteIds([]);
  };

  const submitForm = async (values: ComisionFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      if (dialogMode === 'create') {
        await createComisionRequest(buildPayload(values));
        setSuccessMessage('Comisión creada correctamente.');
      } else if (selectedComision) {
        await updateComisionRequest(selectedComision.id, buildPayload(values));
        setSuccessMessage('Comisión actualizada correctamente.');
      }
      closeDialog();
      await fetchComisiones(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear la comisión.'
            : 'No se pudo actualizar la comisión.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedComision) {
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await deleteComisionRequest(selectedComision.id);
      setSelectedComision(null);
      setSuccessMessage('Comisión eliminada correctamente.');
      await fetchComisiones(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar la comisión.'));
      setLoading(false);
    }
  };

  const submitParticipantes = async () => {
    if (!selectedComision) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateComisionParticipantesRequest(selectedComision.id, participanteIds);
      setSuccessMessage('Participantes actualizados correctamente.');
      closeParticipantesDialog();
      await fetchComisiones(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron guardar los participantes.'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    comisiones,
    selectedComision,
    setSelectedComision,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    participantesVisible,
    participanteIds,
    setParticipanteIds,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total: meta.total,
    limit: meta.limit,
    filters,
    setFilters,
    refetch: fetchComisiones,
    openCreateDialog,
    openEditDialog,
    openParticipantesDialog,
    closeDialog,
    closeParticipantesDialog,
    submitForm,
    submitParticipantes,
    deleteSelected,
  };
};
