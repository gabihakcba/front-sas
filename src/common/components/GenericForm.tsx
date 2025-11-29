'use client';

import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { classNames } from 'primereact/utils';
import { FieldConfig, FormSection } from '../types/form';

interface GenericFormProps {
  fields?: FieldConfig[];
  sections?: FormSection[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  defaultValues?: any;
  isLoading?: boolean;
  submitLabel: string;
  columns?: number;
  actionType?: 'create' | 'update' | 'delete' | 'login';
  onValuesChange?: (values: any) => void;
}

export const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  sections,
  onSubmit,
  onCancel,
  defaultValues = {},
  isLoading = false,
  submitLabel,
  columns = 1,
  actionType = 'create',
  onValuesChange,
}) => {
  // Flatten fields from sections or use direct fields
  const allFields = sections
    ? sections.flatMap((section) => section.fields)
    : fields || [];

  // Generate default values if not provided, ensuring all fields have a value
  const initialValues = allFields.reduce(
    (acc, field) => {
      if (defaultValues[field.name] !== undefined) {
        acc[field.name] = defaultValues[field.name];
      } else if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      } else {
        // Default values based on type
        switch (field.type) {
          case 'checkbox':
            acc[field.name] = false;
            break;
          case 'date':
          case 'number':
            acc[field.name] = null;
            break;
          default:
            acc[field.name] = '';
        }
      }
      return acc;
    },
    {} as Record<string, any>
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
  });

  const values = useWatch({ control });

  React.useEffect(() => {
    if (onValuesChange) {
      onValuesChange(values);
    }
  }, [values, onValuesChange]);

  React.useEffect(() => {
    reset(initialValues);
  }, [reset, JSON.stringify(defaultValues)]);

  const renderField = (
    field: FieldConfig,
    fieldProps: any,
    fieldState: any
  ) => {
    const commonProps = {
      id: field.name,
      className: classNames('w-full', { 'p-invalid': fieldState.invalid }),
      placeholder: field.placeholder,
      ...field.inputProps,
    };

    // Determine the icon to use (loading spinner overrides custom icon)
    const displayIcon = field.isLoading ? 'pi pi-spin pi-spinner' : field.icon;

    const renderInputWithIcon = (input: React.ReactNode) => {
      if (displayIcon && field.type !== 'checkbox') {
        return (
          <IconField iconPosition="right">
            {input}
            <InputIcon className={displayIcon} />
          </IconField>
        );
      }
      return input;
    };

    let inputElement: React.ReactNode;

    switch (field.type) {
      case 'text':
      case 'email':
        inputElement = (
          <InputText
            {...commonProps}
            value={fieldProps.value ?? ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            ref={fieldProps.ref}
            type={field.type}
            disabled={field.disabled}
          />
        );
        return renderInputWithIcon(inputElement);

      case 'password':
        // Password component doesn't work well with IconField wrapper, handle separately
        inputElement = (
          <Password
            {...commonProps}
            value={fieldProps.value ?? ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            inputRef={fieldProps.ref}
            toggleMask
            feedback={false}
            inputClassName="w-full p-3"
            disabled={field.disabled}
          />
        );
        // Note: Password component has its own toggle icon, so we skip the custom icon wrapper
        return inputElement;

      case 'number':
        inputElement = (
          <InputText
            {...commonProps}
            value={fieldProps.value ?? ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            ref={fieldProps.ref}
            type="number"
            disabled={field.disabled}
          />
        );
        return renderInputWithIcon(inputElement);

      case 'textarea':
        inputElement = (
          <InputTextarea
            {...commonProps}
            value={fieldProps.value ?? ''}
            onChange={(e) => fieldProps.onChange(e.target.value)}
            ref={fieldProps.ref}
            rows={5}
            autoResize
            disabled={field.disabled}
          />
        );
        return renderInputWithIcon(inputElement);

      case 'dropdown': {
        // Pre-procesamiento de opciones para labels dinámicos
        const processedOptions =
          typeof field.optionLabel === 'function'
            ? field.options?.map((opt) => ({
                ...opt,
                __label: (field.optionLabel as (item: any) => string)(opt),
              }))
            : field.options;

        const labelField =
          typeof field.optionLabel === 'function'
            ? '__label'
            : field.optionLabel || 'label';

        return (
          <Dropdown
            {...commonProps}
            value={fieldProps.value}
            onChange={(e) => fieldProps.onChange(e.value)}
            options={processedOptions}
            optionLabel={labelField}
            optionValue={field.optionValue || 'value'}
            ref={fieldProps.ref}
            loading={field.isLoading}
            filter={field.filter || !!field.filterBy}
            filterBy={field.filterBy}
            showClear={field.showClear}
            resetFilterOnHide
            virtualScrollerOptions={{ itemSize: 38 }}
            disabled={field.disabled}
          />
        );
      }

      case 'multiselect': {
        // Pre-procesamiento de opciones para labels dinámicos
        const processedOptions =
          typeof field.optionLabel === 'function'
            ? field.options?.map((opt) => ({
                ...opt,
                __label: (field.optionLabel as (item: any) => string)(opt),
              }))
            : field.options;

        const labelField =
          typeof field.optionLabel === 'function'
            ? '__label'
            : field.optionLabel || 'label';

        return (
          <MultiSelect
            {...commonProps}
            value={fieldProps.value || []}
            onChange={(e) => fieldProps.onChange(e.value)}
            options={processedOptions}
            optionLabel={labelField}
            optionValue={field.optionValue || 'value'}
            display="chip"
            filter={field.filter || !!field.filterBy}
            filterBy={field.filterBy}
            ref={fieldProps.ref}
            virtualScrollerOptions={{ itemSize: 38 }}
            disabled={field.disabled}
          />
        );
      }

      case 'date':
        // Asegurar que el valor sea un objeto Date válido o null
        let dateValue: Date | null = null;

        if (fieldProps.value instanceof Date) {
          dateValue = fieldProps.value;
        } else if (typeof fieldProps.value === 'string' && fieldProps.value) {
          const parsed = new Date(fieldProps.value);
          if (!isNaN(parsed.getTime())) {
            dateValue = parsed;
          }
        }

        inputElement = (
          <Calendar
            {...commonProps}
            value={dateValue}
            onChange={(e) => fieldProps.onChange(e.value)}
            ref={fieldProps.ref}
            dateFormat="dd/mm/yy"
            showIcon
            iconPos="left"
            mask="99/99/9999"
            showButtonBar
            readOnlyInput
            appendTo={
              typeof document !== 'undefined' ? document.body : undefined
            }
            disabled={field.disabled}
          />
        );
        return inputElement;

      case 'checkbox':
        return (
          <div className="flex items-center">
            <Checkbox
              inputId={field.name}
              checked={fieldProps.value}
              onChange={(e) => fieldProps.onChange(e.checked)}
              ref={fieldProps.ref}
              className={classNames({ 'p-invalid': fieldState.invalid })}
              {...field.inputProps}
              disabled={field.disabled}
            />
            <label
              htmlFor={field.name}
              className="ml-2 cursor-pointer"
            >
              {field.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFields = (fieldsToRender: FieldConfig[], gridCols?: number) => {
    const cols = gridCols || columns;
    const values = useWatch({ control });

    return (
      <div
        className={`grid gap-4 ${
          cols === 1
            ? 'grid-cols-1'
            : cols === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : `grid-cols-1 md:grid-cols-${cols}`
        }`}
      >
        {fieldsToRender.map((field) => {
          if (field.showIf && !field.showIf(values)) {
            return null;
          }

          return (
            <div
              key={field.name}
              className={
                field.colSpan ? `col-span-${field.colSpan} p-fluid` : 'p-fluid'
              }
            >
              {field.type !== 'checkbox' && (
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  {field.label}
                </label>
              )}
              <Controller
                name={field.name}
                control={control}
                rules={field.rules}
                render={({ field: fieldProps, fieldState }) => (
                  <>
                    {renderField(field, fieldProps, fieldState)}
                    {fieldState.error && (
                      <small className="text-red-500 text-xs block mt-1">
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderSection = (section: FormSection, index: number) => {
    const cols = section.layout?.cols || 1;
    return (
      <fieldset
        key={index}
        className="border border-slate-700/50 rounded-lg p-6 bg-slate-800/20"
      >
        {section.title && (
          <legend className="text-lg font-semibold text-white px-2">
            {section.title}
          </legend>
        )}
        {renderFields(section.fields, cols)}
      </fieldset>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6"
    >
      {sections ? (
        <div className="space-y-6">
          {sections.map((section, index) => renderSection(section, index))}
        </div>
      ) : (
        renderFields(fields || [])
      )}

      <div className="flex gap-2 mt-6">
        {onCancel && (
          <Button
            label="Cancelar"
            type="button"
            onClick={onCancel}
            className="w-full"
            icon="pi pi-times"
            iconPos="right"
            size="small"
            outlined
            severity="secondary"
            disabled={isLoading}
          />
        )}
        <Button
          label={submitLabel}
          type="submit"
          className="w-full"
          loading={isLoading}
          icon={
            actionType === 'login'
              ? 'pi pi-sign-in'
              : actionType === 'delete'
                ? 'pi pi-trash'
                : 'pi pi-save'
          }
          iconPos="right"
          size="small"
          outlined
          severity={
            actionType === 'create'
              ? 'success'
              : actionType === 'update'
                ? 'warning'
                : actionType === 'delete'
                  ? 'danger'
                  : 'info'
          }
        />
      </div>
    </form>
  );
};
