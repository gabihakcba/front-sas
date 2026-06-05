'use client';

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { AsistenciaSabatinoItem } from '@/types/sabatinos';
import { getResponsiveDialogProps } from '@/lib/dialog';

interface AsistenciaSabatinoDialogProps {
  visible: boolean;
  onHide: () => void;
  sabatinoId: number;
  sabatinoTitulo: string;
  fetchAsistencia: (id: number) => Promise<AsistenciaSabatinoItem[]>;
  saveAsistencia: (id: number, payload: { asistencias: Array<{ idMiembro: number; asistio: boolean }> }) => Promise<any>;
}

export function AsistenciaSabatinoDialog({
  visible,
  onHide,
  sabatinoId,
  sabatinoTitulo,
  fetchAsistencia,
  saveAsistencia,
}: AsistenciaSabatinoDialogProps) {
  const [items, setItems] = useState<AsistenciaSabatinoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  const loadAsistencia = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAsistencia(sabatinoId);
      setItems(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'No tiene permisos para ver o registrar asistencia en este sabatino ya que no pertenece a ninguna de las ramas afectadas.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && sabatinoId) {
      void loadAsistencia();
    } else {
      setItems([]);
      setError('');
      setGlobalFilter('');
    }
  }, [visible, sabatinoId]);

  const handleToggleAttendance = (idMiembro: number, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.idMiembro === idMiembro ? { ...item, asistio: checked } : item))
    );
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        asistencias: items.map((item) => ({
          idMiembro: item.idMiembro,
          asistio: item.asistio,
        })),
      };
      await saveAsistencia(sabatinoId, payload);
      onHide();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar la asistencia.');
    } finally {
      setSubmitting(false);
    }
  };

  const header = (
    <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
      <div className="flex flex-col">
        <span className="text-xl font-bold">Asistencia de Protagonistas</span>
        <span className="text-sm text-color-secondary font-medium">{sabatinoTitulo}</span>
      </div>
      {!error && (
        <IconField iconPosition="right" className="w-full md:w-64">
          <InputText
            className="w-full p-inputtext-sm"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar por nombre, apellido o DNI"
          />
          <InputIcon className="pi pi-search" />
        </IconField>
      )}
    </div>
  );

  const filteredItems = items.filter((item) => {
    const term = globalFilter.toLowerCase().trim();
    if (!term) return true;
    return (
      item.nombre.toLowerCase().includes(term) ||
      item.apellidos.toLowerCase().includes(term) ||
      item.dni.toLowerCase().includes(term) ||
      (item.nombreRama && item.nombreRama.toLowerCase().includes(term))
    );
  });

  const footer = (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        iconPos="right"
        outlined
        size="small"
        onClick={onHide}
        disabled={submitting}
      />
      {!error && (
        <Button
          label="Guardar"
          icon="pi pi-check"
          iconPos="right"
          outlined
          size="small"
          onClick={handleSave}
          loading={submitting}
          disabled={loading}
        />
      )}
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      footer={footer}
      {...getResponsiveDialogProps('800px')}
    >
      {error ? (
        <div className="p-2">
          <Message severity="error" text={error} className="w-full" />
        </div>
      ) : loading ? (
        <div className="p-4 text-center">Cargando lista de protagonistas...</div>
      ) : (
        <DataTable
          value={filteredItems}
          className="p-datatable-sm"
          emptyMessage="No se encontraron protagonistas."
          responsiveLayout="scroll"
          rows={10}
          paginator
        >
          <Column
            header="Protagonista"
            body={(row: AsistenciaSabatinoItem) => (
              <span>
                {row.apellidos}, {row.nombre}
              </span>
            )}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="dni"
            header="DNI"
            style={{ width: '8rem' }}
            className="hidden md:table-cell"
            headerClassName="hidden md:table-cell"
          />
          <Column
            field="nombreRama"
            header="Rama"
            style={{ width: '10rem' }}
            className="hidden md:table-cell"
            headerClassName="hidden md:table-cell"
          />
          <Column
            header="Asistencia"
            body={(row: AsistenciaSabatinoItem) => (
              <Checkbox
                checked={row.asistio}
                onChange={(e) => handleToggleAttendance(row.idMiembro, e.checked ?? false)}
              />
            )}
            style={{ width: '6rem', textAlign: 'center' }}
          />
        </DataTable>
      )}
    </Dialog>
  );
}
