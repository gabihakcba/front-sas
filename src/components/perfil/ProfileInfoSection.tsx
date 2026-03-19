'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { PerfilResumen } from '@/types/perfiles';

interface ProfilePersonalFormValues {
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  telefonoEmergencia: string;
  totem: string;
  cualidad: string;
}

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

const InputRow = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <strong>
      {label}
      {required ? ' *' : ''}
    </strong>
    {children}
  </div>
);

interface Props {
  summary: PerfilResumen;
  canEditOwnProfile: boolean;
  canEditOwnSignature: boolean;
  editing: boolean;
  savingProfile: boolean;
  formValues: ProfilePersonalFormValues;
  onToggleEdit: () => void;
  onCancelEdit: () => void;
  onSaveProfile: () => void;
  onChange: <K extends keyof ProfilePersonalFormValues>(
    key: K,
    value: ProfilePersonalFormValues[K],
  ) => void;
  onEditSignature: () => void;
  onSyncPermissions: () => void;
  syncingPermissions: boolean;
}

export function ProfileInfoSection({
  summary,
  canEditOwnProfile,
  canEditOwnSignature,
  editing,
  savingProfile,
  formValues,
  onToggleEdit,
  onCancelEdit,
  onSaveProfile,
  onChange,
  onEditSignature,
  onSyncPermissions,
  syncingPermissions,
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
        {canEditOwnProfile || canEditOwnSignature ? (
          <div className="flex flex-wrap gap-2">
            {canEditOwnProfile ? (
              editing ? (
                <>
                  <Button
                    type="button"
                    label="Cancelar"
                    icon="pi pi-times"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={onCancelEdit}
                  />
                  <Button
                    type="button"
                    label="Guardar"
                    icon="pi pi-check"
                    iconPos="right"
                    outlined
                    size="small"
                    loading={savingProfile}
                    onClick={onSaveProfile}
                  />
                </>
              ) : (
                <Button
                  type="button"
                  label="Modo edición"
                  icon="pi pi-pencil"
                  iconPos="right"
                  outlined
                  size="small"
                  onClick={onToggleEdit}
                />
              )
            ) : null}
            {canEditOwnSignature ? (
              <Button
                type="button"
                label="Firma"
                icon="pi pi-pencil"
                iconPos="right"
                outlined
                size="small"
                onClick={onEditSignature}
              />
            ) : null}
            {canEditOwnProfile ? (
              <Button
                type="button"
                label="Actualizar Permisos"
                icon="pi pi-sync"
                iconPos="right"
                outlined
                size="small"
                loading={syncingPermissions}
                onClick={onSyncPermissions}
                severity="secondary"
              />
            ) : null}
          </div>
        ) : null}
      </div>
      <Divider />
      {editing ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoRow label="Usuario" value={summary.Cuenta.user} />
          <InputRow label="Nombre" required>
            <InputText
              value={formValues.nombre}
              onChange={(event) => onChange('nombre', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Apellidos" required>
            <InputText
              value={formValues.apellidos}
              onChange={(event) => onChange('apellidos', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="DNI" required>
            <InputText
              value={formValues.dni}
              onChange={(event) => onChange('dni', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Fecha de nacimiento" required>
            <Calendar
              value={dayjs(formValues.fechaNacimiento, 'YYYY-MM-DD').toDate()}
              onChange={(event) =>
                onChange(
                  'fechaNacimiento',
                  event.value instanceof Date
                    ? dayjs(event.value).format('YYYY-MM-DD')
                    : formValues.fechaNacimiento,
                )
              }
              dateFormat="dd/mm/yy"
              showButtonBar
              className="w-full"
              inputClassName="w-full"
            />
          </InputRow>
          <InputRow label="Dirección" required>
            <InputText
              value={formValues.direccion}
              onChange={(event) => onChange('direccion', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Email">
            <InputText
              value={formValues.email}
              onChange={(event) => onChange('email', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Teléfono">
            <InputText
              value={formValues.telefono}
              onChange={(event) => onChange('telefono', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Teléfono de emergencia" required>
            <InputText
              value={formValues.telefonoEmergencia}
              onChange={(event) =>
                onChange('telefonoEmergencia', event.target.value)
              }
              className="w-full"
            />
          </InputRow>
          <InputRow label="Totem">
            <InputText
              value={formValues.totem}
              onChange={(event) => onChange('totem', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Cualidad">
            <InputText
              value={formValues.cualidad}
              onChange={(event) => onChange('cualidad', event.target.value)}
              className="w-full"
            />
          </InputRow>
        </div>
      ) : (
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
      )}
    </Card>
  );
}

export type { ProfilePersonalFormValues };
