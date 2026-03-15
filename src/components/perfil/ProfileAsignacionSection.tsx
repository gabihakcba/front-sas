'use client';

import dayjs from 'dayjs';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PerfilAsignacion } from '@/types/perfiles';

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex flex-col gap-1">
    <strong>{label}</strong>
    <span>{value && value.trim().length > 0 ? value : '-'}</span>
  </div>
);

interface Props {
  asignacion: PerfilAsignacion | null;
  loading: boolean;
}

export function shouldShowAsignacionSection(asignacion: PerfilAsignacion | null) {
  return Boolean(asignacion?.ramaActual || asignacion?.asignacionAdulto);
}

export function ProfileAsignacionSection({ asignacion, loading }: Props) {
  if (loading) {
    return <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />;
  }

  if (!asignacion) {
    return <span>Abrí la sección para cargar la asignación.</span>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {asignacion.ramaActual ? (
        <Card title="Rama">
          <div className="flex flex-col gap-2">
            <InfoRow label="Rama" value={asignacion.ramaActual.Rama.nombre} />
            <InfoRow label="Área" value={asignacion.ramaActual.Rama.Area.nombre} />
            <InfoRow
              label="Ingreso"
              value={dayjs(asignacion.ramaActual.fecha_ingreso).format(
                'DD/MM/YYYY',
              )}
            />
          </div>
        </Card>
      ) : null}

      {asignacion.asignacionAdulto ? (
        <Card title="Área / Posición">
          <div className="flex flex-col gap-2">
            <InfoRow
              label="Área"
              value={asignacion.asignacionAdulto.Area.nombre}
            />
            <InfoRow
              label="Rama"
              value={asignacion.asignacionAdulto.Rama?.nombre}
            />
            <InfoRow
              label="Posición"
              value={asignacion.asignacionAdulto.Posicion.nombre}
            />
            <InfoRow
              label="Ingreso"
              value={dayjs(asignacion.asignacionAdulto.fecha_inicio).format(
                'DD/MM/YYYY',
              )}
            />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
