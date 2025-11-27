'use client';

import React from 'react';
import { ConceptosPagoList } from '@/features/parametros/components/ConceptosPagoList';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';

export default function ConceptosPagoPage() {
  return (
    <Protect
      resource={RESOURCE.CONCEPTO_PAGO}
      action={ACTION.READ}
    >
      <ConceptosPagoList />
    </Protect>
  );
}
