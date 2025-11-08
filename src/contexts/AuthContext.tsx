
import React, { createContext, useState, ReactNode, useEffect } from "react";

type User = { id: string; email: string } | null;

export type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Reemplaza por llamada real a API
      await new Promise((r) => setTimeout(r, 500));
      const u = { id: "1", email };
      setUser(u);
      localStorage.setItem("auth_user", JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  useEffect(() => {
    // opcional: refrescar token / validar sesión al montar
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};