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
import { ProfileInfoSection } from './ProfileInfoSection';
import { ProfileVinculosSection } from './ProfileVinculosSection';

interface Props {
  memberId?: number;
}

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
    error,
    firmaError,
    forbidden,
    loadAsignacion,
    loadActividad,
    loadVinculos,
    loadFirma,
    saveFirma,
  } = usePerfilHook(memberId);
  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
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
        canEditOwnSignature={canEditOwnSignature}
        onEditSignature={() => {
          setSignatureDialogVisible(true);
          void loadFirma();
        }}
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
