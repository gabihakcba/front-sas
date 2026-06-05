'use client';

import { Divider } from 'primereact/divider';
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
    <div className="flex flex-col gap-4">
      {vinculos.responsables.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold mb-3">Responsables del protagonista</h3>
          <div className="flex flex-col gap-3">
            {vinculos.responsables.map((item, index) => (
              <div key={item.id}>
                {index > 0 ? <Divider className="my-2" /> : null}
                <div className="font-semibold text-base">
                  {item.Responsable.Miembro.apellidos},{' '}
                  {item.Responsable.Miembro.nombre}
                </div>
                <div className="text-sm">
                  Relación: <span className="font-medium">{item.Relacion.tipo}</span>
                </div>
                <div className="text-sm text-gray-600">DNI: {item.Responsable.Miembro.dni}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {vinculos.responsables.length > 0 && vinculos.protagonistas.length > 0 ? (
        <Divider className="my-4" />
      ) : null}

      {vinculos.protagonistas.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold mb-3">Protagonistas a cargo</h3>
          <div className="flex flex-col gap-3">
            {vinculos.protagonistas.map((item, index) => (
              <div key={item.id}>
                {index > 0 ? <Divider className="my-2" /> : null}
                <div className="font-semibold text-base">
                  {item.Protagonista.Miembro.apellidos},{' '}
                  {item.Protagonista.Miembro.nombre}
                </div>
                <div className="text-sm">
                  Relación: <span className="font-medium">{item.Relacion.tipo}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Rama:{' '}
                  {item.Protagonista.Miembro.MiembroRama[0]?.Rama.nombre ?? 'Sin rama'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
