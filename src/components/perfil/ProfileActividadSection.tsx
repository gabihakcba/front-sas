'use client';

import dayjs from 'dayjs';
import { Divider } from 'primereact/divider';
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
    <div className="flex flex-col gap-4">
      {actividad.InscripcionEvento.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold mb-3">Eventos</h3>
          <div className="flex flex-col gap-3">
            {actividad.InscripcionEvento.map((inscripcion, index) => (
              <div key={inscripcion.id}>
                {index > 0 ? <Divider className="my-2" /> : null}
                <div className="font-semibold text-base">{inscripcion.Evento.nombre}</div>
                <div className="text-sm text-gray-600">
                  {inscripcion.Evento.TipoEvento.nombre} |{' '}
                  {dayjs(inscripcion.Evento.fecha_inicio).format('DD/MM/YYYY')}
                </div>
                <div className="text-sm">
                  Asistió: <span className="font-medium">{inscripcion.asistio ? 'Sí' : 'No'}</span> | Pagado:{' '}
                  <span className="font-medium">{inscripcion.pagado ? 'Sí' : 'No'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {actividad.InscripcionEvento.length > 0 && actividad.ParticipantesComision.length > 0 ? (
        <Divider className="my-4" />
      ) : null}

      {actividad.ParticipantesComision.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold mb-3">Comisiones</h3>
          <div className="flex flex-col gap-3">
            {actividad.ParticipantesComision.map((participacion, index) => (
              <div key={participacion.id}>
                {index > 0 ? <Divider className="my-2" /> : null}
                <div className="font-semibold text-base">{participacion.Comision.nombre}</div>
                <div className="text-sm text-gray-600">
                  Inicio: {dayjs(participacion.fecha_inicio).format('DD/MM/YYYY')}
                </div>
                <div className="text-sm">
                  Evento: <span className="font-medium">{participacion.Comision.Evento?.nombre ?? 'Sin evento'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
