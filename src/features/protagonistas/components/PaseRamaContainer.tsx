import React, { useMemo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { GenericForm } from '@/common/components/GenericForm';
import { useRamasQuery } from '@/hooks/queries/useRamas';

interface PaseRamaContainerProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const PaseRamaContainer: React.FC<PaseRamaContainerProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();

  const ramaOptions = useMemo(
    () =>
      ramas?.map((rama) => ({
        label: rama.nombre,
        value: rama.id,
      })),
    [ramas]
  );

  if (isLoadingRamas) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton
          height="2rem"
          className="mb-2"
        />
        <Skeleton
          height="2rem"
          width="50%"
          className="mb-2"
        />
      </div>
    );
  }

  return (
    <GenericForm
      sections={[
        {
          title: '',
          layout: { cols: 1 },
          fields: [
            {
              name: 'rama',
              label: 'Nueva Rama',
              type: 'dropdown',
              rules: { required: 'La rama es requerida' },
              options: ramaOptions,
              placeholder: 'Seleccione la nueva rama',
            },
            {
              name: 'fecha_pase',
              label: 'Fecha de Pase',
              type: 'date',
              rules: { required: 'La fecha es requerida' },
            },
          ],
        },
      ]}
      onSubmit={onSubmit}
      defaultValues={{ rama: undefined, fecha_pase: new Date() }}
      submitLabel="Confirmar Pase"
      isLoading={isLoading}
      actionType="update"
    />
  );
};
