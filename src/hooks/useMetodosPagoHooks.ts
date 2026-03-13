'use client';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  createMetodoPagoRequest,
  deleteMetodoPagoRequest,
  getMetodoPagoRequest,
  getMetodosPagoRequest,
  updateMetodoPagoRequest,
} from '@/queries/metodos-pago';
import {
  CreateMetodoPagoPayload,
  MetodoPago,
  MetodoPagoFormValues,
} from '@/types/metodos-pago';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): MetodoPagoFormValues => ({
  nombre: '',
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

const buildPayload = (
  values: MetodoPagoFormValues,
): CreateMetodoPagoPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim()
    ? { descripcion: values.descripcion.trim() }
    : {}),
});

interface UseMetodosPagoHookResult {
  metodosPago: MetodoPago[];
  selectedMetodoPago: MetodoPago | null;
  setSelectedMetodoPago: (metodoPago: MetodoPago | null) => void;
  formValues: MetodoPagoFormValues;
  setFormValues: (values: MetodoPagoFormValues) => void;
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
  openCreateDialog: () => void;
  openEditDialog: () => Promise<void>;
  closeDialog: () => void;
  submitForm: (values: MetodoPagoFormValues) => Promise<void>;
  deleteSelected: () => Promise<void>;
}

export const useMetodosPagoHook = (): UseMetodosPagoHookResult => {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [selectedMetodoPago, setSelectedMetodoPago] =
    useState<MetodoPago | null>(null);
  const [formValues, setFormValuesState] = useState<MetodoPagoFormValues>(
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

  const setFormValues = (values: MetodoPagoFormValues) => {
    setFormValuesState(values);
  };

  const fetchMetodosPago = async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getMetodosPagoRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
      });

      setMetodosPago(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedMetodoPago((current) => {
        if (!current) {
          return null;
        }

        return response.data.find((item) => item.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los metodos de pago.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMetodosPago();
  }, []);

  const openCreateDialog = () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setFormValuesState(createEmptyFormValues());
    setDialogVisible(true);
  };

  const openEditDialog = async () => {
    if (!selectedMetodoPago) {
      setError('Seleccioná un metodo de pago para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const metodoPago = await getMetodoPagoRequest(selectedMetodoPago.id);
      setFormValuesState({
        nombre: metodoPago.nombre,
        descripcion: metodoPago.descripcion ?? '',
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, 'No se pudo cargar el metodo de pago seleccionado.'),
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: MetodoPagoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createMetodoPagoRequest(buildPayload(values));
        setSuccessMessage('Metodo de pago guardado correctamente.');
      } else if (selectedMetodoPago) {
        await updateMetodoPagoRequest(
          selectedMetodoPago.id,
          buildPayload(values),
        );
        setSuccessMessage('Metodo de pago actualizado correctamente.');
      }

      closeDialog();
      await fetchMetodosPago(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el metodo de pago.'
            : 'No se pudo actualizar el metodo de pago.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedMetodoPago) {
      setError('Seleccioná un metodo de pago para eliminar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteMetodoPagoRequest(selectedMetodoPago.id);
      setSelectedMetodoPago(null);
      setSuccessMessage('Metodo de pago eliminado correctamente.');
      await fetchMetodosPago(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el metodo de pago.'));
      setLoading(false);
    }
  };

  return {
    metodosPago,
    selectedMetodoPago,
    setSelectedMetodoPago,
    formValues,
    setFormValues,
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
    refetch: fetchMetodosPago,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
