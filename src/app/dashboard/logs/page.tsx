'use client';

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { useLogsHook } from '@/hooks/useLogsHook';
import { LogActionSummary, LogEntry } from '@/types/logs';

export default function LogsPage() {
  const {
    logs,
    options,
    selectedLog,
    setSelectedLog,
    error,
    loading,
    page,
    total,
    limit,
    filters,
    setFilters,
    refetch,
  } = useLogsHook();

  const handlePage = (event: DataTablePageEvent) => {
    const nextPage = Math.floor(event.first / event.rows) + 1;
    void refetch(nextPage);
  };

  const renderSelectHeader = (
    label: string,
    value: string | null,
    optionValues: string[],
    onChange: (value: string | null) => void,
    placeholder: string,
  ) => (
    <div className="flex flex-col gap-2">
      <span>{label}</span>
      <Dropdown
        value={value}
        options={optionValues.map((option) => ({
          label: option,
          value: option,
        }))}
        onChange={(event: DropdownChangeEvent) =>
          onChange((event.value as string | null) ?? null)
        }
        placeholder={placeholder}
        showClear
        filter
        className="w-full"
      />
    </div>
  );

  const usernameBody = (log: LogEntry) => log.cuenta?.username ?? '-';

  const memberBody = (log: LogEntry) =>
    log.miembro?.memberId ? `#${log.miembro.memberId}` : '-';

  const dateBody = (log: LogEntry) =>
    dayjs(log.timestamp).format('DD/MM/YYYY HH:mm:ss');

  const actionsBody = (log: LogEntry) => {
    const uniqueTables = Array.from(
      new Set(log.Action.map((action) => action.tabla)),
    );

    if (uniqueTables.length === 0) {
      return <span>-</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {uniqueTables.map((table) => (
          <Tag key={`${log.id}-${table}`} value={table} />
        ))}
      </div>
    );
  };

  const userAgentBody = (log: LogEntry) =>
    log.userAgent?.trim() ? log.userAgent : '-';

  const actionCountBody = (log: LogEntry) => log.Action.length;

  const footerText = useMemo(() => {
    if (!selectedLog) {
      return 'Seleccioná un log para ver rápidamente cuántas acciones registró.';
    }

    const tables = Array.from(
      new Set(selectedLog.Action.map((action: LogActionSummary) => action.tabla)),
    );

    return `Log #${selectedLog.id} con ${selectedLog.Action.length} acciones${tables.length > 0 ? ` en ${tables.join(', ')}` : ''}.`;
  }, [selectedLog]);

  return (
    <div className="h-full w-full">
      <Card title="Logs" className="h-full">
        <div className="flex flex-col gap-3">
          <IconField iconPosition="right">
            <InputText
              value={filters.q}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  q: event.target.value,
                })
              }
              placeholder="Buscar por endpoint, IP o user-agent"
              className="w-full"
            />
            <InputIcon className="pi pi-search" />
          </IconField>
          {error ? <Message severity="error" text={error} className="w-full" /> : null}
          <DataTable
            value={logs}
            dataKey="id"
            selectionMode="single"
            selection={selectedLog}
            onSelectionChange={(event) =>
              setSelectedLog((event.value as LogEntry | null) ?? null)
            }
            loading={loading}
            paginator
            lazy
            first={(page - 1) * limit}
            rows={10}
            totalRecords={total}
            onPage={handlePage}
            emptyMessage="No hay logs para mostrar."
            footer={footerText}
            scrollable
          >
            <Column field="id" header="ID" />
            <Column header="Fecha" body={dateBody} />
            <Column
              field="endpoint"
              header={renderSelectHeader(
                'Endpoint',
                filters.endpoint,
                options.endpoints,
                (value) =>
                  setFilters({
                    ...filters,
                    endpoint: value,
                  }),
                'Todos',
              )}
            />
            <Column
              header={renderSelectHeader(
                'Cuenta',
                filters.username,
                options.usernames,
                (value) =>
                  setFilters({
                    ...filters,
                    username: value,
                  }),
                'Todas',
              )}
              body={usernameBody}
            />
            <Column header="Miembro" body={memberBody} />
            <Column field="ip" header="IP" />
            <Column header="User-Agent" body={userAgentBody} />
            <Column header="Acciones" body={actionCountBody} />
            <Column
              header={renderSelectHeader(
                'Tablas',
                filters.tabla,
                options.tablas,
                (value) =>
                  setFilters({
                    ...filters,
                    tabla: value,
                  }),
                'Todas',
              )}
              body={actionsBody}
            />
          </DataTable>
        </div>
      </Card>
    </div>
  );
}
