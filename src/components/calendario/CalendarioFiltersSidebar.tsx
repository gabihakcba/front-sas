'use client';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { CalendarSource } from '@/hooks/useCalendarioHooks';
import { EventoOption, EventoRamaOption } from '@/types/eventos';

interface CalendarioFiltersSidebarProps {
  selectedSources: CalendarSource[];
  sourceOptions: Array<{ label: string; value: CalendarSource }>;
  tipoEventoOptions: EventoOption[];
  areaOptions: EventoOption[];
  ramaOptions: EventoRamaOption[];
  selectedTipoEventoId: number | null;
  selectedAreaId: number | null;
  selectedRamaId: number | null;
  onSourcesChange: (value: CalendarSource[]) => void;
  onTipoEventoChange: (value: number | null) => void;
  onAreaChange: (value: number | null) => void;
  onRamaChange: (value: number | null) => void;
  onClose?: () => void;
}

export default function CalendarioFiltersSidebar(
  props: CalendarioFiltersSidebarProps,
) {
  const tipoEventoDropdownOptions = [
    { label: 'Todos', value: null },
    ...props.tipoEventoOptions.map((tipo) => ({
      label: tipo.nombre,
      value: tipo.id,
    })),
  ];
  const areaDropdownOptions = [
    { label: 'Todas', value: null },
    ...props.areaOptions.map((area) => ({
      label: area.nombre,
      value: area.id,
    })),
  ];
  const ramaDropdownOptions = [
    { label: 'Todas', value: null },
    ...props.ramaOptions
      .filter((rama) =>
        props.selectedAreaId === null ? true : rama.id_area === props.selectedAreaId,
      )
      .map((rama) => ({
        label: rama.nombre,
        value: rama.id,
      })),
  ];
  const eventosDisabled = !props.selectedSources.includes('eventos');

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-lg font-semibold">Filtros</h2>
        {props.onClose ? (
          <Button
            type="button"
            icon="pi pi-times"
            text
            size="small"
            onClick={props.onClose}
          />
        ) : null}
      </div>

      <div>
        <label htmlFor="calendar-source-filter" className="mb-2 block">
          Mostrar
        </label>
        <MultiSelect
          inputId="calendar-source-filter"
          value={props.selectedSources}
          options={props.sourceOptions}
          optionLabel="label"
          optionValue="value"
          display="chip"
          className="w-full"
          onChange={(event: MultiSelectChangeEvent) =>
            props.onSourcesChange((event.value as CalendarSource[]) ?? [])
          }
        />
      </div>

      <div>
        <label htmlFor="calendar-tipo-filter" className="mb-2 block">
          Tipo de evento
        </label>
        <Dropdown
          id="calendar-tipo-filter"
          value={props.selectedTipoEventoId}
          onChange={(event) => props.onTipoEventoChange(event.value as number | null)}
          options={tipoEventoDropdownOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Todos"
          disabled={eventosDisabled}
          showClear
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="calendar-area-filter" className="mb-2 block">
          Area afectada
        </label>
        <Dropdown
          id="calendar-area-filter"
          value={props.selectedAreaId}
          onChange={(event) => props.onAreaChange(event.value as number | null)}
          options={areaDropdownOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Todas"
          disabled={eventosDisabled}
          showClear
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="calendar-rama-filter" className="mb-2 block">
          Rama afectada
        </label>
        <Dropdown
          id="calendar-rama-filter"
          value={props.selectedRamaId}
          onChange={(event) => props.onRamaChange(event.value as number | null)}
          options={ramaDropdownOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Todas"
          disabled={eventosDisabled}
          showClear
          className="w-full"
        />
      </div>
    </div>
  );
}
