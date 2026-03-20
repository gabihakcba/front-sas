'use client';

import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState, startTransition } from 'react';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Sidebar } from 'primereact/sidebar';
import { FilePreviewDialog } from '@/components/common/FilePreviewDialog';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { ConsejoAsistenciaDialog } from '@/components/consejos/ConsejoAsistenciaDialog';
import { ConsejoModeradorDialog } from '@/components/consejos/ConsejoModeradorDialog';
import { ConsejoOradoresPanel } from '@/components/consejos/ConsejoOradoresPanel';
import { ConsejoSecretariaDialog } from '@/components/consejos/ConsejoSecretariaDialog';
import { ConsejoTemarioFormDialog } from '@/components/consejos/ConsejoTemarioFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useConsejoRealtime } from '@/hooks/useConsejoRealtime';
import {
  hasAdultMemberAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import { getResponsiveDialogProps } from '@/lib/dialog';
import {
  createConsejoAsistenciaRequest,
  getConsejoAsistenciaOptionsRequest,
  getConsejoAsistenciasRequest,
  createConsejoTemarioRequest,
  exportConsejoPdfRequest,
  getConsejoRequest,
  updateConsejoModeradorRequest,
  updateConsejoSecretariaRequest,
  updateConsejoTemarioRequest,
} from '@/queries/consejos';
import {
  ConsejoAsistenciaItem,
  ConsejoAsistenciaOption,
  Consejo,
  ConsejoTemarioItem,
  ConsejoTemarioFormValues,
} from '@/types/consejos';

const ESTADO_OPTIONS = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'En tratamiento', value: 'EN_TRATAMIENTO' },
  { label: 'Tratado', value: 'TRATADO' },
  { label: 'Pospuesto', value: 'POSPUESTO' },
];

const getEstadoColorClass = (value: string) => {
  switch (value) {
    case 'EN_TRATAMIENTO':
      return 'text-yellow-500';
    case 'TRATADO':
      return 'text-green-500';
    case 'POSPUESTO':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};

const getSinMpColorClass = (sinMp: boolean) =>
  sinMp ? 'text-red-500' : 'text-green-500';

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

const createEmptyTemaForm = (): ConsejoTemarioFormValues => ({
  titulo: '',
  descripcion: '',
  debate: '',
  acuerdo: '',
  sinMp: false,
  estado: 'PENDIENTE',
});

type TemaActaDraft = {
  debate: string;
  acuerdo: string;
  estado: string;
};

type TemaActaSyncPayload = TemaActaDraft & {
  temarioId: number;
};

export default function ConsejoWorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuth();
  const consejoId = Number(params.id);
  const [consejo, setConsejo] = useState<Consejo | null>(null);
  const [selectedTemaId, setSelectedTemaId] = useState<number | null>(null);
  const [temaDrafts, setTemaDrafts] = useState<Record<number, TemaActaDraft>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [temaDialogVisible, setTemaDialogVisible] = useState(false);
  const [temaDialogMode, setTemaDialogMode] = useState<'create' | 'edit'>('create');
  const [temaDialogValues, setTemaDialogValues] = useState<ConsejoTemarioFormValues>(
    createEmptyTemaForm(),
  );
  const [temaDialogError, setTemaDialogError] = useState('');
  const [isDesktopTemas, setIsDesktopTemas] = useState(false);
  const [temaSidebarVisible, setTemaSidebarVisible] = useState(false);
  const [mobileOptionsVisible, setMobileOptionsVisible] = useState(false);
  const [asistenciaDialogVisible, setAsistenciaDialogVisible] = useState(false);
  const [moderadorDialogVisible, setModeradorDialogVisible] = useState(false);
  const [secretariaDialogVisible, setSecretariaDialogVisible] = useState(false);
  const [asistencias, setAsistencias] = useState<ConsejoAsistenciaItem[]>([]);
  const [asistenciaOptions, setAsistenciaOptions] = useState<
    ConsejoAsistenciaOption[]
  >([]);
  const [asistenciaLoading, setAsistenciaLoading] = useState(false);
  const [asistenciaSearching, setAsistenciaSearching] = useState(false);
  const [asistenciaError, setAsistenciaError] = useState('');
  const [asistenciaSuccessMessage, setAsistenciaSuccessMessage] = useState('');
  const [moderadorLoading, setModeradorLoading] = useState(false);
  const [moderadorError, setModeradorError] = useState('');
  const [secretariaLoading, setSecretariaLoading] = useState(false);
  const [secretariaError, setSecretariaError] = useState('');
  const [exportingAll, setExportingAll] = useState(false);
  const [exportingPublic, setExportingPublic] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewTitle, setPreviewTitle] = useState('Preview PDF');
  const [previewFileName, setPreviewFileName] = useState('archivo.pdf');
  const [previewError, setPreviewError] = useState('');
  const temarioSyncTimeoutRef = useRef<number | null>(null);
  const lastSyncedTemarioRef = useRef<TemaActaSyncPayload | null>(null);

  const canManageConsejo =
    hasAdultMemberAccess(user) && hasPermissionAccess(user, 'UPDATE:CONSEJO');
  const canManageAssignments = hasAdultMemberAccess(user);
  const canExportFullPdf = !(
    user?.roles.includes('PROTAGONISTA') || user?.roles.includes('RESPONSABLE')
  );
  const canRead = hasPermissionAccess(user, 'READ:CONSEJO');
  const currentMemberId = user?.memberId ?? null;

  const {
    state: realtimeState,
    lastTemarioUpdate,
    error: realtimeError,
    isConnected: realtimeConnected,
    setError: setRealtimeError,
    emit,
  } = useConsejoRealtime({
    consejoId,
    token,
    enabled: canRead && !!consejo,
  });
  const effectiveModeratorMemberId =
    realtimeState.moderatorMemberId ?? consejo?.Moderador?.id ?? null;
  const isModerator = !!(
    currentMemberId &&
    effectiveModeratorMemberId &&
    effectiveModeratorMemberId === currentMemberId
  );
  const canRaiseHand = !!(
    currentMemberId &&
    asistencias.some((item) => item.Miembro.id === currentMemberId)
  );
  const canEditActa = !!(
    currentMemberId &&
    (consejo?.Secretario?.id === currentMemberId ||
      consejo?.Prosecretario?.id === currentMemberId)
  );
  const temas = consejo?.TemarioConsejo ?? [];
  const selectedTema =
    temas.find((tema) => tema.id === selectedTemaId) ?? temas[0] ?? null;
  const selectedTemaDraft = selectedTema
    ? temaDrafts[selectedTema.id] ?? {
        debate: selectedTema.debate ?? '',
        acuerdo: selectedTema.acuerdo ?? '',
        estado: selectedTema.estado,
      }
    : null;

  const buildTemaDrafts = useCallback(
    (items: ConsejoTemarioItem[]): Record<number, TemaActaDraft> =>
      items.reduce<Record<number, TemaActaDraft>>((acc, tema) => {
        acc[tema.id] = {
          debate: tema.debate ?? '',
          acuerdo: tema.acuerdo ?? '',
          estado: tema.estado,
        };

        return acc;
      }, {}),
    [],
  );

  const loadConsejo = useCallback(async () => {
    if (!Number.isFinite(consejoId)) {
      setError('El consejo indicado no es válido.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getConsejoRequest(consejoId);
      setConsejo(response);
      setTemaDrafts(buildTemaDrafts(response.TemarioConsejo));
      setSelectedTemaId((current) => current ?? response.TemarioConsejo[0]?.id ?? null);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar el consejo.'));
    } finally {
      setLoading(false);
    }
  }, [buildTemaDrafts, consejoId]);

  useEffect(() => {
    if (!canRead) {
      setLoading(false);
      setError('No tenés permisos para ver este consejo.');
      return;
    }

    void loadConsejo();
  }, [canRead, loadConsejo]);

  useEffect(() => {
    if (!canRead || !Number.isFinite(consejoId)) {
      return;
    }

    const loadAsistenciasBase = async () => {
      try {
        const currentAsistencias = await getConsejoAsistenciasRequest(consejoId);
        setAsistencias(currentAsistencias);
      } catch {
        // La carga principal del consejo no debe depender de este listado auxiliar.
      }
    };

    void loadAsistenciasBase();
  }, [canRead, consejoId]);

  const openCreateTemaDialog = () => {
    setTemaDialogMode('create');
    setTemaDialogValues(createEmptyTemaForm());
    setTemaDialogError('');
    setTemaDialogVisible(true);
  };

  const openEditTemaDialog = () => {
    if (!selectedTema) {
      setTemaDialogError('Seleccioná un tema para editar.');
      return;
    }

    setTemaDialogMode('edit');
    setTemaDialogValues({
      titulo: selectedTema.titulo,
      descripcion: selectedTema.descripcion ?? '',
      debate: '',
      acuerdo: '',
      sinMp: selectedTema.sin_mp,
      estado: selectedTema.estado,
    });
    setTemaDialogError('');
    setTemaDialogVisible(true);
  };

  const closeTemaDialog = () => {
    setTemaDialogVisible(false);
    setTemaDialogValues(createEmptyTemaForm());
    setTemaDialogError('');
  };

  const openAsistenciaDialog = async () => {
    setAsistenciaDialogVisible(true);
    setAsistenciaLoading(true);
    setAsistenciaError('');
    setAsistenciaSuccessMessage('');

    try {
      const [currentAsistencias, currentOptions] = await Promise.all([
        getConsejoAsistenciasRequest(consejoId),
        getConsejoAsistenciaOptionsRequest(consejoId),
      ]);
      setAsistencias(currentAsistencias);
      setAsistenciaOptions(currentOptions);
    } catch (err: unknown) {
      setAsistenciaError(
        getErrorMessage(err, 'No se pudo cargar la asistencia del consejo.'),
      );
    } finally {
      setAsistenciaLoading(false);
    }
  };

  const closeAsistenciaDialog = () => {
    setAsistenciaDialogVisible(false);
    setAsistenciaError('');
    setAsistenciaSuccessMessage('');
  };

  const openModeradorDialog = async () => {
    setModeradorDialogVisible(true);
    setModeradorLoading(false);
    setModeradorError('');

    if (asistencias.length > 0 && asistenciaOptions.length > 0) {
      return;
    }

    setAsistenciaLoading(true);

    try {
      const [currentAsistencias, currentOptions] = await Promise.all([
        getConsejoAsistenciasRequest(consejoId),
        getConsejoAsistenciaOptionsRequest(consejoId),
      ]);
      setAsistencias(currentAsistencias);
      setAsistenciaOptions(currentOptions);
    } catch (err: unknown) {
      setModeradorError(
        getErrorMessage(err, 'No se pudo cargar la lista de miembros.'),
      );
    } finally {
      setAsistenciaLoading(false);
    }
  };

  const closeModeradorDialog = () => {
    setModeradorDialogVisible(false);
    setModeradorError('');
  };

  const openSecretariaDialog = async () => {
    setSecretariaDialogVisible(true);
    setSecretariaLoading(false);
    setSecretariaError('');

    if (asistenciaOptions.length > 0) {
      return;
    }

    setAsistenciaLoading(true);

    try {
      const currentOptions = await getConsejoAsistenciaOptionsRequest(consejoId);
      setAsistenciaOptions(currentOptions);
    } catch (err: unknown) {
      setSecretariaError(
        getErrorMessage(err, 'No se pudo cargar la lista de adultos.'),
      );
    } finally {
      setAsistenciaLoading(false);
    }
  };

  const closeSecretariaDialog = () => {
    setSecretariaDialogVisible(false);
    setSecretariaError('');
  };

  const handleAsistenciaSearch = async (value: string) => {
    setAsistenciaSearching(true);

    try {
      const currentOptions = await getConsejoAsistenciaOptionsRequest(
        consejoId,
        value,
      );
      setAsistenciaOptions(currentOptions);
    } catch (err: unknown) {
      setAsistenciaError(
        getErrorMessage(err, 'No se pudo buscar miembros para asistencia.'),
      );
    } finally {
      setAsistenciaSearching(false);
    }
  };

  const handleAddAsistencia = async (idMiembro: number) => {
    setAsistenciaError('');
    setAsistenciaSuccessMessage('');

    try {
      await createConsejoAsistenciaRequest(consejoId, idMiembro);
      const [currentAsistencias, currentOptions] = await Promise.all([
        getConsejoAsistenciasRequest(consejoId),
        getConsejoAsistenciaOptionsRequest(consejoId),
      ]);
      setAsistencias(currentAsistencias);
      setAsistenciaOptions(currentOptions);
      setAsistenciaSuccessMessage('Asistencia agregada correctamente.');
      await loadConsejo();
    } catch (err: unknown) {
      setAsistenciaError(
        getErrorMessage(err, 'No se pudo agregar la asistencia.'),
      );
    }
  };

  const handleUpdateModerador = async (idModerador: number | null) => {
    setModeradorLoading(true);
    setModeradorError('');

    try {
      const response = await updateConsejoModeradorRequest(consejoId, {
        idModerador,
      });
      setConsejo(response);
      closeModeradorDialog();
    } catch (err: unknown) {
      setModeradorError(
        getErrorMessage(err, 'No se pudo actualizar el moderador del consejo.'),
      );
    } finally {
      setModeradorLoading(false);
    }
  };

  const handleUpdateSecretaria = async ({
    idSecretario,
    idProsecretario,
  }: {
    idSecretario: number | null;
    idProsecretario: number | null;
  }) => {
    setSecretariaLoading(true);
    setSecretariaError('');

    try {
      const response = await updateConsejoSecretariaRequest(consejoId, {
        idSecretario,
        idProsecretario,
      });
      setConsejo(response);
      closeSecretariaDialog();
    } catch (err: unknown) {
      setSecretariaError(
        getErrorMessage(err, 'No se pudo actualizar la secretaria del consejo.'),
      );
    } finally {
      setSecretariaLoading(false);
    }
  };

  const handleExportPdf = async (includePrivateTopics: boolean) => {
    const setLoadingState = includePrivateTopics
      ? setExportingAll
      : setExportingPublic;

    setLoadingState(true);
    setError('');
    setPreviewVisible(true);
    setPreviewError('');

    try {
      const blob = await exportConsejoPdfRequest(consejoId, includePrivateTopics);
      const suffix = includePrivateTopics ? 'completo' : 'pdf';
      setPreviewBlob(blob);
      setPreviewTitle(
        includePrivateTopics ? 'Preview PDF completo' : 'Preview PDF',
      );
      setPreviewFileName(`consejo-${consejoId}-${suffix}.pdf`);
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'No se pudo exportar el PDF del consejo.');
      setError(message);
      setPreviewError(message);
      setPreviewBlob(null);
    } finally {
      setLoadingState(false);
    }
  };

  const handleTemaSubmit = async (values: ConsejoTemarioFormValues) => {
    setTemaDialogError('');

    try {
      if (temaDialogMode === 'create') {
        await createConsejoTemarioRequest(consejoId, {
          titulo: values.titulo.trim(),
          ...(values.descripcion.trim()
            ? { descripcion: values.descripcion.trim() }
            : {}),
          sinMp: values.sinMp,
        });
      } else if (selectedTema) {
        await updateConsejoTemarioRequest(consejoId, selectedTema.id, {
          titulo: values.titulo.trim(),
          ...(values.descripcion.trim()
            ? { descripcion: values.descripcion.trim() }
            : {}),
          sinMp: values.sinMp,
        });
      }

      closeTemaDialog();
      await loadConsejo();
    } catch (err: unknown) {
      setTemaDialogError(getErrorMessage(err, 'No se pudo guardar el tema.'));
    }
  };

  const handleSaveTema = useCallback(async () => {
    if (!selectedTema) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        ...(canEditActa
          ? {
              debate: selectedTemaDraft?.debate ?? '',
              acuerdo: selectedTemaDraft?.acuerdo ?? '',
            }
          : {}),
        estado: selectedTemaDraft?.estado ?? selectedTema.estado,
      };
      const updatedTema = await updateConsejoTemarioRequest(
        consejoId,
        selectedTema.id,
        payload,
      );
      setConsejo((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          TemarioConsejo: current.TemarioConsejo.map((tema) =>
            tema.id === updatedTema.id ? updatedTema : tema,
          ),
        };
      });
      setTemaDrafts((current) => ({
        ...current,
        [updatedTema.id]: {
          debate: updatedTema.debate ?? '',
          acuerdo: updatedTema.acuerdo ?? '',
          estado: updatedTema.estado,
        },
      }));
      lastSyncedTemarioRef.current = {
        temarioId: updatedTema.id,
        debate: updatedTema.debate ?? '',
        acuerdo: updatedTema.acuerdo ?? '',
        estado: updatedTema.estado,
      };
      setSuccessMessage('Tema guardado correctamente.');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo guardar el tema.'));
    } finally {
      setSaving(false);
    }
  }, [canEditActa, consejoId, selectedTema, selectedTemaDraft]);

  useEffect(() => {
    if (!canEditActa) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();

        if (!saving && selectedTema) {
          void handleSaveTema();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canEditActa, handleSaveTema, saving, selectedTema]);

  useEffect(() => {
    if (!canEditActa || !selectedTema || !selectedTemaDraft) {
      return;
    }

    const nextPayload: TemaActaSyncPayload = {
      temarioId: selectedTema.id,
      debate: selectedTemaDraft.debate,
      acuerdo: selectedTemaDraft.acuerdo,
      estado: selectedTemaDraft.estado,
    };

    const lastPayload = lastSyncedTemarioRef.current;
    if (
      lastPayload &&
      lastPayload.temarioId === nextPayload.temarioId &&
      lastPayload.debate === nextPayload.debate &&
      lastPayload.acuerdo === nextPayload.acuerdo &&
      lastPayload.estado === nextPayload.estado
    ) {
      return;
    }

    if (temarioSyncTimeoutRef.current !== null) {
      window.clearTimeout(temarioSyncTimeoutRef.current);
    }

    temarioSyncTimeoutRef.current = window.setTimeout(() => {
      emit('consejo:temario:sync', nextPayload);
      lastSyncedTemarioRef.current = nextPayload;
    }, 500);

    return () => {
      if (temarioSyncTimeoutRef.current !== null) {
        window.clearTimeout(temarioSyncTimeoutRef.current);
      }
    };
  }, [canEditActa, emit, selectedTema, selectedTemaDraft]);

  useEffect(() => {
    if (!lastTemarioUpdate) {
      return;
    }

    setConsejo((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        TemarioConsejo: current.TemarioConsejo.map((tema) =>
          tema.id === lastTemarioUpdate.id ? lastTemarioUpdate : tema,
        ),
      };
    });

    setTemaDrafts((current) => ({
      ...current,
      [lastTemarioUpdate.id]: {
        debate: lastTemarioUpdate.debate ?? '',
        acuerdo: lastTemarioUpdate.acuerdo ?? '',
        estado: lastTemarioUpdate.estado,
      },
    }));

    lastSyncedTemarioRef.current = {
      temarioId: lastTemarioUpdate.id,
      debate: lastTemarioUpdate.debate ?? '',
      acuerdo: lastTemarioUpdate.acuerdo ?? '',
      estado: lastTemarioUpdate.estado,
    };
  }, [lastTemarioUpdate]);

  useEffect(() => {
    if (!consejo) {
      return;
    }

    setRealtimeError('');
  }, [consejo, setRealtimeError]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const syncSidebar = (matches: boolean) => {
      setIsDesktopTemas(matches);
      setTemaSidebarVisible(matches);
    };

    syncSidebar(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncSidebar(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  if (loading) {
    return <div className="py-4">Cargando consejo...</div>;
  }

  const temasSidebarContent = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {canManageConsejo ? (
          <Button
            type="button"
            label="Agregar tema"
            icon="pi pi-plus"
            iconPos="right"
            outlined
            size="small"
            onClick={openCreateTemaDialog}
          />
        ) : null}
        {canManageConsejo ? (
          <Button
            type="button"
            label="Editar"
            icon="pi pi-pencil"
            iconPos="right"
            outlined
            size="small"
            onClick={openEditTemaDialog}
            disabled={!selectedTema}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {temas.map((tema) => (
          <button
            key={tema.id}
            type="button"
            onClick={() => {
              setSelectedTemaId(tema.id);
              if (!isDesktopTemas) {
                setTemaSidebarVisible(false);
              }
            }}
            className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left ${
              selectedTema?.id === tema.id ? 'border-primary' : 'border-gray-300'
            }`}
          >
            <span className="truncate">{tema.titulo}</span>
            <span className="ml-3 flex items-center gap-2">
              <i
                className={`pi pi-circle-fill ${getEstadoColorClass(tema.estado)}`}
                title={tema.estado}
              />
              <i
                className={`pi pi-info-circle ${getSinMpColorClass(tema.sin_mp)}`}
                title={tema.sin_mp ? 'Sin MP' : 'Con MP'}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={temaSidebarVisible && isDesktopTemas ? 'md:pr-[23rem]' : ''}>
      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          label="Temas"
          icon="pi pi-bars"
          iconPos="right"
          outlined
          size="small"
          onClick={() => setTemaSidebarVisible((current) => !current)}
        />
      </div>
      <Sidebar
        visible={temaSidebarVisible}
        position="right"
        modal={!isDesktopTemas}
        dismissable
        blockScroll={!isDesktopTemas}
        showCloseIcon={!isDesktopTemas}
        closeOnEscape={!isDesktopTemas}
        onHide={() => setTemaSidebarVisible(false)}
        header="Temas"
        style={{ width: isDesktopTemas ? '22rem' : 'calc(100vw - 2rem)', maxWidth: '22rem' }}
        pt={{
          content: {
            className: 'p-4',
          },
        }}
      >
        {temasSidebarContent}
      </Sidebar>
      <div>
        <Card
          title={consejo ? `${consejo.nombre} - ${dayjs(consejo.fecha).format('DD/MM/YYYY')}` : 'Consejo'}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              type="button"
              label="Volver"
              icon="pi pi-arrow-left"
              iconPos="right"
              outlined
              size="small"
              onClick={() => startTransition(() => router.push('/dashboard/consejos'))}
            />
            {!isDesktopTemas ? (
              <Button
                type="button"
                label="Opciones"
                icon="pi pi-ellipsis-v"
                iconPos="right"
                outlined
                size="small"
                onClick={() => setMobileOptionsVisible(true)}
              />
            ) : null}
            {isDesktopTemas ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  label="Asistencia"
                  icon="pi pi-users"
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={() => void openAsistenciaDialog()}
                />
                {canManageAssignments ? (
                  <Button
                    type="button"
                    label="Asignar secretaria"
                    icon="pi pi-users"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() => void openSecretariaDialog()}
                  />
                ) : null}
                {canManageAssignments ? (
                  <Button
                    type="button"
                    label="Asignar moderador"
                    icon="pi pi-user-plus"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() => void openModeradorDialog()}
                  />
                ) : null}
                {canExportFullPdf ? (
                  <Button
                    type="button"
                    label="PDF completo"
                    icon={exportingAll ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() => void handleExportPdf(true)}
                    loading={exportingAll}
                  />
                ) : null}
                <Button
                  type="button"
                  label="PDF"
                  icon={exportingPublic ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={() => void handleExportPdf(false)}
                  loading={exportingPublic}
                />
              </div>
            ) : null}
          </div>

          {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
          {realtimeError ? (
            <Message severity="warn" text={realtimeError} className="mb-3 w-full" />
          ) : null}
          {successMessage ? (
            <Message severity="success" text={successMessage} className="mb-3 w-full" />
          ) : null}

          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-color-secondary">
            <span>
              Moderador:{' '}
              {consejo?.Moderador
                ? `${consejo.Moderador.apellidos}, ${consejo.Moderador.nombre}`
                : 'Sin asignar'}
            </span>
            <span>
              Secretario:{' '}
              {consejo?.Secretario
                ? `${consejo.Secretario.apellidos}, ${consejo.Secretario.nombre}`
                : 'Sin asignar'}
            </span>
            <span>
              Prosecretario:{' '}
              {consejo?.Prosecretario
                ? `${consejo.Prosecretario.apellidos}, ${consejo.Prosecretario.nombre}`
                : 'Sin asignar'}
            </span>
            <span>Asistencias: {consejo?._count.AsistenciaConsejo ?? 0}</span>
            <span>
              Tiempo real: {realtimeConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {!selectedTema ? (
            <Message severity="info" text="Este consejo todavía no tiene temas cargados." />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_16rem] md:items-end">
                <div>
                  <h2 className="text-xl font-semibold">{selectedTema.titulo}</h2>
                  <p>{selectedTema.descripcion ?? 'Sin descripcion cargada.'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="tema-estado-acta">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    id="tema-estado-acta"
                    value={selectedTemaDraft?.estado ?? selectedTema.estado}
                    options={ESTADO_OPTIONS}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(event: DropdownChangeEvent) => {
                      if (!selectedTema) {
                        return;
                      }

                      setTemaDrafts((current) => ({
                        ...current,
                        [selectedTema.id]: {
                          debate:
                            current[selectedTema.id]?.debate ??
                            selectedTema.debate ??
                            '',
                          acuerdo:
                            current[selectedTema.id]?.acuerdo ??
                            selectedTema.acuerdo ??
                            '',
                          estado: event.value as string,
                        },
                      }));
                    }}
                    className="w-full"
                    disabled={!canEditActa}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="tema-debate">Debate</label>
                <RichTextEditor
                  key={`tema-debate-${selectedTemaId}-${canEditActa ? 'edit' : 'view'}`}
                  id="tema-debate"
                  value={selectedTemaDraft?.debate ?? selectedTema.debate ?? ''}
                  onChange={(nextValue) => {
                    if (!canEditActa || !selectedTema) {
                      return;
                    }
                    setTemaDrafts((current) => ({
                      ...current,
                      [selectedTema.id]: {
                        debate: nextValue,
                        acuerdo:
                          current[selectedTema.id]?.acuerdo ??
                          selectedTema.acuerdo ??
                          '',
                        estado:
                          current[selectedTema.id]?.estado ??
                          selectedTema.estado,
                      },
                    }));
                  }}
                  minHeightRem={12}
                  maxHeightRem={32}
                  disabled={!canEditActa}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="tema-acuerdo">Acuerdo</label>
                <RichTextEditor
                  key={`tema-acuerdo-${selectedTemaId}-${canEditActa ? 'edit' : 'view'}`}
                  id="tema-acuerdo"
                  value={selectedTemaDraft?.acuerdo ?? selectedTema.acuerdo ?? ''}
                  onChange={(nextValue) => {
                    if (!canEditActa || !selectedTema) {
                      return;
                    }
                    setTemaDrafts((current) => ({
                      ...current,
                      [selectedTema.id]: {
                        debate:
                          current[selectedTema.id]?.debate ??
                          selectedTema.debate ??
                          '',
                        acuerdo: nextValue,
                        estado:
                          current[selectedTema.id]?.estado ??
                          selectedTema.estado,
                      },
                    }));
                  }}
                  minHeightRem={12}
                  maxHeightRem={32}
                  disabled={!canEditActa}
                />
              </div>

              {canEditActa ? (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    label="Guardar"
                    icon={saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
                    iconPos="right"
                    outlined
                    size="small"
                    tooltip="Guardar (Ctrl+S / Cmd+S)"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => void handleSaveTema()}
                    loading={saving}
                    disabled={!canEditActa}
                  />
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>

      <ConsejoTemarioFormDialog
        visible={temaDialogVisible}
        mode={temaDialogMode}
        loading={false}
        values={temaDialogValues}
        error={temaDialogError}
        showEstado={false}
        showContentFields={false}
        onHide={closeTemaDialog}
        onSubmit={(values) => void handleTemaSubmit(values)}
      />
      <ConsejoAsistenciaDialog
        visible={asistenciaDialogVisible}
        canManage={canManageAssignments}
        loading={asistenciaLoading}
        searching={asistenciaSearching}
        error={asistenciaError}
        successMessage={asistenciaSuccessMessage}
        asistencias={asistencias}
        options={asistenciaOptions}
        onHide={closeAsistenciaDialog}
        onSearch={(value) => void handleAsistenciaSearch(value)}
        onAdd={(idMiembro) => void handleAddAsistencia(idMiembro)}
      />
      <ConsejoModeradorDialog
        visible={moderadorDialogVisible}
        loading={moderadorLoading}
        options={asistenciaOptions}
        currentModerador={consejo?.Moderador ?? null}
        error={moderadorError}
        onHide={closeModeradorDialog}
        onSubmit={(idModerador) => void handleUpdateModerador(idModerador)}
      />
      <ConsejoSecretariaDialog
        visible={secretariaDialogVisible}
        loading={secretariaLoading}
        options={asistenciaOptions}
        secretario={consejo?.Secretario ?? null}
        prosecretario={consejo?.Prosecretario ?? null}
        error={secretariaError}
        onHide={closeSecretariaDialog}
        onSubmit={(values) => void handleUpdateSecretaria(values)}
      />
      <FilePreviewDialog
        visible={previewVisible}
        title={previewTitle}
        fileName={previewFileName}
        mimeType="application/pdf"
        blob={previewBlob}
        loading={exportingAll || exportingPublic}
        error={previewError}
        onHide={() => {
          setPreviewVisible(false);
          setPreviewBlob(null);
          setPreviewError('');
        }}
      />
      <Dialog
        visible={mobileOptionsVisible}
        onHide={() => setMobileOptionsVisible(false)}
        header="Opciones"
        {...getResponsiveDialogProps('30rem')}
      >
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            label="Asistencia"
            icon="pi pi-users"
            iconPos="right"
            outlined
            size="small"
            onClick={() => {
              setMobileOptionsVisible(false);
              void openAsistenciaDialog();
            }}
          />
          {canManageAssignments ? (
            <Button
              type="button"
              label="Asignar secretaria"
              icon="pi pi-users"
              iconPos="right"
              outlined
              size="small"
              onClick={() => {
                setMobileOptionsVisible(false);
                void openSecretariaDialog();
              }}
            />
          ) : null}
          {canManageAssignments ? (
            <Button
              type="button"
              label="Asignar moderador"
              icon="pi pi-user-plus"
              iconPos="right"
              outlined
              size="small"
              onClick={() => {
                setMobileOptionsVisible(false);
                void openModeradorDialog();
              }}
            />
          ) : null}
          {canExportFullPdf ? (
            <Button
              type="button"
              label="PDF completo"
              icon={exportingAll ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
              iconPos="right"
              outlined
              size="small"
              onClick={() => {
                setMobileOptionsVisible(false);
                void handleExportPdf(true);
              }}
              loading={exportingAll}
            />
          ) : null}
          <Button
            type="button"
            label="PDF"
            icon={exportingPublic ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
            iconPos="right"
            outlined
            size="small"
            onClick={() => {
              setMobileOptionsVisible(false);
              void handleExportPdf(false);
            }}
            loading={exportingPublic}
          />
        </div>
      </Dialog>
      {consejo ? (
        <ConsejoOradoresPanel
          isConnected={realtimeConnected}
          isModerator={isModerator}
          canRaiseHand={canRaiseHand}
          hasRaisedHand={
            currentMemberId !== null &&
            realtimeState.raisedHands.some(
              (item) => item.memberId === currentMemberId,
            )
          }
          speakers={realtimeState.speakers}
          raisedHands={realtimeState.raisedHands}
          currentModeradorName={
            consejo.Moderador
              ? `${consejo.Moderador.apellidos}, ${consejo.Moderador.nombre}`
              : null
          }
          attendance={asistencias}
          onRaiseHand={() => emit('consejo:hand:raise')}
          onCancelRaiseHand={() => emit('consejo:hand:cancel')}
          onAddSpeaker={(memberId) => emit('consejo:speaker:add', { memberId })}
          onRemoveSpeaker={(memberId) =>
            emit('consejo:speaker:remove', { memberId })
          }
          onReorderSpeakers={(memberIds) =>
            emit('consejo:speakers:reorder', { memberIds })
          }
        />
      ) : null}
    </div>
  );
}
