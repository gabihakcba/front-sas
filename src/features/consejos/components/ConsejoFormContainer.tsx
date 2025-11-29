'use client';

import React from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { getConsejoFormSections } from '../forms/consejoFormConfig';
import { Consejo } from '@/common/types/consejo';

interface ConsejoFormContainerProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialValues?: Consejo;
  isLoading?: boolean;
  submitLabel?: string;
}

export const ConsejoFormContainer: React.FC<ConsejoFormContainerProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  isLoading = false,
  submitLabel = 'Guardar',
}) => {
  const sections = getConsejoFormSections();

  return (
    <GenericForm
      sections={sections}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={initialValues}
      isLoading={isLoading}
      submitLabel={submitLabel}
    />
  );
};
