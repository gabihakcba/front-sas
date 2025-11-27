'use client';

import React, { useMemo } from 'react';
import { GenericForm } from '@/common/components/GenericForm';
import { useAreasQuery } from '@/hooks/queries/useAreas';
import { useRamasQuery } from '@/hooks/queries/useRamas';
import { useAdultosQuery } from '@/hooks/queries/useAdultos';
import { useProtagonistasQuery } from '@/hooks/queries/useProtagonistas';
import { useResponsablesQuery } from '@/hooks/queries/useResponsables';
import { getCuentaDineroFormSections } from '../forms/cuentaDineroFormConfig';

interface CuentaDineroFormContainerProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  actionType: 'create' | 'update';
  submitLabel: string;
}

export const CuentaDineroFormContainer = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  actionType,
  submitLabel,
}: CuentaDineroFormContainerProps) => {
  const { data: areas = [], isLoading: isLoadingAreas } = useAreasQuery();
  const { data: ramas = [], isLoading: isLoadingRamas } = useRamasQuery();
  const { data: adultos = [], isLoading: isLoadingAdultos } = useAdultosQuery();
  const { data: protagonistas = [], isLoading: isLoadingProtagonistas } =
    useProtagonistasQuery();

  const { data: responsables = [], isLoading: isLoadingResponsables } =
    useResponsablesQuery();

  const miembros = useMemo(() => {
    const mappedAdultos = adultos.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      apellidos: a.apellidos,
      dni: a.dni,
    }));
    const mappedProtagonistas = protagonistas.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      apellidos: p.apellidos,
      dni: p.dni,
    }));
    const mappedResponsables = responsables.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      apellidos: r.apellidos,
      dni: r.dni,
    }));
    const allMiembros = [
      ...mappedAdultos,
      ...mappedProtagonistas,
      ...mappedResponsables,
    ];

    // Filter duplicates by DNI using a Map
    const uniqueMiembrosMap = new Map();
    allMiembros.forEach((miembro) => {
      if (miembro.dni && !uniqueMiembrosMap.has(miembro.dni)) {
        uniqueMiembrosMap.set(miembro.dni, miembro);
      }
    });

    return Array.from(uniqueMiembrosMap.values());
  }, [adultos, protagonistas, responsables]);

  // Determine initial tipo_propietario based on defaultValues
  const initialValues = useMemo(() => {
    if (!defaultValues) return { tipo_propietario: 'AREA' };
    let tipo = 'AREA';
    if (defaultValues.id_rama) tipo = 'RAMA';
    if (defaultValues.id_miembro) tipo = 'MIEMBRO';
    return { ...defaultValues, tipo_propietario: tipo };
  }, [defaultValues]);

  const isLoadingCatalogs =
    isLoadingAreas ||
    isLoadingRamas ||
    isLoadingAdultos ||
    isLoadingProtagonistas ||
    isLoadingResponsables;

  if (isLoadingCatalogs) {
    return (
      <div className="flex justify-center p-4">
        <i className="pi pi-spin pi-spinner text-2xl" />
      </div>
    );
  }

  const handleSubmit = (data: any) => {
    // Clean up payload based on tipo_propietario
    const payload = { ...data };
    if (payload.tipo_propietario === 'AREA') {
      delete payload.id_rama;
      delete payload.id_miembro;
    } else if (payload.tipo_propietario === 'RAMA') {
      delete payload.id_area;
      delete payload.id_miembro;
    } else if (payload.tipo_propietario === 'MIEMBRO') {
      delete payload.id_area;
      delete payload.id_rama;
    }
    delete payload.tipo_propietario; // Remove virtual field
    onSubmit(payload);
  };

  return (
    <GenericForm
      sections={getCuentaDineroFormSections(areas, ramas, miembros)}
      defaultValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={submitLabel}
      actionType={actionType}
    />
  );
};
