'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createPagoRequest,
  deletePagoRequest,
  getPagoRequest,
  getPagosOptionsRequest,
  getPagosRequest,
  updatePagoRequest,
} from '@/queries/pagos';
import {
  CreatePagoPayload,
  Pago,
  PagoFilters,
  PagoFormValues,
  PagosOptionsResponse,
  UpdatePagoPayload,
} from '@/types/pagos';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
type DialogMode = 'create' | 'edit';
const createEmptyFilters = (): PagoFilters => ({
  q: '',
  idConceptoPago: null,
  idMetodoPago: null,
  idCuentaDinero: null,
  idCuentaOrigen: null,
});

const createEmptyFormValues = (): PagoFormValues => ({
  monto: '',
  detalles: '',
  fechaPago: dayjs().format('YYYY-MM-DD'),
  idCuentaDinero: null,
  idCuentaOrigen: null,
  idMetodoPago: null,
  idConceptoPago: null,
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

const buildCreatePayload = (
  values: PagoFormValues,
): CreatePagoPayload => ({
  monto: Number(values.monto),
  ...(values.detalles.trim() ? { detalles: values.detalles.trim() } : {}),
  ...(values.fechaPago
    ? { fechaPago: dayjs(values.fechaPago).toISOString() }
    : {}),
  idCuentaDinero: values.idCuentaDinero!,
  ...(values.idCuentaOrigen ? { idCuentaOrigen: values.idCuentaOrigen } : {}),
  idMetodoPago: values.idMetodoPago!,
  idConceptoPago: values.idConceptoPago!,
  idMiembro: values.idMiembro!,
});

const buildUpdatePayload = (
  values: PagoFormValues,
): UpdatePagoPayload => ({
  monto: Number(values.monto),
  ...(values.detalles.trim() ? { detalles: values.detalles.trim() } : {}),
  ...(values.fechaPago
    ? { fechaPago: dayjs(values.fechaPago).toISOString() }
    : {}),
  idCuentaDinero: values.idCuentaDinero!,
  idCuentaOrigen: values.idCuentaOrigen ?? null,
  idMetodoPago: values.idMetodoPago!,
  idConceptoPago: values.idConceptoPago!,
  idMiembro: values.idMiembro!,
});

interface UsePagosHookResult {
  pagos: Pago[];
  selectedPago: Pago | null;
  setSelectedPago: (pago: Pago | null) => void;
  formValues: PagoFormValues;
  setFormValues: (values: PagoFormValues) => void;
  options: PagosOptionsResponse;
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
  filters: PagoFilters;
  setFilters: (filters: PagoFilters) => void;
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => Promise<void>;
  openEditDialog: () => Promise<void>;
  closeDialog: () => void;
  submitForm: (values: PagoFormValues) => Promise<void>;
  deleteSelected: () => Promise<void>;
}

export const usePagosHook = (): UsePagosHookResult => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);
  const [formValues, setFormValuesState] = useState<PagoFormValues>(
    createEmptyFormValues(),
  );
  const [options, setOptions] = useState<PagosOptionsResponse>({
    cuentas: [],
    conceptos: [],
    metodos: [],
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
  const [filters, setFiltersState] = useState<PagoFilters>(createEmptyFilters());

  const setFormValues = (values: PagoFormValues) => {
    setFormValuesState(values);
  };

  const setFilters = (nextFilters: PagoFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = useCallback(async () => {
    const response = await getPagosOptionsRequest();
    setOptions(response);
  }, []);

  const fetchPagos = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getPagosRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        filters,
      });
      setPagos(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedPago((current) => {
        if (!current) {
          return null;
        }

        return response.data.find((item) => item.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los pagos.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchPagos(1);
  }, [fetchPagos]);

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

  const openEditDialog = useCallback(async () => {
    if (!selectedPago) {
      setError('Seleccioná un pago para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [, pagoResponse] = await Promise.all([
        fetchOptions(),
        getPagoRequest(selectedPago.id),
      ]);
      setFormValuesState({
        monto: pagoResponse.monto,
        detalles: pagoResponse.detalles ?? '',
        fechaPago: dayjs(pagoResponse.fecha_pago).format('YYYY-MM-DD'),
        idCuentaDinero: pagoResponse.CuentaDinero.id,
        idCuentaOrigen: pagoResponse.CuentaOrigen?.id ?? null,
        idMetodoPago: pagoResponse.MetodoPago.id,
        idConceptoPago: pagoResponse.ConceptoPago.id,
        idMiembro: pagoResponse.Miembro.id,
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el pago.'));
    } finally {
      setDialogLoading(false);
    }
  }, [fetchOptions, selectedPago]);

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const submitForm = async (values: PagoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createPagoRequest(buildCreatePayload(values));
        setSuccessMessage('Pago creado correctamente.');
      } else if (selectedPago) {
        await updatePagoRequest(selectedPago.id, buildUpdatePayload(values));
        setSuccessMessage('Pago actualizado correctamente.');
      }

      closeDialog();
      await fetchPagos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo guardar el pago.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedPago) {
      setError('Seleccioná un pago para eliminar.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await deletePagoRequest(selectedPago.id);
      setSelectedPago(null);
      setSuccessMessage('Pago eliminado correctamente.');
      await fetchPagos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el pago.'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    pagos,
    selectedPago,
    setSelectedPago,
    formValues,
    setFormValues,
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
    refetch: fetchPagos,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
