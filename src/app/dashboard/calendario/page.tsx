'use client';

import dayjs from 'dayjs';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import { DatesSetArg, EventClickArg } from '@fullcalendar/core';
import { MouseEvent, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Sidebar } from 'primereact/sidebar';
import { FormEvent } from 'primereact/ts-helpers';
import { EventContentArg } from '@fullcalendar/core';
import CalendarioFiltersSidebar from '@/components/calendario/CalendarioFiltersSidebar';
import { useCalendarioHook } from '@/hooks/useCalendarioHooks';
import { getResponsiveDialogProps } from '@/lib/dialog';

function renderCalendarEventContent(eventInfo: EventContentArg) {
  const stripeColor = eventInfo.event.extendedProps.stripeColor as string | null;
  const stripeColors = eventInfo.event.extendedProps.stripeColors as string[] | undefined;
  const effectiveStripeColors =
    stripeColors && stripeColors.length > 0
      ? stripeColors
      : stripeColor
        ? [stripeColor]
        : [];

  return (
    <div className="calendar-event-content">
      {effectiveStripeColors.length > 0 ? (
        <span className="calendar-event-stripes">
          {effectiveStripeColors.map((color) => (
            <span
              key={`${eventInfo.event.id}-${color}`}
              className="calendar-event-stripe"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
      ) : null}
      <span className="calendar-event-title">{eventInfo.event.title}</span>
    </div>
  );
}

type NavigationOption = {
  value: 'prev' | 'next';
  icon: string;
};

type ViewOption = {
  label: string;
  value: 'dayGridMonth' | 'multiMonthSemester' | 'multiMonthYear';
};

interface CalendarExtendedProps {
  source?: 'eventos' | 'consejos' | 'cumpleanios';
  tipo?: string;
  lugar?: string | null;
  descripcion?: string | null;
  esOrdinario?: boolean;
  horaInicio?: string | null;
  horaFin?: string | null;
  tipoMiembro?: 'protagonista' | 'responsable' | 'adulto' | 'otro';
  ramaNombre?: string | null;
  areaNombre?: string | null;
}

interface CalendarDayListItem {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  extendedProps?: CalendarExtendedProps;
}

const navigationOptions: NavigationOption[] = [
  { value: 'prev', icon: 'pi pi-chevron-left' },
  { value: 'next', icon: 'pi pi-chevron-right' },
];

const viewOptions: ViewOption[] = [
  { label: 'Mes', value: 'dayGridMonth' },
  { label: 'Semestre', value: 'multiMonthSemester' },
  { label: 'Año', value: 'multiMonthYear' },
];

export default function CalendarioPage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [titlePickerVisible, setTitlePickerVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [pickerDate, setPickerDate] = useState<Date | null>(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDayItems, setSelectedDayItems] = useState<CalendarDayListItem[]>([]);
  const {
    events,
    sourceOptions,
    loading,
    error,
    tipoEventoOptions,
    areaOptions,
    ramaOptions,
    birthdayMemberTypeOptions,
    selectedSources,
    selectedTipoEventoId,
    selectedAreaId,
    selectedRamaId,
    selectedBirthdayMemberType,
    filtersVisible,
    setSelectedSources,
    setSelectedTipoEventoId,
    setSelectedAreaId,
    setSelectedRamaId,
    setSelectedBirthdayMemberType,
    setFiltersVisible,
    handleDatesSet,
  } = useCalendarioHook();

  const handleCalendarDatesSet = (arg: DatesSetArg) => {
    setCurrentTitle(arg.view.title);
    setCurrentView(arg.view.type);
    setPickerDate(arg.start);
    handleDatesSet(arg);
  };

  const handleNavigate = (action: 'prev' | 'next') => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      return;
    }

    if (action === 'prev') {
      api.prev();
      return;
    }

    if (action === 'next') {
      api.next();
    }
  };

  const handleChangeView = (view: 'dayGridMonth' | 'multiMonthSemester' | 'multiMonthYear') => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      return;
    }

    api.changeView(view);
  };

  const handlePickerChange = (event: FormEvent<Date | null>) => {
    const selectedValue = event.value;
    const nextDate =
      selectedValue instanceof Date
        ? selectedValue
        : Array.isArray(selectedValue)
          ? (selectedValue[0] ?? null)
          : null;

    if (!nextDate) {
      return;
    }

    setPickerDate(nextDate);
    calendarRef.current?.getApi().gotoDate(nextDate);
    setTitlePickerVisible(false);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX ?? null;

    touchStartXRef.current = null;

    if (startX === null || endX === null) {
      return;
    }

    const diffX = endX - startX;

    if (Math.abs(diffX) < 48) {
      return;
    }

    if (diffX < 0) {
      handleNavigate('next');
      return;
    }

    handleNavigate('prev');
  };

  const openDayDialog = (date: Date) => {
    const targetDay = dayjs(date).format('YYYY-MM-DD');
    const items = events.filter((item) => {
      const start = item.start ? dayjs(item.start as string) : null;
      const end = item.end ? dayjs(item.end as string).subtract(1, 'day') : start;
      const target = dayjs(targetDay);

      if (!start || !end) {
        return false;
      }

      return !target.isBefore(start.startOf('day')) && !target.isAfter(end.endOf('day'));
    }) as CalendarDayListItem[];

    setSelectedDay(targetDay);
    setSelectedDayItems(items);
  };

  const handleEventClick = (arg: EventClickArg) => {
    openDayDialog(arg.event.start ?? new Date());
  };

  const handleCalendarContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest('.fc-event')) {
      return;
    }

    const dayCell = target.closest<HTMLElement>('[data-date]');

    if (!dayCell) {
      return;
    }

    const dateValue = dayCell.dataset.date;

    if (!dateValue) {
      return;
    }

    const parsedDate = dayjs(dateValue, 'YYYY-MM-DD', true);

    if (!parsedDate.isValid()) {
      return;
    }

    openDayDialog(parsedDate.toDate());
  };

  return (
    <>
      <Sidebar
        visible={filtersVisible}
        position="right"
        onHide={() => setFiltersVisible(false)}
        className="w-full sm:w-24rem"
      >
        <CalendarioFiltersSidebar
          selectedSources={selectedSources}
          sourceOptions={sourceOptions}
          tipoEventoOptions={tipoEventoOptions}
          areaOptions={areaOptions}
          ramaOptions={ramaOptions}
          birthdayMemberTypeOptions={birthdayMemberTypeOptions}
          selectedTipoEventoId={selectedTipoEventoId}
          selectedAreaId={selectedAreaId}
          selectedRamaId={selectedRamaId}
          selectedBirthdayMemberType={selectedBirthdayMemberType}
          onSourcesChange={setSelectedSources}
          onTipoEventoChange={setSelectedTipoEventoId}
          onAreaChange={setSelectedAreaId}
          onRamaChange={setSelectedRamaId}
          onBirthdayMemberTypeChange={setSelectedBirthdayMemberType}
          onClose={() => setFiltersVisible(false)}
        />
      </Sidebar>

      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="m-0 text-2xl font-semibold">Calendario</h1>
              <p className="m-0">
                Visualizá eventos, consejos y cumpleaños del grupo por mes, semestre o año.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                label="Filtros"
                icon="pi pi-sliders-h"
                iconPos="right"
                outlined
                size="small"
                onClick={() => setFiltersVisible(true)}
              />
            </div>
          </div>

          {error ? <Message severity="error" text={error} /> : null}

          {loading ? (
            <div className="flex justify-center py-8">
              <ProgressSpinner
                style={{ width: '48px', height: '48px' }}
                strokeWidth="4"
              />
            </div>
          ) : null}

          <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="hidden md:block">
              <SelectButton
                value={null}
                options={navigationOptions}
                itemTemplate={(option: NavigationOption) => <i className={option.icon} />}
                onChange={(event: SelectButtonChangeEvent) => {
                  if (event.value) {
                    handleNavigate(event.value as 'prev' | 'next');
                  }
                }}
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                label={currentTitle || 'Seleccionar fecha'}
                icon="pi pi-angle-down"
                iconPos="right"
                outlined
                size="small"
                onClick={() => setTitlePickerVisible(true)}
              />
            </div>
            <SelectButton
              value={currentView}
              options={viewOptions}
              optionLabel="label"
              optionValue="value"
              onChange={(event: SelectButtonChangeEvent) => {
                if (event.value) {
                  handleChangeView(
                    event.value as 'dayGridMonth' | 'multiMonthSemester' | 'multiMonthYear',
                  );
                }
              }}
            />
          </div>

          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleCalendarContainerClick}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, multiMonthPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              height="auto"
              datesSet={handleCalendarDatesSet}
              events={events}
              headerToolbar={{
                left: '',
                center: '',
                right: '',
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' },
                },
                multiMonthSemester: {
                  type: 'multiMonth',
                  duration: { months: 6 },
                  multiMonthMaxColumns: 3,
                  titleFormat: (arg) =>
                    `${dayjs(arg.start.marker).format('MMMM YYYY')} - ${dayjs(
                      arg.end?.marker ?? arg.start.marker,
                    )
                      .subtract(1, 'day')
                      .format('MMMM YYYY')}`,
                  buttonText: 'Semestre',
                },
                multiMonthYear: {
                  type: 'multiMonth',
                  duration: { years: 1 },
                  titleFormat: { year: 'numeric' },
                  buttonText: 'Año',
                },
              }}
              fixedWeekCount={false}
              showNonCurrentDates={false}
              eventDisplay="block"
              eventContent={renderCalendarEventContent}
              eventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      <Dialog
        visible={titlePickerVisible}
        onHide={() => setTitlePickerVisible(false)}
        header="Seleccionar fecha"
        {...getResponsiveDialogProps('28rem')}
      >
        <Calendar
          inline
          value={pickerDate}
          onChange={handlePickerChange}
          viewDate={pickerDate ?? undefined}
          monthNavigator
          yearNavigator
          yearRange="2000:2100"
          showButtonBar
          dateFormat="dd/mm/yy"
          className="w-full"
        />
      </Dialog>

      <Dialog
        visible={selectedDay !== null}
        onHide={() => {
          setSelectedDay(null);
          setSelectedDayItems([]);
        }}
        header={
          selectedDay
            ? `Agenda del ${dayjs(selectedDay).format('DD/MM/YYYY')}`
            : 'Agenda del día'
        }
        {...getResponsiveDialogProps('36rem')}
      >
        <div className="flex flex-col gap-3 break-words">
          {selectedDayItems.length === 0 ? (
            <Message severity="info" text="No hay eventos ni cumpleaños cargados para este día." />
          ) : (
            selectedDayItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded border border-surface-300 p-3 break-words"
              >
                <div className="font-semibold break-words whitespace-normal">
                  {item.title}
                </div>
                {item.extendedProps?.source === 'eventos' ? (
                  <div className="flex flex-col gap-1 text-sm break-words whitespace-normal">
                    <span>Tipo: {item.extendedProps.tipo ?? '-'}</span>
                    {item.extendedProps.lugar ? (
                      <span>Lugar: {item.extendedProps.lugar}</span>
                    ) : null}
                    <span>
                      Fecha: {dayjs(item.start).format('DD/MM/YYYY')} -{' '}
                      {dayjs(item.end ?? item.start).subtract(1, 'day').format('DD/MM/YYYY')}
                    </span>
                    {item.extendedProps.descripcion ? (
                      <span>Descripción: {item.extendedProps.descripcion}</span>
                    ) : null}
                  </div>
                ) : item.extendedProps?.source === 'consejos' ? (
                  <div className="flex flex-col gap-1 text-sm break-words whitespace-normal">
                    <span>Tipo: Consejo</span>
                    <span>
                      Modalidad:{' '}
                      {item.extendedProps.esOrdinario ? 'Ordinario' : 'Extraordinario'}
                    </span>
                    <span>Fecha: {dayjs(item.start).format('DD/MM/YYYY')}</span>
                    {item.extendedProps.horaInicio ? (
                      <span>
                        Hora inicio:{' '}
                        {dayjs(`1970-01-01T${item.extendedProps.horaInicio}`).format('HH:mm')}
                      </span>
                    ) : null}
                    {item.extendedProps.horaFin ? (
                      <span>
                        Hora fin:{' '}
                        {dayjs(`1970-01-01T${item.extendedProps.horaFin}`).format('HH:mm')}
                      </span>
                    ) : null}
                    {item.extendedProps.descripcion ? (
                      <span>Descripción: {item.extendedProps.descripcion}</span>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 text-sm break-words whitespace-normal">
                    <span>Tipo: Cumpleaños</span>
                    <span>Miembro: {item.extendedProps?.tipoMiembro ?? '-'}</span>
                    {item.extendedProps?.ramaNombre ? (
                      <span>Rama: {item.extendedProps.ramaNombre}</span>
                    ) : null}
                    {item.extendedProps?.areaNombre ? (
                      <span>Área: {item.extendedProps.areaNombre}</span>
                    ) : null}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Dialog>
    </>
  );
}
