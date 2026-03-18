export interface ConfiguracionGrupo {
  nombre_grupo: string;
  url_logo: string | null;
  url_favicon: string | null;
  theme_web: string;
  theme_mobile: string;
  updatedAt: string;
}

export interface UpdateConfiguracionGrupoPayload {
  nombreGrupo: string;
  themeWeb: string;
  themeMobile: string;
  logoFile: File | null;
  faviconFile: File | null;
}
