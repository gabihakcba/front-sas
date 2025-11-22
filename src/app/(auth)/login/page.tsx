'use client';

import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LoginPage() {
  const { isAuth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuth) {
      router.push('/dashboard');
    }
  }, [isAuth, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-ground">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ground">
      <LoginForm />
    </div>
  );
}
