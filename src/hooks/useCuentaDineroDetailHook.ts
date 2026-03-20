'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  addMovimientoCuentaAdjuntosRequest,
  createMovimientoCuentaRequest,
  deleteMovimientoCuentaAdjuntoRequest,
  deleteMovimientoCuentaRequest,
  getCuentaDineroRequest,
  getCuentaMovimientosOptionsRequest,
  getCuentaMovimientosRequest,
} from '@/queries/cuentas-dinero';
import {
  CuentaDinero,
  CreateMovimientoCuentaPayload,
  MovimientoCuenta,
  MovimientoCuentaAdjuntosFormValues,
  MovimientoCuentaFilters,
  MovimientoCuentaFormValues,
  MovimientosCuentaOptionsResponse,
} from '@/types/cuentas-dinero';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

const createEmptyFilters = (): MovimientoCuentaFilters => ({
  q: '',
  idMetodoPago: null,
  tipo: null,
  includeDeleted: false,
});

const createEmptyFormValues = (): MovimientoCuentaFormValues => ({
  monto: null,
  detalles: '',
  fechaMovimiento: dayjs().format('YYYY-MM-DD'),
  idMetodoPago: null,
  adjuntos: [],
});

const createEmptyAdjuntosValues = (): MovimientoCuentaAdjuntosFormValues => ({
  adjuntos: [],
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
  values: MovimientoCuentaFormValues,
): CreateMovimientoCuentaPayload => ({
  monto: values.monto!,
  ...(values.detalles.trim() ? { detalles: values.detalles.trim() } : {}),
  ...(values.fechaMovimiento
    ? { fechaMovimiento: dayjs(values.fechaMovimiento).toISOString() }
    : {}),
  idMetodoPago: values.idMetodoPago!,
  ...(values.adjuntos.length ? { adjuntos: values.adjuntos } : {}),
});

export const useCuentaDineroDetailHook = (id: number) => {
  const [cuenta, setCuenta] = useState<CuentaDinero | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoCuenta[]>([]);
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientoCuenta | null>(null);
  const [options, setOptions] = useState<MovimientosCuentaOptionsResponse>({
    responsableActual: null,
    metodos: [],
    tipos: ['INGRESO', 'EGRESO'],
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [adjuntosDialogVisible, setAdjuntosDialogVisible] = useState(false);
  const [formValues, setFormValues] = useState<MovimientoCuentaFormValues>(
    createEmptyFormValues(),
  );
  const [adjuntosFormValues, setAdjuntosFormValues] =
    useState<MovimientoCuentaAdjuntosFormValues>(createEmptyAdjuntosValues());
  const [filters, setFilters] = useState<MovimientoCuentaFilters>(
    createEmptyFilters(),
  );
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

  const fetchCuenta = useCallback(async () => {
    const response = await getCuentaDineroRequest(id);
    setCuenta(response);
  }, [id]);

  const fetchOptions = useCallback(async () => {
    const response = await getCuentaMovimientosOptionsRequest(id);
    setOptions(response);
  }, [id]);

  const fetchMovimientos = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError('');

      try {
        const [cuentaResponse, movimientosResponse] = await Promise.all([
          getCuentaDineroRequest(id),
          getCuentaMovimientosRequest(id, {
            page: nextPage,
            limit: DEFAULT_LIMIT,
            filters,
          }),
        ]);

        setCuenta(cuentaResponse);
        setMovimientos(movimientosResponse.data);
        setMeta(movimientosResponse.meta);
        setPage(movimientosResponse.meta.page);
        setSelectedMovimiento((current) => {
          if (!current) {
            return null;
          }
          return (
            movimientosResponse.data.find((item) => item.id === current.id) ?? null
          );
        });
      } catch (err: unknown) {
        setError(
          getErrorMessage(
            err,
            'No se pudo cargar el detalle de la cuenta de dinero.',
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, id],
  );

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchMovimientos(1);
  }, [fetchMovimientos]);

  const openCreateDialog = useCallback(async () => {
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await fetchOptions();
      setFormValues(createEmptyFormValues());
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las opciones.'));
    } finally {
      setDialogLoading(false);
    }
  }, [fetchOptions]);

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValues(createEmptyFormValues());
  };

  const openAdjuntosDialog = () => {
    setAdjuntosFormValues(createEmptyAdjuntosValues());
    setAdjuntosDialogVisible(true);
  };

  const closeAdjuntosDialog = () => {
    setAdjuntosDialogVisible(false);
    setAdjuntosFormValues(createEmptyAdjuntosValues());
  };

  const submitForm = async (values: MovimientoCuentaFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await createMovimientoCuentaRequest(id, buildCreatePayload(values));
      setSuccessMessage('Movimiento registrado correctamente.');
      closeDialog();
      await fetchMovimientos(1);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo registrar el movimiento.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedMovimiento) {
      setError('Seleccioná un movimiento para eliminar.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteMovimientoCuentaRequest(id, selectedMovimiento.id);
      setSelectedMovimiento(null);
      setSuccessMessage('Movimiento eliminado correctamente.');
      await fetchMovimientos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el movimiento.'));
    } finally {
      setSubmitting(false);
    }
  };

  const submitAdjuntos = async () => {
    if (!selectedMovimiento) {
      setError('Seleccioná un movimiento para adjuntar archivos.');
      return;
    }

    if (!adjuntosFormValues.adjuntos.length) {
      setError('Seleccioná al menos un archivo para adjuntar.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await addMovimientoCuentaAdjuntosRequest(
        id,
        selectedMovimiento.id,
        adjuntosFormValues.adjuntos,
      );
      setSuccessMessage('Adjuntos agregados correctamente.');
      closeAdjuntosDialog();
      await fetchMovimientos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron agregar los adjuntos.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAdjunto = async (adjuntoId: number) => {
    if (!selectedMovimiento) {
      setError('Seleccioná un movimiento para eliminar el adjunto.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteMovimientoCuentaAdjuntoRequest(
        id,
        selectedMovimiento.id,
        adjuntoId,
      );
      setSuccessMessage('Adjunto eliminado correctamente.');
      await fetchMovimientos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el adjunto.'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    cuenta,
    movimientos,
    selectedMovimiento,
    setSelectedMovimiento,
    options,
    dialogVisible,
    adjuntosDialogVisible,
    formValues,
    setFormValues,
    adjuntosFormValues,
    setAdjuntosFormValues,
    filters,
    setFilters,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total: meta.total,
    limit: meta.limit,
    refetch: fetchMovimientos,
    refreshCuenta: fetchCuenta,
    openCreateDialog,
    closeDialog,
    openAdjuntosDialog,
    closeAdjuntosDialog,
    submitForm,
    submitAdjuntos,
    deleteAdjunto,
    deleteSelected,
  };
};
