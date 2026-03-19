'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createReunionRequest,
  deleteReunionRequest,
  getReunionInvitadosRequest,
  getReunionRequest,
  getReunionesOptionsRequest,
  getReunionesRequest,
  updateReunionInvitadosRequest,
  updateReunionRequest,
} from '@/queries/reuniones';
import {
  CreateReunionPayload,
  Reunion,
  ReunionFilters,
  ReunionFormValues,
  ReunionInvitado,
  ReunionesOptionsResponse,
  UpdateReunionPayload,
} from '@/types/reuniones';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

type DialogMode = 'create' | 'edit';

const createEmptyFilters = (): ReunionFilters => ({
  q: '',
  modalidad: null,
  fechaDesde: '',
  fechaHasta: '',
  includeDeleted: false,
});

const createEmptyFormValues = (): ReunionFormValues => ({
  titulo: '',
  descripcion: '',
  fechaInicio: dayjs().startOf('day').toISOString(),
  fechaFin: dayjs().startOf('day').add(1, 'hour').toISOString(),
  modalidad: 'PRESENCIAL',
  lugarFisico: '',
  urlVirtual: '',
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

const buildPayload = (values: ReunionFormValues): CreateReunionPayload => ({
  titulo: values.titulo.trim(),
  ...(values.descripcion.trim() ? { descripcion: values.descripcion.trim() } : {}),
  fechaInicio: dayjs(values.fechaInicio).toISOString(),
  fechaFin: dayjs(values.fechaFin).toISOString(),
  modalidad: values.modalidad,
  ...(values.lugarFisico.trim() ? { lugarFisico: values.lugarFisico.trim() } : {}),
  ...(values.urlVirtual.trim() ? { urlVirtual: values.urlVirtual.trim() } : {}),
  areaIds: values.areaIds,
  ramaIds: values.ramaIds,
});

export const useReunionesHook = () => {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [selectedReunion, setSelectedReunion] = useState<Reunion | null>(null);
  const [formValues, setFormValuesState] = useState<ReunionFormValues>(
    createEmptyFormValues(),
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [invitadosVisible, setInvitadosVisible] = useState(false);
  const [invitados, setInvitados] = useState<ReunionInvitado[]>([]);
  const [invitadoIds, setInvitadoIds] = useState<number[]>([]);
  const [options, setOptions] = useState<ReunionesOptionsResponse>({
    areas: [],
    ramas: [],
    miembros: [],
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [auxSubmitting, setAuxSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFiltersState] = useState<ReunionFilters>(createEmptyFilters());

  const setFilters = (nextFilters: ReunionFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = async () => {
    const response = await getReunionesOptionsRequest();
    setOptions(response);
  };

  const fetchReuniones = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError('');
      try {
        const response = await getReunionesRequest({
          page: nextPage,
          limit: DEFAULT_LIMIT,
          filters,
        });
        setReuniones(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setSelectedReunion((current) =>
          current
            ? response.data.find((item) => item.id === current.id) ?? null
            : null,
        );
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudieron obtener las reuniones.'));
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void fetchOptions();
  }, []);

  useEffect(() => {
    void fetchReuniones();
  }, [fetchReuniones]);

  const openCreateDialog = async () => {
    setDialogMode('create');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await fetchOptions();
      setFormValuesState(createEmptyFormValues());
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las opciones.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openEditDialog = async () => {
    if (!selectedReunion) {
      setError('Selecciona una reunion para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [reunion] = await Promise.all([
        getReunionRequest(selectedReunion.id),
        fetchOptions(),
      ]);

      setFormValuesState({
        titulo: reunion.titulo,
        descripcion: reunion.descripcion ?? '',
        fechaInicio: dayjs(reunion.fecha_inicio).toISOString(),
        fechaFin: dayjs(reunion.fecha_fin).toISOString(),
        modalidad: reunion.modalidad,
        lugarFisico: reunion.lugar_fisico ?? '',
        urlVirtual: reunion.url_virtual ?? '',
        areaIds: reunion.AreasAfectadas.map((item) => item.Area.id),
        ramaIds: reunion.RamasAfectadas.map((item) => item.Rama.id),
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar la reunion.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openInvitadosDialog = async () => {
    if (!selectedReunion) {
      setError('Selecciona una reunion para administrar invitados.');
      return;
    }

    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [currentInvitados] = await Promise.all([
        getReunionInvitadosRequest(selectedReunion.id),
        fetchOptions(),
      ]);

      setInvitados(currentInvitados);
      setInvitadoIds(currentInvitados.map((item) => item.Miembro.id));
      setInvitadosVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar los invitados.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const closeInvitadosDialog = () => {
    setInvitadosVisible(false);
    setInvitados([]);
    setInvitadoIds([]);
  };

  const submitForm = async (values: ReunionFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createReunionRequest(buildPayload(values));
        setSuccessMessage('Reunion creada correctamente.');
      } else if (selectedReunion) {
        await updateReunionRequest(
          selectedReunion.id,
          buildPayload(values) as UpdateReunionPayload,
        );
        setSuccessMessage('Reunion actualizada correctamente.');
      }

      closeDialog();
      await fetchReuniones(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear la reunion.'
            : 'No se pudo actualizar la reunion.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedReunion) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteReunionRequest(selectedReunion.id);
      setSelectedReunion(null);
      setSuccessMessage('Reunion eliminada correctamente.');
      await fetchReuniones(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar la reunion.'));
      setLoading(false);
    }
  };

  const submitInvitados = async () => {
    if (!selectedReunion) {
      return;
    }

    setAuxSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateReunionInvitadosRequest(selectedReunion.id, invitadoIds);
      setSuccessMessage('Invitaciones actualizadas correctamente.');
      closeInvitadosDialog();
      await fetchReuniones(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron actualizar los invitados.'));
    } finally {
      setAuxSubmitting(false);
    }
  };

  return {
    reuniones,
    selectedReunion,
    setSelectedReunion,
    formValues,
    dialogMode,
    dialogVisible,
    invitadosVisible,
    invitados,
    invitadoIds,
    setInvitadoIds,
    options,
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
    refetch: fetchReuniones,
    openCreateDialog,
    openEditDialog,
    openInvitadosDialog,
    closeDialog,
    closeInvitadosDialog,
    submitForm,
    deleteSelected,
    submitInvitados,
  };
};
