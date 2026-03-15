'use client';

import { useEffect, useState } from 'react';
import {
  getMyProfileActividadRequest,
  getMyProfileAsignacionRequest,
  getMyProfileRequest,
  getMyProfileVinculosRequest,
  getProfileActividadRequest,
  getProfileAsignacionRequest,
  getProfileRequest,
  getProfileVinculosRequest,
} from '@/queries/perfiles';
import {
  PerfilActividad,
  PerfilAsignacion,
  PerfilResumen,
  PerfilVinculos,
} from '@/types/perfiles';

export function usePerfilHook(memberId?: number) {
  const [summary, setSummary] = useState<PerfilResumen | null>(null);
  const [asignacion, setAsignacion] = useState<PerfilAsignacion | null>(null);
  const [actividad, setActividad] = useState<PerfilActividad | null>(null);
  const [vinculos, setVinculos] = useState<PerfilVinculos | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAsignacion, setLoadingAsignacion] = useState(false);
  const [loadingActividad, setLoadingActividad] = useState(false);
  const [loadingVinculos, setLoadingVinculos] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');

      try {
        const response = memberId
          ? await getProfileRequest(memberId)
          : await getMyProfileRequest();
        setSummary(response);
      } catch {
        setError('No se pudo cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, [memberId]);

  const loadAsignacion = async () => {
    if (asignacion || loadingAsignacion) {
      return;
    }

    setLoadingAsignacion(true);
    try {
      const response = memberId
        ? await getProfileAsignacionRequest(memberId)
        : await getMyProfileAsignacionRequest();
      setAsignacion(response);
    } catch {
      setError('No se pudo cargar la asignación del perfil.');
    } finally {
      setLoadingAsignacion(false);
    }
  };

  const loadActividad = async () => {
    if (actividad || loadingActividad) {
      return;
    }

    setLoadingActividad(true);
    try {
      const response = memberId
        ? await getProfileActividadRequest(memberId)
        : await getMyProfileActividadRequest();
      setActividad(response);
    } catch {
      setError('No se pudo cargar la actividad del perfil.');
    } finally {
      setLoadingActividad(false);
    }
  };

  const loadVinculos = async () => {
    if (vinculos || loadingVinculos) {
      return;
    }

    setLoadingVinculos(true);
    try {
      const response = memberId
        ? await getProfileVinculosRequest(memberId)
        : await getMyProfileVinculosRequest();
      setVinculos(response);
    } catch {
      setError('No se pudieron cargar los vínculos del perfil.');
    } finally {
      setLoadingVinculos(false);
    }
  };

  return {
    summary,
    asignacion,
    actividad,
    vinculos,
    loading,
    loadingAsignacion,
    loadingActividad,
    loadingVinculos,
    error,
    loadAsignacion,
    loadActividad,
    loadVinculos,
  };
}
