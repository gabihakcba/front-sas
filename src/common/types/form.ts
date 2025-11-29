import { RegisterOptions } from 'react-hook-form';

export type FieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'multiselect'
  | 'textarea';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  rules?: RegisterOptions;
  options?: any[];
  optionValue?: string;
  optionLabel?: string | ((item: any) => string);
  filterBy?: string;
  placeholder?: string;
  colSpan?: number;
  inputProps?: Record<string, any>;
  icon?: string;
  isLoading?: boolean;
  showIf?: (values: any) => boolean;
  filter?: boolean;
  showClear?: boolean;
  defaultValue?: any;
  disabled?: boolean;
}

export interface FormSection {
  title?: string;
  fields: FieldConfig[];
  layout?: {
    cols: number;
    md?: number;
    lg?: number;
  };
}
