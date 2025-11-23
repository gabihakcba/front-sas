'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from 'primereact/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-surface-card p-6 rounded-xl border border-surface-border">
        <h2 className="text-2xl font-bold mb-4 text-text-main">
          Bienvenido, {user?.username || user?.sub || 'Usuario'}
        </h2>
        <p className="text-text-secondary mb-6">
          Has iniciado sesión correctamente.
        </p>

        <div className="flex gap-4">
          <Button
            label="Cerrar Sesión"
            severity="danger"
            icon="pi pi-power-off"
            iconPos="right"
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
}
