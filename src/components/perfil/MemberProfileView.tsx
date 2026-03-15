'use client';

import { Accordion, AccordionTab } from 'primereact/accordion';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePerfilHook } from '@/hooks/usePerfilHook';
import { ProfileActividadSection } from './ProfileActividadSection';
import { ProfileAsignacionSection } from './ProfileAsignacionSection';
import { ProfileInfoSection } from './ProfileInfoSection';
import { ProfileVinculosSection } from './ProfileVinculosSection';

interface Props {
  memberId?: number;
}

export function MemberProfileView({ memberId }: Props) {
  const {
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
  } = usePerfilHook(memberId);

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
    return <Message severity="error" text={error || 'No se pudo cargar el perfil.'} />;
  }

  const canShowAsignacionTab =
    summary.Adulto !== null || summary.Protagonista !== null;
  const canShowActividadTab = true;
  const canShowVinculosTab =
    summary.Responsable !== null || summary.Protagonista !== null;

  return (
    <div className="flex flex-col gap-4">
      {error ? <Message severity="error" text={error} /> : null}

      <ProfileInfoSection summary={summary} />

      <Accordion
        multiple
        onTabOpen={(event) => {
          const index = Number(event.index);

          if (canShowAsignacionTab && index === 0) {
            void loadAsignacion();
          }

          if (
            (!canShowAsignacionTab && canShowActividadTab && index === 0) ||
            (canShowAsignacionTab && canShowActividadTab && index === 1)
          ) {
            void loadActividad();
          }

          if (
            canShowVinculosTab &&
            ((canShowAsignacionTab && canShowActividadTab && index === 2) ||
              (!canShowAsignacionTab && canShowActividadTab && index === 1) ||
              (canShowAsignacionTab && !canShowActividadTab && index === 1) ||
              (!canShowAsignacionTab && !canShowActividadTab && index === 0))
          ) {
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
    </div>
  );
}
