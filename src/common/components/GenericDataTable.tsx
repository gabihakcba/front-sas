'use client';

import { useState, ReactNode } from 'react';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Tag } from 'primereact/tag';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import { TableColumn } from '@/common/types/table';
import { formatDate } from '@/lib/date';

interface GenericDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  permissionResource: RESOURCE;
  mobileDetailTemplate?: (item: T) => ReactNode; // Deprecated but kept for backward compatibility
  dataKey?: string;
  rowActions?: (item: T) => ReactNode;
}

export function GenericDataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  title,
  subtitle,
  actions,
  onEdit,
  onDelete,
  permissionResource,
  mobileDetailTemplate,
  dataKey = 'id',
  rowActions,
}: GenericDataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | undefined
  >(undefined);

  /**
   * Helper to render cell content based on column type
   */
  const renderCell = (column: TableColumn<T>, rowData: T) => {
    // Custom body template takes priority
    if (column.body) {
      return column.body(rowData);
    }

    // 1. Get value (direct or transformed)
    let value: any;
    if (column.transform) {
      value = column.transform(rowData);
    } else {
      value = rowData[column.field as keyof T];
    }

    // 2. Handle specific types that have their own null/false logic
    if (column.type === 'boolean') {
      return value ? (
        <i className="pi pi-check text-green-500" />
      ) : (
        <i className="pi pi-times text-red-500" />
      );
    }

    if (column.type === 'tag') {
      const label = column.tagConfig?.getLabel
        ? column.tagConfig.getLabel(value)
        : String(value || '');

      if (!value && !column.tagConfig?.getLabel) return null;

      const severity = column.tagConfig?.getSeverity
        ? column.tagConfig.getSeverity(value)
        : 'info';
      return (
        <Tag
          value={label}
          severity={severity}
        />
      );
    }

    // 3. Global Null Safety for other types (text, date, etc.)
    if (value === null || value === undefined || value === '') {
      return <span className="text-text-secondary/50">-</span>;
    }

    // 4. Handle Date
    if (column.type === 'date') {
      return formatDate(value as string);
    }

    // 5. Handle Text with Severity
    if (column.textSeverity) {
      const severity =
        typeof column.textSeverity === 'function'
          ? column.textSeverity(rowData)
          : column.textSeverity;

      const severityClasses = {
        success: 'text-green-500',
        warning: 'text-orange-500',
        danger: 'text-red-500',
        info: 'text-blue-500',
        primary: 'text-primary',
        secondary: 'text-text-secondary',
      };

      return (
        <span className={severityClasses[severity] || ''}>{String(value)}</span>
      );
    }

    // Default text
    return String(value);
  };

  /**
   * Render body content for a column
   */
  const renderColumnBody = (column: TableColumn<T>) => {
    return (rowData: T) => renderCell(column, rowData);
  };

  /**
   * Default mobile detail template
   * Automatically generates a grid view for columns hidden on mobile
   */
  const defaultMobileDetailTemplate = (rowData: T) => {
    const hiddenColumns = columns.filter((col) => col.hideOnMobile);

    if (hiddenColumns.length === 0) {
      return null;
    }

    return (
      <div className="p-4 bg-surface-50 rounded-lg">
        <div className="grid grid-cols-1 gap-4 text-sm">
          {hiddenColumns.map((col, idx) => (
            <div key={idx}>
              <strong className="text-text-secondary block mb-1">
                {col.header}:
              </strong>
              <div className="text-text-main">{renderCell(col, rowData)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Actions column template
   */
  const actionsTemplate = (rowData: T) => {
    return (
      <div className="flex gap-2 justify-end">
        {rowActions && rowActions(rowData)}
        {onEdit && (
          <Protect
            resource={permissionResource}
            action={ACTION.UPDATE}
          >
            <Button
              className="p-button-sm p-button-outlined gap-2"
              severity="warning"
              onClick={() => onEdit(rowData)}
            >
              <span className="hidden md:inline">Editar</span>
              <i className="pi pi-pencil" />
            </Button>
          </Protect>
        )}
        {onDelete && (
          <Protect
            resource={permissionResource}
            action={ACTION.DELETE}
          >
            <Button
              className="p-button-sm p-button-outlined gap-2"
              severity="danger"
              onClick={() => onDelete(rowData)}
            >
              <span className="hidden md:inline">Eliminar</span>
              <i className="pi pi-trash" />
            </Button>
          </Protect>
        )}
      </div>
    );
  };

  /**
   * Header with title, subtitle, search, and actions
   */
  const header = (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 py-2">
      <div className="flex-1">
        <h2 className="text-xl font-bold m-0 text-text-main">{title}</h2>
        {subtitle && (
          <p className="text-sm text-text-secondary m-0 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        {/* Search */}
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
            className="w-full md:w-64"
          />
        </IconField>
        {/* Actions */}
        {actions}
      </div>
    </div>
  );

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>
    );
  }

  const hasActions = onEdit || onDelete || rowActions;
  const expansionTemplate =
    mobileDetailTemplate ||
    (columns.some((col) => col.hideOnMobile)
      ? defaultMobileDetailTemplate
      : undefined);

  return (
    <div className="w-full">
      <DataTable
        value={data}
        header={header}
        globalFilter={globalFilter}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        rowExpansionTemplate={expansionTemplate}
        dataKey={dataKey}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows
        className="p-datatable-sm"
        emptyMessage="No se encontraron registros"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      >
        {/* Expansion column for mobile */}
        {expansionTemplate && (
          <Column
            expander
            className="md:hidden w-12"
            headerClassName="md:hidden"
          />
        )}

        {/* Data columns */}
        {columns.map((column, idx) => {
          const className = [
            column.className || '',
            column.hideOnMobile ? 'hidden md:table-cell' : '',
          ]
            .join(' ')
            .trim();

          return (
            <Column
              key={idx}
              field={column.field as string}
              header={column.header}
              sortable={column.sortable}
              body={renderColumnBody(column)}
              className={className}
              headerClassName={className}
            />
          );
        })}

        {/* Actions column */}
        {hasActions && (
          <Column
            header="Acciones"
            body={actionsTemplate}
            className="w-32"
            headerClassName="text-right"
          />
        )}
      </DataTable>
    </div>
  );
}
