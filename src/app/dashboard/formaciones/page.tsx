'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { FilePreviewDialog } from '@/components/common/FilePreviewDialog';
import { useFormacionesAdminHook } from '@/hooks/useFormacionesAdminHook';
import {
  CreateAdjuntoFormacionPayload,
  CreatePlanDesempenoPayload,
  PlanFormacionTemplateAdmin,
  UpdateTemplatePayload,
} from '@/types/formacion';

const MAX_ADJUNTO_SIZE_BYTES = 8 * 1024 * 1024;

type TemplateDraft = {
  nombre: string;
  descripcion: string;
  idArea: number;
  activo: boolean;
  niveles: Array<{
    orden: number;
    nombre: string;
    descripcion: string;
    competencias: Array<{
      nombre: string;
      descripcion: string;
      tipo: 'ESENCIAL' | 'ESPECIFICA';
      comportamientos: string;
      aprendizajes: string;
      resultados: string;
    }>;
  }>;
};

const buildTemplateDraft = (
  template: PlanFormacionTemplateAdmin,
): TemplateDraft => ({
  nombre: template.nombre,
  descripcion: template.descripcion ?? '',
  idArea: template.id_area,
  activo: template.activo,
  niveles: template.Niveles.map((nivel) => ({
    orden: nivel.orden,
    nombre: nivel.nombre,
    descripcion: nivel.descripcion ?? '',
    competencias: nivel.Competencias.map((competencia) => ({
      nombre: competencia.nombre,
      descripcion: competencia.descripcion ?? '',
      tipo: competencia.tipo,
      comportamientos: competencia.Comportamientos.map((item) => item.descripcion).join(
        '\n',
      ),
      aprendizajes: competencia.Aprendizajes.map(
        (item) =>
          `${item.descripcion}${item.obligatoria ? ' | obligatoria' : ' | opcional'}`,
      ).join('\n'),
      resultados: competencia.ResultadosEsperados.map((item) => item.descripcion).join(
        '\n',
      ),
    })),
  })),
});

const parseMultiline = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const toTemplatePayload = (draft: TemplateDraft): UpdateTemplatePayload => ({
  nombre: draft.nombre,
  descripcion: draft.descripcion || null,
  idArea: draft.idArea,
  activo: draft.activo,
  niveles: draft.niveles.map((nivel) => ({
    orden: nivel.orden,
    nombre: nivel.nombre,
    descripcion: nivel.descripcion || null,
    competencias: nivel.competencias.map((competencia) => ({
      nombre: competencia.nombre,
      descripcion: competencia.descripcion || null,
      tipo: competencia.tipo,
      comportamientos: parseMultiline(competencia.comportamientos).map(
        (descripcion) => ({ descripcion }),
      ),
      aprendizajes: parseMultiline(competencia.aprendizajes).map((line) => {
        const [descripcionPart, tipoPart] = line.split('|').map((item) => item.trim());
        return {
          descripcion: descripcionPart,
          obligatoria: (tipoPart ?? 'obligatoria').toLowerCase() !== 'opcional',
        };
      }),
      resultados: parseMultiline(competencia.resultados).map((descripcion) => ({
        descripcion,
      })),
    })),
  })),
});

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('No se pudo leer el archivo.'));
        return;
      }
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });

const validateAdjuntoFile = (file: File) => {
  if (file.size > MAX_ADJUNTO_SIZE_BYTES) {
    throw new Error(
      'El archivo seleccionado supera el tamaño máximo recomendado de 8 MB.',
    );
  }
};

function FormacionTemplateEditor({
  template,
  draft,
  areaOptions,
  canManage,
  submitting,
  setTemplateDrafts,
  onSave,
  onUseTemplate,
  onUploadAdjunto,
  onReplaceAdjunto,
  onPreviewAdjunto,
  onDeleteAdjunto,
}: {
  template: PlanFormacionTemplateAdmin;
  draft: TemplateDraft;
  areaOptions: Array<{ label: string; value: number }>;
  canManage: boolean;
  submitting: boolean;
  setTemplateDrafts: React.Dispatch<
    React.SetStateAction<Record<number, TemplateDraft>>
  >;
  onSave: () => void;
  onUseTemplate: () => void;
  onUploadAdjunto: (file: File) => void;
  onReplaceAdjunto: (adjuntoId: number, file: File) => void;
  onPreviewAdjunto: (adjuntoId: number) => void;
  onDeleteAdjunto: (adjuntoId: number) => void;
}) {
  const addAdjuntoInputId = `add-adjunto-${template.id}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Tag value={template.activo ? 'Activo' : 'Inactivo'} />
        <Button
          label="Usar para inscribirme"
          icon="pi pi-send"
          iconPos="right"
          outlined
          size="small"
          onClick={onUseTemplate}
        />
      </div>

      {canManage ? (
        <>
          <InputText
            value={draft.nombre}
            onChange={(event) =>
              setTemplateDrafts((current) => ({
                ...current,
                [template.id]: {
                  ...draft,
                  nombre: event.target.value,
                },
              }))
            }
            placeholder="Nombre"
          />

          <InputTextarea
            value={draft.descripcion}
            onChange={(event) =>
              setTemplateDrafts((current) => ({
                ...current,
                [template.id]: {
                  ...draft,
                  descripcion: event.target.value,
                },
              }))
            }
            rows={3}
            placeholder="Descripción"
          />

          <Dropdown
            value={draft.idArea}
            options={areaOptions}
            onChange={(event) =>
              setTemplateDrafts((current) => ({
                ...current,
                [template.id]: {
                  ...draft,
                  idArea: event.value as number,
                },
              }))
            }
            placeholder="Área"
          />

          <div className="flex items-center gap-2">
            <Checkbox
              inputId={`template-activo-${template.id}`}
              checked={draft.activo}
              onChange={(event) =>
                setTemplateDrafts((current) => ({
                  ...current,
                  [template.id]: {
                    ...draft,
                    activo: Boolean(event.checked),
                  },
                }))
              }
            />
            <label htmlFor={`template-activo-${template.id}`}>Activo</label>
          </div>
        </>
      ) : (
        <>
          <strong>{template.nombre}</strong>
          {template.descripcion ? <span>{template.descripcion}</span> : null}
        </>
      )}

      <Accordion multiple>
        {draft.niveles.map((nivel, nivelIndex) => (
          <AccordionTab
            key={`${template.id}-${nivel.orden}`}
            header={`${nivel.nombre} (${nivel.competencias.length} competencias)`}
          >
            <div className="flex flex-col gap-3">
              {canManage ? (
                <>
                  <InputText
                    value={nivel.nombre}
                    onChange={(event) =>
                      setTemplateDrafts((current) => {
                        const next = structuredClone(draft);
                        next.niveles[nivelIndex].nombre = event.target.value;
                        return { ...current, [template.id]: next };
                      })
                    }
                  />
                  <InputTextarea
                    value={nivel.descripcion}
                    onChange={(event) =>
                      setTemplateDrafts((current) => {
                        const next = structuredClone(draft);
                        next.niveles[nivelIndex].descripcion = event.target.value;
                        return { ...current, [template.id]: next };
                      })
                    }
                    rows={2}
                  />
                </>
              ) : (
                <>
                  <strong>{nivel.nombre}</strong>
                  {nivel.descripcion ? <span>{nivel.descripcion}</span> : null}
                </>
              )}

              {nivel.competencias.map((competencia, competenciaIndex) => (
              <Card
                key={`${nivel.orden}-${competencia.nombre}-${competenciaIndex}`}
                title={
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{competencia.nombre}</span>
                    <Tag
                      value={
                        competencia.tipo === 'ESENCIAL'
                          ? 'Esencial'
                          : 'Específica'
                      }
                    />
                  </div>
                }
              >
                <div className="flex flex-col gap-2">
                    {canManage ? (
                      <>
                        <InputText
                          value={competencia.nombre}
                          onChange={(event) =>
                            setTemplateDrafts((current) => {
                              const next = structuredClone(draft);
                              next.niveles[nivelIndex].competencias[
                                competenciaIndex
                              ].nombre = event.target.value;
                              return { ...current, [template.id]: next };
                            })
                          }
                        />
                        <Dropdown
                          value={competencia.tipo}
                          options={[
                            { label: 'Esencial', value: 'ESENCIAL' },
                            { label: 'Específica', value: 'ESPECIFICA' },
                          ]}
                          onChange={(event) =>
                            setTemplateDrafts((current) => {
                              const next = structuredClone(draft);
                              next.niveles[nivelIndex].competencias[
                                competenciaIndex
                              ].tipo = event.value as 'ESENCIAL' | 'ESPECIFICA';
                              return { ...current, [template.id]: next };
                            })
                          }
                          placeholder="Tipo de competencia"
                        />
                        <InputTextarea
                          value={competencia.descripcion}
                          onChange={(event) =>
                            setTemplateDrafts((current) => {
                              const next = structuredClone(draft);
                              next.niveles[nivelIndex].competencias[
                                competenciaIndex
                              ].descripcion = event.target.value;
                              return { ...current, [template.id]: next };
                            })
                          }
                          rows={2}
                          placeholder="Descripción"
                        />
                        <InputTextarea
                          value={competencia.comportamientos}
                          onChange={(event) =>
                            setTemplateDrafts((current) => {
                              const next = structuredClone(draft);
                              next.niveles[nivelIndex].competencias[
                                competenciaIndex
                              ].comportamientos = event.target.value;
                              return { ...current, [template.id]: next };
                            })
                          }
                          rows={4}
                          placeholder="Comportamientos, uno por línea"
                        />
                        <InputTextarea
                          value={competencia.aprendizajes}
                          onChange={(event) =>
                            setTemplateDrafts((current) => {
                              const next = structuredClone(draft);
                              next.niveles[nivelIndex].competencias[
                                competenciaIndex
                              ].aprendizajes = event.target.value;
                              return { ...current, [template.id]: next };
                            })
                          }
                          rows={4}
                          placeholder="Aprendizajes, uno por línea. Podés usar: descripción | obligatoria/opcional"
                        />
                        <InputTextarea
                          value={competencia.resultados}
                          onChange={(event) =>
                            setTemplateDrafts((current) => {
                              const next = structuredClone(draft);
                              next.niveles[nivelIndex].competencias[
                                competenciaIndex
                              ].resultados = event.target.value;
                              return { ...current, [template.id]: next };
                            })
                          }
                          rows={4}
                          placeholder="Resultados esperados, uno por línea"
                        />
                      </>
                    ) : (
                      <>{competencia.descripcion ? <span>{competencia.descripcion}</span> : null}</>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </AccordionTab>
        ))}
      </Accordion>

      {canManage ? (
        <div className="flex flex-wrap gap-2">
          <Button
            label="Guardar template"
            icon="pi pi-save"
            iconPos="right"
            outlined
            size="small"
            loading={submitting}
            onClick={onSave}
          />
        </div>
      ) : null}

      <Card
        title={
          <div className="flex items-center justify-between gap-2">
            <span>Adjuntos</span>
            {canManage ? (
              <label className="inline-flex cursor-pointer" htmlFor={addAdjuntoInputId}>
                <span className="p-button p-component p-button-outlined p-button-sm">
                  <span className="p-button-label">+</span>
                </span>
              </label>
            ) : null}
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          {canManage ? (
            <input
              id={addAdjuntoInputId}
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                onUploadAdjunto(file);
                event.currentTarget.value = '';
              }}
            />
          ) : null}

          {(template.Adjuntos ?? []).map((adjunto) => (
            <div
              key={adjunto.id}
              className="flex items-center justify-between gap-3"
            >
              <span className="truncate">{adjunto.archivo_nombre}</span>
              <div className="flex items-center gap-2">
                <Button
                  label="Preview"
                  icon="pi pi-eye"
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={() => onPreviewAdjunto(adjunto.id)}
                />
                {canManage ? (
                  <>
                    <label className="inline-flex cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }
                          onReplaceAdjunto(adjunto.id, file);
                          event.currentTarget.value = '';
                        }}
                      />
                      <span className="p-button p-component p-button-outlined p-button-sm">
                        <span className="p-button-label">Reemplazar</span>
                        <span className="p-button-icon p-button-icon-right pi pi-refresh" />
                      </span>
                    </label>
                    <Button
                      icon="pi pi-times"
                      outlined
                      size="small"
                      severity="danger"
                      loading={submitting}
                      onClick={() => onDeleteAdjunto(adjunto.id)}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function FormacionesPage() {
  const {
    workspace,
    options,
    loading,
    submitting,
    error,
    successMessage,
    createDefaultTemplate,
    updateTemplate,
    uploadAdjunto,
    deleteAdjunto,
    downloadAdjunto,
    createAsignacionApf,
    closeAsignacionApf,
    inscribirme,
  } = useFormacionesAdminHook();

  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateDrafts, setTemplateDrafts] = useState<Record<number, TemplateDraft>>(
    {},
  );
  const [selectedTemplateForInscription, setSelectedTemplateForInscription] =
    useState<number | null>(null);
  const [selectedApfAdulto, setSelectedApfAdulto] = useState<number | null>(null);
  const [inscriptionYear, setInscriptionYear] = useState<number | null>(
    dayjs().year(),
  );
  const [apfAdultId, setApfAdultId] = useState<number | null>(null);
  const [apfConsejoId, setApfConsejoId] = useState<number | null>(null);
  const [apfObservacion, setApfObservacion] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewTitle, setPreviewTitle] = useState('Preview');
  const [previewFileName, setPreviewFileName] = useState('archivo.pdf');
  const [previewMimeType, setPreviewMimeType] = useState('application/pdf');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const runAdjuntoUpload = async (
    templateId: number,
    file: File,
    replaceAdjuntoId?: number,
  ) => {
    try {
      setUploadError('');
      validateAdjuntoFile(file);
      const archivoBase64 = await fileToBase64(file);
      const payload: CreateAdjuntoFormacionPayload = {
        titulo: file.name,
        archivoNombre: file.name,
        archivoMime: file.type || 'application/octet-stream',
        archivoBase64,
      };

      if (replaceAdjuntoId) {
        await deleteAdjunto(replaceAdjuntoId);
      }

      await uploadAdjunto(templateId, payload);
    } catch (nextError) {
      if (nextError instanceof Error) {
        setUploadError(nextError.message);
      }
      return;
    }
  };

  const areaOptions = useMemo(
    () =>
      (workspace?.areas ?? []).map((area) => ({
        label: area.nombre,
        value: area.id,
      })),
    [workspace],
  );

  const apfOptions = useMemo(
    () =>
      (options?.apfAdults ?? []).map((adulto) => ({
        label: `${adulto.Miembro.nombre} ${adulto.Miembro.apellidos}`,
        value: adulto.id,
      })),
    [options],
  );

  const adultOptions = useMemo(
    () =>
      (workspace?.adults ?? []).map((adulto) => ({
        label: `${adulto.Miembro.nombre} ${adulto.Miembro.apellidos}`,
        value: adulto.id,
      })),
    [workspace],
  );

  const consejoOptions = useMemo(
    () =>
      (workspace?.consejos ?? []).map((consejo) => ({
        label: `${consejo.nombre} - ${dayjs(consejo.fecha).format('DD/MM/YYYY')}`,
        value: consejo.id,
      })),
    [workspace],
  );

  const templateOptions = useMemo(
    () =>
      (workspace?.templates ?? []).map((template) => ({
        label: template.nombre,
        value: template.id,
      })),
    [workspace],
  );

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <ProgressSpinner style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  const canManage = workspace?.canManage ?? false;
  const effectiveCanManage = canManage && editMode;

  return (
    <div className="flex flex-col gap-4">
      {error ? <Message severity="error" text={error} /> : null}
      {uploadError ? <Message severity="error" text={uploadError} /> : null}
      {successMessage ? <Message severity="success" text={successMessage} /> : null}

      {canManage ? (
        <div className="flex justify-end">
          <Button
            label={editMode ? 'Modo vista' : 'Modo edición'}
            icon={editMode ? 'pi pi-eye' : 'pi pi-pencil'}
            iconPos="right"
            outlined
            size="small"
            onClick={() => setEditMode((current) => !current)}
          />
        </div>
      ) : null}

      <Card title="Formaciones">
        <div className="flex flex-col gap-3">
          {effectiveCanManage ? (
            <div className="flex flex-col gap-2 md:flex-row">
              <InputText
                value={newTemplateName}
                onChange={(event) => setNewTemplateName(event.target.value)}
                placeholder="Nombre del nuevo template"
              />
              <Button
                label="Crear template base"
                icon="pi pi-plus"
                iconPos="right"
                outlined
                size="small"
                loading={submitting}
                disabled={!newTemplateName.trim()}
                onClick={() => {
                  void createDefaultTemplate(newTemplateName.trim()).then(() =>
                    setNewTemplateName(''),
                  );
                }}
              />
            </div>
          ) : (
            <Message
              severity="info"
              text="Las plantillas de formación están disponibles para consulta. La gestión queda habilitada solo para personas adultas."
            />
          )}

          <div className="flex flex-col gap-2 md:flex-row">
            <Dropdown
              value={selectedTemplateForInscription}
              options={templateOptions}
              onChange={(event) =>
                setSelectedTemplateForInscription((event.value as number | null) ?? null)
              }
              placeholder="Template para inscribirme"
            />
            <Dropdown
              value={selectedApfAdulto}
              options={apfOptions}
              onChange={(event) =>
                setSelectedApfAdulto((event.value as number | null) ?? null)
              }
              placeholder="APF"
            />
            <InputNumber
              value={inscriptionYear}
              onValueChange={(event) => setInscriptionYear(event.value ?? null)}
              useGrouping={false}
              placeholder="Año"
            />
            <Button
              label="Inscribirme"
              icon="pi pi-send"
              iconPos="right"
              outlined
              size="small"
              loading={submitting}
              disabled={
                !selectedTemplateForInscription || !selectedApfAdulto || !inscriptionYear
              }
              onClick={() => {
                if (
                  !selectedTemplateForInscription ||
                  !selectedApfAdulto ||
                  !inscriptionYear
                ) {
                  return;
                }

                const payload: CreatePlanDesempenoPayload = {
                  idPlanFormacionTemplate: selectedTemplateForInscription,
                  idApfAdulto: selectedApfAdulto,
                  anio: inscriptionYear,
                };

                void inscribirme(payload);
              }}
            />
          </div>
        </div>
      </Card>

      {effectiveCanManage ? (
        <Card title="APFs habilitados">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 md:flex-row">
              <Dropdown
                value={apfAdultId}
                options={adultOptions}
                onChange={(event) => setApfAdultId((event.value as number | null) ?? null)}
                placeholder="Adulto"
              />
              <Dropdown
                value={apfConsejoId}
                options={consejoOptions}
                onChange={(event) =>
                  setApfConsejoId((event.value as number | null) ?? null)
                }
                placeholder="Consejo"
              />
              <InputText
                value={apfObservacion}
                onChange={(event) => setApfObservacion(event.target.value)}
                placeholder="Observación"
              />
              <Button
                label="Habilitar APF"
                icon="pi pi-check"
                iconPos="right"
                outlined
                size="small"
                loading={submitting}
                disabled={!apfAdultId || !apfConsejoId}
                onClick={() => {
                  if (!apfAdultId || !apfConsejoId) {
                    return;
                  }

                  void createAsignacionApf({
                    idAdulto: apfAdultId,
                    idConsejo: apfConsejoId,
                    observacion: apfObservacion || undefined,
                  }).then(() => {
                    setApfAdultId(null);
                    setApfConsejoId(null);
                    setApfObservacion('');
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              {(workspace?.apfAssignments ?? []).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <strong>
                      {assignment.Adulto.Miembro.nombre}{' '}
                      {assignment.Adulto.Miembro.apellidos}
                    </strong>
                    <span>
                      Consejo: {assignment.Consejo.nombre} (
                      {dayjs(assignment.Consejo.fecha).format('DD/MM/YYYY')})
                    </span>
                    {assignment.observacion ? (
                      <span>{assignment.observacion}</span>
                    ) : null}
                  </div>
                  <Button
                    label="Cerrar"
                    icon="pi pi-times"
                    iconPos="right"
                    outlined
                    size="small"
                    severity="danger"
                    loading={submitting}
                    onClick={() => {
                      void closeAsignacionApf(assignment.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      <Card title="Templates de formación">
        <Accordion multiple>
          {(workspace?.templates ?? []).map((template) => {
            const draft = templateDrafts[template.id] ?? buildTemplateDraft(template);

            return (
              <AccordionTab
                key={template.id}
                header={`${template.nombre} (${template.Area.nombre})`}
              >
                <FormacionTemplateEditor
                  template={template}
                  draft={draft}
                  areaOptions={areaOptions}
                  canManage={effectiveCanManage}
                  submitting={submitting}
                  setTemplateDrafts={setTemplateDrafts}
                  onSave={() => {
                    void updateTemplate(template.id, toTemplatePayload(draft));
                  }}
                  onUseTemplate={() => setSelectedTemplateForInscription(template.id)}
                  onUploadAdjunto={(file) => {
                    void runAdjuntoUpload(template.id, file);
                  }}
                  onReplaceAdjunto={(adjuntoId, file) => {
                    void runAdjuntoUpload(template.id, file, adjuntoId);
                  }}
                  onPreviewAdjunto={(adjuntoId) => {
                    setPreviewVisible(true);
                    setPreviewLoading(true);
                    setPreviewError('');

                    void downloadAdjunto(adjuntoId)
                      .then((response) => {
                        const byteCharacters = atob(response.archivoBase64);
                        const byteNumbers = new Array(byteCharacters.length);

                        for (let index = 0; index < byteCharacters.length; index += 1) {
                          byteNumbers[index] = byteCharacters.charCodeAt(index);
                        }

                        const byteArray = new Uint8Array(byteNumbers);
                        setPreviewBlob(
                          new Blob([byteArray], {
                            type:
                              response.archivo_mime ?? 'application/octet-stream',
                          }),
                        );
                        setPreviewTitle(`Preview de ${response.titulo}`);
                        setPreviewFileName(response.archivo_nombre);
                        setPreviewMimeType(
                          response.archivo_mime ?? 'application/octet-stream',
                        );
                      })
                      .catch(() => {
                        setPreviewError('No se pudo generar el preview del adjunto.');
                      })
                      .finally(() => {
                        setPreviewLoading(false);
                      });
                  }}
                  onDeleteAdjunto={(adjuntoId) => {
                    void deleteAdjunto(adjuntoId);
                  }}
                />
              </AccordionTab>
            );
          })}
        </Accordion>
      </Card>

      <FilePreviewDialog
        visible={previewVisible}
        title={previewTitle}
        fileName={previewFileName}
        mimeType={previewMimeType}
        blob={previewBlob}
        loading={previewLoading}
        error={previewError}
        onHide={() => {
          setPreviewVisible(false);
          setPreviewBlob(null);
          setPreviewTitle('Preview');
          setPreviewFileName('archivo.pdf');
          setPreviewMimeType('application/pdf');
          setPreviewError('');
        }}
      />
    </div>
  );
}
