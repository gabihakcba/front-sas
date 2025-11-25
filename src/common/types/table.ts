import { ReactNode } from 'react';

export type TextSeverity =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'primary'
  | 'secondary';

export interface TableColumn<T = any> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  body?: (data: T) => ReactNode;
  className?: string;
  type?: 'text' | 'date' | 'boolean' | 'tag';
  tagConfig?: {
    getLabel?: (val: any) => string;
    getSeverity?: (
      val: any
    ) => 'success' | 'warning' | 'danger' | 'info' | null;
  };
  hideOnMobile?: boolean;
  transform?: (row: T) => string | number;
  textSeverity?: TextSeverity | ((row: T) => TextSeverity);
}
