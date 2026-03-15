'use client';

import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PerfilVinculos } from '@/types/perfiles';

interface Props {
  vinculos: PerfilVinculos | null;
  loading: boolean;
}

export function shouldShowVinculosSection(vinculos: PerfilVinculos | null) {
  return Boolean(
    vinculos &&
      (vinculos.responsables.length > 0 || vinculos.protagonistas.length > 0),
  );
}

export function ProfileVinculosSection({ vinculos, loading }: Props) {
  if (loading) {
    return <ProgressSpinner style={{ width: '2rem', height: '2rem' }} />;
  }

  if (!vinculos) {
    return <span>Abrí la sección para cargar los vínculos.</span>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {vinculos.responsables.length > 0 ? (
        <Card title="Responsables del protagonista">
          <div className="flex flex-col gap-3">
            {vinculos.responsables.map((item) => (
              <div key={item.id}>
                <strong>
                  {item.Responsable.Miembro.apellidos},{' '}
                  {item.Responsable.Miembro.nombre}
                </strong>
                <div>Relación: {item.Relacion.tipo}</div>
                <div>DNI: {item.Responsable.Miembro.dni}</div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {vinculos.protagonistas.length > 0 ? (
        <Card title="Protagonistas a cargo">
          <div className="flex flex-col gap-3">
            {vinculos.protagonistas.map((item) => (
              <div key={item.id}>
                <strong>
                  {item.Protagonista.Miembro.apellidos},{' '}
                  {item.Protagonista.Miembro.nombre}
                </strong>
                <div>Relación: {item.Relacion.tipo}</div>
                <div>
                  Rama: {item.Protagonista.MiembroRama[0]?.Rama.nombre ?? 'Sin rama'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
