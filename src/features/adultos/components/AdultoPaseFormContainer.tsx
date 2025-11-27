import React, { useMemo } from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { getEquipoFormSection } from '../forms/adultoFormConfig';
import {
  useAreasQuery,
  usePosicionesQuery,
  useRolesQuery,
} from '@/hooks/queries/useCommon';
import { useRamasQuery } from '@/hooks/queries/useRamas';
import { AdultoFormData } from '@/common/types/adulto';
import { FieldConfig } from '@/common/types/form';

interface AdultoPaseFormContainerProps {
  onSubmit: (data: AdultoFormData & { fecha_pase: Date }) => void;
  isLoading: boolean;
}

export const AdultoPaseFormContainer: React.FC<
  AdultoPaseFormContainerProps
> = ({ onSubmit, isLoading }) => {
  const { data: areas = [], isLoading: isLoadingAreas } = useAreasQuery();
  const { data: posiciones = [], isLoading: isLoadingPosiciones } =
    usePosicionesQuery();
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery();

  // Sección de equipo para el formulario de Pase
  const paseSection = useMemo(() => {
    const { fields, ...rest } = getEquipoFormSection(
      areas,
      posiciones,
      ramas,
      roles
    );
    return [
      {
        ...rest,
        fields: [
          ...fields,
          {
            name: 'fecha_pase',
            label: 'Fecha de Inicio en Cargo',
            type: 'date',
            rules: { required: 'Requerido' },
          },
        ] as FieldConfig[],
      },
    ];
  }, [areas, posiciones, ramas, roles]);

  return (
    <GenericForm
      sections={paseSection}
      onSubmit={onSubmit}
      defaultValues={{ fecha_pase: new Date() }}
      submitLabel="Confirmar Pase"
      isLoading={
        isLoading ||
        isLoadingAreas ||
        isLoadingPosiciones ||
        isLoadingRamas ||
        isLoadingRoles
      }
      actionType="create"
    />
  );
};
