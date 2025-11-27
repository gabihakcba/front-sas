'use client';

import React from 'react';
import { CuentasDineroList } from '@/features/parametros/components/CuentasDineroList';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';

export default function CuentasDineroPage() {
  return (
    <Protect
      resource={RESOURCE.CUENTA_DINERO}
      action={ACTION.READ}
    >
      <CuentasDineroList />
    </Protect>
  );
}
