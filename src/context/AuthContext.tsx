'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import api, {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  registerSessionExpiredCallback,
} from '@/lib/axios';
import { parseJwt, UserSession } from '@/lib/utils';

interface User extends UserSession {}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useRef<Toast>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        const decoded = parseJwt(token);
        if (decoded) {
          setUser(decoded);
        } else {
          // Invalid token format
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Register axios session expired callback
  useEffect(() => {
    registerSessionExpiredCallback(() => {
      handleSessionExpired();
    });
  }, []);

  const handleSessionExpired = () => {
    // Show sticky toast
    toast.current?.show({
      severity: 'error',
      sticky: true,
      content: (props) => (
        <div
          className="flex flex-column align-items-start"
          style={{ flex: '1' }}
        >
          <div className="flex align-items-center gap-2">
            <span className="font-bold text-900">Tu sesión ha caducado</span>
          </div>
          <div className="font-medium text-700 my-3 text-sm">
            Por favor, inicia sesión nuevamente para continuar.
          </div>
          <Button
            label="Volver a ingresar"
            size="small"
            severity="danger"
            onClick={() => {
              logout();
            }}
          />
        </div>
      ),
    });
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    router.push('/login');
  };

  const hasRole = (roleName: string) => {
    return user?.roles?.some((r) => r.name === roleName) ?? false;
  };

  const isAdmin = hasRole('SUPER_ADMIN');

  const value = {
    user,
    isAuth: !!user,
    isLoading,
    setUser,
    logout,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      <Toast
        ref={toast}
        position="top-center"
      />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
