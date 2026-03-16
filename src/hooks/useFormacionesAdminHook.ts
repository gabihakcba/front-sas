'use client';

import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import {
  createAsignacionApfRequest,
  createDefaultTemplateRequest,
  createPlanDesempenoRequest,
  deleteAdjuntoFormacionRequest,
  deleteAsignacionApfRequest,
  downloadAdjuntoFormacionRequest,
  getFormacionAdminWorkspaceRequest,
  getPlanFormacionOptionsRequest,
  updateTemplateRequest,
  uploadAdjuntoFormacionRequest,
} from '@/queries/formacion';
import {
  CreateAdjuntoFormacionPayload,
  CreateAsignacionApfPayload,
  CreatePlanDesempenoPayload,
  FormacionAdminWorkspace,
  PlanFormacionOptionsResponse,
  UpdateTemplatePayload,
} from '@/types/formacion';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 413) {
      return 'El archivo supera el tamaño permitido por el servidor. Probá con un PDF o adjunto más liviano.';
    }

    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  return fallback;
};

export function useFormacionesAdminHook() {
  const [workspace, setWorkspace] = useState<FormacionAdminWorkspace | null>(null);
  const [options, setOptions] = useState<PlanFormacionOptionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadWorkspace = async () => {
    setLoading(true);
    setError('');

    try {
      const workspaceResponse = await getFormacionAdminWorkspaceRequest();
      let optionsResponse: PlanFormacionOptionsResponse | null = null;

      try {
        optionsResponse = await getPlanFormacionOptionsRequest();
      } catch {
        optionsResponse = null;
      }

      setWorkspace(workspaceResponse);
      setOptions(optionsResponse);
    } catch (nextError) {
      setError(
        getErrorMessage(
          nextError,
          'No se pudo cargar la sección de formaciones.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkspace();
  }, []);

  const runMutation = async <T>(fn: () => Promise<T>, success: string) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fn();
      setSuccessMessage(success);
      if (
        response &&
        typeof response === 'object' &&
        'templates' in (response as object)
      ) {
        setWorkspace(response as unknown as FormacionAdminWorkspace);
      } else {
        await loadWorkspace();
      }
      return response;
    } catch (nextError) {
      setError(getErrorMessage(nextError, 'No se pudo completar la operación.'));
      throw nextError;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    workspace,
    options,
    loading,
    submitting,
    error,
    successMessage,
    refetch: loadWorkspace,
    createDefaultTemplate: (nombre: string) =>
      runMutation(
        () => createDefaultTemplateRequest(nombre),
        'Template creado correctamente.',
      ),
    updateTemplate: (id: number, payload: UpdateTemplatePayload) =>
      runMutation(
        () => updateTemplateRequest(id, payload),
        'Template actualizado correctamente.',
      ),
    uploadAdjunto: (templateId: number, payload: CreateAdjuntoFormacionPayload) =>
      runMutation(
        () => uploadAdjuntoFormacionRequest(templateId, payload),
        'Adjunto cargado correctamente.',
      ),
    deleteAdjunto: (id: number) =>
      runMutation(
        () => deleteAdjuntoFormacionRequest(id),
        'Adjunto eliminado correctamente.',
      ),
    downloadAdjunto: downloadAdjuntoFormacionRequest,
    createAsignacionApf: (payload: CreateAsignacionApfPayload) =>
      runMutation(
        () => createAsignacionApfRequest(payload),
        'Asignación APF creada correctamente.',
      ),
    closeAsignacionApf: (id: number) =>
      runMutation(
        () => deleteAsignacionApfRequest(id),
        'Asignación APF cerrada correctamente.',
      ),
    inscribirme: (payload: CreatePlanDesempenoPayload) =>
      runMutation(
        () => createPlanDesempenoRequest(payload),
        'Inscripción al plan creada correctamente.',
      ),
  };
}
