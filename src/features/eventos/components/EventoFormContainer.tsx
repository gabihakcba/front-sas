import React from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { useTiposEventoQuery } from '@/hooks/queries/useTiposEvento';
import { useRamasQuery } from '@/hooks/queries/useRamas';
import { useAreasQuery } from '@/hooks/queries/useAreas';
import { getEventoFormSections } from '../forms/eventoFormConfig';
import { CreateEventoDto } from '@/common/types/evento';

interface EventoFormContainerProps {
  initialData?: any;
  onSubmit: (data: CreateEventoDto) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
}

export const EventoFormContainer: React.FC<EventoFormContainerProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
}) => {
  const { data: tiposEvento = [] } = useTiposEventoQuery();
  const { data: ramas = [] } = useRamasQuery();
  const { data: areas = [] } = useAreasQuery();

  const tiposOptions = tiposEvento.map((t) => ({
    label: t.nombre,
    value: t.id,
  }));

  const ramasOptions = ramas.map((r) => ({
    label: r.nombre,
    value: r.id,
  }));

  const areasOptions = areas.map((a) => ({
    label: a.nombre,
    value: a.id,
  }));

  const sections = getEventoFormSections(
    tiposOptions,
    ramasOptions,
    areasOptions
  );

  return (
    <GenericForm
      sections={sections}
      defaultValues={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={submitLabel}
    />
  );
};
