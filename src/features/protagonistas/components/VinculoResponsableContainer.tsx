import React, { useMemo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { GenericForm } from '@/common/components/GenericForm';
import { getVinculoResponsableFormConfig } from '../forms/protagonistaFormConfig';
import { useResponsablesQuery } from '@/hooks/queries/useResponsables';
import {
  useRelacionesQuery,
  useCrearRelacionMutation,
} from '@/hooks/queries/useRelaciones';

interface VinculoResponsableContainerProps {
  protagonistaId: number;
  onClose: () => void;
}

export const VinculoResponsableContainer: React.FC<
  VinculoResponsableContainerProps
> = ({ protagonistaId, onClose }) => {
  const { data: responsables = [], isLoading: isLoadingResponsables } =
    useResponsablesQuery();
  const { data: relaciones = [], isLoading: isLoadingRelaciones } =
    useRelacionesQuery();
  const vincularMutation = useCrearRelacionMutation();

  const sections = useMemo(
    () => getVinculoResponsableFormConfig(responsables, relaciones),
    [responsables, relaciones]
  );

  const handleSubmit = (data: any) => {
    vincularMutation.mutate(
      {
        id_protagonista: protagonistaId,
        id_responsable: data.id_responsable,
        id_relacion: data.id_relacion,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (isLoadingResponsables || isLoadingRelaciones) {
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
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitLabel="Vincular"
      isLoading={vincularMutation.isPending}
      actionType="create"
    />
  );
};
