'use client';

import dayjs from 'dayjs';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { EventContentArg } from '@fullcalendar/core';
import CalendarioFiltersSidebar from '@/components/calendario/CalendarioFiltersSidebar';
import { useCalendarioHook } from '@/hooks/useCalendarioHooks';

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

export default function CalendarioPage() {
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
                Visualizá eventos y cumpleaños del grupo por mes, semestre o año.
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

          <FullCalendar
            plugins={[dayGridPlugin, multiMonthPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            height="auto"
            datesSet={handleDatesSet}
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,multiMonthSemester,multiMonthYear',
            }}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
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
          />
        </div>
      </div>
    </>
  );
}
