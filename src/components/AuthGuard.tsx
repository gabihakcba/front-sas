'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuth, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuth) {
            router.push('/login');
        }
    }, [isAuth, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <ProgressSpinner />
            </div>
        );
    }

    if (!isAuth) {
        return null;
    }

    return <>{children}</>;
}
