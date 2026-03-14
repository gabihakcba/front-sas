'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createResponsableRequest,
  deleteResponsableRequest,
  getResponsableRequest,
  getResponsablesOptionsRequest,
  getResponsablesRequest,
  updateResponsabilidadesRequest,
  updateResponsableRequest,
} from '@/queries/responsables';
import {
  CreateResponsablePayload,
  PaginatedResponsablesResponse,
  Responsable,
  ResponsableFilters,
  ResponsableFormValues,
  ResponsableOptionsResponse,
  UpdateResponsablePayload,
} from '@/types/responsables';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

const createEmptyFilters = (): ResponsableFilters => ({
  q: '',
});

const createEmptyFormValues = (): ResponsableFormValues => ({
  user: '',
  password: '',
  nombre: '',
  apellidos: '',
  dni: '',
  fechaNacimiento: '',
  direccion: '',
  email: '',
  telefono: '',
  telefonoEmergencia: '',
  totem: '',
  cualidad: '',
});

type DialogMode = 'create' | 'edit';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(' ');
    }
  }

  return fallback;
};

const mapResponsableToFormValues = (
  responsable: Responsable,
): ResponsableFormValues => ({
  user: responsable.Miembro.Cuenta.user,
  password: '',
  nombre: responsable.Miembro.nombre,
  apellidos: responsable.Miembro.apellidos,
  dni: responsable.Miembro.dni,
  fechaNacimiento: responsable.Miembro.fecha_nacimiento
    ? dayjs(responsable.Miembro.fecha_nacimiento).format('YYYY-MM-DD')
    : '',
  direccion: responsable.Miembro.direccion ?? '',
  email: responsable.Miembro.email ?? '',
  telefono: responsable.Miembro.telefono ?? '',
  telefonoEmergencia: responsable.Miembro.telefono_emergencia ?? '',
  totem: responsable.Miembro.totem ?? '',
  cualidad: responsable.Miembro.cualidad ?? '',
});

const buildCreatePayload = (
  values: ResponsableFormValues,
): CreateResponsablePayload => ({
  user: values.user.trim(),
  password: values.password,
  nombre: values.nombre.trim(),
  apellidos: values.apellidos.trim(),
  dni: values.dni.trim(),
  fechaNacimiento: dayjs(values.fechaNacimiento).toISOString(),
  direccion: values.direccion.trim(),
  ...(values.email.trim() ? { email: values.email.trim() } : {}),
  ...(values.telefono.trim() ? { telefono: values.telefono.trim() } : {}),
  telefonoEmergencia: values.telefonoEmergencia.trim(),
  ...(values.totem.trim() ? { totem: values.totem.trim() } : {}),
  ...(values.cualidad.trim() ? { cualidad: values.cualidad.trim() } : {}),
});

const buildUpdatePayload = (
  values: ResponsableFormValues,
): UpdateResponsablePayload => ({
  user: values.user.trim(),
  ...(values.password.trim() ? { password: values.password } : {}),
  nombre: values.nombre.trim(),
  apellidos: values.apellidos.trim(),
  dni: values.dni.trim(),
  fechaNacimiento: dayjs(values.fechaNacimiento).toISOString(),
  direccion: values.direccion.trim(),
  email: values.email.trim(),
  telefono: values.telefono.trim(),
  telefonoEmergencia: values.telefonoEmergencia.trim(),
  totem: values.totem.trim(),
  cualidad: values.cualidad.trim(),
});

interface UseResponsablesHookResult {
  responsables: Responsable[];
  selectedResponsable: Responsable | null;
  setSelectedResponsable: (value: Responsable | null) => void;
  formValues: ResponsableFormValues;
  options: ResponsableOptionsResponse;
  dialogMode: DialogMode;
  dialogVisible: boolean;
  assignmentDialogVisible: boolean;
  assignmentValues: number[];
  error: string;
  successMessage: string;
  loading: boolean;
  dialogLoading: boolean;
  submitting: boolean;
  assignmentSubmitting: boolean;
  page: number;
  total: number;
  limit: number;
  filters: ResponsableFilters;
  setFilters: (filters: ResponsableFilters) => void;
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => Promise<void>;
  openEditDialog: () => Promise<void>;
  openAssignmentDialog: () => Promise<void>;
  closeDialog: () => void;
  closeAssignmentDialog: () => void;
  setAssignmentValues: (value: number[]) => void;
  submitForm: (values: ResponsableFormValues) => Promise<void>;
  submitAssignments: () => Promise<void>;
  deleteSelected: () => Promise<void>;
}

export const useResponsablesHook = (): UseResponsablesHookResult => {
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [selectedResponsable, setSelectedResponsable] = useState<Responsable | null>(
    null,
  );
  const [formValues, setFormValues] = useState<ResponsableFormValues>(
    createEmptyFormValues(),
  );
  const [options, setOptions] = useState<ResponsableOptionsResponse>({
    protagonistas: [],
  });
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [assignmentDialogVisible, setAssignmentDialogVisible] = useState(false);
  const [assignmentValues, setAssignmentValues] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFiltersState] = useState<ResponsableFilters>(
    createEmptyFilters(),
  );

  const setFilters = (nextFilters: ResponsableFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchOptions = useCallback(async () => {
    const response = await getResponsablesOptionsRequest();
    setOptions(response);
  }, []);

  const fetchResponsables = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError('');

      try {
        const response: PaginatedResponsablesResponse = await getResponsablesRequest({
          page: nextPage,
          limit: DEFAULT_LIMIT,
          filters,
        });
        setResponsables(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setSelectedResponsable((current) => {
          if (!current) {
            return null;
          }

          return response.data.find((item) => item.id === current.id) ?? null;
        });
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo cargar el listado.'));
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchResponsables(1);
  }, [fetchResponsables]);

  const refetch = useCallback(
    async (nextPage = page) => {
      await fetchResponsables(nextPage);
    },
    [fetchResponsables, page],
  );

  const openCreateDialog = useCallback(async () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setDialogLoading(false);
    setFormValues(createEmptyFormValues());
    setDialogVisible(true);
  }, []);

  const openEditDialog = useCallback(async () => {
    if (!selectedResponsable) {
      return;
    }

    setDialogMode('edit');
    setDialogVisible(true);
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await getResponsableRequest(selectedResponsable.id);
      setFormValues(mapResponsableToFormValues(response));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el responsable.'));
    } finally {
      setDialogLoading(false);
    }
  }, [selectedResponsable]);

  const openAssignmentDialog = useCallback(async () => {
    if (!selectedResponsable) {
      return;
    }

    setAssignmentDialogVisible(true);
    setAssignmentSubmitting(false);
    setError('');
    setSuccessMessage('');

    try {
      const response = await getResponsableRequest(selectedResponsable.id);
      setAssignmentValues(
        response.Responsabilidad.map((item) => item.Protagonista.id),
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar las responsabilidades.'));
    }
  }, [selectedResponsable]);

  const closeDialog = () => {
    setDialogVisible(false);
    setDialogLoading(false);
    setSubmitting(false);
    setError('');
    setFormValues(createEmptyFormValues());
  };

  const closeAssignmentDialog = () => {
    setAssignmentDialogVisible(false);
    setAssignmentSubmitting(false);
    setError('');
    setAssignmentValues([]);
  };

  const submitForm = useCallback(
    async (values: ResponsableFormValues) => {
      setSubmitting(true);
      setError('');

      try {
        if (dialogMode === 'create') {
          await createResponsableRequest(buildCreatePayload(values));
          setSuccessMessage('Responsable creado correctamente.');
        } else if (selectedResponsable) {
          await updateResponsableRequest(
            selectedResponsable.id,
            buildUpdatePayload(values),
          );
          setSuccessMessage('Responsable actualizado correctamente.');
        }

        closeDialog();
        await fetchResponsables(dialogMode === 'create' ? 1 : page);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudo guardar el responsable.'));
      } finally {
        setSubmitting(false);
      }
    },
    [dialogMode, fetchResponsables, page, selectedResponsable],
  );

  const submitAssignments = useCallback(async () => {
    if (!selectedResponsable) {
      return;
    }

    setAssignmentSubmitting(true);
    setError('');

    try {
      await updateResponsabilidadesRequest(selectedResponsable.id, assignmentValues);
      setSuccessMessage('Responsabilidades actualizadas correctamente.');
      closeAssignmentDialog();
      await fetchResponsables(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, 'No se pudieron actualizar las responsabilidades.'),
      );
    } finally {
      setAssignmentSubmitting(false);
    }
  }, [assignmentValues, fetchResponsables, page, selectedResponsable]);

  const deleteSelected = useCallback(async () => {
    if (!selectedResponsable) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteResponsableRequest(selectedResponsable.id);
      setSuccessMessage('Responsable eliminado correctamente.');
      setSelectedResponsable(null);
      await fetchResponsables(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el responsable.'));
      setLoading(false);
    }
  }, [fetchResponsables, page, selectedResponsable]);

  return {
    responsables,
    selectedResponsable,
    setSelectedResponsable,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    assignmentDialogVisible,
    assignmentValues,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    assignmentSubmitting,
    page,
    total: meta.total,
    limit: meta.limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    openEditDialog,
    openAssignmentDialog,
    closeDialog,
    closeAssignmentDialog,
    setAssignmentValues,
    submitForm,
    submitAssignments,
    deleteSelected,
  };
};
