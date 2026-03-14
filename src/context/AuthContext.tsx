"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { User, AuthState } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncFromStorage = () => {
      const storedToken = localStorage.getItem("sas_token");
      const storedUser = localStorage.getItem("sas_user");

      setToken(storedToken);
      setUser(storedUser ? (JSON.parse(storedUser) as User) : null);
      setIsLoading(false);
    };

    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const isAuthenticated = !!token;

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("sas_token", newToken);
    localStorage.setItem("sas_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sas_token");
    localStorage.removeItem("sas_user");
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
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
