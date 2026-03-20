"use client";

import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getTipoActividadesRequest,
  createTipoActividadRequest,
  updateTipoActividadRequest,
  deleteTipoActividadRequest,
} from '@/queries/sabatinos';
import { TipoActividad } from '@/types/sabatinos';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { getResponsiveDialogProps } from '@/lib/dialog';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';

export default function TipoActividadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const [tipos, setTipos] = useState<TipoActividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoActividad | null>(null);

  // Form State
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({ nombre: '', color: 'FFFFFF' });
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const data = await getTipoActividadesRequest();
      setTipos(data);
    } catch (err) {
      setError('No se pudieron cargar los tipos de actividad.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTipos();
  }, []);

  const openCreate = () => {
    setMode('create');
    setFormValues({ nombre: '', color: 'FFFFFF' });
    setVisible(true);
  };

  const openEdit = () => {
    if (!selectedTipo) return;
    setMode('edit');
    setFormValues({
      nombre: selectedTipo.nombre,
      color: selectedTipo.color?.replace('#', '') || 'FFFFFF',
    });
    setVisible(true);
  };

  const handleSubmit = async () => {
    if (!formValues.nombre.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        nombre: formValues.nombre.trim(),
        color: `#${formValues.color}`,
      };

      if (mode === 'create') {
        await createTipoActividadRequest(payload);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Tipo creado correctamente.' });
      } else if (selectedTipo) {
        await updateTipoActividadRequest(selectedTipo.id, payload);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Tipo actualizado correctamente.' });
      }
      setVisible(false);
      setSelectedTipo(null);
      void fetchTipos();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar el tipo.';
      toast.current?.show({ severity: 'error', summary: 'Error', detail: Array.isArray(msg) ? msg[0] : msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!selectedTipo) return;
    confirmDelete({
      message: `¿Estás seguro de eliminar el tipo "${selectedTipo.nombre}"?`,
      onAccept: async () => {
        try {
          await deleteTipoActividadRequest(selectedTipo.id);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Tipo eliminado correctamente.' });
          setSelectedTipo(null);
          void fetchTipos();
        } catch (err: any) {
          const msg = err.response?.data?.message || 'No se pudo eliminar el tipo.';
          toast.current?.show({ severity: 'error', summary: 'Error', detail: msg });
        }
      },
    });
  };

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Button
          icon="pi pi-arrow-left"
          iconPos="right"
          outlined
          size="small"
          onClick={() => router.push('/dashboard/actividades')}
        />
        <h1 className="text-xl font-bold m-0 text-color">Tipos de Actividad</h1>
      </div>
      <ResponsiveTableActions
        crudActions={[
          { label: 'Crear', icon: 'pi pi-plus', onClick: openCreate },
          { label: 'Editar', icon: 'pi pi-pencil', onClick: openEdit, disabled: !selectedTipo },
          { label: 'Eliminar', icon: 'pi pi-trash', onClick: handleDelete, disabled: !selectedTipo, severity: 'danger' },
        ]}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      
      <Card>
        <DataTable
          value={tipos}
          loading={loading}
          header={header}
          selectionMode="single"
          selection={selectedTipo}
          onSelectionChange={(e) => setSelectedTipo(e.value as TipoActividad)}
          dataKey="id"
          className="p-datatable-sm"
          emptyMessage="No hay tipos de actividad cargados."
        >
          <Column field="id" header="ID" style={{ width: '5rem' }} />
          <Column field="nombre" header="Nombre" sortable />
          <Column 
            header="Color" 
            body={(rowData: TipoActividad) => (
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-surface-300" 
                  style={{ backgroundColor: rowData.color || '#fff' }} 
                />
                <span className="font-mono text-xs">{rowData.color}</span>
              </div>
            )} 
          />
        </DataTable>
      </Card>

      <Dialog
        header={mode === 'create' ? 'Nuevo Tipo de Actividad' : 'Editar Tipo de Actividad'}
        visible={visible}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" iconPos="right" outlined size="small" onClick={() => setVisible(false)} />
            <Button label="Guardar" icon="pi pi-check" iconPos="right" outlined size="small" onClick={handleSubmit} loading={submitting} />
          </div>
        }
        {...getResponsiveDialogProps('400px')}
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="nombre">Nombre *</label>
            <InputText
              id="nombre"
              value={formValues.nombre}
              onChange={(e) => setFormValues({ ...formValues, nombre: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="color">Color Representativo</label>
            <div className="flex items-center gap-3">
              <ColorPicker
                id="color"
                value={formValues.color}
                onChange={(e) => setFormValues({ ...formValues, color: e.value as string })}
              />
              <span className="font-mono">#{formValues.color}</span>
            </div>
          </div>
        </div>
      </Dialog>

      {deleteConfirmDialog}
    </div>
  );
}
