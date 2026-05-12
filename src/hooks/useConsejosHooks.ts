'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  assignConsejoRepresentanteJuvenilRequest,
  createConsejoRequest,
  createConsejoTemarioRequest,
  deleteConsejoRequest,
  deleteConsejoTemarioRequest,
  getConsejoRepresentantesJuvenilesOptionsRequest,
  getConsejoRepresentantesJuvenilesRequest,
  getConsejoRequest,
  getConsejoTemarioRequest,
  getConsejosRequest,
  removeConsejoRepresentanteJuvenilRequest,
  updateConsejoTemarioRequest,
  updateConsejoRequest,
} from '@/queries/consejos';
import {
  Consejo,
  ConsejosFilters,
  ConsejoFormValues,
  ConsejoRepresentanteJuvenilItem,
  ConsejoTemarioFormValues,
  ConsejoTemarioItem,
  CreateConsejoTemarioPayload,
  CreateConsejoPayload,
} from '@/types/consejos';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

type DialogMode = 'create' | 'edit';

const createEmptyFormValues = (): ConsejoFormValues => ({
  nombre: '',
  descripcion: '',
  fecha: dayjs().format('YYYY-MM-DD'),
  horaInicio: '',
  horaFin: '',
  esOrdinario: true,
});

const createEmptyTemarioFormValues = (): ConsejoTemarioFormValues => ({
  titulo: '',
  descripcion: '',
  debate: '',
  acuerdo: '',
  sinMp: false,
  estado: 'PENDIENTE',
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

const buildPayload = (values: ConsejoFormValues): CreateConsejoPayload => ({
  nombre: values.nombre.trim(),
  ...(values.descripcion.trim()
    ? { descripcion: values.descripcion.trim() }
    : {}),
  fecha: dayjs(values.fecha).toISOString(),
  ...(values.horaInicio
    ? { horaInicio: dayjs(`${values.fecha}T${values.horaInicio}`).toISOString() }
    : {}),
  ...(values.horaFin
    ? { horaFin: dayjs(`${values.fecha}T${values.horaFin}`).toISOString() }
    : {}),
  esOrdinario: values.esOrdinario,
});

interface UseConsejosHookResult {
  consejos: Consejo[];
  selectedConsejo: Consejo | null;
  setSelectedConsejo: (consejo: Consejo | null) => void;
  formValues: ConsejoFormValues;
  temario: ConsejoTemarioItem[];
  selectedTemario: ConsejoTemarioItem | null;
  setSelectedTemario: (temario: ConsejoTemarioItem | null) => void;
  temarioFormValues: ConsejoTemarioFormValues;
  dialogMode: DialogMode;
  dialogVisible: boolean;
  temarioDialogMode: DialogMode;
  temarioDialogVisible: boolean;
  temarioFormVisible: boolean;
  error: string;
  temarioError: string;
  successMessage: string;
  temarioSuccessMessage: string;
  representantesJuveniles: ConsejoRepresentanteJuvenilItem[];
  representantesJuvenilesOptions: ConsejoRepresentanteJuvenilItem[];
  representantesJuvenilesVisible: boolean;
  representantesJuvenilesLoading: boolean;
  representantesJuvenilesSearching: boolean;
  representantesJuvenilesSubmitting: boolean;
  representantesJuvenilesError: string;
  representantesJuvenilesSuccessMessage: string;
  loading: boolean;
  dialogLoading: boolean;
  temarioLoading: boolean;
  temarioSubmitting: boolean;
  submitting: boolean;
  page: number;
  total: number;
  limit: number;
  filters: ConsejosFilters;
  setFilters: (filters: ConsejosFilters) => void;
  refetch: (nextPage?: number) => Promise<void>;
  openCreateDialog: () => void;
  openEditDialog: () => Promise<void>;
  openTemarioDialog: () => Promise<void>;
  openCreateTemarioDialog: () => void;
  openEditTemarioDialog: () => void;
  openRepresentantesJuvenilesDialog: () => Promise<void>;
  closeDialog: () => void;
  closeTemarioDialog: () => void;
  closeTemarioFormDialog: () => void;
  closeRepresentantesJuvenilesDialog: () => void;
  searchRepresentantesJuvenilesOptions: (value: string) => Promise<void>;
  assignRepresentanteJuvenil: (memberId: number) => Promise<void>;
  removeRepresentanteJuvenil: (memberId: number) => Promise<void>;
  submitForm: (values: ConsejoFormValues) => Promise<void>;
  submitTemarioForm: (values: ConsejoTemarioFormValues) => Promise<void>;
  deleteSelected: () => Promise<void>;
  deleteSelectedTemario: () => Promise<void>;
}

export const useConsejosHook = (): UseConsejosHookResult => {
  const [consejos, setConsejos] = useState<Consejo[]>([]);
  const [selectedConsejo, setSelectedConsejo] = useState<Consejo | null>(null);
  const [formValues, setFormValues] = useState<ConsejoFormValues>(
    createEmptyFormValues(),
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [temario, setTemario] = useState<ConsejoTemarioItem[]>([]);
  const [selectedTemario, setSelectedTemario] =
    useState<ConsejoTemarioItem | null>(null);
  const [temarioFormValues, setTemarioFormValues] =
    useState<ConsejoTemarioFormValues>(createEmptyTemarioFormValues());
  const [temarioDialogMode, setTemarioDialogMode] =
    useState<DialogMode>('create');
  const [temarioDialogVisible, setTemarioDialogVisible] = useState(false);
  const [temarioFormVisible, setTemarioFormVisible] = useState(false);
  const [representantesJuveniles, setRepresentantesJuveniles] = useState<
    ConsejoRepresentanteJuvenilItem[]
  >([]);
  const [
    representantesJuvenilesOptions,
    setRepresentantesJuvenilesOptions,
  ] = useState<ConsejoRepresentanteJuvenilItem[]>([]);
  const [representantesJuvenilesVisible, setRepresentantesJuvenilesVisible] =
    useState(false);
  const [representantesJuvenilesLoading, setRepresentantesJuvenilesLoading] =
    useState(false);
  const [
    representantesJuvenilesSearching,
    setRepresentantesJuvenilesSearching,
  ] = useState(false);
  const [
    representantesJuvenilesSubmitting,
    setRepresentantesJuvenilesSubmitting,
  ] = useState(false);
  const [
    representantesJuvenilesError,
    setRepresentantesJuvenilesError,
  ] = useState('');
  const [
    representantesJuvenilesSuccessMessage,
    setRepresentantesJuvenilesSuccessMessage,
  ] = useState('');
  const [error, setError] = useState('');
  const [temarioError, setTemarioError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [temarioSuccessMessage, setTemarioSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [temarioLoading, setTemarioLoading] = useState(false);
  const [temarioSubmitting, setTemarioSubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFiltersState] = useState<ConsejosFilters>({
    includeDeleted: false,
  });
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const setFilters = (nextFilters: ConsejosFilters) => {
    setFiltersState(nextFilters);
  };

  const fetchConsejos = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await getConsejosRequest({
        page: nextPage,
        limit: DEFAULT_LIMIT,
        includeDeleted: filters.includeDeleted,
      });

      setConsejos(response.data);
      setMeta(response.meta);
      setPage(response.meta.page);
      setSelectedConsejo((current) => {
        if (!current) {
          return null;
        }

        return response.data.find((item) => item.id === current.id) ?? null;
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron obtener los consejos.'));
    } finally {
      setLoading(false);
    }
  }, [filters.includeDeleted]);

  useEffect(() => {
    void fetchConsejos();
  }, [fetchConsejos]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setError('');
    setSuccessMessage('');
    setFormValues(createEmptyFormValues());
    setDialogVisible(true);
  };

  const openEditDialog = async () => {
    if (!selectedConsejo) {
      setError('Seleccioná un consejo para editar.');
      return;
    }

    setDialogMode('edit');
    setDialogLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const consejo = await getConsejoRequest(selectedConsejo.id);
      setFormValues({
        nombre: consejo.nombre,
        descripcion: consejo.descripcion ?? '',
        fecha: dayjs(consejo.fecha).format('YYYY-MM-DD'),
        horaInicio: consejo.hora_inicio
          ? dayjs(consejo.hora_inicio).format('HH:mm')
          : '',
        horaFin: consejo.hora_fin ? dayjs(consejo.hora_fin).format('HH:mm') : '',
        esOrdinario: consejo.es_ordinario,
      });
      setDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el consejo.'));
    } finally {
      setDialogLoading(false);
    }
  };

  const openTemarioDialog = async () => {
    if (!selectedConsejo) {
      setError('Seleccioná un consejo para administrar su temario.');
      return;
    }

    setTemarioLoading(true);
    setTemarioError('');
    setTemarioSuccessMessage('');
    setSelectedTemario(null);

    try {
      const items = await getConsejoTemarioRequest(selectedConsejo.id);
      setTemario(items);
      setTemarioDialogVisible(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el temario.'));
    } finally {
      setTemarioLoading(false);
    }
  };

  const openCreateTemarioDialog = () => {
    setTemarioDialogMode('create');
    setTemarioError('');
    setTemarioSuccessMessage('');
    setTemarioFormValues(createEmptyTemarioFormValues());
    setTemarioFormVisible(true);
  };

  const openRepresentantesJuvenilesDialog = async () => {
    setRepresentantesJuvenilesVisible(true);
    setRepresentantesJuvenilesLoading(true);
    setRepresentantesJuvenilesError('');
    setRepresentantesJuvenilesSuccessMessage('');

    try {
      const [assigned, options] = await Promise.all([
        getConsejoRepresentantesJuvenilesRequest(),
        getConsejoRepresentantesJuvenilesOptionsRequest(),
      ]);
      setRepresentantesJuveniles(assigned);
      setRepresentantesJuvenilesOptions(options);
    } catch (err: unknown) {
      setRepresentantesJuvenilesError(
        getErrorMessage(
          err,
          'No se pudieron cargar los representantes juveniles.',
        ),
      );
    } finally {
      setRepresentantesJuvenilesLoading(false);
    }
  };

  const openEditTemarioDialog = () => {
    if (!selectedTemario) {
      setTemarioError('Seleccioná un tema para editar.');
      return;
    }

    setTemarioDialogMode('edit');
    setTemarioError('');
    setTemarioSuccessMessage('');
    setTemarioFormValues({
      titulo: selectedTemario.titulo,
      descripcion: selectedTemario.descripcion ?? '',
      debate: selectedTemario.debate ?? '',
      acuerdo: selectedTemario.acuerdo ?? '',
      sinMp: selectedTemario.sin_mp,
      estado: selectedTemario.estado,
    });
    setTemarioFormVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormValues(createEmptyFormValues());
  };

  const closeTemarioDialog = () => {
    setTemarioDialogVisible(false);
    setTemario([]);
    setSelectedTemario(null);
    setTemarioError('');
    setTemarioSuccessMessage('');
  };

  const closeTemarioFormDialog = () => {
    setTemarioFormVisible(false);
    setTemarioFormValues(createEmptyTemarioFormValues());
  };

  const closeRepresentantesJuvenilesDialog = () => {
    setRepresentantesJuvenilesVisible(false);
    setRepresentantesJuveniles([]);
    setRepresentantesJuvenilesOptions([]);
    setRepresentantesJuvenilesError('');
    setRepresentantesJuvenilesSuccessMessage('');
  };

  const searchRepresentantesJuvenilesOptions = async (value: string) => {
    setRepresentantesJuvenilesSearching(true);

    try {
      const options = await getConsejoRepresentantesJuvenilesOptionsRequest(value);
      setRepresentantesJuvenilesOptions(options);
    } catch (err: unknown) {
      setRepresentantesJuvenilesError(
        getErrorMessage(
          err,
          'No se pudieron buscar representantes juveniles.',
        ),
      );
    } finally {
      setRepresentantesJuvenilesSearching(false);
    }
  };

  const assignRepresentanteJuvenil = async (memberId: number) => {
    setRepresentantesJuvenilesSubmitting(true);
    setRepresentantesJuvenilesError('');
    setRepresentantesJuvenilesSuccessMessage('');

    try {
      await assignConsejoRepresentanteJuvenilRequest(memberId);
      const [assigned, options] = await Promise.all([
        getConsejoRepresentantesJuvenilesRequest(),
        getConsejoRepresentantesJuvenilesOptionsRequest(),
      ]);
      setRepresentantesJuveniles(assigned);
      setRepresentantesJuvenilesOptions(options);
      setRepresentantesJuvenilesSuccessMessage(
        'Representante juvenil asignado correctamente.',
      );
    } catch (err: unknown) {
      setRepresentantesJuvenilesError(
        getErrorMessage(
          err,
          'No se pudo asignar el representante juvenil.',
        ),
      );
    } finally {
      setRepresentantesJuvenilesSubmitting(false);
    }
  };

  const removeRepresentanteJuvenil = async (memberId: number) => {
    setRepresentantesJuvenilesSubmitting(true);
    setRepresentantesJuvenilesError('');
    setRepresentantesJuvenilesSuccessMessage('');

    try {
      await removeConsejoRepresentanteJuvenilRequest(memberId);
      const [assigned, options] = await Promise.all([
        getConsejoRepresentantesJuvenilesRequest(),
        getConsejoRepresentantesJuvenilesOptionsRequest(),
      ]);
      setRepresentantesJuveniles(assigned);
      setRepresentantesJuvenilesOptions(options);
      setRepresentantesJuvenilesSuccessMessage(
        'Representante juvenil removido correctamente.',
      );
    } catch (err: unknown) {
      setRepresentantesJuvenilesError(
        getErrorMessage(
          err,
          'No se pudo remover el representante juvenil.',
        ),
      );
    } finally {
      setRepresentantesJuvenilesSubmitting(false);
    }
  };

  const submitForm = async (values: ConsejoFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = buildPayload(values);

      if (dialogMode === 'create') {
        await createConsejoRequest(payload);
        setSuccessMessage('Consejo creado correctamente.');
      } else if (selectedConsejo) {
        await updateConsejoRequest(selectedConsejo.id, payload);
        setSuccessMessage('Consejo actualizado correctamente.');
      }

      closeDialog();
      await fetchConsejos(page);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          dialogMode === 'create'
            ? 'No se pudo crear el consejo.'
            : 'No se pudo actualizar el consejo.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSelected = async () => {
    if (!selectedConsejo) {
      setError('Seleccioná un consejo para eliminar.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await deleteConsejoRequest(selectedConsejo.id);
      setSelectedConsejo(null);
      setSuccessMessage('Consejo eliminado correctamente.');
      await fetchConsejos(page);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo eliminar el consejo.'));
    } finally {
      setSubmitting(false);
    }
  };

  const submitTemarioForm = async (values: ConsejoTemarioFormValues) => {
    if (!selectedConsejo) {
      setTemarioError('Seleccioná un consejo válido.');
      return;
    }

    setTemarioSubmitting(true);
    setTemarioError('');
    setTemarioSuccessMessage('');

    const payload: CreateConsejoTemarioPayload = {
      titulo: values.titulo.trim(),
      ...(values.descripcion.trim()
        ? { descripcion: values.descripcion.trim() }
        : {}),
      ...(values.debate ? { debate: values.debate } : {}),
      ...(values.acuerdo ? { acuerdo: values.acuerdo } : {}),
      sinMp: values.sinMp,
      estado: values.estado,
    };

    try {
      if (temarioDialogMode === 'create') {
        await createConsejoTemarioRequest(selectedConsejo.id, payload);
        setTemarioSuccessMessage('Tema agregado correctamente.');
      } else if (selectedTemario) {
        await updateConsejoTemarioRequest(
          selectedConsejo.id,
          selectedTemario.id,
          payload,
        );
        setTemarioSuccessMessage('Tema actualizado correctamente.');
      }

      const items = await getConsejoTemarioRequest(selectedConsejo.id);
      setTemario(items);
      closeTemarioFormDialog();
      await fetchConsejos(page);
    } catch (err: unknown) {
      setTemarioError(
        getErrorMessage(
          err,
          temarioDialogMode === 'create'
            ? 'No se pudo agregar el tema.'
            : 'No se pudo actualizar el tema.',
        ),
      );
    } finally {
      setTemarioSubmitting(false);
    }
  };

  const deleteSelectedTemario = async () => {
    if (!selectedConsejo || !selectedTemario) {
      setTemarioError('Seleccioná un tema para eliminar.');
      return;
    }

    setTemarioSubmitting(true);
    setTemarioError('');
    setTemarioSuccessMessage('');

    try {
      await deleteConsejoTemarioRequest(selectedConsejo.id, selectedTemario.id);
      setSelectedTemario(null);
      setTemarioSuccessMessage('Tema eliminado correctamente.');
      const items = await getConsejoTemarioRequest(selectedConsejo.id);
      setTemario(items);
      await fetchConsejos(page);
    } catch (err: unknown) {
      setTemarioError(getErrorMessage(err, 'No se pudo eliminar el tema.'));
    } finally {
      setTemarioSubmitting(false);
    }
  };

  return {
    consejos,
    selectedConsejo,
    setSelectedConsejo,
    formValues,
    temario,
    selectedTemario,
    setSelectedTemario,
    temarioFormValues,
    dialogMode,
    dialogVisible,
    temarioDialogMode,
    temarioDialogVisible,
    temarioFormVisible,
    error,
    temarioError,
    successMessage,
    temarioSuccessMessage,
    representantesJuveniles,
    representantesJuvenilesOptions,
    representantesJuvenilesVisible,
    representantesJuvenilesLoading,
    representantesJuvenilesSearching,
    representantesJuvenilesSubmitting,
    representantesJuvenilesError,
    representantesJuvenilesSuccessMessage,
    loading,
    dialogLoading,
    temarioLoading,
    temarioSubmitting,
    submitting,
    page,
    total: meta.total,
    limit: meta.limit,
    filters,
    setFilters,
    refetch: fetchConsejos,
    openCreateDialog,
    openEditDialog,
    openTemarioDialog,
    openCreateTemarioDialog,
    openEditTemarioDialog,
    openRepresentantesJuvenilesDialog,
    closeDialog,
    closeTemarioDialog,
    closeTemarioFormDialog,
    closeRepresentantesJuvenilesDialog,
    searchRepresentantesJuvenilesOptions,
    assignRepresentanteJuvenil,
    removeRepresentanteJuvenil,
    submitForm,
    submitTemarioForm,
    deleteSelected,
    deleteSelectedTemario,
  };
};
