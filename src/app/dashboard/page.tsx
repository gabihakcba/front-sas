'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from 'primereact/button';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-2xl font-bold mb-4">Bienvenido, {user?.user || user?.sub || 'Usuario'}</h2>
                <p className="text-slate-400 mb-6">Has iniciado sesión correctamente.</p>

                <div className="flex gap-4">
                    <Button
                        label="Cerrar Sesión"
                        severity="danger"
                        icon="pi pi-power-off"
                        onClick={logout}
                    />
                </div>
            </div>
        </div>
    );
}
