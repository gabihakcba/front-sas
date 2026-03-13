"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
import { User, AuthState } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funciones para usar con useSyncExternalStore
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  const token = localStorage.getItem("sas_token");
  const userJson = localStorage.getItem("sas_user");
  return JSON.stringify({ token, userJson });
}

function getServerSnapshot() {
  return JSON.stringify({ token: null, userJson: null });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Sincronizamos con localStorage de forma reactiva
  const authDataJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  
  // En SSR authDataJson será "{ token: null, userJson: null }"
  const { token, userJson } = JSON.parse(authDataJson);

  const user = userJson ? JSON.parse(userJson) : null;
  const isAuthenticated = !!token;

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("sas_token", newToken);
    localStorage.setItem("sas_user", JSON.stringify(newUser));
    // Disparamos un evento manual para que useSyncExternalStore se entere en la misma pestaña
    window.dispatchEvent(new Event("storage"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sas_token");
    localStorage.removeItem("sas_user");
    window.dispatchEvent(new Event("storage"));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading: false, // La sincronización es instantánea con este patrón
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
