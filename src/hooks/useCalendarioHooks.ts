'use client';

import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { DatesSetArg, EventInput } from '@fullcalendar/core';
import {
  getCalendarCumpleaniosRequest,
  getCalendarConsejosRequest,
  getCalendarEventosRequest,
  getEventosOptionsRequest,
} from '@/queries/eventos';
import {
  CalendarBirthday,
  CalendarConsejo,
  EventoOption,
  EventoRamaOption,
} from '@/types/eventos';

export type CalendarSource = 'eventos' | 'consejos' | 'cumpleanios';
export type CalendarBirthdayMemberType =
  | 'protagonista'
  | 'responsable'
  | 'adulto'
  | null;

type CalendarSourceOption = {
  label: string;
  value: CalendarSource;
};

const DEFAULT_CALENDAR_SOURCES: CalendarSource[] = ['eventos', 'consejos'];

const calendarSourceOptions: CalendarSourceOption[] = [
  { label: 'Eventos', value: 'eventos' },
  { label: 'Consejos', value: 'consejos' },
  { label: 'Cumpleaños', value: 'cumpleanios' },
];

const calendarBirthdayMemberTypeOptions: Array<{
  label: string;
  value: CalendarBirthdayMemberType;
}> = [
  { label: 'Todos', value: null },
  { label: 'Protagonistas', value: 'protagonista' },
  { label: 'Responsables', value: 'responsable' },
  { label: 'Adultos', value: 'adulto' },
];

const ramaBirthdayColors: Record<string, string> = {
  Castores: '#f97316',
  Manada: '#eab308',
  Unidad: '#22c55e',
  Caminantes: '#3b82f6',
  Rovers: '#ef4444',
};

const ramaStripeOrder = ['Castores', 'Manada', 'Unidad', 'Caminantes', 'Rovers'];
const eventCalendarColor = '#b8f2e6';
const consejoCalendarColor = '#c7d2fe';
const adultBirthdayColor = '#a855f7';
const defaultBirthdayColor = 'var(--surface-500)';

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message)) {
      return message.join(' ');
    }
  }

  return fallback;
};

export const useCalendarioHook = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedSources, setSelectedSources] =
    useState<CalendarSource[]>(DEFAULT_CALENDAR_SOURCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipoEventoOptions, setTipoEventoOptions] = useState<EventoOption[]>([]);
  const [areaOptions, setAreaOptions] = useState<EventoOption[]>([]);
  const [ramaOptions, setRamaOptions] = useState<EventoRamaOption[]>([]);
  const [selectedTipoEventoId, setSelectedTipoEventoId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedRamaId, setSelectedRamaId] = useState<number | null>(null);
  const [selectedBirthdayMemberType, setSelectedBirthdayMemberType] =
    useState<CalendarBirthdayMemberType>(null);
  const [visibleRange, setVisibleRange] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const fetchCalendarData = async (
    from: string,
    to: string,
    sources: CalendarSource[],
    idTipo: number | null,
    idArea: number | null,
    idRama: number | null,
    birthdayMemberType: CalendarBirthdayMemberType,
  ) => {
    setLoading(true);
    setError('');

    try {
      const requests: Array<Promise<EventInput[]>> = [];

      if (sources.includes('eventos')) {
        requests.push(
          getCalendarEventosRequest({ from, to, idTipo, idArea, idRama }).then((response) =>
            response.map((item) => {
              const orderedRamaStripeColors = ramaStripeOrder
                .filter((ramaNombre) =>
                  item.RamaAfectada.some((ramaAfectada) => ramaAfectada.Rama.nombre === ramaNombre),
                )
                .map((ramaNombre) => ramaBirthdayColors[ramaNombre])
                .filter(Boolean);
              const hasNonRamaArea = item.AreaAfectada.some(
                (areaAfectada) => areaAfectada.Area.nombre !== 'Rama',
              );
              const stripeColors = hasNonRamaArea
                ? [...orderedRamaStripeColors, adultBirthdayColor]
                : orderedRamaStripeColors;

              return {
                id: `evento-${item.id}`,
                title: item.nombre,
                start: item.fecha_inicio,
                end: dayjs(item.fecha_fin).add(1, 'day').toISOString(),
                allDay: true,
                backgroundColor: eventCalendarColor,
                borderColor: eventCalendarColor,
                textColor: '#134e4a',
                extendedProps: {
                  source: 'eventos',
                  tipo: item.TipoEvento.nombre,
                  lugar: item.lugar,
                  terminado: item.terminado,
                  descripcion: item.descripcion,
                  stripeColors,
                },
              };
            }),
          ),
        );
      }

      if (sources.includes('consejos')) {
        requests.push(
          getCalendarConsejosRequest({ from, to }).then((response) =>
            response.map((item: CalendarConsejo) => ({
              id: `consejo-${item.id}`,
              title: item.nombre,
              start: item.fecha,
              end: dayjs(item.fecha).add(1, 'day').toISOString(),
              allDay: true,
              backgroundColor: consejoCalendarColor,
              borderColor: consejoCalendarColor,
              textColor: '#312e81',
              extendedProps: {
                source: 'consejos',
                descripcion: item.descripcion,
                esOrdinario: item.es_ordinario,
                horaInicio: item.hora_inicio,
                horaFin: item.hora_fin,
              },
            })),
          ),
        );
      }

      if (sources.includes('cumpleanios')) {
        requests.push(
          getCalendarCumpleaniosRequest({ from, to }).then((response) =>
            response
              .filter((item: CalendarBirthday) =>
                birthdayMemberType === null
                  ? true
                  : item.tipoMiembro === birthdayMemberType,
              )
              .map((item) => ({
              ...(item.ramaNombre
                ? {
                    classNames: ['calendar-birthday-with-rama'],
                  }
                : {}),
              id: `cumple-${item.id}`,
              title: `Cumple: ${item.nombreCompleto}`,
              start: item.fecha,
              end: dayjs(item.fecha).add(1, 'day').toISOString(),
              allDay: true,
              backgroundColor:
                item.tipoMiembro === 'adulto'
                  ? adultBirthdayColor
                  : item.ramaNombre
                    ? ramaBirthdayColors[item.ramaNombre] ?? defaultBirthdayColor
                    : defaultBirthdayColor,
              borderColor:
                item.tipoMiembro === 'adulto'
                  ? adultBirthdayColor
                  : item.ramaNombre
                    ? ramaBirthdayColors[item.ramaNombre] ?? defaultBirthdayColor
                    : defaultBirthdayColor,
              textColor: '#ffffff',
              extendedProps: {
                source: 'cumpleanios',
                dni: item.dni,
                tipoMiembro: item.tipoMiembro,
                ramaNombre: item.ramaNombre,
                areaNombre: item.areaNombre,
                stripeColor: item.ramaNombre
                  ? ramaBirthdayColors[item.ramaNombre] ?? defaultBirthdayColor
                  : null,
              },
            })),
          ),
        );
      }

      const results = await Promise.all(requests);
      setEvents(results.flat());
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron cargar los datos del calendario.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await getEventosOptionsRequest();
        setTipoEventoOptions(response.tipos);
        setAreaOptions(response.areas);
        setRamaOptions(response.ramas);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'No se pudieron cargar los tipos de evento.'));
      }
    };

    void fetchOptions();
  }, []);

  useEffect(() => {
    if (!visibleRange) {
      return;
    }

    void fetchCalendarData(
      visibleRange.from,
      visibleRange.to,
      selectedSources,
      selectedTipoEventoId,
      selectedAreaId,
      selectedRamaId,
      selectedBirthdayMemberType,
    );
  }, [
    selectedAreaId,
    selectedBirthdayMemberType,
    selectedRamaId,
    selectedSources,
    selectedTipoEventoId,
    visibleRange,
  ]);

  useEffect(() => {
    if (selectedRamaId === null) {
      setSelectedAreaId(null);
      return;
    }

    const selectedRama = ramaOptions.find((rama) => rama.id === selectedRamaId);

    if (!selectedRama) {
      return;
    }

    setSelectedAreaId(selectedRama.id_area);
  }, [ramaOptions, selectedRamaId]);

  const handleDatesSet = (arg: DatesSetArg) => {
    setVisibleRange({
      from: dayjs(arg.start).startOf('day').toISOString(),
      to: dayjs(arg.end).endOf('day').toISOString(),
    });
  };

  return {
    events,
    selectedSources,
    sourceOptions: calendarSourceOptions,
    loading,
    error,
    tipoEventoOptions,
    areaOptions,
    ramaOptions,
    selectedTipoEventoId,
    selectedAreaId,
    selectedRamaId,
    selectedBirthdayMemberType,
    birthdayMemberTypeOptions: calendarBirthdayMemberTypeOptions,
    filtersVisible,
    setSelectedSources,
    setSelectedTipoEventoId,
    setSelectedAreaId,
    setSelectedRamaId,
    setSelectedBirthdayMemberType,
    setFiltersVisible,
    handleDatesSet,
  };
};
