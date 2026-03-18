'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  createCicloProgramaRequest,
  deleteCicloProgramaRequest,
  getCicloProgramaRequest,
  getCiclosProgramaOptionsRequest,
  getCiclosProgramaRequest,
  updateCicloProgramaRequest,
} from '@/queries/ciclos-programa';
import {
  CicloProgramaDetalle,
  CicloProgramaFilters,
  CicloProgramaFormValues,
  CicloProgramaResumen,
  CiclosProgramaOptionsResponse,
  CreateCicloProgramaPayload,
  UpdateCicloProgramaPayload,
} from '@/types/ciclos-programa';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

const createEmptyFilters = (): CicloProgramaFilters => ({
  q: '',
  fechaDesde: '',
  fechaHasta: '',
});

const createEmptyFormValues = (): CicloProgramaFormValues => ({
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  idRama: null,
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
  values: CicloProgramaFormValues,
): CreateCicloProgramaPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim() ? { descripcion: values.descripcion.trim() } : {}),
  fechaInicio: dayjs(values.fechaInicio).toISOString(),
  fechaFin: dayjs(values.fechaFin).toISOString(),
  idRama: values.idRama!,
});

const buildBranchDefaultRama = (
  scopes: Array<{ role: string; scopeType: string; scopeId: number | null }>,
) =>
  scopes.find(
    (scope) =>
      (scope.role === 'JEFATURA_RAMA' || scope.role === 'AYUDANTE_RAMA') &&
      scope.scopeType === 'RAMA' &&
      scope.scopeId !== null,
  )?.scopeId ?? null;

export const useCiclosProgramaHook = () => {
  const { user } = useAuth();
  const [ciclos, setCiclos] = useState<CicloProgramaResumen[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<CicloProgramaResumen | null>(null);
  const [formValues, setFormValues] = useState<CicloProgramaFormValues>(createEmptyFormValues());
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [options, setOptions] = useState<CiclosProgramaOptionsResponse>({
    ramas: [],
    estados: [],
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
  const [filters, setFiltersState] = useState<CicloProgramaFilters>(createEmptyFilters());

  const setFilters = (nextFilters: CicloProgramaFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = async () => {
    const response = await getCiclosProgramaOptionsRequest();
    setOptions(response);
    return response;
  };

  const fetchCiclos = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError('');

      try {
        const response = await getCiclosProgramaRequest({
          page: nextPage,
          limit: DEFAULT_LIMIT,
          filters,
        });
        setCiclos(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setSelectedCiclo((current) =>
          current ? response.data.find((item) => item.id === current.id) ?? null : null,
        );
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudieron obtener los ciclos de programa.'));
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
    void fetchCiclos();
  }, [fetchCiclos]);

  const openCreateDialog = async () => {
    setDialogMode('create');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetchOptions();
      const defaultRamaId = buildBranchDefaultRama(user?.scopes ?? []);
      setFormValues({
        ...createEmptyFormValues(),
        idRama:
          defaultRamaId ??
          (response.ramas.length === 1 ? response.ramas[0]?.id ?? null : null),
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las opciones.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openEditDialog = async () => {
    if (!selectedCiclo) {
      setError('Seleccioná un ciclo para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [ciclo] = await Promise.all([
        getCicloProgramaRequest(selectedCiclo.id),
        fetchOptions(),
      ]);
      setFormValues({
        nombre: ciclo.nombre,
        descripcion: ciclo.descripcion ?? '',
        fechaInicio: dayjs(ciclo.fecha_inicio).format('YYYY-MM-DD'),
        fechaFin: dayjs(ciclo.fecha_fin).format('YYYY-MM-DD'),
        idRama: ciclo.Rama.id,
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el ciclo de programa.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValues(createEmptyFormValues());
  };

  const submitForm = async (values: CicloProgramaFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createCicloProgramaRequest(buildPayload(values));
        setSuccessMessage('Ciclo de programa creado correctamente.');
      } else if (selectedCiclo) {
        const payload: UpdateCicloProgramaPayload = buildPayload(values);
        await updateCicloProgramaRequest(selectedCiclo.id, payload);
        setSuccessMessage('Ciclo de programa actualizado correctamente.');
      }

      closeDialog();
      await fetchCiclos(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el ciclo de programa.'
            : 'No se pudo actualizar el ciclo de programa.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedCiclo) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteCicloProgramaRequest(selectedCiclo.id);
      setSelectedCiclo(null);
      setSuccessMessage('Ciclo de programa eliminado correctamente.');
      await fetchCiclos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el ciclo de programa.'));
      setLoading(false);
    }
  };

  return {
    ciclos,
    selectedCiclo,
    setSelectedCiclo,
    formValues,
    options,
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
    filters,
    setFilters,
    fetchCiclos,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};

export const useCicloProgramaDetailHook = (id: number) => {
  const [ciclo, setCiclo] = useState<CicloProgramaDetalle | null>(null);
  const [options, setOptions] = useState<CiclosProgramaOptionsResponse>({
    ramas: [],
    estados: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setForbidden(false);

    try {
      const [cicloResponse, optionsResponse] = await Promise.all([
        getCicloProgramaRequest(id),
        getCiclosProgramaOptionsRequest(),
      ]);
      setCiclo(cicloResponse);
      setOptions(optionsResponse);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;

        if (status === 403 || status === 404) {
          setForbidden(true);
          setError('Tu cuenta no tiene permisos para ver este ciclo de programa.');
          return;
        }
      }

      setError(getErrorMessage(err, 'No se pudo cargar el ciclo de programa.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (payload: UpdateCicloProgramaPayload) => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await updateCicloProgramaRequest(id, payload);
      setCiclo(response);
      setSuccessMessage('Ciclo de programa actualizado correctamente.');
      return response;
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'No se pudo actualizar el ciclo de programa.');
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  return {
    ciclo,
    options,
    loading,
    saving,
    error,
    successMessage,
    forbidden,
    setError,
    setSuccessMessage,
    reload: load,
    save,
  };
};
