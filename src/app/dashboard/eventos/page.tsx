import React from 'react';
import { EventosList } from '@/features/eventos/components/EventosList';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';

export default function EventosPage() {
  return (
    <Protect
      resource={RESOURCE.EVENTO}
      action={ACTION.READ}
      fallback={
        <div className="p-4 text-center">
          No tienes permisos para ver eventos.
        </div>
      }
    >
      <EventosList />
    </Protect>
  );
}
