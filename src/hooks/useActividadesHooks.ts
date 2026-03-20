'use client';

import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import {
  createActividadRequest,
  deleteActividadRequest,
  getActividadesRequest,
  getTipoActividadesRequest,
  updateActividadRequest,
  getSabatinosOptionsRequest,
} from '@/queries/sabatinos';
import {
  Actividad,
  CreateActividadPayload,
  TipoActividad,
  UpdateActividadPayload,
} from '@/types/sabatinos';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

type DialogMode = 'create' | 'edit';

const createEmptyActividadFormValues = () => ({
  nombre: '',
  descripcion: '',
  objetivos: '',
  materiales: '',
  id_tipo: null as number | null,
  responsableIds: [] as number[],
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

export const useActividadesHook = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const [options, setOptions] = useState<{
    tiposActividad: TipoActividad[];
    adultos: Array<{ id: number; miembroId: number; nombre: string; apellidos: string; dni: string }>;
  }>({
    tiposActividad: [],
    adultos: [],
  });

  // Dialogs
  const [actividadDialogVisible, setActividadDialogVisible] = useState(false);
  const [actividadDialogMode, setActividadDialogMode] = useState<DialogMode>('create');
  const [actividadFormValues, setActividadFormValues] = useState(createEmptyActividadFormValues());
  const [submitting, setSubmitting] = useState(false);

  const fetchOptions = useCallback(async () => {
    try {
      const [tipos, opt] = await Promise.all([
        getTipoActividadesRequest(),
        getSabatinosOptionsRequest(),
      ]);
      setOptions({
        tiposActividad: tipos,
        adultos: opt.adultos.map((a) => ({
          ...a,
          label: `${a.apellidos}, ${a.nombre}`,
        })),
      });
    } catch (err) {
      console.error('Error fetching options', err);
    }
  }, []);

  const fetchActividades = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getActividadesRequest({
        ...filters,
        page: nextPage,
      });
      setActividades(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron obtener las actividades.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchActividades(filters.page);
  }, [fetchActividades, filters.page]);

  const openCreateDialog = () => {
    setActividadDialogMode('create');
    setActividadFormValues(createEmptyActividadFormValues());
    setActividadDialogVisible(true);
  };

  const openEditDialog = (actividad: Actividad) => {
    setActividadDialogMode('edit');
    setSelectedActividad(actividad);
    // Note: responsibles logic might need adjustment if we want to show global responsibles
    // but the current requirement moved them to Sabatino relationship.
    // For now, in global list, we show Actividad basic data.
    setActividadFormValues({
      nombre: actividad.nombre,
      descripcion: actividad.descripcion ?? '',
      objetivos: actividad.objetivos ?? '',
      materiales: actividad.materiales ?? '',
      id_tipo: actividad.id_tipo,
      responsableIds: [], // Global activités don't have responsibles anymore
    });
    setActividadDialogVisible(true);
  };

  const submitForm = async (data: CreateActividadPayload) => {
    setSubmitting(true);
    setError('');
    try {
      if (actividadDialogMode === 'create') {
        await createActividadRequest(data);
        setSuccessMessage('Actividad creada con éxito.');
      } else if (selectedActividad) {
        await updateActividadRequest(selectedActividad.id, data as UpdateActividadPayload);
        setSuccessMessage('Actividad actualizada con éxito.');
      }
      setActividadDialogVisible(false);
      void fetchActividades(meta.page);
    } catch (err) {
      setError(getErrorMessage(err, 'Error al guardar la actividad.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteActividad = async (id: number) => {
    try {
      await deleteActividadRequest(id);
      setSuccessMessage('Actividad eliminada con éxito.');
      setSelectedActividad(null);
      void fetchActividades(meta.page);
    } catch (err) {
      setError(getErrorMessage(err, 'Error al eliminar la actividad.'));
    }
  };

  return {
    actividades,
    selectedActividad,
    setSelectedActividad,
    loading,
    error,
    successMessage,
    setSuccessMessage,
    filters,
    setFilters,
    meta,
    options,
    // Dialog
    actividadDialogVisible,
    setActividadDialogVisible,
    actividadDialogMode,
    actividadFormValues,
    submitting,
    openCreateDialog,
    openEditDialog,
    submitForm,
    deleteActividad,
  };
};
