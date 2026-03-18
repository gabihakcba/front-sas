'use client';

import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  getConfiguracionGrupoRequest,
  updateConfiguracionGrupoRequest,
} from '@/queries/configuracion-grupo';
import {
  ConfiguracionGrupo,
  UpdateConfiguracionGrupoPayload,
} from '@/types/configuracion-grupo';

const DEFAULT_CONFIG: ConfiguracionGrupo = {
  nombre_grupo: 'Grupo Scout',
  url_logo: '/logo.png',
  url_favicon: '/favicon.ico',
  theme_web: 'lara-light-blue',
  theme_mobile: 'md3-light',
  updatedAt: new Date(0).toISOString(),
};

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

export const useConfiguracionGrupoHook = () => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionGrupo>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadConfiguracion = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getConfiguracionGrupoRequest();
      setConfiguracion(response);
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          'No se pudo obtener la configuración de marca blanca del grupo.',
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfiguracion = useCallback(
    async (payload: UpdateConfiguracionGrupoPayload) => {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      try {
        const response = await updateConfiguracionGrupoRequest(payload);
        setConfiguracion(response);
        setSuccessMessage('La configuración del grupo se guardó correctamente.');
        return response;
      } catch (err: unknown) {
        const message = getErrorMessage(
          err,
          'No se pudo guardar la configuración de marca blanca.',
        );
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadConfiguracion();
  }, [loadConfiguracion]);

  return {
    configuracion,
    loading,
    saving,
    error,
    successMessage,
    reload: loadConfiguracion,
    updateConfiguracion,
  };
};
