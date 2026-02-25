"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CurrentUser } from "@/types/user";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const session = await authService.getSession();
    setUser(session ?? null);
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};