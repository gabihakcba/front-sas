'use client';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  createConceptoPagoRequest,
  deleteConceptoPagoRequest,
  getConceptoPagoRequest,
  getConceptosPagoRequest,
  updateConceptoPagoRequest,
} from '@/queries/conceptos-pago';
import {
  ConceptoPago,
  ConceptoPagoFormValues,
  CreateConceptoPagoPayload,
} from '@/types/conceptos-pago';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): ConceptoPagoFormValues => ({
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
  values: ConceptoPagoFormValues,
): CreateConceptoPagoPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim()
    ? { descripcion: values.descripcion.trim() }
    : {}),
});

interface UseConceptosPagoHookResult {
  conceptosPago: ConceptoPago[];
  selectedConceptoPago: ConceptoPago | null;
  setSelectedConceptoPago: (conceptoPago: ConceptoPago | null) => void;
  formValues: ConceptoPagoFormValues;
  setFormValues: (values: ConceptoPagoFormValues) => void;
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
  submitForm: (values: ConceptoPagoFormValues) => Promise<void>;
  deleteSelected: () => Promise<void>;
}

export const useConceptosPagoHook = (): UseConceptosPagoHookResult => {
  const [conceptosPago, setConceptosPago] = useState<ConceptoPago[]>([]);
  const [selectedConceptoPago, setSelectedConceptoPago] =
    useState<ConceptoPago | null>(null);
  const [formValues, setFormValuesState] = useState<ConceptoPagoFormValues>(
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

  const setFormValues = (values: ConceptoPagoFormValues) => {
    setFormValuesState(values);
  };

  const fetchConceptosPago = async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getConceptosPagoRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
      });

      setConceptosPago(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedConceptoPago((current) => {
        if (!current) {
          return null;
        }

        return response.data.find((item) => item.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, 'No se pudieron obtener los conceptos de pago.'),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchConceptosPago();
  }, []);

  const openCreateDialog = () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setFormValuesState(createEmptyFormValues());
    setDialogVisible(true);
  };

  const openEditDialog = async () => {
    if (!selectedConceptoPago) {
      setError('Seleccioná un concepto de pago para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const conceptoPago = await getConceptoPagoRequest(selectedConceptoPago.id);
      setFormValuesState({
        nombre: conceptoPago.nombre,
        descripcion: conceptoPago.descripcion ?? '',
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          'No se pudo cargar el concepto de pago seleccionado.',
        ),
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: ConceptoPagoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createConceptoPagoRequest(buildPayload(values));
        setSuccessMessage('Concepto de pago guardado correctamente.');
      } else if (selectedConceptoPago) {
        await updateConceptoPagoRequest(
          selectedConceptoPago.id,
          buildPayload(values),
        );
        setSuccessMessage('Concepto de pago actualizado correctamente.');
      }

      closeDialog();
      await fetchConceptosPago(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el concepto de pago.'
            : 'No se pudo actualizar el concepto de pago.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedConceptoPago) {
      setError('Seleccioná un concepto de pago para eliminar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteConceptoPagoRequest(selectedConceptoPago.id);
      setSelectedConceptoPago(null);
      setSuccessMessage('Concepto de pago eliminado correctamente.');
      await fetchConceptosPago(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, 'No se pudo eliminar el concepto de pago.'),
      );
      setLoading(false);
    }
  };

  return {
    conceptosPago,
    selectedConceptoPago,
    setSelectedConceptoPago,
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
    refetch: fetchConceptosPago,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
