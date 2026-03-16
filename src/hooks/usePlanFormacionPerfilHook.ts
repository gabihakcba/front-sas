'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import {
  createPlanDesempenoRequest,
  getMyPlanDesempenoRequest,
  getPlanDesempenoByMemberRequest,
  getPlanFormacionOptionsRequest,
  updatePlanDesempenoCompetenciaRequest,
} from '@/queries/formacion';
import {
  CreatePlanDesempenoPayload,
  PlanDesempenoPerfilResponse,
  PlanFormacionOptionsResponse,
  UpdatePlanDesempenoCompetenciaPayload,
} from '@/types/formacion';

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
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

export function usePlanFormacionPerfilHook(memberId?: number) {
  const [data, setData] = useState<PlanDesempenoPerfilResponse | null>(null);
  const [options, setOptions] = useState<PlanFormacionOptionsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const load = async () => {
    if (loading || data) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = memberId
        ? await getPlanDesempenoByMemberRequest(memberId)
        : await getMyPlanDesempenoRequest();
      setData(response);
    } catch (nextError) {
      setError(
        extractErrorMessage(
          nextError,
          'No se pudo cargar la información de formación.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    if (loadingOptions || options) {
      return options ?? null;
    }

    setLoadingOptions(true);
    setError('');

    try {
      const response = await getPlanFormacionOptionsRequest();
      setOptions(response);
      return response;
    } catch (nextError) {
      setError(
        extractErrorMessage(
          nextError,
          'No se pudieron cargar las opciones del plan de desempeño.',
        ),
      );
    } finally {
      setLoadingOptions(false);
    }

    return null;
  };

  const createPlan = async (payload: CreatePlanDesempenoPayload) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await createPlanDesempenoRequest(payload);
      setData(response);
      setSuccessMessage('Plan de desempeño creado correctamente.');
    } catch (nextError) {
      setError(
        extractErrorMessage(
          nextError,
          'No se pudo crear el plan de desempeño.',
        ),
      );
      throw nextError;
    } finally {
      setSubmitting(false);
    }
  };

  const updateCompetencia = async (
    planId: number,
    competenciaTemplateId: number,
    payload: UpdatePlanDesempenoCompetenciaPayload,
  ) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await updatePlanDesempenoCompetenciaRequest(
        planId,
        competenciaTemplateId,
        payload,
      );
      setData(response);
      setSuccessMessage('Competencia actualizada correctamente.');
    } catch (nextError) {
      setError(
        extractErrorMessage(
          nextError,
          'No se pudo actualizar la competencia.',
        ),
      );
      throw nextError;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    data,
    options,
    loading,
    loadingOptions,
    submitting,
    error,
    successMessage,
    load,
    loadOptions,
    createPlan,
    updateCompetencia,
  };
}
