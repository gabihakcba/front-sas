import { PagosList } from '@/features/tesoreria/components/PagosList';
import { Protect } from '@/components/auth/Protect';
import { RESOURCE, ACTION } from '@/common/types/rbac';

export default function PagosPage() {
  return (
    <Protect
      resource={RESOURCE.PAGO}
      action={ACTION.READ}
      fallback={<div className="p-4">No tienes permisos para ver esta página.</div>}
    >
      <PagosList />
    </Protect>
  );
}
