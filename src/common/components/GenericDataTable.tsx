'use client';

import { useState, ReactNode } from 'react';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
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
  mobileDetailTemplate?: (item: T) => ReactNode;
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
   * Render body content for a column
   */
  const renderColumnBody = (column: TableColumn<T>) => {
    return (rowData: T) => {
      // Custom body template takes priority
      if (column.body) {
        return column.body(rowData);
      }

      const value = rowData[column.field as keyof T];

      // Handle boolean values with icons
      if (column.isBoolean) {
        return value ? (
          <i className="pi pi-check text-green-500" />
        ) : (
          <i className="pi pi-times text-red-500" />
        );
      }

      // Handle date values
      if (column.isDate && value) {
        return formatDate(value as string);
      }

      return value ?? '-';
    };
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

  return (
    <div className="w-full">
      <DataTable
        value={data}
        header={header}
        globalFilter={globalFilter}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        rowExpansionTemplate={mobileDetailTemplate}
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
        {mobileDetailTemplate && (
          <Column
            expander
            className="md:hidden w-12"
            headerClassName="md:hidden"
          />
        )}

        {/* Data columns */}
        {columns.map((column, idx) => (
          <Column
            key={idx}
            field={column.field as string}
            header={column.header}
            sortable={column.sortable}
            body={renderColumnBody(column)}
            className={column.className}
            headerClassName={column.className}
          />
        ))}

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
