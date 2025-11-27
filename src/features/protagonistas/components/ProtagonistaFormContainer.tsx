import React, { useMemo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { GenericForm } from '@/common/components/GenericForm';
import { getProtagonistaFormSections } from '../forms/protagonistaFormConfig';
import { useRamasQuery } from '@/hooks/queries/useRamas';
import { ProtagonistaRow } from '@/common/types/protagonista';

interface ProtagonistaFormContainerProps {
  defaultValues: ProtagonistaRow | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  actionType: 'create' | 'update';
  submitLabel?: string;
}

export const ProtagonistaFormContainer: React.FC<
  ProtagonistaFormContainerProps
> = ({ defaultValues, onSubmit, isLoading, actionType, submitLabel }) => {
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();

  const sections = useMemo(() => getProtagonistaFormSections(ramas), [ramas]);

  if (isLoadingRamas) {
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
      defaultValues={defaultValues || { activo: true, es_becado: false }}
      submitLabel={
        submitLabel || (actionType === 'create' ? 'Crear' : 'Guardar')
      }
      isLoading={isLoading}
      actionType={actionType}
    />
  );
};
