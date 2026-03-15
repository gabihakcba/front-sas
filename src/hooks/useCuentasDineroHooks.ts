'use client';

import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createCuentaDineroRequest,
  getCuentasDineroOptionsRequest,
  getCuentasDineroRequest,
} from '@/queries/cuentas-dinero';
import {
  CreateCuentaDineroPayload,
  CuentaDinero,
  CuentaDineroFilters,
  CuentaDineroFormValues,
  CuentaDineroOptionsResponse,
} from '@/types/cuentas-dinero';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create';
const createEmptyFilters = (): CuentaDineroFilters => ({
  q: '',
  idArea: null,
  idRama: null,
  idMiembro: null,
});

const createEmptyFormValues = (): CuentaDineroFormValues => ({
  nombre: '',
  descripcion: '',
  montoActual: '0',
  tipoAsignacion: 'AREA',
  idArea: null,
  idRama: null,
  idMiembro: null,
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

const buildPayload = (
  values: CuentaDineroFormValues,
): CreateCuentaDineroPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim()
    ? { descripcion: values.descripcion.trim() }
    : {}),
  montoActual: Number(values.montoActual),
  ...(values.tipoAsignacion === 'AREA' && values.idArea
    ? { idArea: values.idArea }
    : {}),
  ...(values.tipoAsignacion === 'RAMA' && values.idRama
    ? { idRama: values.idRama }
    : {}),
  ...(values.tipoAsignacion === 'MIEMBRO' && values.idMiembro
    ? { idMiembro: values.idMiembro }
    : {}),
});

interface UseCuentasDineroHookResult {
  cuentasDinero: CuentaDinero[];
  selectedCuentaDinero: CuentaDinero | null;
  setSelectedCuentaDinero: (cuenta: CuentaDinero | null) => void;
  formValues: CuentaDineroFormValues;
  setFormValues: (values: CuentaDineroFormValues) => void;
  options: CuentaDineroOptionsResponse;
  dialogMode: DialogMode;
  dialogVisible: boolean;
  error: string;
  successMessage: string;
  loading: boolean;
  dialogLoading: boolean;
  submitting: boolean;
  page: number;
  total: number;
  limit: number;
  filters: CuentaDineroFilters;
  setFilters: (filters: CuentaDineroFilters) => void;
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => Promise<void>;
  closeDialog: () => void;
  submitForm: (values: CuentaDineroFormValues) => Promise<void>;
}

export const useCuentasDineroHook = (): UseCuentasDineroHookResult => {
  const [cuentasDinero, setCuentasDinero] = useState<CuentaDinero[]>([]);
  const [selectedCuentaDinero, setSelectedCuentaDinero] =
    useState<CuentaDinero | null>(null);
  const [formValues, setFormValuesState] = useState<CuentaDineroFormValues>(
    createEmptyFormValues(),
  );
  const [options, setOptions] = useState<CuentaDineroOptionsResponse>({
    areas: [],
    ramas: [],
    miembros: [],
  });
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
  const [filters, setFiltersState] = useState<CuentaDineroFilters>(
    createEmptyFilters(),
  );

  const filteredRamas = useMemo(() => {
    if (formValues.tipoAsignacion !== 'RAMA') {
      return options.ramas;
    }

    if (!formValues.idArea) {
      return options.ramas;
    }

    return options.ramas.filter((rama) => rama.id_area === formValues.idArea);
  }, [formValues.idArea, formValues.tipoAsignacion, options.ramas]);

  const setFormValues = (values: CuentaDineroFormValues) => {
    setFormValuesState(values);
  };

  const setFilters = (nextFilters: CuentaDineroFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = useCallback(async () => {
    const response = await getCuentasDineroOptionsRequest();
    setOptions(response);
  }, []);

  const fetchCuentasDinero = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getCuentasDineroRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        filters,
      });
      setCuentasDinero(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedCuentaDinero((current) => {
        if (!current) {
          return null;
        }
        return response.data.find((item) => item.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener las cuentas de dinero.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchCuentasDinero(1);
  }, [fetchCuentasDinero]);

  const openCreateDialog = useCallback(async () => {
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
  }, [fetchOptions]);

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: CuentaDineroFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await createCuentaDineroRequest(buildPayload(values));
      setSuccessMessage('Cuenta de dinero creada correctamente.');

      closeDialog();
      await fetchCuentasDinero(1);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo crear la cuenta de dinero.'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    cuentasDinero,
    selectedCuentaDinero,
    setSelectedCuentaDinero,
    formValues,
    setFormValues,
    options: {
      ...options,
      ramas: filteredRamas,
    },
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
    refetch: fetchCuentasDinero,
    openCreateDialog,
    closeDialog,
    submitForm,
  };
};
