'use client';

import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import {
  createCuentaDineroRequest,
  deleteCuentaDineroRequest,
  getCuentaDineroRequest,
  getCuentasDineroOptionsRequest,
  getCuentasDineroRequest,
  updateCuentaDineroRequest,
} from '@/queries/cuentas-dinero';
import {
  CreateCuentaDineroPayload,
  CuentaDinero,
  CuentaDineroFormValues,
  CuentaDineroOptionsResponse,
} from '@/types/cuentas-dinero';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): CuentaDineroFormValues => ({
  nombre: '',
  descripcion: '',
  montoActual: '0',
  tipoAsignacion: 'AREA',
  idArea: null,
  idRama: null,
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
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => Promise<void>;
  openEditDialog: () => Promise<void>;
  closeDialog: () => void;
  submitForm: (values: CuentaDineroFormValues) => Promise<void>;
  deleteSelected: () => Promise<void>;
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

  const fetchCuentasDinero = async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getCuentasDineroRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
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
  };

  useEffect(() => {
    void fetchCuentasDinero();
  }, []);

  const openCreateDialog = async () => {
    setDialogMode('create');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await getCuentasDineroOptionsRequest();
      setOptions(response);
      setFormValuesState(createEmptyFormValues());
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las opciones.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openEditDialog = async () => {
    if (!selectedCuentaDinero) {
      setError('Seleccioná una cuenta de dinero para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [optionsResponse, cuentaResponse] = await Promise.all([
        getCuentasDineroOptionsRequest(),
        getCuentaDineroRequest(selectedCuentaDinero.id),
      ]);

      setOptions(optionsResponse);
      setFormValuesState({
        nombre: cuentaResponse.nombre,
        descripcion: cuentaResponse.descripcion ?? '',
        montoActual: cuentaResponse.monto_actual,
        tipoAsignacion: cuentaResponse.id_rama ? 'RAMA' : 'AREA',
        idArea: cuentaResponse.id_area ?? cuentaResponse.Rama?.id_area ?? null,
        idRama: cuentaResponse.id_rama ?? null,
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar la cuenta de dinero.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: CuentaDineroFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createCuentaDineroRequest(buildPayload(values));
        setSuccessMessage('Cuenta de dinero creada correctamente.');
      } else if (selectedCuentaDinero) {
        await updateCuentaDineroRequest(
          selectedCuentaDinero.id,
          buildPayload(values),
        );
        setSuccessMessage('Cuenta de dinero actualizada correctamente.');
      }

      closeDialog();
      await fetchCuentasDinero(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear la cuenta de dinero.'
            : 'No se pudo actualizar la cuenta de dinero.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedCuentaDinero) {
      setError('Seleccioná una cuenta de dinero para eliminar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteCuentaDineroRequest(selectedCuentaDinero.id);
      setSelectedCuentaDinero(null);
      setSuccessMessage('Cuenta de dinero eliminada correctamente.');
      await fetchCuentasDinero(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar la cuenta de dinero.'));
      setLoading(false);
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
    refetch: fetchCuentasDinero,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
