import api from '@/lib/axios';
import { ConfiguracionGrupoPublica } from '@/types/public-config';

export const getConfiguracionGrupoPublicaRequest = async () => {
  const response = await api.get<ConfiguracionGrupoPublica>(
    '/public/configuracion-grupo',
  );
  return response.data;
};
