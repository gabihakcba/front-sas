'use client';

import { useEffect, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AdultoFirmaDialog } from '@/components/adultos/AdultoFirmaDialog';
import NotAllowed from '@/components/common/NotAllowed';
import { useAuth } from '@/context/AuthContext';
import { usePerfilHook } from '@/hooks/usePerfilHook';
import { usePlanFormacionPerfilHook } from '@/hooks/usePlanFormacionPerfilHook';
import { ProfileActividadSection } from './ProfileActividadSection';
import { ProfileAsignacionSection } from './ProfileAsignacionSection';
import { ProfileFormacionSection } from './ProfileFormacionSection';
import {
  ProfileInfoSection,
  ProfilePersonalFormValues,
} from './ProfileInfoSection';
import { ProfileVinculosSection } from './ProfileVinculosSection';

interface Props {
  memberId?: number;
}

const buildProfileFormValues = (
  summary: NonNullable<ReturnType<typeof usePerfilHook>['summary']>,
): ProfilePersonalFormValues => ({
  nombre: summary.nombre,
  apellidos: summary.apellidos,
  dni: summary.dni,
  fechaNacimiento: summary.fecha_nacimiento.slice(0, 10),
  direccion: summary.direccion,
  email: summary.email ?? '',
  telefono: summary.telefono ?? '',
  telefonoEmergencia: summary.telefono_emergencia,
  totem: summary.totem ?? '',
  cualidad: summary.cualidad ?? '',
});

export function MemberProfileView({ memberId }: Props) {
  const { user } = useAuth();
  const {
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
    syncPermissions,
    syncingPermissions,
  } = usePerfilHook(memberId);
  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileFormValues, setProfileFormValues] =
    useState<ProfilePersonalFormValues | null>(null);
  const {
    data: formacion,
    options: formacionOptions,
    loading: loadingFormacion,
    loadingOptions: loadingFormacionOptions,
    submitting: submittingFormacion,
    error: formacionError,
    successMessage: formacionSuccessMessage,
    load: loadFormacion,
    loadOptions: loadFormacionOptions,
    createPlan,
    updateCompetencia,
  } = usePlanFormacionPerfilHook(memberId);

  const canShowAsignacionTab = Boolean(summary?.Adulto || summary?.Protagonista);
  const canShowActividadTab = true;
  const canShowVinculosTab = Boolean(summary?.Responsable || summary?.Protagonista);
  const canShowFormacionTab = Boolean(summary?.Adulto);
  const canEditOwnSignature = Boolean(
    summary &&
      user &&
      Number(summary.id) === Number(user.memberId),
  );
  const canEditOwnProfile = canEditOwnSignature;
  const tabKeys = [
    ...(canShowAsignacionTab ? ['asignacion'] : []),
    ...(canShowFormacionTab ? ['formacion'] : []),
    ...(canShowActividadTab ? ['actividad'] : []),
    ...(canShowVinculosTab ? ['vinculos'] : []),
  ];

  useEffect(() => {
    if (!summary || !canShowVinculosTab) {
      return;
    }

    void loadVinculos();
  }, [canShowVinculosTab, loadVinculos, memberId, summary]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <ProgressSpinner
          style={{ width: '3rem', height: '3rem' }}
          strokeWidth="4"
        />
      </div>
    );
  }

  if (!summary) {
    if (forbidden) {
      return (
        <NotAllowed
          title="Perfil no disponible"
          message={error || 'Tu cuenta no tiene permisos para ver este perfil.'}
        />
      );
    }

    return <Message severity="error" text={error || 'No se pudo cargar el perfil.'} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Message severity="error" text={error} /> : null}

      <ProfileInfoSection
        summary={summary}
        canEditOwnProfile={canEditOwnProfile}
        canEditOwnSignature={canEditOwnSignature}
        editing={profileEditMode}
        savingProfile={savingProfile}
        formValues={
          profileFormValues ?? buildProfileFormValues(summary)
        }
        onToggleEdit={() => {
          setProfileFormValues(buildProfileFormValues(summary));
          setProfileEditMode(true);
        }}
        onCancelEdit={() => {
          setProfileEditMode(false);
          setProfileFormValues(null);
        }}
        onSaveProfile={() => {
          if (!profileFormValues) {
            return;
          }

          void (async () => {
            await saveProfile({
              nombre: profileFormValues.nombre.trim(),
              apellidos: profileFormValues.apellidos.trim(),
              dni: profileFormValues.dni.trim(),
              fechaNacimiento: profileFormValues.fechaNacimiento,
              direccion: profileFormValues.direccion.trim(),
              email: profileFormValues.email.trim() || null,
              telefono: profileFormValues.telefono.trim() || null,
              telefonoEmergencia: profileFormValues.telefonoEmergencia.trim(),
              totem: profileFormValues.totem.trim() || null,
              cualidad: profileFormValues.cualidad.trim() || null,
            });
            setProfileEditMode(false);
            setProfileFormValues(null);
          })();
        }}
        onChange={(key, value) =>
          setProfileFormValues((current) =>
            current ? { ...current, [key]: value } : current,
          )
        }
        onEditSignature={() => {
          setSignatureDialogVisible(true);
          void loadFirma();
        }}
        onSyncPermissions={() => {
          void (async () => {
            try {
              await syncPermissions();
              window.location.reload();
            } catch (e) {
              console.error(e);
            }
          })();
        }}
        syncingPermissions={syncingPermissions}
      />

      <Accordion
        multiple
        onTabOpen={(event) => {
          const key = tabKeys[Number(event.index)];

          if (key === 'asignacion') {
            void loadAsignacion();
          }

          if (key === 'formacion') {
            void loadFormacion();
          }

          if (key === 'actividad') {
            void loadActividad();
          }

          if (key === 'vinculos') {
            void loadVinculos();
          }
        }}
      >
        {canShowAsignacionTab ? (
          <AccordionTab header="Asignación actual">
            <ProfileAsignacionSection
              asignacion={asignacion}
              loading={loadingAsignacion}
            />
          </AccordionTab>
        ) : null}

        {canShowFormacionTab ? (
          <AccordionTab header="Formación">
            <ProfileFormacionSection
              data={formacion}
              options={formacionOptions}
              loading={loadingFormacion}
              loadingOptions={loadingFormacionOptions}
              submitting={submittingFormacion}
              error={formacionError}
              successMessage={formacionSuccessMessage}
              onLoadOptions={loadFormacionOptions}
              onCreatePlan={createPlan}
              onUpdateCompetencia={updateCompetencia}
            />
          </AccordionTab>
        ) : null}

        {canShowActividadTab ? (
          <AccordionTab header="Eventos y comisiones">
            <ProfileActividadSection
              actividad={actividad}
              loading={loadingActividad}
            />
          </AccordionTab>
        ) : null}

        {canShowVinculosTab ? (
          <AccordionTab header="Vínculos">
            <ProfileVinculosSection
              vinculos={vinculos}
              loading={loadingVinculos}
            />
          </AccordionTab>
        ) : null}
      </Accordion>

      <AdultoFirmaDialog
        visible={signatureDialogVisible}
        adultoNombre={`${summary.nombre} ${summary.apellidos}`}
        firmaBase64={firma?.firmaBase64 ?? null}
        loading={loadingFirma}
        submitting={savingFirma}
        editable={canEditOwnSignature}
        error={firmaError}
        onHide={() => setSignatureDialogVisible(false)}
        onSave={(firmaBase64) => {
          void (async () => {
            await saveFirma(firmaBase64);
            setSignatureDialogVisible(false);
          })();
        }}
      />
    </div>
  );
}
