'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getConfiguracionGrupoPublicaRequest } from '@/queries/public-config';
import { ConfiguracionGrupoPublica } from '@/types/public-config';

interface BrandingContextType {
  branding: ConfiguracionGrupoPublica;
  loading: boolean;
  reload: () => Promise<void>;
}

const DEFAULT_BRANDING: ConfiguracionGrupoPublica = {
  nombre_grupo: 'Grupo Scout',
  url_logo: '/logo.png',
  url_favicon: '/favicon.ico',
  theme_web: 'lara-light-blue',
  theme_mobile: 'md3-light',
  updatedAt: new Date(0).toISOString(),
};

const STORAGE_KEY = 'sas_branding';
const THEME_LINK_ID = 'sas-theme-link';
const FAVICON_LINK_ID = 'sas-favicon-link';
const DEFAULT_THEME_HREF =
  'https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(
  /\/+$/,
  '',
);

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const buildThemeHref = (theme: string) =>
  `https://unpkg.com/primereact/resources/themes/${theme}/theme.css`;

const resolveBrandingAssetUrl = (value: string | null | undefined, fallback: string) => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return fallback;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `${API_BASE_URL}${trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`}`;
};

const applyBrandingToDocument = (branding: ConfiguracionGrupoPublica) => {
  document.title = branding.nombre_grupo;

  const faviconHref = resolveBrandingAssetUrl(branding.url_favicon, '/favicon.ico');
  document
    .querySelectorAll<HTMLLinkElement>("link[rel='icon'], link[rel='shortcut icon']")
    .forEach((link) => {
      if (link.id !== FAVICON_LINK_ID) {
        link.remove();
      }
    });

  let favicon = document.getElementById(FAVICON_LINK_ID) as HTMLLinkElement | null;
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.id = FAVICON_LINK_ID;
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = faviconHref;

  let themeLink = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.id = THEME_LINK_ID;
    themeLink.rel = 'stylesheet';
    document.head.appendChild(themeLink);
  }
  themeLink.href = buildThemeHref(branding.theme_web || 'lara-light-blue');
};

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<ConfiguracionGrupoPublica>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const response = await getConfiguracionGrupoPublicaRequest();
      setBranding(response);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          setBranding(JSON.parse(cached) as ConfiguracionGrupoPublica);
        } catch {
          setBranding(DEFAULT_BRANDING);
        }
      } else {
        setBranding(DEFAULT_BRANDING);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setBranding(JSON.parse(cached) as ConfiguracionGrupoPublica);
      } catch {
        setBranding(DEFAULT_BRANDING);
      }
    }

    void reload();
  }, []);

  useEffect(() => {
    applyBrandingToDocument(branding);
  }, [branding]);

  useEffect(() => {
    let themeLink = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = THEME_LINK_ID;
      themeLink.rel = 'stylesheet';
      themeLink.href = DEFAULT_THEME_HREF;
      document.head.appendChild(themeLink);
    }
  }, []);

  const value = useMemo(
    () => ({
      branding,
      loading,
      reload,
    }),
    [branding, loading],
  );

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export { resolveBrandingAssetUrl };
