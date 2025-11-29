'use client';

import React, { useState, useMemo } from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { getPagoFormSections } from '../forms/pagoFormConfig';
import { useConceptosPagoQuery } from '@/hooks/queries/useConceptosPago';
import { useMetodosPagoQuery } from '@/hooks/queries/useMetodosPago';
import {
  useCuentasDineroQuery,
  useCuentasMiembroQuery,
} from '@/hooks/queries/useCuentasDinero';
import { useMiembrosQuery } from '@/hooks/queries/useMiembros';
import { useEventosQuery } from '@/hooks/queries/useEventos';
import { Pago } from '@/common/types/pago';

interface PagoFormContainerProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialValues?: Pago;
  isLoading?: boolean;
  submitLabel?: string;
}

export const PagoFormContainer: React.FC<PagoFormContainerProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  isLoading = false,
  submitLabel = 'Guardar',
}) => {
  const { data: conceptos = [] } = useConceptosPagoQuery();
  const { data: metodos = [] } = useMetodosPagoQuery();
  const { data: cuentasDestino = [] } = useCuentasDineroQuery();
  const { data: miembros = [] } = useMiembrosQuery();
  const { data: eventos = [] } = useEventosQuery();

  const [selectedMiembroId, setSelectedMiembroId] = useState<
    number | undefined
  >(initialValues?.id_miembro);

  const { data: cuentasPersonales = [] } =
    useCuentasMiembroQuery(selectedMiembroId);

  const handleValuesChange = (values: any) => {
    if (values.id_miembro !== selectedMiembroId) {
      setSelectedMiembroId(values.id_miembro);
    }
  };

  const sections = useMemo(
    () =>
      getPagoFormSections(
        conceptos,
        metodos,
        cuentasDestino,
        miembros,
        cuentasPersonales,
        eventos,
        !!initialValues?.id
      ),
    [
      conceptos,
      metodos,
      cuentasDestino,
      miembros,
      cuentasPersonales,
      eventos,
      initialValues?.id,
    ]
  );

  return (
    <GenericForm
      sections={sections}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={initialValues}
      isLoading={isLoading}
      submitLabel={submitLabel}
      onValuesChange={handleValuesChange}
    />
  );
};
