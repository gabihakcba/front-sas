'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import {
  CreatePlanDesempenoPayload,
  PlanDesempenoDetalle,
  PlanDesempenoPerfilResponse,
  PlanFormacionOptionsResponse,
} from '@/types/formacion';

interface ProfileFormacionSectionProps {
  data: PlanDesempenoPerfilResponse | null;
  options: PlanFormacionOptionsResponse | null;
  loading: boolean;
  loadingOptions: boolean;
  submitting: boolean;
  error: string;
  successMessage: string;
  onLoadOptions: () => Promise<PlanFormacionOptionsResponse | null>;
  onCreatePlan: (payload: CreatePlanDesempenoPayload) => Promise<void>;
  onUpdateCompetencia: (
    planId: number,
    competenciaTemplateId: number,
    payload: {
      validada: boolean;
      observacionApf?: string;
    },
  ) => Promise<void>;
}

interface CreatePlanFormState {
  idPlanFormacionTemplate: number | null;
  idApfAdulto: number | null;
  anio: number | null;
  observacionesGenerales: string;
}

const estadoSeverityMap: Record<
  PlanDesempenoDetalle['estado'],
  'info' | 'success' | 'warning'
> = {
  BORRADOR: 'info',
  EN_CURSO: 'warning',
  FINALIZADO: 'success',
  APROBADO: 'success',
};

const estadoLabelMap: Record<PlanDesempenoDetalle['estado'], string> = {
  BORRADOR: 'Borrador',
  EN_CURSO: 'En curso',
  FINALIZADO: 'Finalizado',
  APROBADO: 'Aprobado',
};

const buildInitialFormState = (
  options: PlanFormacionOptionsResponse | null,
): CreatePlanFormState => ({
  idPlanFormacionTemplate: null,
  idApfAdulto: null,
  anio: options?.currentYear ?? dayjs().year(),
  observacionesGenerales: '',
});

export function ProfileFormacionSection({
  data,
  options,
  loading,
  loadingOptions,
  submitting,
  error,
  successMessage,
  onLoadOptions,
  onCreatePlan,
  onUpdateCompetencia,
}: ProfileFormacionSectionProps) {
  const [createForm, setCreateForm] = useState<CreatePlanFormState>(
    buildInitialFormState(options),
  );
  const [draftByCompetencia, setDraftByCompetencia] = useState<
    Record<number, string>
  >({});

  const latestPlan = data?.planes[0] ?? null;
  const canCreate = data?.canCreatePlan ?? false;
  const canAccessWorkspace = data?.canAccessWorkspace ?? false;

  const apfOptions = useMemo(
    () =>
      (options?.apfAdults ?? []).map((adulto) => ({
        label: `${adulto.Miembro.nombre} ${adulto.Miembro.apellidos}`,
        value: adulto.id,
      })),
    [options],
  );

  const templateOptions = useMemo(
    () =>
      (options?.templates ?? []).map((template) => ({
        label: template.nombre,
        value: template.id,
      })),
    [options],
  );

  const handlePrepareCreate = async () => {
    const loadedOptions = await onLoadOptions();
    setCreateForm(buildInitialFormState(loadedOptions ?? options));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <ProgressSpinner style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <Message
        severity="info"
        text={error || 'No hay información de formación disponible.'}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? <Message severity="error" text={error} /> : null}
      {successMessage ? <Message severity="success" text={successMessage} /> : null}

      {latestPlan ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <strong>{latestPlan.PlanFormacionTemplate.nombre}</strong>
            <Tag
              value={estadoLabelMap[latestPlan.estado]}
              severity={estadoSeverityMap[latestPlan.estado]}
            />
            <Tag value={`Año ${latestPlan.anio}`} />
          </div>
          <span>
            APF: {latestPlan.APF.Miembro.nombre} {latestPlan.APF.Miembro.apellidos}
          </span>
          <span>
            Inicio:{' '}
            {dayjs(latestPlan.fecha_inicio).format('DD/MM/YYYY')}
          </span>
          {latestPlan.observaciones_generales ? (
            <span>{latestPlan.observaciones_generales}</span>
          ) : null}
        </div>
      ) : (
        <Message
          severity="info"
          text="Este adulto todavía no tiene un plan de desempeño iniciado."
        />
      )}

      {canCreate && !latestPlan ? (
        <div className="flex flex-col gap-3">
          <Button
            label="Iniciar plan de desempeño"
            icon="pi pi-plus"
            iconPos="right"
            size="small"
            outlined
            onClick={() => {
              void handlePrepareCreate();
            }}
          />

          {options || loadingOptions ? (
            <div className="flex flex-col gap-3">
              {loadingOptions ? (
                <div className="flex justify-center py-3">
                  <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />
                </div>
              ) : null}

              {options ? (
                <>
                  <Dropdown
                    value={createForm.idPlanFormacionTemplate}
                    options={templateOptions}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        idPlanFormacionTemplate: event.value as number | null,
                      }))
                    }
                    placeholder="Seleccionar plantilla"
                  />

                  <Dropdown
                    value={createForm.idApfAdulto}
                    options={apfOptions}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        idApfAdulto: event.value as number | null,
                      }))
                    }
                    placeholder="Seleccionar APF"
                  />

                  <InputNumber
                    value={createForm.anio}
                    onValueChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        anio: event.value ?? null,
                      }))
                    }
                    useGrouping={false}
                    min={2000}
                    max={9999}
                    placeholder="Año"
                  />

                  <InputTextarea
                    value={createForm.observacionesGenerales}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        observacionesGenerales: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Observaciones iniciales"
                  />

                  <Button
                    label="Guardar plan"
                    icon="pi pi-save"
                    iconPos="right"
                    size="small"
                    outlined
                    loading={submitting}
                    disabled={
                      !createForm.idPlanFormacionTemplate ||
                      !createForm.idApfAdulto ||
                      !createForm.anio
                    }
                    onClick={() => {
                      if (
                        !createForm.idPlanFormacionTemplate ||
                        !createForm.idApfAdulto ||
                        !createForm.anio
                      ) {
                        return;
                      }

                      void onCreatePlan({
                        idPlanFormacionTemplate: createForm.idPlanFormacionTemplate,
                        idApfAdulto: createForm.idApfAdulto,
                        anio: createForm.anio,
                        observacionesGenerales:
                          createForm.observacionesGenerales || undefined,
                      });
                    }}
                  />
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {latestPlan ? (
        <Accordion multiple={canAccessWorkspace}>
          {latestPlan.PlanFormacionTemplate.Niveles.map((nivel) => (
            <AccordionTab
              key={nivel.id}
              header={`${nivel.nombre} (${nivel.Competencias.length} competencias)`}
            >
              <div className="flex flex-col gap-4">
                {nivel.descripcion ? <span>{nivel.descripcion}</span> : null}

                {nivel.Competencias.map((competencia) => {
                  const validation = latestPlan.Competencias.find(
                    (item) => item.id_competencia_template === competencia.id,
                  );
                  const draftKey = validation?.id ?? competencia.id;
                  const observacion =
                    draftByCompetencia[draftKey] ??
                    validation?.observacion_apf ??
                    '';
                  const canManageCompetencia = latestPlan.canManage;

                  return (
                    <div key={competencia.id} className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{competencia.nombre}</strong>
                        <Tag
                          value={
                            competencia.tipo === 'ESENCIAL'
                              ? 'Esencial'
                              : 'Específica'
                          }
                        />
                        <Tag
                          value={validation?.validada ? 'Validada' : 'Pendiente'}
                          severity={validation?.validada ? 'success' : 'warning'}
                        />
                      </div>

                      {competencia.descripcion ? (
                        <span>{competencia.descripcion}</span>
                      ) : null}

                      {competencia.Comportamientos.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          <strong>Comportamientos deseados</strong>
                          {competencia.Comportamientos.map((item) => (
                            <span key={item.id}>• {item.descripcion}</span>
                          ))}
                        </div>
                      ) : null}

                      {competencia.Aprendizajes.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          <strong>Propuestas de aprendizaje</strong>
                          {competencia.Aprendizajes.map((item) => (
                            <span key={item.id}>
                              • {item.descripcion}
                              {item.obligatoria ? ' (obligatoria)' : ' (opcional)'}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {competencia.ResultadosEsperados.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          <strong>Resultados esperados</strong>
                          {competencia.ResultadosEsperados.map((item) => (
                            <span key={item.id}>• {item.descripcion}</span>
                          ))}
                        </div>
                      ) : null}

                      <Divider />

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            inputId={`competencia-${competencia.id}`}
                            checked={validation?.validada ?? false}
                            onChange={(event) => {
                              void onUpdateCompetencia(latestPlan.id, competencia.id, {
                                validada: Boolean(event.checked),
                                observacionApf: observacion || undefined,
                              });
                            }}
                            disabled={!canManageCompetencia || submitting}
                          />
                          <label htmlFor={`competencia-${competencia.id}`}>
                            Competencia validada por APF
                          </label>
                        </div>

                        <InputTextarea
                          value={observacion}
                          onChange={(event) =>
                            setDraftByCompetencia((current) => ({
                              ...current,
                              [draftKey]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Observación del APF"
                          disabled={!canManageCompetencia}
                        />

                        <Button
                          label="Guardar validación"
                          icon="pi pi-save"
                          iconPos="right"
                          size="small"
                          outlined
                          loading={submitting}
                          disabled={!canManageCompetencia}
                          onClick={() => {
                            void onUpdateCompetencia(latestPlan.id, competencia.id, {
                              validada: validation?.validada ?? false,
                              observacionApf: observacion || undefined,
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      ) : null}
    </div>
  );
}
