'use client';

import { useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { resolveBrandingAssetUrl, useBranding } from '@/context/BrandingContext';
import { useConfiguracionGrupoHook } from '@/hooks/useConfiguracionGrupoHook';
import {
  ConfiguracionGrupo,
  UpdateConfiguracionGrupoPayload,
} from '@/types/configuracion-grupo';

const WEB_THEME_OPTIONS = [
  'arya-blue',
  'arya-green',
  'arya-orange',
  'arya-purple',
  'bootstrap4-dark-blue',
  'bootstrap4-dark-purple',
  'bootstrap4-light-blue',
  'bootstrap4-light-purple',
  'fluent-light',
  'lara-dark-amber',
  'lara-dark-blue',
  'lara-dark-cyan',
  'lara-dark-green',
  'lara-dark-indigo',
  'lara-dark-pink',
  'lara-dark-purple',
  'lara-dark-teal',
  'lara-light-amber',
  'lara-light-blue',
  'lara-light-cyan',
  'lara-light-green',
  'lara-light-indigo',
  'lara-light-pink',
  'lara-light-purple',
  'lara-light-teal',
  'luna-amber',
  'luna-blue',
  'luna-green',
  'luna-pink',
  'md-dark-deeppurple',
  'md-dark-indigo',
  'md-light-deeppurple',
  'md-light-indigo',
  'mdc-dark-deeppurple',
  'mdc-dark-indigo',
  'mdc-light-deeppurple',
  'mdc-light-indigo',
  'mira',
  'nano',
  'nova',
  'nova-accent',
  'nova-alt',
  'rhea',
  'saga-blue',
  'saga-green',
  'saga-orange',
  'saga-purple',
  'soho-dark',
  'soho-light',
  'tailwind-light',
  'vela-blue',
  'vela-green',
  'vela-orange',
  'vela-purple',
  'viva-dark',
  'viva-light',
].map((theme) => ({
  label: theme,
  value: theme,
}));

const MOBILE_THEME_OPTIONS = [
  { label: 'MD3 Light', value: 'md3-light' },
  { label: 'MD3 Dark', value: 'md3-dark' },
];

function ConfiguracionGrupoForm({
  configuracion,
  loading,
  saving,
  onSubmit,
}: {
  configuracion: ConfiguracionGrupo;
  loading: boolean;
  saving: boolean;
  onSubmit: (payload: UpdateConfiguracionGrupoPayload) => Promise<void>;
}) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const [formValues, setFormValues] = useState<UpdateConfiguracionGrupoPayload>({
    nombreGrupo: configuracion.nombre_grupo,
    themeWeb: configuracion.theme_web,
    themeMobile: configuracion.theme_mobile,
    logoFile: null,
    faviconFile: null,
  });

  const handleSubmit = async () => {
    await onSubmit({
      nombreGrupo: formValues.nombreGrupo.trim(),
      themeWeb: formValues.themeWeb,
      themeMobile: formValues.themeMobile,
      logoFile: formValues.logoFile,
      faviconFile: formValues.faviconFile,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="nombreGrupo">Nombre del grupo</label>
        <InputText
          id="nombreGrupo"
          value={formValues.nombreGrupo}
          onChange={(event) =>
            setFormValues((current) => ({
              ...current,
              nombreGrupo: event.target.value,
            }))
          }
          className="w-full"
          disabled={loading || saving}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Logo</label>
        {configuracion.url_logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveBrandingAssetUrl(configuracion.url_logo, '/logo.png')}
            alt={`Logo actual de ${configuracion.nombre_grupo}`}
            className="max-h-24 w-auto object-contain"
          />
        ) : null}
        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
          className="hidden"
          onChange={(event) =>
            setFormValues((current) => ({
              ...current,
              logoFile: event.target.files?.[0] ?? null,
            }))
          }
          disabled={loading || saving}
        />
        <Button
          type="button"
          label={formValues.logoFile ? formValues.logoFile.name : 'Seleccionar logo'}
          icon="pi pi-upload"
          iconPos="right"
          outlined
          size="small"
          onClick={() => logoInputRef.current?.click()}
          disabled={loading || saving}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Favicon</label>
        {configuracion.url_favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveBrandingAssetUrl(configuracion.url_favicon, '/favicon.ico')}
            alt={`Favicon actual de ${configuracion.nombre_grupo}`}
            className="h-10 w-10 object-contain"
          />
        ) : null}
        <input
          ref={faviconInputRef}
          type="file"
          accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
          className="hidden"
          onChange={(event) =>
            setFormValues((current) => ({
              ...current,
              faviconFile: event.target.files?.[0] ?? null,
            }))
          }
          disabled={loading || saving}
        />
        <Button
          type="button"
          label={
            formValues.faviconFile ? formValues.faviconFile.name : 'Seleccionar favicon'
          }
          icon="pi pi-upload"
          iconPos="right"
          outlined
          size="small"
          onClick={() => faviconInputRef.current?.click()}
          disabled={loading || saving}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="themeWeb">Tema Web</label>
        <Dropdown
          id="themeWeb"
          value={formValues.themeWeb}
          options={WEB_THEME_OPTIONS}
          filter
          onChange={(event: DropdownChangeEvent) =>
            setFormValues((current) => ({
              ...current,
              themeWeb: String(event.value ?? 'lara-light-blue'),
            }))
          }
          className="w-full"
          disabled={loading || saving}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="themeMobile">Tema Mobile</label>
        <Dropdown
          id="themeMobile"
          value={formValues.themeMobile}
          options={MOBILE_THEME_OPTIONS}
          onChange={(event: DropdownChangeEvent) =>
            setFormValues((current) => ({
              ...current,
              themeMobile: String(event.value ?? 'md3-light'),
            }))
          }
          className="w-full"
          disabled={loading || saving}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          label="Guardar"
          icon="pi pi-save"
          iconPos="right"
          outlined
          size="small"
          onClick={() => void handleSubmit()}
          loading={saving}
          disabled={loading}
        />
      </div>
    </>
  );
}

export default function ConfiguracionGrupoPage() {
  const { reload: reloadBranding } = useBranding();
  const {
    configuracion,
    loading,
    saving,
    error,
    successMessage,
    updateConfiguracion,
  } = useConfiguracionGrupoHook();

  const handleFormSubmit = async (payload: UpdateConfiguracionGrupoPayload) => {
    await updateConfiguracion(payload);
    await reloadBranding();
  };

  return (
    <div className="h-full w-full">
      <Card title="Configuración" className="h-full">
        <div className="flex flex-col gap-3">
          <span className="text-sm text-color-secondary">
            Configurá el nombre visible del grupo, subí el logo y el favicon, y elegí el tema público de esta instalación.
          </span>
          {error ? <Message severity="error" text={error} className="w-full" /> : null}
          {successMessage ? (
            <Message severity="success" text={successMessage} className="w-full" />
          ) : null}
          <ConfiguracionGrupoForm
            key={configuracion.updatedAt}
            configuracion={configuracion}
            loading={loading}
            saving={saving}
            onSubmit={handleFormSubmit}
          />
        </div>
      </Card>
    </div>
  );
}
