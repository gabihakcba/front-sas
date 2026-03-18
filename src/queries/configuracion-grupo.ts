import api from '@/lib/axios';
import {
  ConfiguracionGrupo,
  UpdateConfiguracionGrupoPayload,
} from '@/types/configuracion-grupo';

export const getConfiguracionGrupoRequest = async (): Promise<ConfiguracionGrupo> => {
  const response = await api.get<ConfiguracionGrupo>('/configuracion-grupo');
  return response.data;
};

export const updateConfiguracionGrupoRequest = async (
  payload: UpdateConfiguracionGrupoPayload,
): Promise<ConfiguracionGrupo> => {
  const formData = new FormData();
  formData.append('nombreGrupo', payload.nombreGrupo);
  formData.append('themeWeb', payload.themeWeb);
  formData.append('themeMobile', payload.themeMobile);

  if (payload.logoFile) {
    formData.append('logo', payload.logoFile);
  }

  if (payload.faviconFile) {
    formData.append('favicon', payload.faviconFile);
  }

  const response = await api.patch<ConfiguracionGrupo>(
    '/configuracion-grupo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
