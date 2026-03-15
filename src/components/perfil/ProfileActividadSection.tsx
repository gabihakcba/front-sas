'use client';

import dayjs from 'dayjs';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PerfilActividad } from '@/types/perfiles';

interface Props {
  actividad: PerfilActividad | null;
  loading: boolean;
}

export function shouldShowActividadSection(actividad: PerfilActividad | null) {
  return Boolean(
    actividad &&
      (actividad.InscripcionEvento.length > 0 ||
        actividad.ParticipantesComision.length > 0),
  );
}

export function ProfileActividadSection({ actividad, loading }: Props) {
  if (loading) {
    return <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />;
  }

  if (!actividad) {
    return <span>Abrí la sección para cargar la actividad.</span>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {actividad.InscripcionEvento.length > 0 ? (
        <Card title="Eventos">
          <div className="flex flex-col gap-3">
            {actividad.InscripcionEvento.map((inscripcion) => (
              <div key={inscripcion.id}>
                <strong>{inscripcion.Evento.nombre}</strong>
                <div>
                  {inscripcion.Evento.TipoEvento.nombre} |{' '}
                  {dayjs(inscripcion.Evento.fecha_inicio).format('DD/MM/YYYY')}
                </div>
                <div>
                  Asistió: {inscripcion.asistio ? 'Sí' : 'No'} | Pagado:{' '}
                  {inscripcion.pagado ? 'Sí' : 'No'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {actividad.ParticipantesComision.length > 0 ? (
        <Card title="Comisiones">
          <div className="flex flex-col gap-3">
            {actividad.ParticipantesComision.map((participacion) => (
              <div key={participacion.id}>
                <strong>{participacion.Comision.nombre}</strong>
                <div>
                  Inicio: {dayjs(participacion.fecha_inicio).format('DD/MM/YYYY')}
                </div>
                <div>
                  Evento: {participacion.Comision.Evento?.nombre ?? 'Sin evento'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
