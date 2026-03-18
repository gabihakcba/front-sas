'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { ResponsiveTableActions } from '@/components/common/ResponsiveTableActions';
import { FilePreviewDialog } from '@/components/common/FilePreviewDialog';
import { useAuth } from '@/context/AuthContext';
import { PagoFormDialog } from '@/components/pagos/PagoFormDialog';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { usePagosHook } from '@/hooks/usePagosHooks';
import {
  hasAccessRule,
  hasDeletedAuditAccess,
  hasDeveloperAccess,
  hasPermissionAccess,
} from '@/lib/authorization';
import {
  exportPagoReceiptRequest,
  getPagoAttachmentRequest,
  getPagoWhatsappShareRequest,
} from '@/queries/pagos';
import { PAYMENT_MANAGEMENT_ACCESS } from '@/data/access-control';
import { Pago } from '@/types/pagos';

export default function PagosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [previewMimeType, setPreviewMimeType] = useState('application/pdf');
  const [previewFileName, setPreviewFileName] = useState('archivo.pdf');
  const [previewTitle, setPreviewTitle] = useState('Preview');
  const [whatsappError, setWhatsappError] = useState('');
  const {
    pagos,
    selectedPago,
    setSelectedPago,
    formValues,
    options,
    dialogMode,
    dialogVisible,
    error,
    successMessage,
    loading,
    dialogLoading,
    submitting,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
    openCreateDialog,
    closeDialog,
    submitForm,
    deleteSelected,
  } = usePagosHook();

  const canCreate = hasPermissionAccess(user, 'CREATE:PAGO');
  const canDelete = hasPermissionAccess(user, 'DELETE:PAGO');
  const canManagePaymentCatalogs = hasAccessRule(
    user?.scopes,
    PAYMENT_MANAGEMENT_ACCESS,
  );
  const canAuditDeleted = hasDeletedAuditAccess(user);
  const canSeeId = hasDeveloperAccess(user);

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const handleDelete = () => {
    if (!selectedPago) {
      return;
    }
    confirmDelete({
      message: `Se eliminará de forma lógica el pago ${selectedPago.codigo_validacion}.`,
      impact:
        'El pago dejará de contarse en los listados operativos y puede afectar saldos, comprobantes y trazabilidad visible de movimientos asociados.',
      onAccept: () => void deleteSelected(),
    });
  };

  const handleDownloadReceipt = async () => {
    if (!selectedPago) {
      return;
    }

    setPreviewVisible(true);
    setPreviewLoading(true);
    setPreviewError('');

    try {
      const blob = await exportPagoReceiptRequest(selectedPago.id);
      setPreviewBlob(blob);
      setPreviewMimeType('application/pdf');
      setPreviewFileName(
        `comprobante-pago-${String(selectedPago.id).padStart(6, '0')}.pdf`,
      );
      setPreviewTitle('Preview de comprobante');
    } catch {
      setPreviewBlob(null);
      setPreviewError('No se pudo generar el comprobante.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewAttachment = async () => {
    if (!selectedPago?.comprobante_pago_mime) {
      return;
    }

    setPreviewVisible(true);
    setPreviewLoading(true);
    setPreviewError('');

    try {
      const blob = await getPagoAttachmentRequest(selectedPago.id);
      setPreviewBlob(blob);
      setPreviewMimeType(selectedPago.comprobante_pago_mime);
      setPreviewFileName(
        selectedPago.comprobante_pago_nombre ?? 'comprobante-pago-adjunto',
      );
      setPreviewTitle('Preview de adjunto');
    } catch {
      setPreviewBlob(null);
      setPreviewError('No se pudo cargar el adjunto del pago.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const triggerBlobDownload = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  };

  const handleWhatsappShare = async () => {
    if (!selectedPago) {
      return;
    }

    setWhatsappError('');

    try {
      const [shareData, receiptBlob] = await Promise.all([
        getPagoWhatsappShareRequest(selectedPago.id),
        exportPagoReceiptRequest(selectedPago.id),
      ]);

      const fileName = `comprobante-pago-${String(selectedPago.id).padStart(6, '0')}.pdf`;

      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        const shareNavigator = navigator as Navigator & {
          canShare?: (data?: ShareData) => boolean;
        };
        const file = new File([receiptBlob], fileName, {
          type: 'application/pdf',
        });

        if (shareNavigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: 'Comprobante de pago',
            text: shareData.message,
            files: [file],
          });
          return;
        }
      }

      triggerBlobDownload(receiptBlob, fileName);
      window.open(
        `https://wa.me/${shareData.phone}?text=${encodeURIComponent(shareData.message)}`,
        '_blank',
        'noopener,noreferrer',
      );
      setWhatsappError(
        'WhatsApp Web no permite adjuntar el PDF automáticamente. Se abrió el chat y se descargó el comprobante para adjuntarlo manualmente.',
      );
    } catch {
      setWhatsappError('No se pudo preparar el envío por WhatsApp.');
    }
  };

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
          placeholder="Buscar pago"
        />
        <InputIcon className="pi pi-search" />
      </IconField>
      {canAuditDeleted ? (
        <div className="flex items-center gap-2">
          <label htmlFor="pagos-include-deleted">Incluir borrados</label>
          <Checkbox
            inputId="pagos-include-deleted"
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
          ...(canManagePaymentCatalogs
            ? [
                {
                  label: 'Conceptos',
                  icon: 'pi pi-tags',
                  onClick: () => router.push('/dashboard/conceptos-pago'),
                },
                {
                  label: 'Métodos',
                  icon: 'pi pi-credit-card',
                  onClick: () => router.push('/dashboard/metodos-pago'),
                },
                {
                  label: 'Cuentas',
                  icon: 'pi pi-building-columns',
                  onClick: () => router.push('/dashboard/cuentas-dinero'),
                },
              ]
            : []),
          {
            label: 'Comprobante',
            icon: 'pi pi-file-pdf',
            onClick: () => void handleDownloadReceipt(),
            disabled: !selectedPago || Boolean(selectedPago.borrado),
          },
          ...(canManagePaymentCatalogs
            ? [
                {
                  label: 'Adjunto',
                  icon: 'pi pi-paperclip',
                  onClick: () => void handlePreviewAttachment(),
                  disabled:
                    !selectedPago?.comprobante_pago_mime ||
                    Boolean(selectedPago?.borrado),
                },
                {
                  label: 'WhatsApp',
                  icon: 'pi pi-whatsapp',
                  onClick: () => void handleWhatsappShare(),
                  disabled: !selectedPago || Boolean(selectedPago.borrado),
                },
              ]
            : []),
        ]}
        crudActions={[
          ...(canCreate
            ? [
                {
                  label: 'Crear',
                  icon: 'pi pi-plus',
                  onClick: () => void openCreateDialog(),
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: 'Eliminar',
                  icon: 'pi pi-trash',
                  onClick: handleDelete,
                  disabled: !selectedPago || Boolean(selectedPago.borrado),
                  severity: 'danger' as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );

  const conceptoHeader = (
    <Dropdown
      value={filters.idConceptoPago}
      options={options.conceptos}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idConceptoPago: (event.value as number | null) ?? null,
        })
      }
      placeholder="Concepto"
      showClear
    />
  );

  const metodoHeader = (
    <Dropdown
      value={filters.idMetodoPago}
      options={options.metodos}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idMetodoPago: (event.value as number | null) ?? null,
        })
      }
      placeholder="Método"
      showClear
    />
  );

  const cuentaDestinoHeader = (
    <Dropdown
      value={filters.idCuentaDinero}
      options={options.cuentas}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idCuentaDinero: (event.value as number | null) ?? null,
        })
      }
      placeholder="Cuenta destino"
      showClear
    />
  );

  const cuentaOrigenHeader = (
    <Dropdown
      value={filters.idCuentaOrigen}
      options={options.cuentas}
      optionLabel="nombre"
      optionValue="id"
      onChange={(event: DropdownChangeEvent) =>
        setFilters({
          ...filters,
          idCuentaOrigen: (event.value as number | null) ?? null,
        })
      }
      placeholder="Cuenta origen"
      showClear
    />
  );

  return (
    <div className="h-full w-full">
      <Card title="Pagos" className="h-full">
        {error ? <Message severity="error" text={error} className="mb-3 w-full" /> : null}
        {whatsappError ? (
          <Message severity="warn" text={whatsappError} className="mb-3 w-full" />
        ) : null}
        {successMessage ? (
          <Message severity="success" text={successMessage} className="mb-3 w-full" />
        ) : null}

        <DataTable
          value={pagos}
          dataKey="id"
          loading={loading}
          lazy
          paginator
          header={header}
          selectionMode="single"
          selection={selectedPago}
          onSelectionChange={(event) =>
            setSelectedPago((event.value as Pago | null) ?? null)
          }
          first={(page - 1) * limit}
          rows={10}
          totalRecords={total}
          onPage={handlePage}
          emptyMessage="No hay pagos disponibles para tu scope actual."
          tableStyle={{ minWidth: '72rem', width: '100%' }}
        >
          {canSeeId ? <Column field="id" header="ID" /> : null}
          <Column
            header="Fecha"
            body={(pago: Pago) => dayjs(pago.fecha_pago).format('DD/MM/YYYY')}
          />
          <Column
            header="Creado"
            body={(pago: Pago) => dayjs(pago.createdAt).format('DD/MM/YYYY')}
          />
          <Column field="monto" header="Monto" />
          <Column
            header="Miembro"
            body={(pago: Pago) => `${pago.Miembro.apellidos}, ${pago.Miembro.nombre}`}
          />
          <Column field="ConceptoPago.nombre" header={conceptoHeader} />
          <Column field="MetodoPago.nombre" header={metodoHeader} />
          <Column field="CuentaDinero.nombre" header={cuentaDestinoHeader} />
          <Column
            header={cuentaOrigenHeader}
            body={(pago: Pago) => pago.CuentaOrigen?.nombre ?? '-'}
          />
          <Column
            header="Código"
            body={(pago: Pago) => pago.codigo_validacion.slice(0, 8)}
          />
          <Column
            header="Adjunto"
            body={(pago: Pago) => (pago.comprobante_pago_mime ? 'Sí' : '-')}
          />
          {canAuditDeleted ? (
            <Column
              header="Borrado"
              body={(pago: Pago) => (
                <Tag
                  value={pago.borrado ? 'Sí' : 'No'}
                  severity={pago.borrado ? 'danger' : 'success'}
                />
              )}
            />
          ) : null}
        </DataTable>
      </Card>

      <PagoFormDialog
        visible={dialogVisible}
        mode={dialogMode}
        loading={dialogLoading}
        submitting={submitting}
        values={formValues}
        options={options}
        error={error}
        onHide={closeDialog}
        onSubmit={(values) => void submitForm(values)}
      />

      <FilePreviewDialog
        visible={previewVisible}
        title={previewTitle}
        fileName={previewFileName}
        mimeType={previewMimeType}
        blob={previewBlob}
        loading={previewLoading}
        error={previewError}
        onHide={() => {
          setPreviewVisible(false);
          setPreviewBlob(null);
          setPreviewError('');
          setPreviewMimeType('application/pdf');
          setPreviewFileName('archivo.pdf');
          setPreviewTitle('Preview');
        }}
      />
      {deleteConfirmDialog}
    </div>
  );
}
