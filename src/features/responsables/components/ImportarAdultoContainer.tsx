import React from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { useAdultosQuery } from '@/hooks/queries/useAdultos';
import { useCreateResponsableFromAdultoMutation } from '@/hooks/queries/useResponsables';
import { FieldConfig } from '@/common/types/form';

interface ImportarAdultoContainerProps {
  onClose: () => void;
}

export const ImportarAdultoContainer: React.FC<
  ImportarAdultoContainerProps
> = ({ onClose }) => {
  const { data: adultos = [], isLoading: isLoadingAdultos } = useAdultosQuery();
  const createMutation = useCreateResponsableFromAdultoMutation();

  const handleSubmit = (data: { id_adulto: number }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const fields: FieldConfig[] = [
    {
      name: 'id_adulto',
      label: 'Seleccionar Adulto',
      type: 'dropdown',
      options: adultos,
      optionValue: 'id',
      optionLabel: (item: any) =>
        `${item.nombre} ${item.apellidos} (${item.dni})`,
      filter: true,
      filterBy: 'nombre,apellidos,dni',
      rules: { required: 'Debe seleccionar un adulto' },
      isLoading: isLoadingAdultos,
      inputProps: {
        appendTo: typeof document !== 'undefined' ? document.body : 'self',
      },
    },
  ];

  return (
    <GenericForm
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isLoading={createMutation.isPending}
      submitLabel="Importar"
      actionType="create"
    />
  );
};
