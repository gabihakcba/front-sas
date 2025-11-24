/**
 * Protagonistas Page
 * Protected route for managing protagonistas (scouts)
 */

'use client';

import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';
import ProtagonistasList from '@/features/protagonistas/components/ProtagonistasList';

export default function ProtagonistasPage() {
  return (
    <Protect
      resource={RESOURCE.PROTAGONISTA}
      action={ACTION.READ}
    >
      <div className="p-6">
        <ProtagonistasList />
      </div>
    </Protect>
  );
}
