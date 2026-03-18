'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { PerfilResumen } from '@/types/perfiles';

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
  summary: PerfilResumen;
  canEditOwnSignature: boolean;
  onEditSignature: () => void;
}

export function ProfileInfoSection({
  summary,
  canEditOwnSignature,
  onEditSignature,
}: Props) {
  return (
    <Card title={`${summary.nombre} ${summary.apellidos}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {summary.Adulto ? <Tag value="Adulto" /> : null}
          {summary.Protagonista ? <Tag value="Protagonista" /> : null}
          {summary.Responsable ? <Tag value="Responsable" /> : null}
          {summary.Adulto?.es_becado || summary.Protagonista?.es_becado ? (
            <Tag value="Becado" severity="info" />
          ) : null}
          {summary.Adulto && !summary.Adulto.activo ? (
            <Tag value="Adulto inactivo" severity="warning" />
          ) : null}
          {summary.Protagonista && !summary.Protagonista.activo ? (
            <Tag value="Protagonista inactivo" severity="warning" />
          ) : null}
        </div>
        {canEditOwnSignature ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              label="Firma"
              icon="pi pi-pencil"
              iconPos="right"
              outlined
              size="small"
              onClick={onEditSignature}
            />
          </div>
        ) : null}
      </div>
      <Divider />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoRow label="Usuario" value={summary.Cuenta.user} />
        <InfoRow label="DNI" value={summary.dni} />
        <InfoRow
          label="Fecha de nacimiento"
          value={dayjs(summary.fecha_nacimiento).format('DD/MM/YYYY')}
        />
        <InfoRow label="Email" value={summary.email} />
        <InfoRow label="Teléfono" value={summary.telefono} />
        <InfoRow
          label="Teléfono de emergencia"
          value={summary.telefono_emergencia}
        />
        <InfoRow label="Dirección" value={summary.direccion} />
        <InfoRow label="Totem" value={summary.totem} />
        <InfoRow label="Cualidad" value={summary.cualidad} />
      </div>
    </Card>
  );
}
