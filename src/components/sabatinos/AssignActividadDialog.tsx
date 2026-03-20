'use client';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Sabatino } from '@/types/sabatinos';
import { getResponsiveDialogProps } from '@/lib/dialog';

interface Props {
  visible: boolean;
  onHide: () => void;
  sabatino: Sabatino;
  options: any;
  onAssign: (sabatinoId: number, actividades: Array<{ actividadId: number; numero?: number; fecha?: string }>) => void;
  onCreateNew: () => void;
}

export function AssignActividadDialog({
  visible,
  onHide,
  sabatino,
  options,
  onAssign,
  onCreateNew,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (visible && sabatino.Actividades) {
      setSelectedIds(sabatino.Actividades.map((a) => a.Actividad.id));
    }
  }, [visible, sabatino]);

  const handleSave = () => {
    const actividadesPayload = selectedIds.map(id => {
      const existing = sabatino.Actividades?.find(a => a.Actividad.id === id);
      return {
        actividadId: id,
        numero: existing?.numero ?? undefined,
        fecha: existing?.fecha ?? dayjs(sabatino.fecha_inicio).toISOString(),
        responsableIds: existing?.Responsables?.map((r: any) => r.Adulto.id) ?? [],
      };
    });
    onAssign(sabatino.id, actividadesPayload);
  };

  const footer = (
    <div className="flex justify-between w-full">
      <Button
        label="Nueva Actividad"
        icon="pi pi-plus"
        severity="success"
        onClick={onCreateNew}
        outlined
        size="small"
      />
      <div className="flex gap-2">
        <Button label="Cancelar" icon="pi pi-times" onClick={onHide} outlined size="small" />
        <Button
          label="Guardar Cambios"
          icon="pi pi-check"
          onClick={handleSave}
          size="small"
          outlined
        />
      </div>
    </div>
  );

  return (
    <Dialog
      header={`Actividades de: ${sabatino.titulo}`}
      visible={visible}
      onHide={onHide}
      footer={footer}
      {...getResponsiveDialogProps('600px')}
    >
      <div className="flex flex-col gap-4 mt-2">
        <p className="text-sm text-color-secondary">
          Selecciona las actividades que forman parte de este sabatino o crea una nueva.
        </p>
        <div className="flex flex-col gap-2">
          <label htmlFor="actividades">Actividades Existentes</label>
          <MultiSelect
            id="actividades"
            value={selectedIds}
            options={options.todasActividades}
            optionLabel="nombre"
            optionValue="id"
            onChange={(e) => setSelectedIds(e.value)}
            placeholder="Seleccionar actividades"
            filter
            className="w-full"
            display="chip"
          />
        </div>
      </div>
    </Dialog>
  );
}
