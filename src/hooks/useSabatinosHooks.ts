'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  createActividadRequest,
  createSabatinoRequest,
  deleteActividadRequest,
  deleteSabatinoRequest,
  exportSabatinoPdfRequest,
  getActividadesRequest,
  getSabatinoRequest,
  getSabatinosOptionsRequest,
  getSabatinosRequest,
  getTipoActividadesRequest,
  updateActividadRequest,
  updateSabatinoActividadesRequest,
  updateSabatinoRequest,
} from '@/queries/sabatinos';
import {
  Actividad,
  CreateActividadPayload,
  CreateSabatinoPayload,
  Sabatino,
  SabatinoFilters,
  TipoActividad,
  UpdateActividadPayload,
  UpdateSabatinoPayload,
} from '@/types/sabatinos';
import { PaginatedResponseMeta } from '@/types/pagination';

const DEFAULT_LIMIT = 10;

type DialogMode = 'create' | 'edit';

const createEmptyFilters = (): SabatinoFilters => ({
  q: '',
  page: 1,
  limit: DEFAULT_LIMIT,
  includeDeleted: false,
  fechaDesde: '',
  fechaHasta: '',
});

const createEmptySabatinoFormValues = () => ({
  titulo: '',
  fechaInicio: dayjs().startOf('day').toISOString(),
  fechaFin: dayjs().startOf('day').add(1, 'hour').toISOString(),
  educadorIds: [] as number[],
  ramaIds: [] as number[],
  areaIds: [] as number[],
  actividadIds: [] as number[],
});

const createEmptyActividadFormValues = () => ({
  fecha: dayjs().toISOString(),
  nombre: '',
  descripcion: '',
  objetivos: '',
  materiales: '',
  id_tipo: null as number | null,
  responsableIds: [] as number[],
});

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return fallback;
};

export const useSabatinosHook = () => {
  const { user } = useAuth();
  const [sabatinos, setSabatinos] = useState<Sabatino[]>([]);
  const [selectedSabatino, setSelectedSabatino] = useState<Sabatino | null>(null);
  const [filters, setFilters] = useState<SabatinoFilters>(createEmptyFilters());
  const [meta, setMeta] = useState<PaginatedResponseMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const [options, setOptions] = useState<{
    areas: Array<{ id: number; nombre: string }>;
    ramas: Array<{ id: number; nombre: string }>;
    adultos: Array<{ id: number; miembroId: number; nombre: string; apellidos: string; dni: string }>;
    tiposActividad: TipoActividad[];
    todasActividades: Actividad[];
  }>({
    areas: [],
    ramas: [],
    adultos: [],
    tiposActividad: [],
    todasActividades: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dialogs
  const [sabatinoDialogVisible, setSabatinoDialogVisible] = useState(false);
  const [sabatinoDialogMode, setSabatinoDialogMode] = useState<DialogMode>('create');
  const [sabatinoFormValues, setSabatinoFormValues] = useState(createEmptySabatinoFormValues());
  const [submittingSabatino, setSubmittingSabatino] = useState(false);

  const [actividadDialogVisible, setActividadDialogVisible] = useState(false);
  const [actividadDialogMode, setActividadDialogMode] = useState<DialogMode>('create');
  const [actividadFormValues, setActividadFormValues] = useState(createEmptyActividadFormValues());
  const [submittingActividad, setSubmittingActividad] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

  const [assignActividadVisible, setAssignActividadVisible] = useState(false);

  const fetchOptions = useCallback(async () => {
    try {
      const [opt, tipos, actsResponse] = await Promise.all([
        getSabatinosOptionsRequest(),
        getTipoActividadesRequest(),
        getActividadesRequest({ limit: 1000 }), // Get all for selects
      ]);
      setOptions({
        ...opt,
        adultos: opt.adultos.map((a) => ({
          ...a,
          label: `${a.apellidos}, ${a.nombre}`,
        })),
        tiposActividad: tipos,
        todasActividades: actsResponse.data,
      });
    } catch (err) {
      console.error('Error fetching sabatinos options', err);
    }
  }, []);

  const fetchSabatinos = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await getSabatinosRequest({ ...filters, page: nextPage });
      setSabatinos(response.data);
      setMeta(response.meta);
      setSelectedSabatino((current) =>
        current ? response.data.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron obtener los sabatinos.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    void fetchSabatinos(1);
  }, [fetchSabatinos]);

  const openCreateSabatino = () => {
    setSabatinoDialogMode('create');
    
    // Auto-select based on user scope
    const ramaIds: number[] = [];
    const areaIds: number[] = [];
    
    if (user?.scopes) {
      user.scopes.forEach(scope => {
        if (scope.scopeType === 'RAMA' && scope.scopeId) ramaIds.push(scope.scopeId);
        if (scope.scopeType === 'AREA' && scope.scopeId) areaIds.push(scope.scopeId);
      });
    }

    setSabatinoFormValues({
      ...createEmptySabatinoFormValues(),
      ramaIds,
      areaIds,
    });
    setSabatinoDialogVisible(true);
  };

  const openEditSabatino = async (sabatino: Sabatino) => {
    setSabatinoDialogMode('edit');
    try {
      const fullSabatino = await getSabatinoRequest(sabatino.id);
      setSelectedSabatino(fullSabatino);
      setSabatinoFormValues({
        titulo: fullSabatino.titulo,
        fechaInicio: fullSabatino.fecha_inicio,
        fechaFin: fullSabatino.fecha_fin,
        educadorIds: fullSabatino.Educadores.map(e => e.Adulto.id),
        ramaIds: fullSabatino.RamasAfectadas.map(r => r.Rama.id),
        areaIds: fullSabatino.AreasAfectadas.map(a => a.Area.id),
        actividadIds: fullSabatino.Actividades?.map(a => a.Actividad.id) || [],
      });
      setSabatinoDialogVisible(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el sabatino.'));
    }
  };

  const submitSabatino = async (data: UpdateSabatinoPayload) => {
    setSubmittingSabatino(true);
    setError('');
    try {
      const payload: UpdateSabatinoPayload = {
        ...data,
      };

      if (sabatinoDialogMode === 'create') {
        await createSabatinoRequest(payload as CreateSabatinoPayload);
        setSuccessMessage('Sabatino creado con éxito.');
      } else if (selectedSabatino) {
        await updateSabatinoRequest(selectedSabatino.id, payload);
        setSuccessMessage('Sabatino actualizado con éxito.');
      }
      setSabatinoDialogVisible(false);
      void fetchSabatinos(meta.page);
    } catch (err) {
      setError(getErrorMessage(err, 'Error al guardar el sabatino.'));
    } finally {
      setSubmittingSabatino(false);
    }
  };

  const deleteSabatino = async (id: number) => {
    try {
      await deleteSabatinoRequest(id);
      setSuccessMessage('Sabatino eliminado con éxito.');
      setSelectedSabatino(null);
      void fetchSabatinos(meta.page);
    } catch (err) {
      setError(getErrorMessage(err, 'Error al eliminar el sabatino.'));
    }
  };

  const openCreateActividad = (sabatinoId?: number) => {
    setActividadDialogMode('create');
    
    setActividadFormValues({
      ...createEmptyActividadFormValues(),
    });
    setActividadDialogVisible(true);
  };

  const openEditActividad = async (actividad: any) => {
    setActividadDialogMode('edit');
    setSelectedActividad(actividad);
    setActividadFormValues({
      fecha: actividad.fecha,
      nombre: actividad.nombre,
      descripcion: actividad.descripcion ?? '',
      objetivos: actividad.objetivos ?? '',
      materiales: actividad.materiales ?? '',
      id_tipo: actividad.id_tipo,
      responsableIds: actividad.Responsables?.map((r: any) => r.Adulto.id) ?? [],
    });
    setActividadDialogVisible(true);
  };

  const submitActividad = async (data: CreateActividadPayload, sabatinoId?: number) => {
    setSubmittingActividad(true);
    try {
      if (actividadDialogMode === 'create') {
        const payload: CreateActividadPayload = {
          ...data,
          id_sabatino: sabatinoId,
        };
        await createActividadRequest(payload);
        setSuccessMessage('Actividad creada con éxito.');
      } else if (selectedActividad) {
        await updateActividadRequest(selectedActividad.id, data as UpdateActividadPayload);
        setSuccessMessage('Actividad actualizada con éxito.');
      }
      
      setActividadDialogVisible(false);
      void fetchOptions(); 
      if (sabatinoId) {
        void fetchSabatinos(meta.page);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Error al guardar la actividad.'));
    } finally {
      setSubmittingActividad(false);
    }
  };

  const deleteActividad = async (id: number, sabatinoId?: number) => {
    try {
      await deleteActividadRequest(id);
      setSuccessMessage('Actividad eliminada con éxito.');
      void fetchOptions();
      if (sabatinoId) {
        void fetchSabatinos(meta.page);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Error al eliminar la actividad.'));
    }
  };

  const assignActividadesToSabatino = async (
    sabatinoId: number,
    actividades: Array<{
      actividadId: number;
      numero?: number;
      fecha?: string;
      responsableIds?: number[];
    }>,
  ) => {
    try {
      await updateSabatinoActividadesRequest(sabatinoId, actividades);
      setSuccessMessage('Actividades asignadas con éxito.');
      setAssignActividadVisible(false);
      void fetchSabatinos(meta.page);
    } catch (err) {
      setError(getErrorMessage(err, 'Error al asignar actividades.'));
    }
  };

  const exportSabatinoPdf = async (id: number) => {
    try {
      const blob = await exportSabatinoPdfRequest(id);
      return blob;
    } catch (err) {
      setError(getErrorMessage(err, 'Error al exportar PDF.'));
      throw err;
    }
  };

  return {
    sabatinos,
    selectedSabatino,
    setSelectedSabatino,
    filters,
    setFilters,
    meta,
    options,
    loading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    refetch: fetchSabatinos,
    // Sabatino Dialog
    sabatinoDialogVisible,
    setSabatinoDialogVisible,
    sabatinoDialogMode,
    sabatinoFormValues,
    setSabatinoFormValues,
    submittingSabatino,
    openCreateSabatino,
    openEditSabatino,
    submitSabatino,
    deleteSabatino,
    // Actividad Dialog
    actividadDialogVisible,
    setActividadDialogVisible,
    actividadDialogMode,
    actividadFormValues,
    setActividadFormValues,
    submittingActividad,
    selectedActividad,
    setSelectedActividad,
    openCreateActividad,
    openEditActividad,
    submitActividad,
    deleteActividad,
    // Assign
    assignActividadVisible,
    setAssignActividadVisible,
    assignActividadesToSabatino,
    exportSabatinoPdf,
  };
};
