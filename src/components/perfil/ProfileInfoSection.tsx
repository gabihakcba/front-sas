'use client';

import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Tag } from 'primereact/tag';
import { PerfilResumen } from '@/types/perfiles';

interface ProfilePersonalFormValues {
  user: string;
  password?: string;
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
    <div>
      <h2 className="text-2xl font-bold mb-3">{`${summary.nombre} ${summary.apellidos}`}</h2>
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
          <div className="flex flex-row justify-between sm:justify-start gap-2 w-full">
            {canEditOwnProfile ? (
              editing ? (
                <>
                  <div className="contents">
                    {/* Mobile icon-only button */}
                    <Button
                      type="button"
                      icon="pi pi-times"
                      outlined
                      size="small"
                      className="sm:!hidden"
                      onClick={onCancelEdit}
                      disabled={savingProfile}
                    />
                    {/* Desktop button with text */}
                    <Button
                      type="button"
                      label="Cancelar"
                      icon="pi pi-times"
                      iconPos="right"
                      outlined
                      size="small"
                      className="!hidden sm:!inline-flex sm:w-auto"
                      onClick={onCancelEdit}
                      disabled={savingProfile}
                    />
                  </div>
                  <div className="contents">
                    {/* Mobile icon-only button */}
                    <Button
                      type="button"
                      icon={savingProfile ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                      outlined
                      size="small"
                      loading={savingProfile}
                      className="sm:!hidden"
                      onClick={onSaveProfile}
                    />
                    {/* Desktop button with text */}
                    <Button
                      type="button"
                      label="Guardar"
                      icon="pi pi-check"
                      iconPos="right"
                      outlined
                      size="small"
                      className="!hidden sm:!inline-flex sm:w-auto"
                      loading={savingProfile}
                      onClick={onSaveProfile}
                    />
                  </div>
                </>
              ) : (
                <div className="contents">
                  {/* Mobile icon-only button */}
                  <Button
                    type="button"
                    icon="pi pi-pencil"
                    outlined
                    size="small"
                    className="sm:!hidden"
                    onClick={onToggleEdit}
                  />
                  {/* Desktop button with text */}
                  <Button
                    type="button"
                    label="Modo edición"
                    icon="pi pi-pencil"
                    iconPos="right"
                    outlined
                    size="small"
                    className="!hidden sm:!inline-flex sm:w-auto"
                    onClick={onToggleEdit}
                  />
                </div>
              )
            ) : null}
            {canEditOwnSignature ? (
              <div className="contents">
                {/* Mobile icon-only button */}
                <Button
                  type="button"
                  icon="pi pi-wave-pulse"
                  outlined
                  size="small"
                  className="sm:!hidden"
                  onClick={onEditSignature}
                />
                {/* Desktop button with text */}
                <Button
                  type="button"
                  label="Firma"
                  icon="pi pi-wave-pulse"
                  iconPos="right"
                  outlined
                  size="small"
                  className="!hidden sm:!inline-flex sm:w-auto"
                  onClick={onEditSignature}
                />
              </div>
            ) : null}
            {canEditOwnProfile ? (
              <div className="contents">
                {/* Mobile icon-only button */}
                <Button
                  type="button"
                  icon="pi pi-sync"
                  outlined
                  size="small"
                  loading={syncingPermissions}
                  onClick={onSyncPermissions}
                  severity="secondary"
                  className="sm:!hidden"
                />
                {/* Desktop button with text */}
                <Button
                  type="button"
                  label="Actualizar Permisos"
                  icon="pi pi-sync"
                  iconPos="right"
                  outlined
                  size="small"
                  className="!hidden sm:!inline-flex sm:w-auto"
                  loading={syncingPermissions}
                  onClick={onSyncPermissions}
                  severity="secondary"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <Divider />
      {editing ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-fluid">
          <InputRow label="Usuario" required>
            <InputText
              value={formValues.user}
              onChange={(event) => onChange('user', event.target.value)}
              className="w-full"
            />
          </InputRow>
          <InputRow label="Nueva contraseña (dejar en blanco para mantener)">
            <Password
              value={formValues.password ?? ''}
              onChange={(event) => onChange('password', event.target.value)}
              feedback={false}
              toggleMask
              className="w-full"
              inputClassName="w-full"
            />
          </InputRow>
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
    </div>
  );
}

export type { ProfilePersonalFormValues };
