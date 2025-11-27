'use client';

import React from 'react';
import { MetodosPagoList } from '@/features/parametros/components/MetodosPagoList';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';

export default function MetodosPagoPage() {
  return (
    <Protect
      resource={RESOURCE.METODO_PAGO}
      action={ACTION.READ}
    >
      <MetodosPagoList />
    </Protect>
  );
}
