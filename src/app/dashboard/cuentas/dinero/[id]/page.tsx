'use client';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { FilePreviewDialog } from '@/components/common/FilePreviewDialog';
import { MovimientoCuentaAdjuntosDialog } from '@/components/cuentas-dinero/MovimientoCuentaAdjuntosDialog';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { MovimientoCuentaFormDialog } from '@/components/cuentas-dinero/MovimientoCuentaFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useCuentaDineroDetailHook } from '@/hooks/useCuentaDineroDetailHook';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import {
  hasDeletedAuditAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import { getMovimientoCuentaAdjuntoRequest } from '@/queries/cuentas-dinero';
import { MovimientoCuenta } from '@/types/cuentas-dinero';

const formatMoney = (value: string) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(Number(value));

const hasGroupCuentaCrudAccess = (
  scopes: Array<{ role: string; scopeType: string }> | null | undefined,
) =>
  (scopes ?? []).some(
    (scope) =>
      ['ADM', 'DEV', 'JEFATURA', 'SECRETARIA_TESORERIA'].includes(scope.role) &&
      ['GRUPO', 'GLOBAL'].includes(scope.scopeType),
  );

export default function CuentaDineroDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const accountId = Number(params.id);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [previewMimeType, setPreviewMimeType] = useState('application/pdf');
  const [previewFileName, setPreviewFileName] = useState('adjunto');
  const {
    cuenta,
    movimientos,
    selectedMovimiento,
    setSelectedMovimiento,
    options,
    dialogVisible,
    adjuntosDialogVisible,
    formValues,
    adjuntosFormValues,
    setAdjuntosFormValues,
    filters,
    setFilters,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total,
    limit,
    refetch,
    openCreateDialog,
    closeDialog,
    openAdjuntosDialog,
    closeAdjuntosDialog,
    submitForm,
    submitAdjuntos,
    deleteAdjunto,
    deleteSelected,
  } = useCuentaDineroDetailHook(accountId);

  const canCreate = hasPermissionAccess(user, 'CREATE:CUENTA_DINERO');
  const canDelete = hasPermissionAccess(user, 'DELETE:CUENTA_DINERO');
  const canAuditDeleted = hasDeletedAuditAccess(user);
  const isGroupCashAccount =
    cuenta?.id_miembro === null &&
    cuenta?.id_rama === null &&
    cuenta?.Area?.nombre === 'Jefatura';
  const canMutateCurrentAccount =
    !isGroupCashAccount || hasGroupCuentaCrudAccess(user?.scopes);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedMovimiento) {
      return;
    }

    confirmDelete({
      message: `Se eliminará de forma lógica el movimiento ${selectedMovimiento.codigo_referencia}.`,
      impact:
        'El saldo de la cuenta se recalculará revirtiendo este movimiento y el registro quedará fuera de la operatoria normal.',
      onAccept: () => void deleteSelected(),
    });
  };

  const handlePreviewAttachment = async (
    movimiento: MovimientoCuenta,
    adjuntoId: number,
    nombre: string,
    mime: string,
  ) => {
    setPreviewVisible(true);
    setPreviewLoading(true);
    setPreviewError('');

    try {
      const blob = await getMovimientoCuentaAdjuntoRequest(
        accountId,
        movimiento.id,
        adjuntoId,
      );
      setPreviewBlob(blob);
      setPreviewMimeType(mime);
      setPreviewFileName(nombre);
    } catch {
      setPreviewBlob(null);
      setPreviewError('No se pudo cargar el adjunto.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDeleteAttachment = (adjuntoId: number, nombre: string) => {
    if (!selectedMovimiento) {
      return;
    }

    confirmDelete({
      title: 'Eliminar adjunto',
      message: `Se eliminará definitivamente el adjunto ${nombre}.`,
      impact:
        'La eliminación es física y el archivo dejará de estar disponible para el movimiento.',
      onAccept: () => void deleteAdjunto(adjuntoId),
    });
  };

  const movementTypeOptions = useMemo(
    () => options.tipos.map((tipo) => ({ label: tipo, value: tipo })),
    [options.tipos],
  );

  const filterControls = (
    <>
      <IconField iconPosition="right" className="w-full">
        <InputText
          className="w-full"
          value={filters.q}
          onChange={(event) =>
            setFilters({
              ...filters,
              q: event.target.value,
            })
          }
          placeholder="Buscar movimiento"
        />
        <InputIcon className="pi pi-search" />
      </IconField>
      {canAuditDeleted ? (
        <div className="flex items-center gap-2">
          <label htmlFor="movimientos-include-deleted">Incluir borrados</label>
          <Checkbox
            inputId="movimientos-include-deleted"
            checked={filters.includeDeleted}
            onChange={(event) =>
              setFilters({
                ...filters,
                includeDeleted: Boolean(event.checked),
              })
            }
          />
        </div>
      ) : null}
    </>
  );

  const header = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="hidden md:flex md:flex-col md:gap-2">{filterControls}</div>
      <ResponsiveTableActions
        filtersContent={filterControls}
        relatedActions={[
          {
            label: 'Volver',
            icon: 'pi pi-arrow-left',
            onClick: () => router.push('/dashboard/cuentas-dinero'),
          },
        ]}
        crudActions={[
          {
            label: 'Registrar',
            icon: 'pi pi-plus',
            onClick: () => void openCreateDialog(),
            disabled: !canCreate || !canMutateCurrentAccount,
          },
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            onClick: handleDelete,
            disabled:
              !selectedMovimiento ||
              !canDelete ||
              selectedMovimiento.borrado ||
              !canMutateCurrentAccount,
          },
          {
            label: 'Adjuntar',
            icon: 'pi pi-paperclip',
            onClick: () => openAdjuntosDialog(),
            disabled:
              !selectedMovimiento ||
              selectedMovimiento.borrado ||
              !canCreate ||
              !canMutateCurrentAccount,
          },
        ]}
      />
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Card title="Detalle de cuenta de dinero">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}
        {isGroupCashAccount && !canMutateCurrentAccount ? (
          <Message
            severity="warn"
            text="Esta es la cuenta de grupo. Podés verla, pero solo Jefatura y Secretaría/Tesorería de grupo pueden registrar o eliminar movimientos."
            className="mb-3 w-full"
          />
        ) : null}

        {cuenta ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <strong>Nombre:</strong> {cuenta.nombre}
            </div>
            <div>
              <strong>Saldo actual:</strong> {formatMoney(cuenta.monto_actual)}
            </div>
            <div>
              <strong>Pagos asociados:</strong> {cuenta._count.Pago}
            </div>
            <div>
              <strong>Movimientos:</strong> {cuenta._count.MovimientoCuenta}
            </div>
            <div>
              <strong>Área:</strong> {cuenta.Area?.nombre ?? '-'}
            </div>
            <div>
              <strong>Rama:</strong> {cuenta.Rama?.nombre ?? '-'}
            </div>
            <div>
              <strong>Miembro:</strong>{' '}
              {cuenta.Miembro
                ? `${cuenta.Miembro.apellidos}, ${cuenta.Miembro.nombre}`
                : '-'}
            </div>
            <div>
              <strong>Actualizada:</strong>{' '}
              {cuenta.updatedAt ? dayjs(cuenta.updatedAt).format('DD/MM/YYYY') : '-'}
            </div>
          </div>
        ) : (
          <div>Cargando cuenta...</div>
        )}
      </Card>

      <Card title="Movimientos">
        <DataTable
          value={movimientos}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedMovimiento}
          onSelectionChange={(event) =>
            setSelectedMovimiento((event.value as MovimientoCuenta | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay movimientos para esta cuenta."
          tableStyle={{ minWidth: '72rem', width: '100%' }}
        >
          <Column
            header="Fecha"
            body={(movimiento: MovimientoCuenta) =>
              dayjs(movimiento.fecha_movimiento).format('DD/MM/YYYY')
            }
          />
          <Column
            header={
              <Dropdown
                value={filters.tipo}
                options={movementTypeOptions}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    tipo: (event.value as 'INGRESO' | 'EGRESO' | null) ?? null,
                  })
                }
                placeholder="Tipo"
                showClear
              />
            }
            body={(movimiento: MovimientoCuenta) => (
              <Tag
                value={movimiento.tipo}
                severity={movimiento.tipo === 'INGRESO' ? 'success' : 'danger'}
              />
            )}
          />
          <Column
            header="Monto"
            body={(movimiento: MovimientoCuenta) => formatMoney(movimiento.monto)}
          />
          <Column
            header="Saldo anterior"
            body={(movimiento: MovimientoCuenta) =>
              formatMoney(movimiento.saldo_anterior)
            }
          />
          <Column
            header="Saldo posterior"
            body={(movimiento: MovimientoCuenta) =>
              formatMoney(movimiento.saldo_posterior)
            }
          />
          <Column field="MetodoPago.nombre" header="Método" />
          <Column
            header="Responsable"
            body={(movimiento: MovimientoCuenta) =>
              `${movimiento.Responsable.apellidos}, ${movimiento.Responsable.nombre}`
            }
          />
          <Column
            header="Detalle"
            body={(movimiento: MovimientoCuenta) => movimiento.detalles ?? '-'}
          />
          <Column
            header="Adjuntos"
            body={(movimiento: MovimientoCuenta) =>
              movimiento.Adjuntos.length ? (
                <div className="flex flex-col gap-2">
                  {movimiento.Adjuntos.map((adjunto) => (
                    <Button
                      key={adjunto.id}
                      type="button"
                      label={adjunto.nombre}
                      icon="pi pi-paperclip"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() =>
                        void handlePreviewAttachment(
                          movimiento,
                          adjunto.id,
                          adjunto.nombre,
                          adjunto.mime,
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                '-'
              )
            }
          />
          {canAuditDeleted ? (
            <Column
              header="Borrado"
              body={(movimiento: MovimientoCuenta) => (
                <Tag
                  value={movimiento.borrado ? 'Sí' : 'No'}
                  severity={movimiento.borrado ? 'danger' : 'success'}
                />
              )}
            />
          ) : null}
        </DataTable>
      </Card>

      {selectedMovimiento ? (
        <Card title={`Adjuntos de ${selectedMovimiento.codigo_referencia.slice(0, 8)}`}>
          {selectedMovimiento.Adjuntos.length ? (
            <div className="flex flex-col gap-2">
              {selectedMovimiento.Adjuntos.map((adjunto) => (
                <div
                  key={adjunto.id}
                  className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <strong>{adjunto.nombre}</strong>
                    <div>
                      <small>{dayjs(adjunto.createdAt).format('DD/MM/YYYY')}</small>
                    </div>
                  </div>
                  <Button
                    type="button"
                    label="Ver adjunto"
                    icon="pi pi-eye"
                    iconPos="right"
                    outlined
                    size="small"
                    onClick={() =>
                      void handlePreviewAttachment(
                        selectedMovimiento,
                        adjunto.id,
                        adjunto.nombre,
                        adjunto.mime,
                      )
                    }
                  />
                  <Button
                    type="button"
                    label="Eliminar adjunto"
                    icon="pi pi-trash"
                    iconPos="right"
                    outlined
                    size="small"
                    severity="danger"
                    onClick={() =>
                      handleDeleteAttachment(adjunto.id, adjunto.nombre)
                    }
                    disabled={!canMutateCurrentAccount || !canDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <small>El movimiento seleccionado no tiene adjuntos.</small>
          )}
        </Card>
      ) : null}

      <MovimientoCuentaFormDialog
        visible={dialogVisible}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        options={options}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />

      <MovimientoCuentaAdjuntosDialog
        visible={adjuntosDialogVisible}
        submitting={submitting}
        values={adjuntosFormValues}
        error={error}
        onHide={closeAdjuntosDialog}
        onChange={setAdjuntosFormValues}
        onSubmit={() => void submitAdjuntos()}
      />

      <FilePreviewDialog
        visible={previewVisible}
        loading={previewLoading}
        blob={previewBlob}
        error={previewError}
        mimeType={previewMimeType}
        fileName={previewFileName}
        title="Preview de adjunto"
        onHide={() => {
          setPreviewVisible(false);
          setPreviewBlob(null);
          setPreviewError('');
        }}
      />

      {deleteConfirmDialog}
    </div>
  );
}
