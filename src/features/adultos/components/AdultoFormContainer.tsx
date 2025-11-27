import React, { useMemo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { GenericForm } from '@/common/components/GenericForm';
import { getAdultoFormSections } from '../forms/adultoFormConfig';
import {
  useAreasQuery,
  usePosicionesQuery,
  useRolesQuery,
} from '@/hooks/queries/useCommon';
import { useRamasQuery } from '@/hooks/queries/useRamas';
import { AdultoFormData } from '@/common/types/adulto';

interface AdultoFormContainerProps {
  defaultValues: AdultoFormData | null;
  onSubmit: (data: AdultoFormData) => void;
  isLoading: boolean;
  actionType: 'create' | 'update';
  submitLabel?: string;
}

export const AdultoFormContainer: React.FC<AdultoFormContainerProps> = ({
  defaultValues,
  onSubmit,
  isLoading,
  actionType,
  submitLabel,
}) => {
  const { data: areas = [], isLoading: isLoadingAreas } = useAreasQuery();
  const { data: posiciones = [], isLoading: isLoadingPosiciones } =
    usePosicionesQuery();
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery();

  const sections = useMemo(
    () => getAdultoFormSections(areas, posiciones, ramas, roles),
    [areas, posiciones, ramas, roles]
  );

  if (
    isLoadingAreas ||
    isLoadingPosiciones ||
    isLoadingRamas ||
    isLoadingRoles
  ) {
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
