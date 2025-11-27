import React, { useMemo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { GenericForm } from '@/common/components/GenericForm';
import { getVinculoFormConfig } from '../forms/responsableFormConfig';
import { useRelacionesQuery } from '@/hooks/queries/useRelaciones';
import { useProtagonistasQuery } from '@/hooks/queries/useProtagonistas';

interface VinculoFormContainerProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel?: string;
}

export const VinculoFormContainer: React.FC<VinculoFormContainerProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}) => {
  const { data: relaciones = [], isLoading: isLoadingRelaciones } =
    useRelacionesQuery();
  const { data: protagonistas = [], isLoading: isLoadingProtagonistas } =
    useProtagonistasQuery();

  const sections = useMemo(
    () => getVinculoFormConfig(protagonistas, relaciones),
    [protagonistas, relaciones]
  );

  if (isLoadingRelaciones || isLoadingProtagonistas) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton
          height="2rem"
          className="mb-2"
        />
        <Skeleton
          height="4rem"
          className="mb-2"
        />
        <Skeleton
          height="2rem"
          width="50%"
          className="mb-2"
        />
        <Skeleton height="4rem" />
      </div>
    );
  }

  return (
    <GenericForm
      sections={sections}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={submitLabel || 'Vincular'}
      isLoading={isLoading}
    />
  );
};
