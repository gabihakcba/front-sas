const ARGENTINA_LOCALE = 'es-AR';
const ARGENTINA_TIME_ZONE = 'America/Argentina/Buenos_Aires';

export const formatArgentinaDate = (value: Date | string) =>
  new Intl.DateTimeFormat(ARGENTINA_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: ARGENTINA_TIME_ZONE,
  }).format(new Date(value));

export const formatArgentinaTime = (value: Date | string) =>
  new Intl.DateTimeFormat(ARGENTINA_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ARGENTINA_TIME_ZONE,
  }).format(new Date(value));

export const formatArgentinaDateTime = (value: Date | string) =>
  `${formatArgentinaDate(value)} ${formatArgentinaTime(value)}`;

export const formatArgentinaTimeRange = (
  start?: Date | string | null,
  end?: Date | string | null,
) => {
  if (!start && !end) {
    return '-';
  }

  const startLabel = start ? formatArgentinaTime(start) : '--:--';
  const endLabel = end ? formatArgentinaTime(end) : '--:--';

  return `${startLabel} - ${endLabel}`;
};

export const formatArgentinaDateTimeRange = (
  start?: Date | string | null,
  end?: Date | string | null,
) => {
  if (!start && !end) {
    return '-';
  }

  if (!start) {
    return `--/--/---- ${formatArgentinaTime(end as Date | string)}`;
  }

  return `${formatArgentinaDateTime(start)} - ${end ? formatArgentinaTime(end) : '--:--'}`;
};

export const formatArgentinaClockValue = (value?: string | null) => {
  if (!value) {
    return '--:--';
  }

  const [hours = '--', minutes = '--'] = value.split(':');

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};
