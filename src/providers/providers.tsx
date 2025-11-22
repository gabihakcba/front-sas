'use client';

import { PrimeReactProvider } from 'primereact/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { ToastProvider } from './ToastProvider';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const value = {
    appendTo: 'self' as 'self',
    ripple: true,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider value={value}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}
