"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "TUTOR";
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper to extract user from session response
function extractUser(sessionData: Awaited<ReturnType<typeof authClient.getSession>>): AuthUser | null {
  const user = sessionData?.data?.user;
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user as AuthUser).role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient
      .getSession()
      .then((sessionData) => {
        setUser(extractUser(sessionData));
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    await authClient.signIn.email({ email, password });
    const sessionData = await authClient.getSession();
    setUser(extractUser(sessionData));
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}