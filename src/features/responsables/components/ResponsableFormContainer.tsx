import React from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { getResponsableFormSections } from '../forms/responsableFormConfig';
import { ResponsableRow } from '@/common/types/responsable';

interface ResponsableFormContainerProps {
  defaultValues: Partial<ResponsableRow> | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  actionType?: 'create' | 'update';
  submitLabel?: string;
}

export const ResponsableFormContainer: React.FC<
  ResponsableFormContainerProps
> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  actionType,
  submitLabel,
}) => {
  return (
    <GenericForm
      sections={getResponsableFormSections()}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={defaultValues || { fecha_nacimiento: new Date() }}
      submitLabel={
        submitLabel || (actionType === 'create' ? 'Crear' : 'Guardar')
      }
      isLoading={isLoading}
      actionType={actionType}
    />
  );
};
