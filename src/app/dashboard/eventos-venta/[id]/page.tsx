'use client';

import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column, ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { EventoVentaItemFormDialog } from '@/components/eventos-venta/EventoVentaItemFormDialog';
import { useAuth } from '@/context/AuthContext';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useEventoVentaDetailHook } from '@/hooks/useEventoVentaDetailHook';
import {
  EventoVentaCostoItem,
  EventoVentaItem,
  EventoVentaMiembroOption,
  EventoVentaPago,
  EventoVentaReserva,
  EventoVentaSector,
  EventoVentaSheet,
} from '@/types/eventos-venta';

interface SheetGridRow {
  id: number;
  cells: Array<string | number | boolean | null>;
}

interface ReservationSheetRow {
  id: number;
  sector: string;
  comprador: string;
  idVendedorMiembro: number | null;
  vendedor: string;
  cantidad: number;
  efectivo: number;
  transferencia: number;
  cuenta: string;
  debe: number;
  retiro: number;
  observacion: string;
  total: number;
}

interface DisplayTab {
  key: string;
  header: string;
  kind: 'all' | 'sheet-grid' | 'sheet-sector' | 'sector-fallback';
  sheet?: EventoVentaSheet;
  sector?: EventoVentaSector;
}

interface QuickReservationFormRow {
  id: string;
  comprador: string;
  idVendedorMiembro: number | null;
  idItem: number | null;
  idSector: number | null;
  cantidad: number;
  efectivo: number;
  transferencia: number;
  cuenta: string;
  debe: number;
  retiro: number;
}

interface CostSheetRow {
  id: number;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  costoUnitario: number;
  cantidad: number;
  total: number;
}

interface QuickCostFormRow {
  id: string;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  costoUnitario: number | null;
  cantidad: number | null;
}

const formatMoney = (value: number | string | null) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatCell = (value: string | number | boolean | null) => {
  if (value === null || value === '') {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  return String(value);
};

const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const pagosToSheetValues = (pagos: EventoVentaPago[]) => {
  const efectivo = pagos
    .filter((pago) => pago.tipo_pago === 'EFECTIVO')
    .reduce((acc, pago) => acc + Number(pago.monto), 0);
  const transferencia = pagos
    .filter((pago) => pago.tipo_pago === 'TRANSFERENCIA')
    .reduce((acc, pago) => acc + Number(pago.monto), 0);

  return {
    efectivo,
    transferencia,
  };
};

const buildReservationSheetRows = (
  reservas: EventoVentaReserva[],
): ReservationSheetRow[] =>
  reservas.map((reserva) => {
    const pagos = pagosToSheetValues(reserva.Pagos);

    return {
      id: reserva.id,
      sector: reserva.Sector?.nombre ?? '',
      comprador: reserva.comprador_nombre,
      idVendedorMiembro: reserva.Vendedor?.id ?? null,
      vendedor:
        reserva.Vendedor !== null
          ? `${reserva.Vendedor.nombre} ${reserva.Vendedor.apellidos}`.trim()
          : reserva.vendedor_nombre?.trim() || '',
      cantidad: reserva.cantidad_total,
      efectivo: pagos.efectivo,
      transferencia: pagos.transferencia,
      cuenta: reserva.cuenta_destino ?? '',
      debe: Number(reserva.saldo_pendiente),
      retiro: reserva.cantidad_retirada,
      observacion: reserva.observaciones?.trim() || '',
      total: Number(reserva.monto_total),
    };
  });

const buildSheetGridRows = (sheet: EventoVentaSheet): SheetGridRow[] =>
  sheet.contenido.map((cells, index) => ({
    id: index,
    cells,
  }));

const normalizeAccount = (value: string) => value.trim().toUpperCase();

const toScaledInt = (value: number | null) => Math.round(Number(value ?? 0) * 10000);

const fromScaledInt = (value: number) => value / 10000;

const buildCostSheetRows = (costos: EventoVentaCostoItem[]): CostSheetRow[] =>
  costos.map((costo) => {
    const costoUnitario = fromScaledInt(costo.costo_unitario_x10000);
    const cantidad = fromScaledInt(costo.cantidad_x10000);

    return {
      id: costo.id ?? 0,
      nombre: costo.nombre,
      descripcion: costo.descripcion ?? '',
      unidadMedida: costo.unidad_medida ?? '',
      costoUnitario,
      cantidad,
      total: costoUnitario * cantidad,
    };
  });

export default function EventoVentaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isDevRole = user?.roles.includes('DEV') ?? false;
  const { confirmDelete, deleteConfirmDialog } = useDeleteConfirm();
  const eventoVentaId = Number(params.id);
  const {
    eventoVenta,
    selectedItem,
    setSelectedItem,
    itemDialogVisible,
    itemDialogMode,
    itemFormValues,
    setItemFormValues,
    error,
    successMessage,
    loading,
    submitting,
    quickSubmitting,
    rowSubmitting,
    exporting,
    clearSuccessMessage,
    openCreateItemDialog,
    openEditItemDialog,
    closeItemDialog,
    submitItem,
    deleteSelectedItem,
    exportSpreadsheet,
    createReserva,
    updateReserva,
    deleteReserva,
    createCostoItem,
    updateCostoItem,
    deleteCostoItem,
  } = useEventoVentaDetailHook(eventoVentaId);
  const [activeGeneralTabIndex, setActiveGeneralTabIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const toast = useRef<Toast>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickForm, setQuickForm] = useState<QuickReservationFormRow>({
    id: 'quick-reservation-row',
    comprador: '',
    idVendedorMiembro: null,
    idItem: null,
    idSector: null,
    cantidad: 1,
    efectivo: 0,
    transferencia: 0,
    cuenta: '',
    debe: 0,
    retiro: 0,
  });
  const [debeTouched, setDebeTouched] = useState(false);
  const [quickCostForm, setQuickCostForm] = useState<QuickCostFormRow>({
    id: 'quick-cost-row',
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    costoUnitario: null,
    cantidad: null,
  });

  const orderedSheets = useMemo(() => eventoVenta?.HojasImportes ?? [], [eventoVenta]);

  const sectorReservations = useMemo(() => {
    const grouped = new Map<number, EventoVentaReserva[]>();

    for (const reserva of eventoVenta?.Reservas ?? []) {
      const sectorId = reserva.Sector?.id;
      if (!sectorId) {
        continue;
      }

      const current = grouped.get(sectorId) ?? [];
      current.push(reserva);
      grouped.set(sectorId, current);
    }

    return grouped;
  }, [eventoVenta]);

  const displayTabs = useMemo<DisplayTab[]>(() => {
    const tabs: DisplayTab[] = [
      {
        key: 'all-reservations',
        header: 'Todos',
        kind: 'all',
      },
    ];
    const sectors = eventoVenta?.Sectores ?? [];

    for (const sheet of orderedSheets) {
      if (sheet.tipo_hoja === 'SECTOR') {
        const sector = sectors.find((item) => item.nombre_hoja === sheet.nombre_hoja);
        tabs.push({
          key: `sheet-sector-${sheet.id}`,
          header: sheet.nombre_visible,
          kind: 'sheet-sector',
          sheet,
          sector,
        });
        continue;
      }

      tabs.push({
        key: `sheet-grid-${sheet.id}`,
        header: sheet.nombre_visible,
        kind: 'sheet-grid',
        sheet,
      });
    }

    for (const sector of sectors) {
      const alreadyIncluded = tabs.some(
        (tab) => tab.sector?.id === sector.id || tab.sheet?.nombre_hoja === sector.nombre_hoja,
      );

      if (!alreadyIncluded) {
        tabs.push({
          key: `sector-fallback-${sector.id}`,
          header: sector.nombre,
          kind: 'sector-fallback',
          sector,
        });
      }
    }

    return tabs;
  }, [eventoVenta, orderedSheets]);

  const activeSector = useMemo(() => {
    const activeTab = displayTabs[activeTabIndex];

    if (activeTab?.kind === 'all') {
      return eventoVenta?.Sectores[0];
    }

    if (activeTab?.sector) {
      return activeTab.sector;
    }

    return eventoVenta?.Sectores[0];
  }, [activeTabIndex, displayTabs, eventoVenta]);

  const filteredAllReservations = useMemo(() => {
    const trimmedQuery = normalizeSearchText(searchQuery);
    const reservas = eventoVenta?.Reservas ?? [];

    if (!trimmedQuery) {
      return reservas;
    }

    return reservas.filter((reserva) => {
      const vendedor =
        reserva.Vendedor !== null
          ? `${reserva.Vendedor.nombre} ${reserva.Vendedor.apellidos}`
          : reserva.vendedor_nombre ?? '';

      return (
        normalizeSearchText(reserva.comprador_nombre).includes(trimmedQuery) ||
        normalizeSearchText(vendedor).includes(trimmedQuery)
      );
    });
  }, [eventoVenta, searchQuery]);

  const extrasSector = useMemo(
    () =>
      eventoVenta?.Sectores.find((sector) => sector.tipo_sector === 'EXTRAS') ?? null,
    [eventoVenta],
  );

  const itemOptions = useMemo(
    () =>
      (eventoVenta?.Items ?? []).map((item: EventoVentaItem) => ({
        label: item.nombre,
        value: item.id,
      })),
    [eventoVenta],
  );

  const sellerOptions = useMemo(
    () =>
      (eventoVenta?.miembrosDisponibles ?? []).map((miembro: EventoVentaMiembroOption) => ({
        label: `${miembro.apellidos}, ${miembro.nombre}${
          miembro.ramaActualNombre ? ` · ${miembro.ramaActualNombre}` : ' · EXTRAS'
        }`.trim(),
        value: miembro.id,
      })),
    [eventoVenta],
  );

  const sectorOptions = useMemo(
    () =>
      (eventoVenta?.Sectores ?? []).map((sector) => ({
        label: sector.nombre,
        value: sector.id,
      })),
    [eventoVenta],
  );

  const cuentaOptions = useMemo(
    () => [
      { label: 'RAMA', value: 'RAMA' },
      { label: 'GRUPO', value: 'GRUPO' },
      { label: 'OTRO', value: 'OTRO' },
    ],
    [],
  );

  const selectedQuickItem = useMemo(
    () =>
      eventoVenta?.Items.find((item) => item.id === quickForm.idItem) ??
      eventoVenta?.Items[0] ??
      null,
    [eventoVenta, quickForm.idItem],
  );

  const quickTotal = useMemo(
    () => Number(selectedQuickItem?.precio_unitario ?? 0) * quickForm.cantidad,
    [quickForm.cantidad, selectedQuickItem],
  );

  useEffect(() => {
    if (!eventoVenta) {
      return;
    }

    const defaultSellerId =
      eventoVenta.miembrosDisponibles.some((miembro) => miembro.id === user?.memberId)
        ? (user?.memberId ?? null)
        : null;
    const defaultSeller = eventoVenta.miembrosDisponibles.find(
      (miembro) => miembro.id === defaultSellerId,
    );
    const defaultItemId = eventoVenta.Items[0]?.id ?? null;
    const defaultSectorId =
      eventoVenta.Sectores.find((sector) => sector.id_rama === defaultSeller?.ramaActualId)
        ?.id ??
      extrasSector?.id ??
      eventoVenta.Sectores[0]?.id ??
      null;

    setQuickForm({
      id: 'quick-reservation-row',
      comprador: '',
      idVendedorMiembro: defaultSellerId,
      idItem: defaultItemId,
      idSector: defaultSectorId,
      cantidad: 1,
      efectivo: 0,
      transferencia: 0,
      cuenta: '',
      debe:
        defaultItemId !== null
          ? Number(eventoVenta.Items.find((item) => item.id === defaultItemId)?.precio_unitario ?? 0)
          : 0,
      retiro: 0,
    });
    setDebeTouched(false);
  }, [eventoVenta, extrasSector, user?.memberId]);

  useEffect(() => {
    if (!debeTouched) {
      setQuickForm((current) => ({
        ...current,
        debe: Math.max(quickTotal - current.efectivo - current.transferencia, 0),
      }));
    }
  }, [debeTouched, quickTotal]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    setActiveTabIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!successMessage || !toast.current) {
      return;
    }

    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: successMessage,
      life: 3000,
    });
    clearSuccessMessage();
  }, [clearSuccessMessage, successMessage]);

  const renderSummaryGroupCard = (
    title: string,
    items: Array<{ label: string; value: string | number }>,
  ) => (
    <Card>
      <div className="flex flex-col gap-2">
        <span className="text-base font-bold">{title}</span>
        {items.map((item) => (
          <div
            key={`${title}-${item.label}`}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-base font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );

  const handleReservationCellEditComplete = async (event: ColumnEvent) => {
    const rowData = event.rowData as ReservationSheetRow;
    const field = event.field as keyof ReservationSheetRow;
    const newValue = event.newValue;

    if (field === 'comprador') {
      const comprador = String(newValue ?? '').trim();

      if (!comprador || comprador === rowData.comprador) {
        return;
      }

      await updateReserva(rowData.id, { comprador });
      return;
    }

    if (field === 'idVendedorMiembro') {
      const vendedorId = (newValue as number | null | undefined) ?? null;

      if (vendedorId === rowData.idVendedorMiembro) {
        return;
      }

      await updateReserva(rowData.id, { idVendedorMiembro: vendedorId });
      return;
    }

    if (field === 'cantidad') {
      const cantidad = Math.max(1, Number(newValue ?? rowData.cantidad));
      const retiroAjustado = Math.min(rowData.retiro, cantidad);

      if (cantidad === rowData.cantidad && retiroAjustado === rowData.retiro) {
        return;
      }

      await updateReserva(rowData.id, { cantidad, retiro: retiroAjustado });
      return;
    }

    if (field === 'efectivo') {
      const efectivo = Math.max(0, Number(newValue ?? 0));

      if (efectivo === rowData.efectivo) {
        return;
      }

      await updateReserva(rowData.id, { efectivo });
      return;
    }

    if (field === 'transferencia') {
      const transferencia = Math.max(0, Number(newValue ?? 0));

      if (transferencia === rowData.transferencia) {
        return;
      }

      await updateReserva(rowData.id, { transferencia });
      return;
    }

    if (field === 'cuenta') {
      const cuenta = String(newValue ?? '').trim() || null;

      if ((cuenta ?? '') === rowData.cuenta) {
        return;
      }

      await updateReserva(rowData.id, { cuenta });
      return;
    }

    if (field === 'debe') {
      const debe = Math.max(0, Number(newValue ?? 0));

      if (debe === rowData.debe) {
        return;
      }

      await updateReserva(rowData.id, { debe });
      return;
    }

    if (field === 'retiro') {
      const retiro = Math.min(
        rowData.cantidad,
        Math.max(0, Number(newValue ?? 0)),
      );

      if (retiro === rowData.retiro) {
        return;
      }

      await updateReserva(rowData.id, { retiro });
      return;
    }

    if (field === 'observacion') {
      const observacion = String(newValue ?? '').trim() || null;

      if ((observacion ?? '') === rowData.observacion) {
        return;
      }

      await updateReserva(rowData.id, { observacion });
    }
  };

  const textCellEditor = (options: ColumnEditorOptions) => (
    <InputText
      value={String(options.value ?? '')}
      onChange={(event) => options.editorCallback?.(event.target.value)}
    />
  );

  const integerCellEditor = (options: ColumnEditorOptions, minValue: number) => (
    <InputNumber
      value={Number(options.value ?? minValue)}
      useGrouping={false}
      min={minValue}
      max={
        options.field === 'retiro'
          ? Number((options.rowData as ReservationSheetRow).cantidad)
          : undefined
      }
      onValueChange={(event: InputNumberValueChangeEvent) =>
        options.editorCallback?.(
          options.field === 'retiro'
            ? Math.min(
                Number((options.rowData as ReservationSheetRow).cantidad),
                Math.max(minValue, Number(event.value ?? minValue)),
              )
            : Math.max(minValue, Number(event.value ?? minValue)),
        )
      }
    />
  );

  const moneyCellEditor = (options: ColumnEditorOptions) => (
    <InputNumber
      value={Number(options.value ?? 0)}
      mode="currency"
      currency="ARS"
      locale="es-AR"
      min={0}
      onValueChange={(event: InputNumberValueChangeEvent) =>
        options.editorCallback?.(Math.max(0, Number(event.value ?? 0)))
      }
    />
  );

  const cuentaCellEditor = (options: ColumnEditorOptions) => (
    <Dropdown
      value={String(options.value ?? '')}
      options={cuentaOptions}
      placeholder="Cuenta"
      showClear
      onChange={(event: DropdownChangeEvent) =>
        options.editorCallback?.((event.value as string | null | undefined) ?? '')
      }
    />
  );

  const vendedorCellEditor = (options: ColumnEditorOptions) => (
    <Dropdown
      value={(options.value as number | null | undefined) ?? null}
      options={sellerOptions}
      placeholder="Vendedor"
      showClear
      filter
      onChange={(event: DropdownChangeEvent) =>
        options.editorCallback?.((event.value as number | null | undefined) ?? null)
      }
    />
  );

  const renderReservationTable = ({
    sector,
    sheetHeader,
    reservas,
    emptyMessage,
    showSectorColumn,
  }: {
    sector?: EventoVentaSector;
    sheetHeader?: string;
    reservas?: EventoVentaReserva[];
    emptyMessage?: string;
    showSectorColumn?: boolean;
  }) => {
    const tableReservas = reservas ?? (sector ? sectorReservations.get(sector.id) ?? [] : []);
    const rows = buildReservationSheetRows(tableReservas);
    const totalVendidas = rows.reduce((acc, row) => acc + row.cantidad, 0);
    const totalRetiradas = rows.reduce((acc, row) => acc + row.retiro, 0);
    const totalPorRetirar = Math.max(totalVendidas - totalRetiradas, 0);
    const totalDinero = rows.reduce((acc, row) => acc + row.total, 0);
    const totalPagadoEf = rows.reduce((acc, row) => acc + row.efectivo, 0);
    const totalPagadoTransf = rows.reduce((acc, row) => acc + row.transferencia, 0);
    const totalDebe = rows.reduce((acc, row) => acc + row.debe, 0);
    const totalRendicion = rows.reduce(
      (acc, row) => acc + row.efectivo + row.transferencia,
      0,
    );
    const totalYaRendido = rows.reduce((acc, row) => {
      return normalizeAccount(row.cuenta) === 'GRUPO'
        ? acc + row.efectivo + row.transferencia
        : acc;
    }, 0);
    const totalFaltaRendir = Math.max(totalRendicion - totalYaRendido, 0);

    return (
      <div className="flex flex-col gap-3">
        {sector === undefined && !showSectorColumn ? (
          <Message
            severity="warn"
            text={`No se encontró el sector asociado a ${sheetHeader ?? 'esta hoja'}.`}
          />
        ) : null}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          {renderSummaryGroupCard('Porciones', [
            { label: 'Total', value: totalVendidas },
            { label: 'Retiradas', value: totalRetiradas },
            { label: 'Por retirar', value: totalPorRetirar },
          ])}
          {renderSummaryGroupCard('Plata', [
            { label: 'Total', value: formatMoney(totalDinero) },
            { label: 'Pagado efectivo', value: formatMoney(totalPagadoEf) },
            { label: 'Pagado transferencia', value: formatMoney(totalPagadoTransf) },
            { label: 'Pendiente', value: formatMoney(totalDebe) },
          ])}
          {renderSummaryGroupCard('Rendición', [
            { label: 'Total', value: formatMoney(totalRendicion) },
            { label: 'Ya rendido', value: formatMoney(totalYaRendido) },
            { label: 'Falta rendir', value: formatMoney(totalFaltaRendir) },
          ])}
        </div>
        <DataTable
          value={rows}
          dataKey="id"
          loading={loading || rowSubmitting}
          emptyMessage={emptyMessage ?? 'No hay reservas cargadas para esta hoja.'}
          scrollable
          scrollHeight="30rem"
          size="small"
          editMode="cell"
        >
          {isDevRole ? <Column field="id" header="ID" /> : null}
          {showSectorColumn ? (
            <Column field="sector" header="SECTOR" />
          ) : null}
          <Column
            field="comprador"
            header="COMPRADOR"
            editor={textCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="idVendedorMiembro"
            header="VENDEDOR"
            body={(rowData: ReservationSheetRow) => rowData.vendedor}
            editor={vendedorCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="cantidad"
            header="CANTIDAD"
            editor={(options) => integerCellEditor(options, 1)}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="efectivo"
            header="EFECTIVO"
            body={(rowData: ReservationSheetRow) =>
              rowData.efectivo > 0 ? formatMoney(rowData.efectivo) : ''
            }
            editor={moneyCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="transferencia"
            header="TRANSFERENCIA"
            body={(rowData: ReservationSheetRow) =>
              rowData.transferencia > 0 ? formatMoney(rowData.transferencia) : ''
            }
            editor={moneyCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="cuenta"
            header="CUENTA"
            editor={cuentaCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="debe"
            header="DEBE"
            body={(rowData: ReservationSheetRow) =>
              rowData.debe !== 0 ? formatMoney(rowData.debe) : ''
            }
            editor={moneyCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="retiro"
            header="RETIRADAS"
            editor={(options) => integerCellEditor(options, 0)}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            field="observacion"
            header="OBSERVACIÓN"
            editor={textCellEditor}
            onCellEditComplete={(event) => void handleReservationCellEditComplete(event)}
          />
          <Column
            header=""
            body={(rowData: ReservationSheetRow) => (
              <Button
                type="button"
                icon="pi pi-trash"
                iconPos="right"
                outlined
                size="small"
                severity="danger"
                onClick={() => {
                  confirmDelete({
                    message: `Se eliminará el encargo de "${rowData.comprador}".`,
                    impact:
                      'La reserva dejará de formar parte de la planilla y sus pagos asociados quedarán ocultos por borrado lógico.',
                    onAccept: () => void deleteReserva(rowData.id),
                  });
                }}
              />
            )}
          />
        </DataTable>
      </div>
    );
  };

  const handleQuickSubmit = async () => {
    if (!activeSector || !quickForm.idItem || !quickForm.comprador.trim()) {
      return;
    }

    await createReserva({
      comprador: quickForm.comprador.trim(),
      idVendedorMiembro: quickForm.idVendedorMiembro,
      idItem: quickForm.idItem,
      idSector: quickForm.idSector,
      cantidad: quickForm.cantidad,
      efectivo: quickForm.efectivo,
      transferencia: quickForm.transferencia,
      cuenta: quickForm.cuenta.trim(),
      debe: quickForm.debe,
      retiro: quickForm.retiro,
    });

    setQuickForm((current) => ({
      id: current.id,
      comprador: '',
      idVendedorMiembro: current.idVendedorMiembro,
      idItem: current.idItem,
      idSector: current.idSector,
      cantidad: 1,
      efectivo: 0,
      transferencia: 0,
      cuenta: '',
      debe: Number(selectedQuickItem?.precio_unitario ?? 0),
      retiro: 0,
    }));
    setDebeTouched(false);
  };

  const renderSheetGrid = (sheet: EventoVentaSheet) => {
    const rows = buildSheetGridRows(sheet);
    const maxColumns = rows.reduce(
      (current, row) => Math.max(current, row.cells.length),
      0,
    );

    return (
      <DataTable
        value={rows}
        dataKey="id"
        loading={loading}
        emptyMessage="La hoja no tiene contenido."
        scrollable
        scrollHeight="30rem"
        size="small"
      >
        {Array.from({ length: maxColumns }).map((_, index) => (
          <Column
            key={`sheet-col-${index}`}
            header={index === 0 ? 'A' : String.fromCharCode(65 + index)}
            body={(rowData: SheetGridRow) => formatCell(rowData.cells[index] ?? null)}
          />
        ))}
      </DataTable>
    );
  };

  const handleCostCellEditComplete = async (event: ColumnEvent) => {
    const rowData = event.rowData as CostSheetRow;
    const field = event.field as keyof CostSheetRow;
    const newValue = event.newValue;

    const nextRow: CostSheetRow = {
      ...rowData,
      nombre: field === 'nombre' ? String(newValue ?? '').trim() : rowData.nombre,
      descripcion:
        field === 'descripcion'
          ? String(newValue ?? '').trim()
          : rowData.descripcion,
      unidadMedida:
        field === 'unidadMedida'
          ? String(newValue ?? '').trim()
          : rowData.unidadMedida,
      costoUnitario:
        field === 'costoUnitario'
          ? Math.max(0, Number(newValue ?? 0))
          : rowData.costoUnitario,
      cantidad:
        field === 'cantidad' ? Math.max(0, Number(newValue ?? 0)) : rowData.cantidad,
      total: 0,
    };
    nextRow.total = nextRow.costoUnitario * nextRow.cantidad;

    if (
      nextRow.nombre === rowData.nombre &&
      nextRow.descripcion === rowData.descripcion &&
      nextRow.unidadMedida === rowData.unidadMedida &&
      nextRow.costoUnitario === rowData.costoUnitario &&
      nextRow.cantidad === rowData.cantidad
    ) {
      return;
    }

    if (!nextRow.nombre) {
      return;
    }

    await updateCostoItem(rowData.id, {
      nombre: nextRow.nombre,
      ...(nextRow.descripcion ? { descripcion: nextRow.descripcion } : {}),
      ...(nextRow.unidadMedida ? { unidadMedida: nextRow.unidadMedida } : {}),
      costoUnitarioX10000: toScaledInt(nextRow.costoUnitario),
      cantidadX10000: toScaledInt(nextRow.cantidad),
    });
  };

  const decimalCellEditor = (options: ColumnEditorOptions) => (
    <InputNumber
      value={Number(options.value ?? 0)}
      useGrouping={false}
      min={0}
      minFractionDigits={0}
      maxFractionDigits={4}
      onValueChange={(event: InputNumberValueChangeEvent) =>
        options.editorCallback?.(Math.max(0, Number(event.value ?? 0)))
      }
    />
  );

  const costRows = useMemo(
    () => buildCostSheetRows(eventoVenta?.Costos ?? []),
    [eventoVenta],
  );

  const totalCostos = useMemo(
    () => costRows.reduce((acc, row) => acc + row.total, 0),
    [costRows],
  );

  const balanceSummary = useMemo(() => {
    const reservas = buildReservationSheetRows(eventoVenta?.Reservas ?? []);
    const totalVendidas = reservas.reduce((acc, row) => acc + row.cantidad, 0);
    const totalRetiradas = reservas.reduce((acc, row) => acc + row.retiro, 0);
    const totalPorRetirar = Math.max(totalVendidas - totalRetiradas, 0);
    const totalIngresos = reservas.reduce((acc, row) => acc + row.total, 0);
    const totalCobradoEfectivo = reservas.reduce((acc, row) => acc + row.efectivo, 0);
    const totalCobradoTransferencia = reservas.reduce(
      (acc, row) => acc + row.transferencia,
      0,
    );
    const totalCobrado = totalCobradoEfectivo + totalCobradoTransferencia;
    const totalPendiente = reservas.reduce((acc, row) => acc + row.debe, 0);
    const totalRendido = reservas.reduce((acc, row) => {
      return normalizeAccount(row.cuenta) === 'GRUPO'
        ? acc + row.efectivo + row.transferencia
        : acc;
    }, 0);
    const totalFaltaRendir = Math.max(totalCobrado - totalRendido, 0);
    const balanceCobrado = totalCobrado - totalCostos;
    const balanceProyectado = totalIngresos - totalCostos;

    return {
      totalVendidas,
      totalRetiradas,
      totalPorRetirar,
      totalIngresos,
      totalCobradoEfectivo,
      totalCobradoTransferencia,
      totalCobrado,
      totalPendiente,
      totalCostos,
      totalRendido,
      totalFaltaRendir,
      balanceCobrado,
      balanceProyectado,
    };
  }, [eventoVenta, totalCostos]);

  const handleQuickCostSubmit = async () => {
    if (
      !quickCostForm.nombre.trim() ||
      quickCostForm.costoUnitario === null ||
      quickCostForm.cantidad === null
    ) {
      return;
    }

    await createCostoItem({
      nombre: quickCostForm.nombre.trim(),
      ...(quickCostForm.descripcion.trim()
        ? { descripcion: quickCostForm.descripcion.trim() }
        : {}),
      ...(quickCostForm.unidadMedida.trim()
        ? { unidadMedida: quickCostForm.unidadMedida.trim() }
        : {}),
      costoUnitarioX10000: toScaledInt(quickCostForm.costoUnitario),
      cantidadX10000: toScaledInt(quickCostForm.cantidad),
    });

    setQuickCostForm({
      id: 'quick-cost-row',
      nombre: '',
      descripcion: '',
      unidadMedida: '',
      costoUnitario: null,
      cantidad: null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">
            {eventoVenta?.nombre ?? 'Evento de venta'}
          </h1>
          {eventoVenta ? (
            <span>
              {dayjs(eventoVenta.fecha_evento).format('DD/MM/YYYY')}
              {eventoVenta.descripcion ? ` · ${eventoVenta.descripcion}` : ''}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            label="Volver"
            icon="pi pi-arrow-left"
            iconPos="right"
            outlined
            size="small"
            onClick={() => router.push('/dashboard/eventos-venta')}
          />
          <Button
            type="button"
            label="Exportar planilla"
            icon="pi pi-download"
            iconPos="right"
            outlined
            size="small"
            loading={exporting}
            onClick={() => void exportSpreadsheet()}
          />
        </div>
      </div>

      {error ? <Message severity="error" text={error} /> : null}
      <TabView
        activeIndex={activeGeneralTabIndex}
        onTabChange={(event: TabViewTabChangeEvent) =>
          setActiveGeneralTabIndex(event.index)
        }
      >
        <TabPanel header="Planilla del evento">
          <div className="flex flex-col gap-4">
          <DataTable
            value={[quickForm]}
            dataKey="id"
            scrollable
            scrollHeight="30rem"
            size="small"
            emptyMessage="Sin fila de carga."
          >
            <Column
              header="COMPRADOR"
              body={() => (
                <InputText
                  value={quickForm.comprador}
                  onChange={(event) =>
                    setQuickForm({ ...quickForm, comprador: event.target.value })
                  }
                  placeholder="Comprador"
                />
              )}
            />
            <Column
              header="VENDEDOR"
              body={() => (
                <Dropdown
                  value={quickForm.idVendedorMiembro}
                  options={sellerOptions}
                  placeholder="Vendedor"
                  showClear
                  filter
                  onChange={(event: DropdownChangeEvent) =>
                    {
                      const nextSellerId =
                        (event.value as number | null | undefined) ?? null;
                      const nextSeller = eventoVenta?.miembrosDisponibles.find(
                        (miembro) => miembro.id === nextSellerId,
                      );
                      const nextSectorId =
                        eventoVenta?.Sectores.find(
                          (sector) => sector.id_rama === nextSeller?.ramaActualId,
                        )?.id ??
                        extrasSector?.id ??
                        quickForm.idSector;

                      setQuickForm({
                        ...quickForm,
                        idVendedorMiembro: nextSellerId,
                        idSector: nextSectorId ?? null,
                      });
                    }
                  }
                />
              )}
            />
            <Column
              header="ITEM"
              body={() => (
                <Dropdown
                  value={quickForm.idItem}
                  options={itemOptions}
                  placeholder="Item"
                  onChange={(event: DropdownChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      idItem: (event.value as number | null | undefined) ?? null,
                    })
                  }
                />
              )}
            />
            <Column
              header="SECTOR"
              body={() => (
                <Dropdown
                  value={quickForm.idSector}
                  options={sectorOptions}
                  placeholder="Sector"
                  onChange={(event: DropdownChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      idSector: (event.value as number | null | undefined) ?? null,
                    })
                  }
                />
              )}
            />
            <Column
              header="CANTIDAD"
              body={() => (
                <InputNumber
                  value={quickForm.cantidad}
                  useGrouping={false}
                  min={1}
                  onValueChange={(event: InputNumberValueChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      cantidad: Math.max(1, Number(event.value ?? 1)),
                      retiro: Math.min(
                        quickForm.retiro,
                        Math.max(1, Number(event.value ?? 1)),
                      ),
                    })
                  }
                />
              )}
            />
            <Column
              header="EFECTIVO"
              body={() => (
                <InputNumber
                  value={quickForm.efectivo}
                  mode="currency"
                  currency="ARS"
                  locale="es-AR"
                  min={0}
                  onValueChange={(event: InputNumberValueChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      efectivo: Number(event.value ?? 0),
                    })
                  }
                />
              )}
            />
            <Column
              header="TRANSFERENCIA"
              body={() => (
                <InputNumber
                  value={quickForm.transferencia}
                  mode="currency"
                  currency="ARS"
                  locale="es-AR"
                  min={0}
                  onValueChange={(event: InputNumberValueChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      transferencia: Number(event.value ?? 0),
                    })
                  }
                />
              )}
            />
            <Column
              header="CUENTA"
              body={() => (
                <Dropdown
                  value={quickForm.cuenta}
                  options={cuentaOptions}
                  placeholder="Cuenta"
                  showClear
                  onChange={(event: DropdownChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      cuenta: (event.value as string | null | undefined) ?? '',
                    })
                  }
                />
              )}
            />
            <Column
              header="TOTAL"
              body={() => formatMoney(quickTotal)}
            />
            <Column
              header="DEBE"
              body={() => (
                <InputNumber
                  value={quickForm.debe}
                  mode="currency"
                  currency="ARS"
                  locale="es-AR"
                  min={0}
                  onValueChange={(event: InputNumberValueChangeEvent) => {
                    setDebeTouched(true);
                    setQuickForm({
                      ...quickForm,
                      debe: Number(event.value ?? 0),
                    });
                  }}
                />
              )}
            />
            <Column
              header="RETIRADAS"
              body={() => (
                <InputNumber
                  value={quickForm.retiro}
                  useGrouping={false}
                  min={0}
                  max={quickForm.cantidad}
                  onValueChange={(event: InputNumberValueChangeEvent) =>
                    setQuickForm({
                      ...quickForm,
                      retiro: Math.min(
                        quickForm.cantidad,
                        Math.max(0, Number(event.value ?? 0)),
                      ),
                    })
                  }
                />
              )}
            />
            <Column
              header=""
              body={() => (
                <Button
                  type="button"
                  label="Cargar"
                  icon="pi pi-check"
                  iconPos="right"
                  outlined
                  size="small"
                  loading={quickSubmitting}
                  disabled={
                    !quickForm.comprador.trim() ||
                    !quickForm.idItem ||
                    !quickForm.idSector
                  }
                  onClick={() => void handleQuickSubmit()}
                />
              )}
            />
          </DataTable>
          {displayTabs.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <InputText
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar por comprador o vendedor"
                />
              </div>
              <TabView
                activeIndex={activeTabIndex}
                onTabChange={(event: TabViewTabChangeEvent) =>
                  setActiveTabIndex(event.index)
                }
                scrollable
              >
              {displayTabs.map((tab) => (
                <TabPanel key={tab.key} header={tab.header}>
                  {tab.kind === 'all'
                    ? renderReservationTable({
                        reservas: filteredAllReservations,
                        showSectorColumn: true,
                        emptyMessage: searchQuery.trim()
                          ? 'No hay coincidencias para la búsqueda.'
                          : 'No hay reservas cargadas en el evento.',
                      })
                    : tab.kind === 'sheet-grid' && tab.sheet
                      ? renderSheetGrid(tab.sheet)
                      : renderReservationTable({
                          sector: tab.sector,
                          sheetHeader: tab.header,
                        })}
                </TabPanel>
              ))}
              </TabView>
            </div>
          ) : (
            <Message
              severity="info"
              text="Todavía no hay hojas ni sectores importados para este evento."
            />
          )}
          </div>
        </TabPanel>
        <TabPanel header="Gastos">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-1">
              {renderSummaryGroupCard('Gastos', [
                { label: 'Total', value: formatMoney(totalCostos) },
                { label: 'Items', value: costRows.length },
              ])}
            </div>
            <DataTable
              value={[quickCostForm]}
              dataKey="id"
              scrollable
              scrollHeight="30rem"
              size="small"
              emptyMessage="Sin fila de carga."
            >
              <Column
                header="NOMBRE"
                body={() => (
                  <InputText
                    value={quickCostForm.nombre}
                    onChange={(event) =>
                      setQuickCostForm({ ...quickCostForm, nombre: event.target.value })
                    }
                    placeholder="Nombre"
                  />
                )}
              />
              <Column
                header="DESCRIPCIÓN"
                body={() => (
                  <InputText
                    value={quickCostForm.descripcion}
                    onChange={(event) =>
                      setQuickCostForm({
                        ...quickCostForm,
                        descripcion: event.target.value,
                      })
                    }
                    placeholder="Descripción"
                  />
                )}
              />
              <Column
                header="UNIDAD DE MEDIDA"
                body={() => (
                  <InputText
                    value={quickCostForm.unidadMedida}
                    onChange={(event) =>
                      setQuickCostForm({
                        ...quickCostForm,
                        unidadMedida: event.target.value,
                      })
                    }
                    placeholder="Unidad de medida"
                  />
                )}
              />
              <Column
                header="COSTO POR UNIDAD"
                body={() => (
                  <InputNumber
                    value={quickCostForm.costoUnitario}
                    useGrouping={false}
                    min={0}
                    minFractionDigits={0}
                    maxFractionDigits={4}
                    onValueChange={(event: InputNumberValueChangeEvent) =>
                      setQuickCostForm({
                        ...quickCostForm,
                        costoUnitario:
                          event.value === null || event.value === undefined
                            ? null
                            : Number(event.value),
                      })
                    }
                  />
                )}
              />
              <Column
                header="CANTIDAD"
                body={() => (
                  <InputNumber
                    value={quickCostForm.cantidad}
                    useGrouping={false}
                    min={0}
                    minFractionDigits={0}
                    maxFractionDigits={4}
                    onValueChange={(event: InputNumberValueChangeEvent) =>
                      setQuickCostForm({
                        ...quickCostForm,
                        cantidad:
                          event.value === null || event.value === undefined
                            ? null
                            : Number(event.value),
                      })
                    }
                  />
                )}
              />
              <Column
                header="TOTAL"
                body={() =>
                  formatMoney(
                    Number(quickCostForm.costoUnitario ?? 0) *
                      Number(quickCostForm.cantidad ?? 0),
                  )
                }
              />
              <Column
                header=""
                body={() => (
                  <Button
                    type="button"
                    label="Cargar"
                    icon="pi pi-check"
                    iconPos="right"
                    outlined
                    size="small"
                    loading={rowSubmitting}
                    disabled={
                      !quickCostForm.nombre.trim() ||
                      quickCostForm.costoUnitario === null ||
                      quickCostForm.cantidad === null
                    }
                    onClick={() => void handleQuickCostSubmit()}
                  />
                )}
              />
            </DataTable>
            <DataTable
              value={costRows}
              dataKey="id"
              loading={loading || rowSubmitting}
              emptyMessage="No hay gastos cargados."
              scrollable
              scrollHeight="30rem"
              size="small"
              editMode="cell"
            >
              <Column
                field="nombre"
                header="NOMBRE"
                editor={textCellEditor}
                onCellEditComplete={(event) => void handleCostCellEditComplete(event)}
              />
              <Column
                field="descripcion"
                header="DESCRIPCIÓN"
                editor={textCellEditor}
                onCellEditComplete={(event) => void handleCostCellEditComplete(event)}
              />
              <Column
                field="unidadMedida"
                header="UNIDAD DE MEDIDA"
                editor={textCellEditor}
                onCellEditComplete={(event) => void handleCostCellEditComplete(event)}
              />
              <Column
                field="costoUnitario"
                header="COSTO POR UNIDAD"
                body={(rowData: CostSheetRow) => formatMoney(rowData.costoUnitario)}
                editor={decimalCellEditor}
                onCellEditComplete={(event) => void handleCostCellEditComplete(event)}
              />
              <Column
                field="cantidad"
                header="CANTIDAD"
                body={(rowData: CostSheetRow) => rowData.cantidad}
                editor={decimalCellEditor}
                onCellEditComplete={(event) => void handleCostCellEditComplete(event)}
              />
              <Column
                field="total"
                header="TOTAL"
                body={(rowData: CostSheetRow) => formatMoney(rowData.total)}
              />
              <Column
                header=""
                body={(rowData: CostSheetRow) => (
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    iconPos="right"
                    outlined
                    size="small"
                    severity="danger"
                    onClick={() => {
                      confirmDelete({
                        message: `Se eliminará el gasto "${rowData.nombre}".`,
                        impact:
                          'El gasto dejará de formar parte del cálculo de costos del evento.',
                        onAccept: () => void deleteCostoItem(rowData.id),
                      });
                    }}
                  />
                )}
              />
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header="Balance general">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
              {renderSummaryGroupCard('Porciones', [
                { label: 'Vendidas', value: balanceSummary.totalVendidas },
                { label: 'Retiradas', value: balanceSummary.totalRetiradas },
                { label: 'Por retirar', value: balanceSummary.totalPorRetirar },
              ])}
              {renderSummaryGroupCard('Ingresos', [
                { label: 'Total', value: formatMoney(balanceSummary.totalIngresos) },
                {
                  label: 'Cobrado efectivo',
                  value: formatMoney(balanceSummary.totalCobradoEfectivo),
                },
                {
                  label: 'Cobrado transferencia',
                  value: formatMoney(balanceSummary.totalCobradoTransferencia),
                },
                {
                  label: 'Pendiente',
                  value: formatMoney(balanceSummary.totalPendiente),
                },
              ])}
              {renderSummaryGroupCard('Gastos y rendición', [
                { label: 'Gastos', value: formatMoney(balanceSummary.totalCostos) },
                { label: 'Ya rendido', value: formatMoney(balanceSummary.totalRendido) },
                {
                  label: 'Falta rendir',
                  value: formatMoney(balanceSummary.totalFaltaRendir),
                },
              ])}
              {renderSummaryGroupCard('Resultado', [
                {
                  label: 'Balance cobrado',
                  value: formatMoney(balanceSummary.balanceCobrado),
                },
                {
                  label: 'Balance proyectado',
                  value: formatMoney(balanceSummary.balanceProyectado),
                },
              ])}
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Items configurados">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                label="Nuevo item"
                icon="pi pi-plus"
                iconPos="right"
                outlined
                size="small"
                onClick={() => openCreateItemDialog()}
              />
              <Button
                type="button"
                label="Editar item"
                icon="pi pi-pencil"
                iconPos="right"
                outlined
                size="small"
                disabled={!selectedItem}
                onClick={() => openEditItemDialog()}
              />
              <Button
                type="button"
                label="Eliminar item"
                icon="pi pi-trash"
                iconPos="right"
                outlined
                size="small"
                severity="danger"
                disabled={!selectedItem}
                onClick={() => {
                  if (!selectedItem) {
                    return;
                  }

                  confirmDelete({
                    message: `Se eliminará el item "${selectedItem.nombre}".`,
                    impact:
                      'Las reservas ya importadas conservan sus importes históricos, pero el item dejará de estar disponible para futuras cargas.',
                    onAccept: () => void deleteSelectedItem(),
                  });
                }}
              />
            </div>
            <DataTable
              value={eventoVenta?.Items ?? []}
              selectionMode="single"
              selection={selectedItem}
              onSelectionChange={(event) =>
                setSelectedItem((event.value as typeof selectedItem) ?? null)
              }
              dataKey="id"
              loading={loading}
              emptyMessage="No hay items configurados."
              scrollable
              scrollHeight="30rem"
              size="small"
            >
              <Column field="nombre" header="NOMBRE" />
              <Column field="descripcion" header="DESCRIPCIÓN" />
              <Column
                field="precio_unitario"
                header="PRECIO UNITARIO"
                body={(rowData) => formatMoney(rowData.precio_unitario)}
              />
              <Column field="orden" header="ORDEN" />
              <Column
                header="OFERTAS"
                body={(rowData) =>
                  rowData.Ofertas.length > 0
                    ? rowData.Ofertas.map(
                        (oferta: { cantidad: number; precio_total: string }) =>
                          `${oferta.cantidad} x ${formatMoney(oferta.precio_total)}`,
                      ).join(' · ')
                    : 'Sin ofertas'
                }
              />
              <Column
                header=""
                body={(rowData: EventoVentaItem) => (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      icon="pi pi-pencil"
                      iconPos="right"
                      outlined
                      size="small"
                      onClick={() => openEditItemDialog(rowData)}
                    />
                    <Button
                      type="button"
                      icon="pi pi-trash"
                      iconPos="right"
                      outlined
                      size="small"
                      severity="danger"
                      onClick={() => {
                        confirmDelete({
                          message: `Se eliminará el item "${rowData.nombre}".`,
                          impact:
                            'Las reservas ya importadas conservan sus importes históricos, pero el item dejará de estar disponible para futuras cargas.',
                          onAccept: () => void deleteSelectedItem(rowData),
                        });
                      }}
                    />
                  </div>
                )}
              />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>

      <EventoVentaItemFormDialog
        visible={itemDialogVisible}
        mode={itemDialogMode}
        loading={submitting}
        error={error}
        values={itemFormValues}
        onHide={closeItemDialog}
        onChange={setItemFormValues}
        onSubmit={() => void submitItem()}
      />
      {deleteConfirmDialog}
    </div>
  );
}
