'use client';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import {
  getMyProfileActividadRequest,
  getMyProfileAsignacionRequest,
  getMyProfileFirmaRequest,
  getMyProfileRequest,
  getMyProfileVinculosRequest,
  getProfileActividadRequest,
  getProfileAsignacionRequest,
  getProfileFirmaRequest,
  getProfileRequest,
  getProfileVinculosRequest,
  updateMyProfileRequest,
  updateMyProfileFirmaRequest,
  updateProfileFirmaRequest,
} from '@/queries/perfiles';
import {
  PerfilActividad,
  PerfilAsignacion,
  PerfilFirma,
  PerfilResumen,
  PerfilVinculos,
  UpdatePerfilPersonalPayload,
} from '@/types/perfiles';

export function usePerfilHook(memberId?: number) {
  const [summary, setSummary] = useState<PerfilResumen | null>(null);
  const [asignacion, setAsignacion] = useState<PerfilAsignacion | null>(null);
  const [actividad, setActividad] = useState<PerfilActividad | null>(null);
  const [vinculos, setVinculos] = useState<PerfilVinculos | null>(null);
  const [firma, setFirma] = useState<PerfilFirma | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAsignacion, setLoadingAsignacion] = useState(false);
  const [loadingActividad, setLoadingActividad] = useState(false);
  const [loadingVinculos, setLoadingVinculos] = useState(false);
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [savingFirma, setSavingFirma] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState('');
  const [firmaError, setFirmaError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      setForbidden(false);

      try {
        const response = memberId
          ? await getProfileRequest(memberId)
          : await getMyProfileRequest();
        setSummary(response);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const status = err.response?.status;
          const message = String(err.response?.data?.message ?? '');

          if (
            status === 403 ||
            (status === 404 &&
              message.includes('no existe o no está disponible'))
          ) {
            setForbidden(true);
            setError('Tu cuenta no tiene permisos para ver este perfil.');
            return;
          }
        }

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

  const loadFirma = async () => {
    if (loadingFirma) {
      return;
    }

    setLoadingFirma(true);
    setFirmaError('');
    try {
      const response = memberId
        ? await getProfileFirmaRequest(memberId)
        : await getMyProfileFirmaRequest();
      setFirma(response);
    } catch {
      setFirmaError('No se pudo cargar la firma del perfil.');
    } finally {
      setLoadingFirma(false);
    }
  };

  const saveFirma = async (firmaBase64: string | null) => {
    setSavingFirma(true);
    setFirmaError('');
    try {
      const response = memberId
        ? await updateProfileFirmaRequest(memberId, firmaBase64)
        : await updateMyProfileFirmaRequest(firmaBase64);
      setFirma(response);
      return response.firmaBase64;
    } catch {
      setFirmaError('No se pudo guardar la firma del perfil.');
      throw new Error('No se pudo guardar la firma del perfil.');
    } finally {
      setSavingFirma(false);
    }
  };

  const saveProfile = async (payload: UpdatePerfilPersonalPayload) => {
    setSavingProfile(true);
    setError('');

    try {
      const response = await updateMyProfileRequest(payload);
      setSummary(response);
      return response;
    } catch {
      setError('No se pudo guardar el perfil.');
      throw new Error('No se pudo guardar el perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  return {
    summary,
    asignacion,
    actividad,
    vinculos,
    firma,
    loading,
    loadingAsignacion,
    loadingActividad,
    loadingVinculos,
    loadingFirma,
    savingFirma,
    savingProfile,
    error,
    firmaError,
    forbidden,
    loadAsignacion,
    loadActividad,
    loadVinculos,
    loadFirma,
    saveProfile,
    saveFirma,
  };
}
