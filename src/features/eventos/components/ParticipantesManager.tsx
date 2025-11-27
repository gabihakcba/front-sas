import React, { useState, useMemo } from 'react';
import { GenericDataTable } from '@/common/components/GenericDataTable';
import { Evento } from '@/common/types/evento';
import { InscripcionRow } from '@/common/types/inscripcion';
import { TableColumn } from '@/common/types/table';
import { RESOURCE } from '@/common/types/rbac';
import {
  useInscripcionesEventoQuery,
  useInscribirMiembroMutation,
  useCancelarInscripcionMutation,
} from '@/hooks/queries/useInscripciones';
import { useMiembrosQuery } from '@/hooks/queries/useMiembros';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '@/providers/ToastProvider';
import { Accordion, AccordionTab } from 'primereact/accordion';

interface ParticipantesManagerProps {
  evento: Evento;
  onClose: () => void;
}

export const ParticipantesManager: React.FC<ParticipantesManagerProps> = ({
  evento,
  onClose,
}) => {
  const { data: inscripciones, isLoading } = useInscripcionesEventoQuery(
    evento.id
  );

  // Default empty groups if data is loading or undefined
  const {
    educadores = [],
    protagonistas = [],
    adultos = [],
    responsables = [],
  } = inscripciones || {};

  const { data: miembros = [] } = useMiembrosQuery();
  const inscribirMutation = useInscribirMiembroMutation();
  const cancelarMutation = useCancelarInscripcionMutation();
  const { showSuccessToast, showErrorToast } = useToast();

  const [selectedMiembroId, setSelectedMiembroId] = useState<number | null>(
    null
  );

  const handleInscribir = () => {
    if (!selectedMiembroId) return;

    inscribirMutation.mutate(
      {
        id_evento: evento.id,
        id_miembro: selectedMiembroId,
      },
      {
        onSuccess: () => {
          showSuccessToast('Éxito', 'Miembro inscripto correctamente');
          setSelectedMiembroId(null);
        },
        onError: () => {
          showErrorToast('Error', 'Error al inscribir miembro');
        },
      }
    );
  };

  const handleCancelar = (idInscripcion: number) => {
    confirmDialog({
      message: '¿Está seguro de cancelar esta inscripción?',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        cancelarMutation.mutate(idInscripcion, {
          onSuccess: () => {
            showSuccessToast('Éxito', 'Inscripción cancelada');
          },
          onError: () => {
            showErrorToast('Error', 'Error al cancelar inscripción');
          },
        });
      },
    });
  };

  const baseColumns: TableColumn<InscripcionRow>[] = [
    {
      field: 'nombre',
      header: 'Nombre',
      body: (rowData: InscripcionRow) =>
        `${rowData.nombre} ${rowData.apellidos}`,
      sortable: true,
    },
    {
      field: 'dni',
      header: 'DNI',
      sortable: true,
    },
    {
      field: 'pagado',
      header: 'Pagado',
      body: (rowData: InscripcionRow) => (
        <i
          className={`pi ${
            rowData.pagado
              ? 'pi-check-circle text-green-500'
              : 'pi-times-circle text-red-500'
          }`}
        ></i>
      ),
    },
    {
      field: 'asistio',
      header: 'Asistió',
      body: (rowData: InscripcionRow) => (
        <i
          className={`pi ${
            rowData.asistio
              ? 'pi-check-circle text-green-500'
              : 'pi-times-circle text-red-500'
          }`}
        ></i>
      ),
    },
  ];

  const ramaColumn: TableColumn<InscripcionRow> = {
    field: 'rama',
    header: 'Rama',
    body: (rowData: InscripcionRow) => (
      <Tag
        value={rowData.rama || 'Sin Rama'}
        severity="info"
      />
    ),
  };

  const areaColumn: TableColumn<InscripcionRow> = {
    field: 'area',
    header: 'Área',
    body: (rowData: InscripcionRow) => (
      <Tag
        value={rowData.area || 'Sin Área'}
        severity="warning"
      />
    ),
  };

  const actions = (rowData: InscripcionRow) => (
    <Button
      icon="pi pi-trash"
      severity="danger"
      rounded
      outlined
      size="small"
      onClick={() => handleCancelar(rowData.id)}
      tooltip="Cancelar Inscripción"
    />
  );

  // Filter out members already registered
  const allInscripciones = useMemo(
    () => [...educadores, ...protagonistas, ...adultos, ...responsables],
    [educadores, protagonistas, adultos, responsables]
  );

  const availableMiembros = miembros.filter(
    (m) => !allInscripciones.some((i) => i.id_miembro === m.id)
  );

  const miembrosOptions = availableMiembros.map((m) => ({
    label: `${m.nombre} ${m.apellidos} (${m.dni})`,
    value: m.id,
  }));

  const renderTable = (
    data: InscripcionRow[],
    columns: TableColumn<InscripcionRow>[],
    emptyMsg: string
  ) => (
    <GenericDataTable
      data={data}
      columns={columns}
      rowActions={actions}
      isLoading={isLoading}
      title=""
      permissionResource={RESOURCE.EVENTO}
      emptyMessage={emptyMsg}
    />
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">
          Participantes: {evento.nombre}
        </h2>
        <Button
          icon="pi pi-times"
          rounded
          text
          severity="secondary"
          onClick={onClose}
        />
      </div>

      <div className="p-4 flex gap-2 items-end bg-slate-800/50 rounded-lg mx-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Agregar Participante
          </label>
          <Dropdown
            value={selectedMiembroId}
            onChange={(e) => setSelectedMiembroId(e.value)}
            options={miembrosOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Buscar miembro..."
            filter
            className="w-full"
            virtualScrollerOptions={{ itemSize: 38 }}
          />
        </div>
        <Button
          label="Inscribir"
          icon="pi pi-plus"
          onClick={handleInscribir}
          disabled={!selectedMiembroId || inscribirMutation.isPending}
          loading={inscribirMutation.isPending}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <Accordion
          multiple
          activeIndex={[0, 1]}
        >
          <AccordionTab header={`Educadores (Rama) (${educadores.length})`}>
            {renderTable(
              educadores,
              [...baseColumns, ramaColumn],
              'No hay educadores inscriptos.'
            )}
          </AccordionTab>
          <AccordionTab header={`Protagonistas (${protagonistas.length})`}>
            {renderTable(
              protagonistas,
              [...baseColumns, ramaColumn],
              'No hay protagonistas inscriptos.'
            )}
          </AccordionTab>
          <AccordionTab header={`Staff / Áreas (${adultos.length})`}>
            {renderTable(
              adultos,
              [...baseColumns, areaColumn],
              'No hay adultos inscriptos.'
            )}
          </AccordionTab>
          <AccordionTab
            header={`Familiares Colaboradores (${responsables.length})`}
          >
            {renderTable(
              responsables,
              baseColumns,
              'No hay familiares inscriptos.'
            )}
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
};
