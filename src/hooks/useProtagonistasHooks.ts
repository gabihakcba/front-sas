'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  createProtagonistaRequest,
  deleteProtagonistaRequest,
  getProtagonistaRequest,
  getProtagonistasRequest,
  getRamasRequest,
  registerPaseProtagonistaRequest,
  updateProtagonistaRequest,
} from '@/queries/protagonistas';
import { PaginatedResponseMeta } from '@/types/pagination';
import {
  CreateProtagonistaPayload,
  ProtagonistaFilters,
  Protagonista,
  ProtagonistaFormValues,
  ProtagonistaPasePayload,
  ProtagonistaPaseValues,
  RamaOption,
  UpdateProtagonistaPayload,
} from '@/types/protagonistas';

const DEFAULT_LIMIT = 10;
const createEmptyFilters = (): ProtagonistaFilters => ({
  q: '',
  idRama: null,
  esBecado: null,
  activo: null,
  includeDeleted: false,
});

const createEmptyFormValues = (): ProtagonistaFormValues => ({
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
  idRama: null,
  fechaIngresoRama: '',
  esBecado: false,
  activo: true,
});

const createEmptyPaseValues = (): ProtagonistaPaseValues => ({
  idRama: null,
  fechaIngresoRama: '',
});

type DialogMode = 'create' | 'edit';

interface UseProtagonistasHookResult {
  protagonistas: Protagonista[];
  ramas: RamaOption[];
  selectedProtagonista: Protagonista | null;
  setSelectedProtagonista: (protagonista: Protagonista | null) => void;
  formValues: ProtagonistaFormValues;
  setFormValues: (updater: ProtagonistaFormValues) => void;
  paseValues: ProtagonistaPaseValues;
  setPaseValues: (values: ProtagonistaPaseValues) => void;
  dialogMode: DialogMode;
  dialogVisible: boolean;
  paseDialogVisible: boolean;
  error: string;
  successMessage: string;
  loading: boolean;
  dialogLoading: boolean;
  submitting: boolean;
  page: number;
  total: number;
  limit: number;
  filters: ProtagonistaFilters;
  setFilters: (filters: ProtagonistaFilters) => void;
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => Promise<void>;
  openEditDialog: () => Promise<void>;
  openPaseDialog: () => Promise<void>;
  closeDialog: () => void;
  closePaseDialog: () => void;
  submitForm: (values: ProtagonistaFormValues) => Promise<void>;
  submitPase: () => Promise<void>;
  deleteSelected: () => Promise<void>;
}

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

const mapProtagonistaToFormValues = (
  protagonista: Protagonista,
): ProtagonistaFormValues => {
  const ramaActual = protagonista.Miembro.MiembroRama[0] ?? null;

  return {
    user: protagonista.Miembro.Cuenta?.user ?? '',
    password: '',
    nombre: protagonista.Miembro.nombre,
    apellidos: protagonista.Miembro.apellidos,
    dni: protagonista.Miembro.dni,
    fechaNacimiento: protagonista.Miembro.fecha_nacimiento
      ? dayjs(protagonista.Miembro.fecha_nacimiento).format('YYYY-MM-DD')
      : '',
    direccion: protagonista.Miembro.direccion ?? '',
    email: protagonista.Miembro.email ?? '',
    telefono: protagonista.Miembro.telefono ?? '',
    telefonoEmergencia: protagonista.Miembro.telefono_emergencia ?? '',
    totem: protagonista.Miembro.totem ?? '',
    cualidad: protagonista.Miembro.cualidad ?? '',
    idRama: ramaActual?.Rama.id ?? null,
    fechaIngresoRama: ramaActual?.fecha_ingreso
      ? dayjs(ramaActual.fecha_ingreso).format('YYYY-MM-DD')
      : '',
    esBecado: protagonista.es_becado,
    activo: protagonista.activo,
  };
};

const buildCreatePayload = (
  values: ProtagonistaFormValues,
): CreateProtagonistaPayload => ({
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
  idRama: values.idRama!,
  ...(values.fechaIngresoRama
    ? { fechaIngresoRama: dayjs(values.fechaIngresoRama).toISOString() }
    : {}),
  esBecado: values.esBecado,
  activo: values.activo,
});

const buildUpdatePayload = (
  values: ProtagonistaFormValues,
): UpdateProtagonistaPayload => ({
  user: values.user.trim(),
  ...(values.password.trim() ? { password: values.password } : {}),
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
  ...(values.idRama ? { idRama: values.idRama } : {}),
  ...(values.fechaIngresoRama
    ? { fechaIngresoRama: dayjs(values.fechaIngresoRama).toISOString() }
    : {}),
  esBecado: values.esBecado,
  activo: values.activo,
});

const buildPasePayload = (
  values: ProtagonistaPaseValues,
): ProtagonistaPasePayload => ({
  idRama: values.idRama!,
  ...(values.fechaIngresoRama
    ? { fechaIngresoRama: dayjs(values.fechaIngresoRama).toISOString() }
    : {}),
});

export const useProtagonistasHook = (): UseProtagonistasHookResult => {
  const [protagonistas, setProtagonistas] = useState<Protagonista[]>([]);
  const [ramas, setRamas] = useState<RamaOption[]>([]);
  const [selectedProtagonista, setSelectedProtagonista] =
    useState<Protagonista | null>(null);
  const [formValues, setFormValuesState] = useState<ProtagonistaFormValues>(
    createEmptyFormValues(),
  );
  const [paseValues, setPaseValuesState] = useState<ProtagonistaPaseValues>(
    createEmptyPaseValues(),
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [paseDialogVisible, setPaseDialogVisible] = useState(false);
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
  const [filters, setFiltersState] = useState<ProtagonistaFilters>(
    createEmptyFilters(),
  );

  const setFormValues = (updater: ProtagonistaFormValues) => {
    setFormValuesState(updater);
  };

  const setPaseValues = (values: ProtagonistaPaseValues) => {
    setPaseValuesState(values);
  };

  const setFilters = (nextFilters: ProtagonistaFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchRamas = async () => {
    const response = await getRamasRequest();
    setRamas(response);
  };

  const fetchProtagonistas = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getProtagonistasRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        filters,
      });
      setProtagonistas(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedProtagonista((currentSelection) => {
        if (!currentSelection) {
          return null;
        }

        return (
          response.data.find(
            (protagonista) => protagonista.id === currentSelection.id,
          ) ?? null
        );
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los protagonistas.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchRamas();
  }, []);

  useEffect(() => {
    void fetchProtagonistas(1);
  }, [fetchProtagonistas]);

  const openCreateDialog = async () => {
    setDialogMode('create');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await fetchRamas();
      setFormValuesState(createEmptyFormValues());
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las ramas.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openEditDialog = async () => {
    if (!selectedProtagonista) {
      setError('Seleccioná un protagonista para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [ramasResponse, protagonistaResponse] = await Promise.all([
        getRamasRequest(),
        getProtagonistaRequest(selectedProtagonista.id),
      ]);
      setRamas(ramasResponse);
      setFormValuesState(mapProtagonistaToFormValues(protagonistaResponse));
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, 'No se pudo cargar el protagonista seleccionado.'),
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const openPaseDialog = async () => {
    if (!selectedProtagonista) {
      setError('Seleccioná un protagonista para registrar el pase.');
      return;
    }

    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await fetchRamas();
      setPaseValuesState({
        idRama: null,
        fechaIngresoRama: '',
      });
      setPaseDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar las ramas.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const closePaseDialog = () => {
    setPaseDialogVisible(false);
    setPaseValuesState(createEmptyPaseValues());
  };

  const submitForm = async (values: ProtagonistaFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createProtagonistaRequest(buildCreatePayload(values));
        setSuccessMessage('Protagonista creado correctamente.');
      } else if (selectedProtagonista) {
        await updateProtagonistaRequest(
          selectedProtagonista.id,
          buildUpdatePayload(values),
        );
        setSuccessMessage('Protagonista actualizado correctamente.');
      }

      closeDialog();
      await fetchProtagonistas(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el protagonista.'
            : 'No se pudo actualizar el protagonista.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitPase = async () => {
    if (!selectedProtagonista) {
      setError('Seleccioná un protagonista para registrar el pase.');
      return;
    }

    if (!paseValues.idRama) {
      setError('Debes seleccionar una rama para registrar el pase.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await registerPaseProtagonistaRequest(
        selectedProtagonista.id,
        buildPasePayload(paseValues),
      );
      closePaseDialog();
      setSuccessMessage('Pase registrado correctamente.');
      await fetchProtagonistas(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo registrar el pase.'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedProtagonista) {
      setError('Seleccioná un protagonista para eliminar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteProtagonistaRequest(selectedProtagonista.id);
      setSelectedProtagonista(null);
      setSuccessMessage('Protagonista eliminado correctamente.');
      await fetchProtagonistas(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el protagonista.'));
      setLoading(false);
    }
  };

  return {
    protagonistas,
    ramas,
    selectedProtagonista,
    setSelectedProtagonista,
    formValues,
    setFormValues,
    paseValues,
    setPaseValues,
    dialogMode,
    dialogVisible,
    paseDialogVisible,
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
    refetch: fetchProtagonistas,
    openCreateDialog,
    openEditDialog,
    openPaseDialog,
    closeDialog,
    closePaseDialog,
    submitForm,
    submitPase,
    deleteSelected,
  };
};
