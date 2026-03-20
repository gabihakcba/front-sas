'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuth } from '@/context/AuthContext';
import { useSabatinosHook } from '@/hooks/useSabatinosHooks';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { hasAdultMemberAccess } from '@/lib/authorization';
import {
  formatArgentinaDateTimeRange,
  formatArgentinaTime,
} from '@/lib/argentina-datetime';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { SabatinoFormDialog } from '@/components/sabatinos/SabatinoFormDialog';
import { ActividadFormDialog } from '@/components/sabatinos/ActividadFormDialog';
import { AssignActividadDialog } from '@/components/sabatinos/AssignActividadDialog';
import { getSabatinoRequest } from '@/queries/sabatinos';
import { Sabatino } from '@/types/sabatinos';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { FilePreviewDialog } from '@/components/common/FilePreviewDialog';

export default function SabatinoDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const sabatinoId = Number(params.id);

  const [sabatino, setSabatino] = useState<Sabatino | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [errorLocal, setErrorLocal] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [detailActividad, setDetailActividad] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // PDF Preview State
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const {
    options,
    successMessage,
    setSuccessMessage,
    sabatinoDialogVisible,
    setSabatinoDialogVisible,
    sabatinoDialogMode,
    sabatinoFormValues,
    setSabatinoFormValues,
    submittingSabatino,
    openEditSabatino,
    submitSabatino,
    actividadDialogVisible,
    setActividadDialogVisible,
    actividadDialogMode,
    actividadFormValues,
    setActividadFormValues,
    submittingActividad,
    selectedActividad,
    setSelectedActividad,
    openCreateActividad,
    openEditActividad,
    submitActividad,
    deleteActividad,
    assignActividadVisible,
    setAssignActividadVisible,
    assignActividadesToSabatino,
    exportSabatinoPdf,
  } = useSabatinosHook();

  const canCRUD = hasAdultMemberAccess(user);
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();

  const loadSabatino = async () => {
    setLoadingLocal(true);
    setErrorLocal('');
    try {
      const data = await getSabatinoRequest(sabatinoId);
      setSabatino(data);
    } catch (err) {
      setErrorLocal('No se pudo cargar la información del sabatino.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleRowDoubleClick = (event: any) => {
    setDetailActividad(event.data);
    setDetailVisible(true);
  };

  const handleExportPdf = async () => {
    if (!sabatino) return;
    setPreviewVisible(true);
    setPreviewLoading(true);
    setPreviewError('');
    try {
      const blob = await exportSabatinoPdf(sabatino.id);
      setPreviewBlob(blob);
    } catch (err) {
      setPreviewError('No se pudo generar la preview del sabatino.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleRowReorder = async (event: any) => {
    if (!sabatino) return;
    
    // The new order of rows
    const newOrder = event.value as any[];
    
    // Map to the structure expected by the API, updating 'numero' based on new index
    const payload = newOrder.map((row, index) => ({
      actividadId: row.Actividad.id,
      numero: index + 1, // New sequence number
      fecha: row.fecha,
      responsableIds: row.Responsables.map((r: any) => r.Adulto.id)
    }));

    try {
      await assignActividadesToSabatino(sabatino.id, payload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteActividad = () => {
    if (!selectedRow) return;
    
    const isGrupal = selectedRow.Actividad.Tipo.nombre === 'Grupal';
    const message = isGrupal 
      ? `¿Estás seguro de quitar la actividad "${selectedRow.Actividad.nombre}" de este sabatino? La actividad seguirá existiendo en el sistema.`
      : `¿Estás seguro de eliminar permanentemente la actividad "${selectedRow.Actividad.nombre}"?`;

    confirmDelete({
      message,
      onAccept: async () => {
        try {
          if (isGrupal && sabatino) {
            const remainingActividades = (sabatino.Actividades || [])
              .filter(a => a.Actividad.id !== selectedRow.Actividad.id)
              .map(a => ({
                actividadId: a.Actividad.id,
                numero: a.numero ?? undefined,
                fecha: a.fecha,
                responsableIds: a.Responsables.map((r: any) => r.Adulto.id)
              }));
            await assignActividadesToSabatino(sabatino.id, remainingActividades);
          } else {
            await deleteActividad(selectedRow.Actividad.id, sabatinoId);
          }
          setSelectedRow(null);
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  const activityHeader = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-color-secondary font-medium">
          {sabatino?.Actividades?.length || 0} actividades asociadas
        </span>
      </div>
      <ResponsiveTableActions
        crudActions={[
          ...(canCRUD
            ? [
                {
                  label: 'Nueva',
                  icon: 'pi pi-plus',
                  onClick: () => openCreateActividad(sabatinoId),
                },
                {
                  label: 'Asignar',
                  icon: 'pi pi-list',
                  onClick: () => setAssignActividadVisible(true),
                  severity: 'info' as const,
                },
                {
                  label: 'Editar',
                  icon: 'pi pi-pencil',
                  onClick: () => {
                    if (selectedRow) {
                      const actToEdit = {
                        ...selectedRow.Actividad,
                        fecha: selectedRow.fecha,
                        numero: selectedRow.numero,
                        Responsables: selectedRow.Responsables
                      };
                      void openEditActividad(actToEdit);
                    }
                  },
                  disabled: !selectedRow,
                },
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDeleteActividad,
                  disabled: !selectedRow,
                  severity: 'danger' as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );

  useEffect(() => {
    if (sabatinoId) {
      void loadSabatino();
    }
  }, [sabatinoId]);

  useEffect(() => {
    if (successMessage && toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: successMessage,
        life: 3000,
      });
      setSuccessMessage('');
      void loadSabatino();
      setSelectedRow(null);
    }
  }, [successMessage, setSuccessMessage]);

  if (loadingLocal) return <div className="p-4">Cargando detalles...</div>;
  if (errorLocal || !sabatino) return <div className="p-4"><Message severity="error" text={errorLocal || 'No se encontró el sabatino.'} /></div>;

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            icon="pi pi-arrow-left"
            iconPos="right"
            outlined
            size="small"
            onClick={() => router.push('/dashboard/sabatinos')}
          />
          <h1 className="text-2xl font-bold m-0">{sabatino.titulo}</h1>
        </div>
        <Button
          label="Exportar PDF"
          icon="pi pi-file-pdf"
          iconPos="right"
          severity="secondary"
          outlined
          size="small"
          onClick={handleExportPdf}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Card title="Información General">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-color-secondary">Fecha y Hora</label>
              <span className="text-lg">
                {formatArgentinaDateTimeRange(
                  sabatino.fecha_inicio,
                  sabatino.fecha_fin,
                )}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-color-secondary">Ramas Afectadas</label>
              <div className="flex flex-wrap gap-1">
                {sabatino.RamasAfectadas.length > 0 
                  ? sabatino.RamasAfectadas.map(r => <Tag key={r.Rama.id} value={r.Rama.nombre} severity="info" />)
                  : <span className="text-gray-400">Ninguna</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-color-secondary">Áreas Afectadas</label>
              <div className="flex flex-wrap gap-1">
                {sabatino.AreasAfectadas.length > 0 
                  ? sabatino.AreasAfectadas.map(a => <Tag key={a.Area.id} value={a.Area.nombre} severity="secondary" />)
                  : <span className="text-gray-400">Ninguna</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-color-secondary">Educadores</label>
              <div className="flex flex-col gap-1">
                {sabatino.Educadores.length > 0 
                  ? sabatino.Educadores.map(e => (
                      <span key={e.Adulto.Miembro.id} className="text-sm">
                        • {e.Adulto.Miembro.apellidos}, {e.Adulto.Miembro.nombre}
                      </span>
                    ))
                  : <span className="text-gray-400 italic">Sin asignar</span>}
              </div>
            </div>
          </div>

          {canCRUD && (
            <div className="flex justify-end mt-4">
              <Button
                label="Editar Información"
                icon="pi pi-pencil"
                iconPos="right"
                outlined
                size="small"
                onClick={() => void openEditSabatino(sabatino)}
              />
            </div>
          )}
        </Card>

        <Card title="Actividades Planificadas">
          <DataTable
            value={sabatino.Actividades || []}
            className="p-datatable-sm"
            emptyMessage="No hay actividades asignadas a este sabatino."
            responsiveLayout="stack"
            breakpoint="960px"
            header={activityHeader}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            onRowDoubleClick={handleRowDoubleClick}
            dataKey="Actividad.id"
            reorderableRows
            onRowReorder={handleRowReorder}
          >
            {canCRUD && <Column rowReorder style={{ width: '3rem' }} />}
            <Column field="numero" header="N°" style={{ width: '4rem' }} />
            <Column 
              header="Hora" 
              body={(row: any) => formatArgentinaTime(row.fecha)} 
              style={{ width: '6rem' }}
            />
            <Column 
              header="Actividad" 
              body={(row: any) => (
                <div className="max-h-24 overflow-y-auto whitespace-pre-wrap text-sm">
                  {row.Actividad.nombre}
                </div>
              )}
              style={{ minWidth: '12rem' }}
            />
            <Column 
              header="Descripción" 
              body={(row: any) => (
                <div className="max-h-24 overflow-y-auto whitespace-pre-wrap text-sm italic">
                  {row.Actividad.descripcion || '-'}
                </div>
              )}
              style={{ minWidth: '15rem' }}
            />
            <Column 
              header="Objetivos" 
              body={(row: any) => (
                <div className="max-h-24 overflow-y-auto whitespace-pre-wrap text-sm">
                  {row.Actividad.objetivos || '-'}
                </div>
              )}
              style={{ minWidth: '15rem' }}
            />
            <Column 
              header="Materiales" 
              body={(row: any) => (
                <div className="max-h-24 overflow-y-auto whitespace-pre-wrap text-sm">
                  {row.Actividad.materiales || '-'}
                </div>
              )}
              style={{ minWidth: '15rem' }}
            />
            <Column 
              header="Responsables" 
              body={(row: any) => (
                <div className="max-h-24 overflow-y-auto text-sm">
                  {row.Responsables?.map((r: any) => r.Adulto.Miembro.nombre).join(', ') || '-'}
                </div>
              )}
              style={{ width: '10rem' }}
            />
            <Column 
              header="Tipo" 
              body={(row: any) => (
                <Tag 
                  value={row.Actividad.Tipo.nombre} 
                  style={{ backgroundColor: row.Actividad.Tipo.color || '#eee', color: '#fff' }} 
                />
              )} 
            />
          </DataTable>
        </Card>
      </div>

      <SabatinoFormDialog
        visible={sabatinoDialogVisible}
        onHide={() => setSabatinoDialogVisible(false)}
        mode={sabatinoDialogMode}
        initialValues={sabatinoFormValues}
        onSubmit={submitSabatino}
        loading={submittingSabatino}
        options={options}
      />

      <ActividadFormDialog
        visible={actividadDialogVisible}
        onHide={() => setActividadDialogVisible(false)}
        mode={actividadDialogMode}
        initialValues={actividadFormValues}
        onSubmit={(data) => void submitActividad(data, sabatino.id)}
        loading={submittingActividad}
        options={options}
      />

      <AssignActividadDialog
        visible={assignActividadVisible}
        onHide={() => setAssignActividadVisible(false)}
        sabatino={sabatino}
        options={options}
        onAssign={assignActividadesToSabatino}
        onCreateNew={() => {
          setAssignActividadVisible(false);
          openCreateActividad(sabatino.id);
        }}
      />

      {deleteConfirmDialog}

      <FilePreviewDialog
        visible={previewVisible}
        title={`Preview Sabatino: ${sabatino.titulo}`}
        fileName={`Sabatino - ${sabatino.titulo}.pdf`}
        mimeType="application/pdf"
        blob={previewBlob}
        loading={previewLoading}
        error={previewError}
        onHide={() => {
          setPreviewVisible(false);
          setPreviewBlob(null);
        }}
      />

      <Dialog
        header={detailActividad?.Actividad.nombre}
        visible={detailVisible}
        onHide={() => setDetailVisible(false)}
        {...getResponsiveDialogProps('600px')}
      >
        {detailActividad && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold block text-sm text-color-secondary">Número</label>
                <span>{detailActividad.numero || '-'}</span>
              </div>
              <div>
                <label className="font-bold block text-sm text-color-secondary">Hora</label>
                <span>{formatArgentinaTime(detailActividad.fecha)}</span>
              </div>
              <div>
                <label className="font-bold block text-sm text-color-secondary">Tipo</label>
                <Tag 
                  value={detailActividad.Actividad.Tipo.nombre} 
                  style={{ backgroundColor: detailActividad.Actividad.Tipo.color || '#eee' }} 
                />
              </div>
            </div>

            <Divider />

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Descripción</label>
              <p className="m-0 whitespace-pre-wrap">{detailActividad.Actividad.descripcion || 'Sin descripción'}</p>
            </div>

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Objetivos</label>
              <p className="m-0 whitespace-pre-wrap">{detailActividad.Actividad.objetivos || 'Sin objetivos definidos'}</p>
            </div>

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Materiales</label>
              <p className="m-0 whitespace-pre-wrap">{detailActividad.Actividad.materiales || 'Sin materiales especificados'}</p>
            </div>

            <Divider />

            <div>
              <label className="font-bold block text-sm text-color-secondary mb-1">Responsables</label>
              <div className="flex flex-col gap-1">
                {detailActividad.Responsables.length > 0 
                  ? detailActividad.Responsables.map((r: any) => (
                      <span key={r.Adulto.Miembro.id}>• {r.Adulto.Miembro.apellidos}, {r.Adulto.Miembro.nombre}</span>
                    ))
                  : 'Sin responsables asignados'}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
