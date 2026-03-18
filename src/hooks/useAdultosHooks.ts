'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createAdultoRequest,
  deleteAdultoRequest,
  getAdultoRequest,
  getAdultoFirmaRequest,
  getAdultosOptionsRequest,
  getAdultosRequest,
  updateAdultoFirmaRequest,
  updateAdultoRequest,
} from '@/queries/adultos';
import {
  Adulto,
  AdultoFilters,
  AdultoFormValues,
  AdultoOptionsResponse,
  CreateAdultoPayload,
  UpdateAdultoPayload,
} from '@/types/adultos';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;
const createEmptyFilters = (): AdultoFilters => ({
  q: '',
  idArea: null,
  idPosicion: null,
  idRama: null,
  esBecado: null,
  activo: null,
  includeDeleted: false,
});

type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): AdultoFormValues => ({
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
  idArea: null,
  idPosicion: null,
  idRama: null,
  fechaInicioEquipo: '',
  esBecado: false,
  activo: true,
  idRole: null,
  tipoScope: '',
  idScope: null,
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

const mapAdultoToFormValues = (adulto: Adulto): AdultoFormValues => {
  const assignment = adulto.EquipoArea[0] ?? null;
  const role = adulto.Miembro.Cuenta.CuentaRole[0] ?? null;

  return {
    user: adulto.Miembro.Cuenta.user,
    password: '',
    nombre: adulto.Miembro.nombre,
    apellidos: adulto.Miembro.apellidos,
    dni: adulto.Miembro.dni,
    fechaNacimiento: adulto.Miembro.fecha_nacimiento
      ? dayjs(adulto.Miembro.fecha_nacimiento).format('YYYY-MM-DD')
      : '',
    direccion: adulto.Miembro.direccion ?? '',
    email: adulto.Miembro.email ?? '',
    telefono: adulto.Miembro.telefono ?? '',
    telefonoEmergencia: adulto.Miembro.telefono_emergencia ?? '',
    totem: adulto.Miembro.totem ?? '',
    cualidad: adulto.Miembro.cualidad ?? '',
    idArea: assignment?.Area.id ?? null,
    idPosicion: assignment?.Posicion.id ?? null,
    idRama: assignment?.Rama?.id ?? null,
    fechaInicioEquipo: assignment?.fecha_inicio
      ? dayjs(assignment.fecha_inicio).format('YYYY-MM-DD')
      : '',
    esBecado: adulto.es_becado,
    activo: adulto.activo,
    idRole: role?.Role.id ?? null,
    tipoScope: role?.tipo_scope ?? '',
    idScope: role?.id_scope ?? null,
  };
};

const buildCreatePayload = (values: AdultoFormValues): CreateAdultoPayload => ({
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
  idArea: values.idArea!,
  idPosicion: values.idPosicion!,
  ...(values.idRama ? { idRama: values.idRama } : {}),
  ...(values.fechaInicioEquipo
    ? { fechaInicioEquipo: dayjs(values.fechaInicioEquipo).toISOString() }
    : {}),
  esBecado: values.esBecado,
  activo: values.activo,
  ...(values.idRole ? { idRole: values.idRole } : {}),
  ...(values.tipoScope ? { tipoScope: values.tipoScope } : {}),
  ...(values.idScope ? { idScope: values.idScope } : {}),
});

const buildUpdatePayload = (values: AdultoFormValues): UpdateAdultoPayload => ({
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
  ...(values.idArea ? { idArea: values.idArea } : {}),
  ...(values.idPosicion ? { idPosicion: values.idPosicion } : {}),
  ...(values.idRama ? { idRama: values.idRama } : {}),
  ...(values.fechaInicioEquipo
    ? { fechaInicioEquipo: dayjs(values.fechaInicioEquipo).toISOString() }
    : {}),
  esBecado: values.esBecado,
  activo: values.activo,
  ...(values.idRole ? { idRole: values.idRole } : {}),
  ...(values.tipoScope ? { tipoScope: values.tipoScope } : {}),
  ...(values.idScope ? { idScope: values.idScope } : {}),
});

interface UseAdultosHookResult {
  adultos: Adulto[];
  selectedAdulto: Adulto | null;
  setSelectedAdulto: (adulto: Adulto | null) => void;
  formValues: AdultoFormValues;
  setFormValues: (values: AdultoFormValues) => void;
  options: AdultoOptionsResponse;
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
  filters: AdultoFilters;
  setFilters: (filters: AdultoFilters) => void;
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => Promise<void>;
  openEditDialog: () => Promise<void>;
  getSignature: (adultoId: number) => Promise<string | null>;
  saveSignature: (
    adultoId: number,
    firmaBase64: string | null,
  ) => Promise<string | null>;
  closeDialog: () => void;
  submitForm: (values: AdultoFormValues) => Promise<void>;
  deleteSelected: () => Promise<void>;
}

export const useAdultosHook = (): UseAdultosHookResult => {
  const [adultos, setAdultos] = useState<Adulto[]>([]);
  const [selectedAdulto, setSelectedAdulto] = useState<Adulto | null>(null);
  const [formValues, setFormValuesState] = useState<AdultoFormValues>(
    createEmptyFormValues(),
  );
  const [options, setOptions] = useState<AdultoOptionsResponse>({
    areas: [],
    posiciones: [],
    ramas: [],
    roles: [],
    scopes: [],
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
  const [filters, setFiltersState] = useState<AdultoFilters>(createEmptyFilters());

  const setFormValues = (values: AdultoFormValues) => {
    setFormValuesState(values);
  };

  const setFilters = (nextFilters: AdultoFilters) => {
    setFiltersState(nextFilters);
  };

  const filteredRamas = useMemo(() => {
    if (!formValues.idArea) {
      return options.ramas;
    }

    return options.ramas.filter((rama) => rama.id_area === formValues.idArea);
  }, [options.ramas, formValues.idArea]);

  void filteredRamas;

  const fetchOptions = useCallback(async () => {
    const response = await getAdultosOptionsRequest();
    setOptions(response);
  }, []);

  const fetchAdultos = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getAdultosRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        filters,
      });
      setAdultos(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedAdulto((current) => {
        if (!current) {
          return null;
        }

        return response.data.find((adulto) => adulto.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los adultos.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchAdultos(1);
  }, [fetchAdultos]);

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
    if (!selectedAdulto) {
      setError('Seleccioná un adulto para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const [, adultoResponse] = await Promise.all([
        fetchOptions(),
        getAdultoRequest(selectedAdulto.id),
      ]);
      setFormValuesState(mapAdultoToFormValues(adultoResponse));
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el adulto seleccionado.'));
    } finally {
      setDialogLoading(false);
    }
  }, [fetchOptions, selectedAdulto]);

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValuesState(createEmptyFormValues());
  };

  const getSignature = useCallback(async (adultoId: number) => {
    const response = await getAdultoFirmaRequest(adultoId);
    return response.firmaBase64;
  }, []);

  const saveSignature = useCallback(
    async (adultoId: number, firmaBase64: string | null) => {
      const response = await updateAdultoFirmaRequest(adultoId, firmaBase64);
      await fetchAdultos(page);
      return response.firmaBase64;
    },
    [fetchAdultos, page],
  );

  const submitForm = async (values: AdultoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (dialogMode === 'create') {
        await createAdultoRequest(buildCreatePayload(values));
        setSuccessMessage('Adulto creado correctamente.');
      } else if (selectedAdulto) {
        await updateAdultoRequest(selectedAdulto.id, buildUpdatePayload(values));
        setSuccessMessage('Adulto actualizado correctamente.');
      }

      closeDialog();
      await fetchAdultos(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el adulto.'
            : 'No se pudo actualizar el adulto.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedAdulto) {
      setError('Seleccioná un adulto para eliminar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteAdultoRequest(selectedAdulto.id);
      setSelectedAdulto(null);
      setSuccessMessage('Adulto eliminado correctamente.');
      await fetchAdultos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el adulto.'));
      setLoading(false);
    }
  };

  return {
    adultos,
    selectedAdulto,
    setSelectedAdulto,
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
    refetch: fetchAdultos,
    openCreateDialog,
    openEditDialog,
    getSignature,
    saveSignature,
    closeDialog,
    submitForm,
    deleteSelected,
  };
};
