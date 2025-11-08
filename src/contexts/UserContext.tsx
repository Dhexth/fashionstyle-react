import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
} from "../services/userService";
import { User } from "../types/user";

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());

  const loginUser = async (email: string, password: string) => {
    const res = await login({ email, password });
    setUser(res.user);
    setIsAuth(true);
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const res = await register({ name, email, password });
    setUser(res.user);
    setIsAuth(true);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    // Cada vez que el usuario cambie, sincronizamos localStorage
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, isAuth, loginUser, registerUser, logoutUser, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de un UserProvider");
  return ctx;
};
