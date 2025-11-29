'use client';

import { TiposEventoList } from '@/features/parametros/components/TiposEventoList';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';

export default function TiposEventoPage() {
  return (
    <Protect
      resource={RESOURCE.TIPO_EVENTO}
      action={ACTION.READ}
      fallback={
        <div className="p-4 text-red-500">
          No tienes permisos para ver esta página.
        </div>
      }
    >
      <TiposEventoList />
    </Protect>
  );
}
