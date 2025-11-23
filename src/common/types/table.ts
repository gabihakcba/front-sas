import { ReactNode } from 'react';

export interface TableColumn<T = any> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  body?: (data: T) => ReactNode;
  className?: string; // Critical for responsive design (e.g., 'hidden md:table-cell')
  isBoolean?: boolean; // To render check/times icons automatically
  isDate?: boolean; // To use formatDate automatically
}
